import { db } from "../db.js";

export const getAnalytics = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [[{ active_users }]] = await db.query(
      "SELECT COUNT(*) AS active_users FROM users WHERE is_active = 1"
    );

    const [topSkills] = await db.query(`
      SELECT s.skill_name, COUNT(us.user_id) AS count
      FROM skills s
      JOIN user_skills us ON us.skill_id = s.id
      GROUP BY s.id
      ORDER BY count DESC
      LIMIT 10
    `);

    return res.json({
      totalUsers: total_users,
      activeUsers: active_users,
      topSkills,
    });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
