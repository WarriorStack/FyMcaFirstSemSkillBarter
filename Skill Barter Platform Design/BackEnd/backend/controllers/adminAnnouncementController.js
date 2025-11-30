import { db } from "../db.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const adminId = req.user.id;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message required" });
    }

    // 1️⃣ Insert into announcements table
    const [result] = await db.query(
      `INSERT INTO announcements (admin_id, title, message)
       VALUES (?, ?, ?)`,
      [adminId, title, message]
    );

    const announcementId = result.insertId;

    // 2️⃣ Fetch ALL users to send notification to
    const [users] = await db.query(
      `SELECT id FROM users WHERE user_type != 'admin'`
    );

    // 3️⃣ Insert notification for all users
    const notificationInserts = users.map((u) => [
      u.id,
      "announcement",
      JSON.stringify({
        title,
        message,
        announcement_id: announcementId,
      }),
      0, // is_read
    ]);

    await db.query(
      `INSERT INTO notifications (user_id, notification_type, payload, is_read)
       VALUES ?`,
      [notificationInserts]
    );

    return res.json({ message: "Announcement broadcasted to all users" });
  } catch (err) {
    console.error("CREATE ANNOUNCEMENT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.full_name AS admin_name
       FROM announcements a
       JOIN users u ON u.id = a.admin_id
       ORDER BY a.created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("GET ANNOUNCEMENTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
