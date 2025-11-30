import { db } from "../db.js";

export const createProject = async (req, res) => {
  try {
    const {
      created_by,
      project_name,
      description,
      status,
      starts_at,
      ends_at,
      max_participants,
    } = req.body;

    if (!created_by || !project_name) {
      return res
        .status(400)
        .json({ message: "created_by and project_name are required" });
    }

    const [result] = await db.query(
      `INSERT INTO projects
       (created_by, project_name, description, status, starts_at, ends_at, max_participants)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        created_by,
        project_name,
        description ?? null,
        status ?? "open",
        starts_at ?? null,
        ends_at ?? null,
        max_participants ?? null,
      ]
    );

    const projectId = result.insertId;

    // auto-add creator as participant (owner)
    await db.query(
      `INSERT INTO project_participants (project_id, user_id, role)
       VALUES (?, ?, ?)`,
      [projectId, created_by, "owner"]
    );

    res.json({
      message: "Project created successfully",
      project: { id: projectId },
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error while creating project" });
  }
};
