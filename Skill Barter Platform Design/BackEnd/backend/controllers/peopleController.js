// backend/controllers/peopleController.js
import { db } from "../db.js";

export const getPeopleForExplore = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.full_name,
        u.display_name,
        u.avatar_url,
        s.rating,
        s.rating_count,
        GROUP_CONCAT(sk.skill_name) AS skills
      FROM users u
      LEFT JOIN students s ON s.id = u.id
      LEFT JOIN user_skills us ON us.user_id = u.id
      LEFT JOIN skills sk ON sk.id = us.skill_id
      WHERE u.user_type = 'student'
      GROUP BY u.id
    `);

    const people = rows.map((r) => ({
      id: r.id,
      full_name: r.full_name,
      display_name: r.display_name,
      avatar_url: r.avatar_url,
      rating: r.rating !== null && r.rating !== undefined ? Number(r.rating) : null,
      rating_count: r.rating_count || 0,
      points: 0,
      skills: r.skills ? r.skills.split(",") : [], // always an array
    }));

    res.json(people);
  } catch (err) {
    console.error("PEOPLE EXPLORE ERROR:", err);
    res.status(500).json({ message: "Server error loading people" });
  }
};


// ---------- PUBLIC PROFILE VIEW (read-only) ----------
export const getPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // basic user info
    const [[user]] = await db.query(
      `SELECT 
         id, 
         full_name, 
         display_name, 
         avatar_url,
         bio,
         user_type
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // student metrics
    const [[student]] = await db.query(
      `SELECT
         college,
         points_balance AS points,
         rating,
         rating_count
       FROM students
       WHERE id = ?`,
      [userId]
    );

    // skills
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

    // collaboration count
    const [[collabCount]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM collaborations
       WHERE requester_id = ? OR provider_id = ?`,
      [userId, userId]
    );

    return res.json({
      id: user.id,
      full_name: user.full_name,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      bio: user.bio ?? null,

      college: student?.college ?? null,
      rating: student?.rating ?? null,
      rating_count: student?.rating_count ?? 0,
      points: student?.points ?? 0,

      skills,
      collaborations: collabCount?.total ?? 0,
    });
  } catch (err) {
    console.error("PUBLIC PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error loading profile" });
  }
};
