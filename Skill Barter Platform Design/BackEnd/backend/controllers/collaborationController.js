// backend/controllers/collaborationController.js
import { db } from "../db.js";

// helper: get "best" instructor for a skill
async function findBestInstructorForSkill(skillId) {
  const [rows] = await db.query(
    `
    SELECT
      us.user_id AS instructor_id
    FROM user_skills us
    LEFT JOIN students st ON st.id = us.user_id
    WHERE us.skill_id = ?
    ORDER BY
      st.rating DESC,
      st.rating_count DESC,
      us.years_experience DESC
    LIMIT 1
    `,
    [skillId]
  );
  return rows[0] || null;
}

// POST /collaborations/request
// Supports BOTH:
//  - { requester_id, to_user_id, message }  -> direct person
//  - { requester_id, skill_id, message }    -> best instructor for skill
export const requestCollaboration = async (req, res) => {
  try {
    const { requester_id, to_user_id, skill_id, message } = req.body;

    if (!requester_id) {
      return res.status(400).json({ message: "Missing requester_id" });
    }

    let providerId = to_user_id;
    let title = "";
    let details =
      message && message.trim().length > 0
        ? message.trim()
        : "I'd like to collaborate with you.";

    /* ---------------------------
       CASE 1: DIRECT PERSON REQUEST
    --------------------------- */
    if (to_user_id) {
      providerId = to_user_id;
      title = "Collaboration Request";

      if (Number(providerId) === Number(requester_id)) {
        return res
          .status(400)
          .json({ message: "You cannot send a request to yourself" });
      }
    }

    /* ---------------------------
       CASE 2: SKILL REQUEST
    --------------------------- */
    else if (skill_id) {
      const [[skill]] = await db.query(
        "SELECT skill_name FROM skills WHERE id = ?",
        [skill_id]
      );
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      const best = await findBestInstructorForSkill(skill_id);
      if (!best) {
        return res
          .status(400)
          .json({ message: "No instructor currently offers this skill" });
      }

      providerId = best.instructor_id;
      title = `Learn ${skill.skill_name}`;
      details = message
        ? message.trim()
        : `I'd like to learn ${skill.skill_name} from you.`;

      if (Number(providerId) === Number(requester_id)) {
        return res
          .status(400)
          .json({ message: "You already teach this skill" });
      }
    }

    /* ---------------------------
       VALIDATION
    --------------------------- */
    if (!providerId) {
      return res.status(400).json({
        message: "Missing both skill_id and to_user_id",
      });
    }

    /* ---------------------------
       CREATE COLLABORATION ROW
    --------------------------- */
    const [result] = await db.query(
      `
      INSERT INTO collaborations
      (requester_id, provider_id, project_id, title, details, status)
      VALUES (?, ?, NULL, ?, ?, 'pending')
      `,
      [requester_id, providerId, title, details]
    );

    const collaborationId = result.insertId;

    /* ---------------------------
       CREATE CONVERSATION + FIRST MESSAGE
    --------------------------- */
    const [convRes] = await db.query(
      "INSERT INTO conversations (subject, is_group) VALUES (?, 0)",
      [title]
    );
    const conversationId = convRes.insertId;

    await db.query(
      "INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)",
      [conversationId, requester_id, details]
    );

    // Link the conversation to the collaboration
    await db.query(
      "UPDATE collaborations SET conversation_id = ? WHERE id = ?",
      [conversationId, collaborationId]
    );

    res.json({
      message: "Collaboration request sent",
      collaboration_id: collaborationId,
      provider_id: providerId,
      conversation_id: conversationId,
    });
  } catch (err) {
    console.error("REQUEST COLLAB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /collaborations/:id/accept
export const acceptCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    const [[collab]] = await db.query(
      "SELECT requester_id, provider_id, status FROM collaborations WHERE id = ?",
      [id]
    );

    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    // New rule: both requester and provider can accept
    if (
      Number(collab.requester_id) !== Number(user_id) &&
      Number(collab.provider_id) !== Number(user_id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    if (collab.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    await db.query(
      `
      UPDATE collaborations
      SET status = 'accepted', responded_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    res.json({ message: "Collaboration accepted" });
  } catch (err) {
    console.error("ACCEPT COLLAB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /collaborations/:id/reject
export const rejectCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    const [[collab]] = await db.query(
      "SELECT requester_id, provider_id, status FROM collaborations WHERE id = ?",
      [id]
    );

    if (!collab) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    // New rule: both requester and provider can reject
    if (
      Number(collab.requester_id) !== Number(user_id) &&
      Number(collab.provider_id) !== Number(user_id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this request" });
    }

    if (collab.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    await db.query(
      `
      UPDATE collaborations
      SET status = 'rejected', responded_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    res.json({ message: "Collaboration rejected" });
  } catch (err) {
    console.error("REJECT COLLAB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /collaborations/mine?user_id=...
export const getMyCollaborations = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    const [rows] = await db.query(
      `
      SELECT
        c.id,
        c.requester_id,
        c.provider_id,
        c.title,
        c.details,
        c.status,
        c.requested_at,
        c.conversation_id,
        u1.full_name AS requester_name,
        u2.full_name AS provider_name
      FROM collaborations c
      JOIN users u1 ON u1.id = c.requester_id
      JOIN users u2 ON u2.id = c.provider_id
      WHERE c.requester_id = ? OR c.provider_id = ?
      ORDER BY c.requested_at DESC
      `,
      [user_id, user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET MY COLLABS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
