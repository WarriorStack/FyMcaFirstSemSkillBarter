// backend/controllers/adminVerificationController.js
import { db } from "../db.js";

export const getSkillVerifications = async (req, res) => {
  try {
    const { status } = req.query; // optional

    let sql = `
      SELECT sv.*, s.skill_name, ru.full_name AS requester_name,
             vu.full_name AS verifier_name
      FROM skill_verifications sv
      JOIN skills s ON s.id = sv.skill_id
      JOIN users ru ON ru.id = sv.requester_id
      LEFT JOIN users vu ON vu.id = sv.verifier_id
    `;
    const params = [];

    if (status) {
      sql += " WHERE sv.status = ?";
      params.push(status);
    }

    sql += " ORDER BY sv.created_at DESC";

    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error("GET SKILL VERIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSkillVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const adminId = req.user.id;

    if (!["requested", "approved", "rejected", "revoked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get verification row
    const [[verification]] = await db.query(
      "SELECT * FROM skill_verifications WHERE id = ?",
      [id]
    );
    if (!verification) {
      return res.status(404).json({ message: "Verification not found" });
    }

    await db.query(
      `UPDATE skill_verifications
       SET status = ?, notes = ?, verifier_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, notes || null, adminId, id]
    );

    // If approved -> mark user_skill as verified
    if (status === "approved") {
      await db.query(
        `UPDATE user_skills
         SET verified_by = ?, verified_at = NOW()
         WHERE user_id = ? AND skill_id = ?`,
        [adminId, verification.requester_id, verification.skill_id]
      );

      await db.query(
        `UPDATE skills SET verified = 1, updated_at = NOW()
         WHERE id = ?`,
        [verification.skill_id]
      );
    }

    return res.json({ message: "Verification updated" });
  } catch (err) {
    console.error("UPDATE SKILL VERIFICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
