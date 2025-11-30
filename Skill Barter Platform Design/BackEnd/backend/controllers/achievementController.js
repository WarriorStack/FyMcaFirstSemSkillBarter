// backend/controllers/achievementController.js
import { db } from "../db.js";

// Get achievements for a specific user
export const getAchievements = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Missing user_id" });

    const [rows] = await db.query(
      `SELECT * FROM achievements
       WHERE user_id = ?
       ORDER BY earned_at DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET ACHIEVEMENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add achievement for a user
export const addAchievement = async (req, res) => {
  try {
    const { user_id, title, description, points_reward, icon } = req.body;

    if (!user_id || !title)
      return res.status(400).json({ message: "user_id & title required" });

    const [result] = await db.query(
      `INSERT INTO achievements (user_id, title, description, points_reward, icon)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title, description ?? null, points_reward ?? 0, icon ?? "award"]
    );

    res.json({
      message: "Achievement added",
      achievement_id: result.insertId
    });
  } catch (err) {
    console.error("ADD ACHIEVEMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
