// backend/controllers/adminAchievementController.js
import { db } from "../db.js";

export const getAchievements = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.full_name AS user_name
       FROM achievements a
       JOIN users u ON u.id = a.user_id
       ORDER BY a.earned_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET ACHIEVEMENTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const { user_id, title, description, points_reward, icon } = req.body;

    if (!user_id || !title) {
      return res.status(400).json({ message: "User & title required" });
    }

    const [result] = await db.query(
      `INSERT INTO achievements (user_id, title, description, points_reward, icon)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title, description || null, points_reward || 0, icon || "award"]
    );

    return res.json({ id: result.insertId, message: "Achievement created" });
  } catch (err) {
    console.error("CREATE ACHIEVEMENT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM achievements WHERE id = ?", [id]);
    return res.json({ message: "Achievement deleted" });
  } catch (err) {
    console.error("DELETE ACHIEVEMENT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAchievementStats = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT title, COUNT(*) AS count
       FROM achievements
       GROUP BY title
       ORDER BY count DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("ACHIEVEMENT STATS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
