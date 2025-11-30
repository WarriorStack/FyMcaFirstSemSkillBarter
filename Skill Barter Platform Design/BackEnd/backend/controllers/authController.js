import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const signup = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const [existing] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    await connection.beginTransaction();

    // Insert into USERS
    const [insertUser] = await connection.query(
      `INSERT INTO users (full_name, display_name, email, password, user_type)
       VALUES (?, ?, ?, ?, 'student')`,
      [name, name, email, hashedPassword]
    );

    const userId = insertUser.insertId;

    // Insert into STUDENTS
    await connection.query(
      `INSERT INTO students (id, points_balance, rating, rating_count)
       VALUES (?, 0, NULL, 0)`,
      [userId]
    );

    await connection.commit();
    connection.release();

    return res.json({ message: "Account created successfully" });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    try {
      await connection.rollback();
      connection.release();
    } catch {}

    return res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "SUPER_SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
