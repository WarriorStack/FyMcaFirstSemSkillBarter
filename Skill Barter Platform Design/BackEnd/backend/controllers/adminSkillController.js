// backend/controllers/adminSkillController.js
import { db } from "../db.js";

export const getSkills = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, skill_name, category, description, verified, is_featured
       FROM skills
       ORDER BY created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET SKILLS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { skill_name, category, description, verified, is_featured } =
      req.body;

    if (!skill_name) {
      return res.status(400).json({ message: "Skill name required" });
    }

    const [result] = await db.query(
      `INSERT INTO skills (skill_name, category, description, verified, is_featured)
       VALUES (?, ?, ?, ?, ?)`,
      [
        skill_name,
        category || null,
        description || null,
        verified ? 1 : 0,
        is_featured ? 1 : 0,
      ]
    );

    return res.json({ id: result.insertId, message: "Skill created" });
  } catch (err) {
    console.error("CREATE SKILL ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_name, category, description, verified, is_featured } =
      req.body;

    await db.query(
      `UPDATE skills
       SET skill_name = ?, category = ?, description = ?, verified = ?, is_featured = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        skill_name,
        category || null,
        description || null,
        verified ? 1 : 0,
        is_featured ? 1 : 0,
        id,
      ]
    );

    return res.json({ message: "Skill updated" });
  } catch (err) {
    console.error("UPDATE SKILL ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM skills WHERE id = ?", [id]);

    return res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error("DELETE SKILL ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const mergeSkills = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { fromId, toId } = req.body;

    if (!fromId || !toId || fromId === toId) {
      return res.status(400).json({ message: "Invalid merge ids" });
    }

    await connection.beginTransaction();

    // Move user_skills
    await connection.query(
      `UPDATE IGNORE user_skills
       SET skill_id = ?
       WHERE skill_id = ?`,
      [toId, fromId]
    );

    // Move skill_verifications
    await connection.query(
      `UPDATE skill_verifications
       SET skill_id = ?
       WHERE skill_id = ?`,
      [toId, fromId]
    );

    // Delete old skill
    await connection.query("DELETE FROM skills WHERE id = ?", [fromId]);

    await connection.commit();
    connection.release();

    return res.json({ message: "Skills merged" });
  } catch (err) {
    console.error("MERGE SKILLS ERROR:", err);
    await connection.rollback();
    connection.release();
    return res.status(500).json({ message: "Server error" });
  }
};
