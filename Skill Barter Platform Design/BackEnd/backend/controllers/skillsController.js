// backend/controllers/skillsController.js
import { db } from "../db.js";

/* ----------------------------
   Helpers
----------------------------- */

function mapLevel(proficiency) {
  if (!proficiency) return "Beginner";
  return proficiency.charAt(0).toUpperCase() + proficiency.slice(1);
}

function mapDuration(years) {
  if (years == null) return "4 weeks";
  if (years <= 1) return "4 weeks";
  if (years <= 3) return "6 weeks";
  if (years <= 5) return "8 weeks";
  return "10 weeks";
}

function mapPoints(proficiency) {
  if (!proficiency) return 80;
  const p = proficiency.toLowerCase();
  switch (p) {
    case "beginner": return 80;
    case "intermediate": return 120;
    case "advanced": return 160;
    case "expert": return 200;
    default: return 100;
  }
}

/* ----------------------------
   GET /skills
   Main Skill Explorer API
----------------------------- */

export const getAllSkillsWithInstructors = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM (
        SELECT
          s.id,
          s.skill_name AS name,
          s.category,
          s.description,
          s.verified,

          us.user_id AS instructor_id,
          u.full_name AS instructor_name,
          u.avatar_url,

          st.rating AS instructor_rating,
          st.rating_count AS instructor_rating_count,

          us.proficiency_level,
          us.years_experience,

          COALESCE(coll.student_count, 0) AS students,

          ROW_NUMBER() OVER (
            PARTITION BY s.id
            ORDER BY
              st.rating DESC,
              st.rating_count DESC,
              us.years_experience DESC
          ) AS rn

        FROM skills s

        LEFT JOIN user_skills us ON us.skill_id = s.id
        LEFT JOIN users u ON u.id = us.user_id
        LEFT JOIN students st ON st.id = u.id

        LEFT JOIN (
          SELECT provider_id, COUNT(*) AS student_count
          FROM collaborations
          WHERE status IN ('accepted','in_progress','completed')
          GROUP BY provider_id
        ) coll ON coll.provider_id = us.user_id
      ) ranked
      WHERE rn = 1 OR rn IS NULL
      ORDER BY name;
      `
    );

    const skills = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category || "Other",
      description: r.description || "",
      verified: !!r.verified,

      instructor: r.instructor_id
        ? {
            id: r.instructor_id,
            name: r.instructor_name,
            avatar:
              r.avatar_url ||
              "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
            rating: r.instructor_rating ?? null,
            rating_count: r.instructor_rating_count ?? 0,
          }
        : null,

      students: r.students || 0,
      level: mapLevel(r.proficiency_level),
      duration: mapDuration(r.years_experience),
      points: mapPoints(r.proficiency_level),
    }));

    return res.json(skills); // CLEAN ARRAY ✔
  } catch (err) {
    console.error("❌ GET ALL SKILLS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ----------------------------
   GET /skills/list
   For dropdown menus
----------------------------- */

export const getSkillsList = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT id, skill_name, category
      FROM skills
      ORDER BY skill_name
      `
    );

    return res.json(rows);
  } catch (err) {
    console.error("❌ GET SKILLS LIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
