import { db } from "../db.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, user_type, is_active, created_at
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

    await db.query(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [active ? 1 : 0, id]
    );

    return res.json({ message: "User status updated" });
  } catch (err) {
    console.error("SET ACTIVE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

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
