// backend/controllers/adminUserController.js
import { db } from "../db.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, user_type, is_active, shadow_banned, can_message, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const setActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    await db.query("UPDATE users SET is_active = ? WHERE id = ?", [
      active ? 1 : 0,
      id,
    ]);

    return res.json({ message: "User status updated" });
  } catch (err) {
    console.error("SET ACTIVE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type } = req.body; // 'student' | 'mentor' | 'trainer' | 'admin'

    if (!["student", "mentor", "trainer", "admin"].includes(user_type)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await db.query("UPDATE users SET user_type = ? WHERE id = ?", [
      user_type,
      id,
    ]);

    return res.json({ message: "User role updated" });
  } catch (err) {
    console.error("UPDATE ROLE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// For compatibility with your old "Promote to admin" button
export const promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("UPDATE users SET user_type = 'admin' WHERE id = ?", [id]);

    return res.json({ message: "User promoted to admin" });
  } catch (err) {
    console.error("PROMOTE ADMIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const setShadowBanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { shadow_banned } = req.body;

    await db.query("UPDATE users SET shadow_banned = ? WHERE id = ?", [
      shadow_banned ? 1 : 0,
      id,
    ]);

    return res.json({ message: "Shadow-ban status updated" });
  } catch (err) {
    console.error("SHADOW BAN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const setMessagingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { can_message } = req.body;

    await db.query("UPDATE users SET can_message = ? WHERE id = ?", [
      can_message ? 1 : 0,
      id,
    ]);

    return res.json({ message: "Messaging status updated" });
  } catch (err) {
    console.error("MESSAGING STATUS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Full user details for the drawer in AdminPanel
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [[user]] = await db.query(
      `SELECT u.id, u.full_name, u.email, u.user_type, u.is_active,
              u.shadow_banned, u.can_message, u.created_at,
              s.college, s.points_balance, s.rating, s.rating_count
       FROM users u
       LEFT JOIN students s ON s.id = u.id
       WHERE u.id = ?`,
      [id]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [skills] = await db.query(
      `SELECT s.id, s.skill_name, s.category, s.verified,
              us.proficiency_level, us.years_experience
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = ?`,
      [id]
    );

    const [collaborations] = await db.query(
      `SELECT c.*, ru.full_name AS requester_name, pu.full_name AS provider_name
       FROM collaborations c
       JOIN users ru ON ru.id = c.requester_id
       JOIN users pu ON pu.id = c.provider_id
       WHERE c.requester_id = ? OR c.provider_id = ?
       ORDER BY c.created_at DESC
       LIMIT 20`,
      [id, id]
    );

    const [projects] = await db.query(
      `SELECT p.*
       FROM projects p
       JOIN project_participants pp ON pp.project_id = p.id
       WHERE pp.user_id = ?
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [id]
    );

    const [reports] = await db.query(
      `SELECT r.*, u2.full_name AS reporter_name
       FROM reports r
       JOIN users u2 ON u2.id = r.reporter_id
       WHERE r.reported_user_id = ?
       ORDER BY r.created_at DESC
       LIMIT 20`,
      [id]
    );

    const [transactions] = await db.query(
      `SELECT *
       FROM transactions
       WHERE from_user_id = ? OR to_user_id = ?
       ORDER BY created_at DESC
       LIMIT 30`,
      [id, id]
    );

    return res.json({
      user,
      skills,
      collaborations,
      projects,
      reports,
      transactions,
    });
  } catch (err) {
    console.error("GET USER DETAILS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
