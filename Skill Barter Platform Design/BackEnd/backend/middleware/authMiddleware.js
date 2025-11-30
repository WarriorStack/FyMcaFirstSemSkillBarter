
// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SUPER_SECRET_KEY"
    );

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate
    await authenticate(req, res, async () => {
      const [rows] = await db.query(
        "SELECT user_type FROM users WHERE id = ?",
        [req.user.id]
      );

      if (!rows.length || rows[0].user_type !== "admin") {
        return res.status(403).json({ message: "Admins only" });
      }

      next();
    });
  } catch (err) {
    console.error("ADMIN CHECK ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
