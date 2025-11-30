import { db } from "../db.js";

export const getReports = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.id, r.issue, r.status, r.priority, r.created_at,
              u.full_name AS user
       FROM reports r
       JOIN users u ON u.id = r.reported_user_id
       ORDER BY r.created_at DESC`
    );

    return res.json(rows);
  } catch (err) {
    console.error("GET REPORTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "investigating", "resolved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      "UPDATE reports SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    return res.json({ message: "Report updated successfully" });
  } catch (err) {
    console.error("UPDATE REPORT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
