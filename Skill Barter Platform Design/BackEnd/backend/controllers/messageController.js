import { db } from "../db.js";

export const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET MSG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, content } = req.body;

    if (!conversation_id || !sender_id || !content)
      return res.status(400).json({ message: "Missing fields" });

    await db.query(
      `INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)`,
      [conversation_id, sender_id, content]
    );

    res.json({ message: "Message sent" });
  } catch (err) {
    console.error("SEND MSG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
