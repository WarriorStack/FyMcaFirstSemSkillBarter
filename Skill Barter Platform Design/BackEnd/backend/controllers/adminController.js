import { db } from "../db.js";

export const getAdminDashboardData = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [[{ active_users }]] = await db.query(
      "SELECT COUNT(*) AS active_users FROM users WHERE is_active = 1"
    );

    const [[{ pending_reports }]] = await db.query(
      "SELECT COUNT(*) AS pending_reports FROM reports WHERE status = 'pending'"
    );

    const [[{ total_skills }]] = await db.query(
      "SELECT COUNT(*) AS total_skills FROM skills"
    );

    const [userGrowthRows] = await db.query(`
      SELECT 
  DATE_FORMAT(created_at, '%b') AS month,
  COUNT(*) AS users
FROM users
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(created_at, '%b')
ORDER BY MIN(created_at);

    `);

    const [skillCategoryRows] = await db.query(`
      SELECT 
        COALESCE(category, 'Other') AS name,
        COUNT(*) AS value
      FROM skills
      GROUP BY COALESCE(category, 'Other')
      ORDER BY value DESC
      LIMIT 6
    `);

    const [recentReportsRows] = await db.query(`
      SELECT 
        r.id,
        u.full_name AS user,
        r.issue,
        r.status,
        r.priority
      FROM reports r
      JOIN users u ON r.reported_user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    const [recentUsersRows] = await db.query(`
      SELECT 
        u.id,
        u.full_name AS name,
        u.created_at,
        COALESCE(s.points_balance, 0) AS points,
        u.is_active
      FROM users u
      LEFT JOIN students s ON s.id = u.id
      WHERE u.user_type = 'student'
      ORDER BY u.created_at DESC
      LIMIT 10
    `);

    const userGrowth = userGrowthRows.map((row) => ({
      month: row.month,
      users: Number(row.users),
    }));

    const colors = [
      "#6C63FF",
      "#4A90E2",
      "#FFC857",
      "#FF9A56",
      "#2ECC71",
      "#FF6B6B"
    ];

    const skillCategories = skillCategoryRows.map((row, index) => ({
      name: row.name,
      value: Number(row.value),
      color: colors[index % colors.length],
    }));

    const recentReports = recentReportsRows.map((row) => ({
      id: row.id,
      user: row.user,
      issue: row.issue,
      status: row.status,
      priority: row.priority,
    }));

    const recentUsers = recentUsersRows.map((row) => ({
      id: row.id,
      name: row.name,
      joined: row.created_at,
      points: Number(row.points),
      status: row.is_active ? "active" : "inactive",
    }));

    return res.json({
      stats: {
        totalUsers: total_users,
        activeSessions: active_users,
        pendingReports: pending_reports,  // ✅ FIXED
        totalSkills: total_skills,
      },
      userGrowth,
      skillCategories,
      recentReports,
      recentUsers,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};