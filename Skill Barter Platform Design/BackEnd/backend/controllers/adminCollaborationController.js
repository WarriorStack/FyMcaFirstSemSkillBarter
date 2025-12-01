// backend/controllers/adminCollaborationController.js
import { db } from "../db.js";

export const getCollaborations = async (req, res) => {
  try {
    const { status } = req.query; // optional filter

    let sql = `
      SELECT c.*, 
             ru.full_name AS requester_name,
             pu.full_name AS provider_name
      FROM collaborations c
      JOIN users ru ON ru.id = c.requester_id
      JOIN users pu ON pu.id = c.provider_id
    `;
    const params = [];

    if (status) {
      sql += " WHERE c.status = ?";
      params.push(status);
    }

    sql += " ORDER BY c.created_at DESC";

    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error("GET COLLABORATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCollaborationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (
      ![
        "pending",
        "accepted",
        "rejected",
        "in_progress",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      `UPDATE collaborations
       SET status = ?, admin_notes = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, admin_notes || null, id]
    );

    return res.json({ message: "Collaboration updated" });
  } catch (err) {
    console.error("UPDATE COLLAB ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
