// backend/controllers/dashboardController.js
import { db } from "../db.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    // 1) USER BASIC INFO + TYPE
    const [[user]] = await db.query(
      `SELECT id, full_name, display_name, avatar_url, user_type
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2) STUDENT INFO (POINTS, RATING)
    const [[student]] = await db.query(
      `SELECT points_balance, rating, rating_count
       FROM students
       WHERE id = ?`,
      [userId]
    );

    const points = student?.points_balance ?? 0;
    const rating = student?.rating ?? null;
    const ratingCount = student?.rating_count ?? 0;

    // 3) SKILLS COUNT
    const [[skillsCountRow]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM user_skills
       WHERE user_id = ?`,
      [userId]
    );
    const skillsCount = skillsCountRow?.total ?? 0;

    // 4) CONNECTIONS COUNT (UNIQUE OTHER USERS IN COLLABORATIONS)
    const [[connectionsRow]] = await db.query(
      `SELECT COUNT(DISTINCT other_user) AS total
       FROM (
         SELECT provider_id AS other_user
         FROM collaborations
         WHERE requester_id = ?
         UNION
         SELECT requester_id AS other_user
         FROM collaborations
         WHERE provider_id = ?
       ) AS t`,
      [userId, userId]
    );
    const connections = connectionsRow?.total ?? 0;

    // 5) NOTIFICATIONS (LATEST 10)
    const [notificationsRows] = await db.query(
      `SELECT id, notification_type, payload, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    const notifications = notificationsRows.map((n) => {
      let message = "Notification";

      if (n.payload) {
        try {
          const parsed =
            typeof n.payload === "string" ? JSON.parse(n.payload) : n.payload;
          message = parsed.message || n.notification_type || message;
        } catch {
          message = n.notification_type || message;
        }
      } else if (n.notification_type) {
        message = n.notification_type;
      }

      return {
        id: n.id,
        type: n.notification_type,          // ✅ expose type to frontend
        message,
        is_read: !!n.is_read,
        time: new Date(n.created_at).toLocaleString(),
      };
    });

    // 6) PROJECTS (LATEST 10 WHERE USER IS PARTICIPANT)
    const [projectsRows] = await db.query(
      `SELECT 
         p.id,
         p.project_name,
         p.status,
         pp.role,
         p.starts_at,
         p.ends_at
       FROM project_participants pp
       JOIN projects p ON p.id = pp.project_id
       WHERE pp.user_id = ?
       ORDER BY p.created_at DESC
       LIMIT 10`,
      [userId]
    );

    const projects = projectsRows.map((p) => ({
      id: p.id,
      title: p.project_name,
      status: p.status,
      role: p.role || "Member",
      starts_at: p.starts_at,
      ends_at: p.ends_at,
    }));

    // 7) WEEKLY POINTS (LAST 7 DAYS FROM transactions)
    const [weeklyRows] = await db.query(
      `SELECT 
         DATE(created_at) AS day_date,
         SUM(
           CASE 
             WHEN transaction_type = 'earn' THEN amount
             WHEN transaction_type = 'redeem' THEN -amount
             ELSE 0
           END
         ) AS net_points
       FROM transactions
       WHERE to_user_id = ?
         AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)`,
      [userId]
    );

    const pointsByDate = new Map();
    weeklyRows.forEach((row) => {
      const d =
        row.day_date instanceof Date
          ? row.day_date.toISOString().slice(0, 10)
          : row.day_date;
      pointsByDate.set(d, Number(row.net_points) || 0);
    });

    const weeklyPoints = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });

      weeklyPoints.push({
        name: label,
        points: pointsByDate.get(key) || 0,
      });
    }

    // 8) ACHIEVEMENTS LOGIC
    const achievements = [];

    if (points >= 500) {
      achievements.push({
        id: "points_500",
        name: "Point Collector",
        icon: "💰",
        description: "Earned 500+ points.",
        rarity: "Silver",
      });
    }

    if (points >= 1000) {
      achievements.push({
        id: "points_1000",
        name: "Point Master",
        icon: "👑",
        description: "Earned 1000+ points.",
        rarity: "Gold",
      });
    }

    if (skillsCount >= 5) {
      achievements.push({
        id: "skills_5",
        name: "Skill Explorer",
        icon: "🧠",
        description: "Learned or teaches 5+ skills.",
        rarity: "Bronze",
      });
    }

    if (skillsCount >= 10) {
      achievements.push({
        id: "skills_10",
        name: "Skill Builder",
        icon: "🛠️",
        description: "Learned or teaches 10+ skills.",
        rarity: "Silver",
      });
    }

    if (connections >= 5) {
      achievements.push({
        id: "conn_5",
        name: "Networker",
        icon: "🤝",
        description: "Connected with 5+ peers.",
        rarity: "Bronze",
      });
    }

    if (connections >= 15) {
      achievements.push({
        id: "conn_15",
        name: "Community Builder",
        icon: "🌐",
        description: "Connected with 15+ peers.",
        rarity: "Silver",
      });
    }

    if (rating !== null && rating >= 4.5 && ratingCount >= 5) {
      achievements.push({
        id: "rating_top",
        name: "Top Rated",
        icon: "⭐",
        description: "Maintained a 4.5+ rating with 5+ reviews.",
        rarity: "Gold",
      });
    }

    // FINAL RESPONSE
    return res.json({
      user: {
        id: user.id,
        name: user.full_name,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        user_type: user.user_type,
      },
      stats: {
        points,
        skills: skillsCount,
        connections,
        achievements: achievements.length,
        rating,
        rating_count: ratingCount,
      },
      weeklyPoints,
      notifications,   // ✅ now includes type
      projects,
      achievements,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
