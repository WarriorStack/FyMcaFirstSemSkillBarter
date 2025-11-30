import { db } from "../db.js";

/* ============================================================
      GET ALL TASKS FOR A COLLABORATION
============================================================ */
export const getTasksByCollab = async (req, res) => {
  try {
    const { collab_id } = req.params;

    const [rows] = await db.query(
      `SELECT t.*, u.full_name AS assignee_name
       FROM tasks t
       JOIN users u ON u.id = t.assignee_id
       WHERE t.collaboration_id = ?
       ORDER BY t.created_at DESC`,
      [collab_id]
    );

    // Group by status for kanban
    const grouped = {
      todo: [],
      inprogress: [],
      done: [],
    };

    rows.forEach((t) => grouped[t.status].push(t));

    res.json(grouped);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
      GET ALL TASKS ASSIGNED TO A USER (Kanban dashboard)
============================================================ */
export const getMyTasks = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [rows] = await db.query(
      `SELECT t.*, c.title AS collaboration_title
       FROM tasks t
       JOIN collaborations c ON c.id = t.collaboration_id
       WHERE assignee_id = ?
       ORDER BY t.created_at DESC`,
      [user_id]
    );

    const grouped = { todo: [], inprogress: [], done: [] };
    rows.forEach((t) => grouped[t.status].push(t));

    res.json(grouped);
  } catch (err) {
    console.error("GET USER TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
      CREATE TASK
============================================================ */
export const createTask = async (req, res) => {
  try {
    const {
      collaboration_id,
      title,
      description,
      priority,
      status,
      assignee_id,
      due_date,
    } = req.body;

    if (!collaboration_id || !title || !assignee_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO tasks 
       (collaboration_id, title, description, priority, status, assignee_id, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        collaboration_id,
        title,
        description || null,
        priority || "Medium",
        status || "todo",
        assignee_id,
        due_date || null,
      ]
    );

    res.json({ message: "Task created", id: result.insertId });
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
      UPDATE TASK
============================================================ */
export const updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    const fields = req.body;
    const keys = Object.keys(fields);

    if (keys.length === 0) return res.json({ message: "Nothing to update" });

    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = Object.values(fields);

    await db.query(
      `UPDATE tasks SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      [...values, task_id]
    );

    res.json({ message: "Task updated" });
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
      MOVE TASK (Kanban drag/drop)
============================================================ */
export const moveTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status } = req.body;

    if (!["todo", "inprogress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      `UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, task_id]
    );

    res.json({ message: "Task moved" });
  } catch (err) {
    console.error("MOVE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
      DELETE TASK
============================================================ */
export const deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    await db.query(`DELETE FROM tasks WHERE id = ?`, [task_id]);

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
