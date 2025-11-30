// backend/controllers/profileController.js
import { db } from "../db.js";

// ---------- helpers ----------
const calcProfileCompletion = ({ user, student }) => {
  const fields = [
    user.full_name,
    user.display_name,
    user.phone,
    student?.college,
    student?.student_number,
  ];
  const filled = fields.filter((f) => f && f.trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
};

// ---------- GET /profile?user_id=... ----------
export const getProfile = async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ message: "Missing user_id" });

    const [[user]] = await db.query(
      "SELECT id, full_name, display_name, email, phone, avatar_url FROM users WHERE id = ?",
      [userId]
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const [[student]] = await db.query(
      `SELECT student_number, college, points_balance
       FROM students WHERE id = ?`,
      [userId]
    );

    const [[skillsCountRow]] = await db.query(
      "SELECT COUNT(*) AS total_skills FROM user_skills WHERE user_id = ?",
      [userId]
    );
    const skillsCount = skillsCountRow.total_skills || 0;

    // Get rating + review count dynamically from feedback table
    const [[ratingRow]] = await db.query(
      `SELECT 
         COUNT(*) AS rating_count,
         AVG(rating) AS avg_rating
       FROM feedback
       WHERE to_user_id = ?`,
      [userId]
    );

    const ratingCount = ratingRow?.rating_count || 0;
    const avgRatingRaw = ratingRow?.avg_rating;
    const avgRating =
      avgRatingRaw !== null && avgRatingRaw !== undefined
        ? Number(avgRatingRaw)
        : null;

    const profileCompletion = calcProfileCompletion({ user, student });

    return res.json({
      user,
      student: student || null,
      stats: {
        skills: skillsCount,
        points: student?.points_balance ?? 0,
        rating: avgRating,
        rating_count: ratingCount,
      },
      profileCompletion,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- PUT /profile ----------
export const updateProfile = async (req, res) => {
  let connection;
  try {
    const { user_id, full_name, display_name, phone, college, student_number } =
      req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.query(
      `UPDATE users
       SET full_name = ?, display_name = ?, phone = ?
       WHERE id = ?`,
      [full_name, display_name, phone, user_id]
    );

    const [[existingStudent]] = await connection.query(
      "SELECT id FROM students WHERE id = ?",
      [user_id]
    );

    if (existingStudent) {
      await connection.query(
        `UPDATE students
         SET college = ?, student_number = ?
         WHERE id = ?`,
        [college, student_number, user_id]
      );
    } else {
      await connection.query(
        `INSERT INTO students (id, college, student_number, points_balance, rating, rating_count)
         VALUES (?, ?, ?, 0, NULL, 0)`,
        [user_id, college, student_number]
      );
    }

    await connection.commit();
    connection.release();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch {}
    }
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- SKILLS: GET /profile/skills?user_id=... ----------
export const getUserSkills = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Missing user_id" });

    const [rows] = await db.query(
      `SELECT us.skill_id,
              s.skill_name,
              s.category,
              us.proficiency_level,
              us.years_experience
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = ?
       ORDER BY s.skill_name`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET USER SKILLS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- SKILLS: POST /profile/skills ----------
export const addUserSkill = async (req, res) => {
  try {
    const { user_id, skill_id, proficiency_level, years_experience } = req.body;

    if (!user_id || !skill_id || !proficiency_level) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existing] = await db.query(
      "SELECT 1 FROM user_skills WHERE user_id = ? AND skill_id = ?",
      [user_id, skill_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Skill already added" });
    }

    await db.query(
      `INSERT INTO user_skills
       (user_id, skill_id, proficiency_level, years_experience)
       VALUES (?, ?, ?, ?)`,
      [user_id, skill_id, proficiency_level, years_experience ?? null]
    );

    res.json({ message: "Skill added successfully" });
  } catch (err) {
    console.error("ADD USER SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- SKILLS: PUT /profile/skills/:skillId ----------
export const updateUserSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { user_id, proficiency_level, years_experience } = req.body;

    if (!user_id || !skillId) {
      return res.status(400).json({ message: "Missing user_id or skillId" });
    }

    await db.query(
      `UPDATE user_skills
       SET proficiency_level = ?, years_experience = ?
       WHERE user_id = ? AND skill_id = ?`,
      [proficiency_level, years_experience ?? null, user_id, skillId]
    );

    res.json({ message: "Skill updated successfully" });
  } catch (err) {
    console.error("UPDATE USER SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- SKILLS: DELETE /profile/skills/:skillId?user_id=... ----------
export const deleteUserSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { user_id } = req.query;
    if (!user_id || !skillId) {
      return res.status(400).json({ message: "Missing user_id or skillId" });
    }

    await db.query(
      "DELETE FROM user_skills WHERE user_id = ? AND skill_id = ?",
      [user_id, skillId]
    );

    res.json({ message: "Skill removed successfully" });
  } catch (err) {
    console.error("DELETE USER SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- AVATAR: POST /profile/avatar ----------
export const saveAvatar = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: "Missing user_id" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await db.query("UPDATE users SET avatar_url = ? WHERE id = ?", [
      avatarUrl,
      user_id,
    ]);

    res.json({ message: "Avatar updated", avatar_url: avatarUrl });
  } catch (err) {
    console.error("SAVE AVATAR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- REVIEWS: GET /profile/reviews?user_id=... ----------
export const getUserReviews = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Missing user_id" });

    const [rows] = await db.query(
      `SELECT 
         f.id,
         f.rating,
         f.comment,
         f.created_at,
         u.display_name AS from_user_name,
         p.project_name
       FROM feedback f
       LEFT JOIN users u ON u.id = f.from_user_id
       LEFT JOIN projects p ON p.id = f.project_id
       WHERE f.to_user_id = ?
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET USER REVIEWS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- REVIEWS: POST /profile/reviews ----------
export const addUserReview = async (req, res) => {
  try {
    const { from_user_id, to_user_id, rating, comment, project_id } = req.body;

    if (!from_user_id || !to_user_id || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (from_user_id === to_user_id) {
      return res
        .status(400)
        .json({ message: "You cannot review yourself" });
    }

    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    // Ensure both users exist
    const [[fromUser]] = await db.query(
      "SELECT id FROM users WHERE id = ?",
      [from_user_id]
    );
    const [[toUser]] = await db.query("SELECT id FROM users WHERE id = ?", [
      to_user_id,
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.query(
      `INSERT INTO feedback (from_user_id, to_user_id, project_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [from_user_id, to_user_id, project_id ?? null, ratingNum, comment ?? null]
    );

    // Recalculate rating + count from feedback for this instructor
    const [[ratingRow]] = await db.query(
      `SELECT 
         COUNT(*) AS rating_count,
         AVG(rating) AS avg_rating
       FROM feedback
       WHERE to_user_id = ?`,
      [to_user_id]
    );

    const newCount = ratingRow?.rating_count || 0;
    const newAvgRaw = ratingRow?.avg_rating;
    const newAvg =
      newAvgRaw !== null && newAvgRaw !== undefined
        ? Number(newAvgRaw)
        : null;

    // Optionally sync into students table (if row exists)
    await db.query(
      `UPDATE students
       SET rating = ?, rating_count = ?
       WHERE id = ?`,
      [newAvg, newCount, to_user_id]
    );

    res.json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("ADD USER REVIEW ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- PUBLIC PROFILE VIEW (read-only) ----------
// GET /profile/public/:id
export const getPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch basic user info
    const [[user]] = await db.query(
      `SELECT 
         id, 
         full_name, 
         display_name, 
         avatar_url,
         user_type
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch skills
    const [skills] = await db.query(
      `SELECT 
         sk.skill_name AS name,
         sk.category,
         us.proficiency_level AS level,
         us.years_experience AS years
       FROM user_skills us
       JOIN skills sk ON sk.id = us.skill_id
       WHERE us.user_id = ?
       ORDER BY sk.skill_name`,
      [userId]
    );

    // Fetch reviews
    const [reviews] = await db.query(
      `SELECT 
         f.rating,
         f.comment,
         f.created_at,
         u.display_name AS from_user_name
       FROM feedback f
       LEFT JOIN users u ON u.id = f.from_user_id
       WHERE f.to_user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    // Wrap + return
    res.json({
      user,
      skills,
      reviews,
    });
  } catch (err) {
    console.error("PUBLIC PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error loading profile" });
  }
};



