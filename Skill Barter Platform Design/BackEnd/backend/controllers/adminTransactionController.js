// backend/controllers/adminTransactionController.js
import { db } from "../db.js";

export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT *
       FROM transactions
       WHERE from_user_id = ? OR to_user_id = ?
       ORDER BY created_at DESC`,
      [userId, userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("GET TRANSACTIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const adjustUserPoints = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { userId } = req.params;
    const { amount, description } = req.body; // positive or negative

    const delta = Number(amount);
    if (!delta || !Number.isFinite(delta)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    await connection.beginTransaction();

    const [[student]] = await connection.query(
      "SELECT points_balance FROM students WHERE id = ? FOR UPDATE",
      [userId]
    );

    if (!student) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: "Student not found" });
    }

    const newBalance = Math.max(0, student.points_balance + delta);

    // Update balance
    await connection.query(
      "UPDATE students SET points_balance = ? WHERE id = ?",
      [newBalance, userId]
    );

    // Insert transaction
    await connection.query(
      `INSERT INTO transactions (
         from_user_id, to_user_id, transaction_type,
         amount, balance_after, description
       )
       VALUES (?, ?, 'admin_adjustment', ?, ?, ?)`,
      [null, userId, Math.abs(delta), newBalance, description || null]
    );

    await connection.commit();
    connection.release();

    return res.json({ message: "Points adjusted", balance: newBalance });
  } catch (err) {
    console.error("ADJUST POINTS ERROR:", err);
    await connection.rollback();
    connection.release();
    return res.status(500).json({ message: "Server error" });
  }
};
