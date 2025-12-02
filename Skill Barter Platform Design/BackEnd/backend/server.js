// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import peopleRoutes from "./routes/peopleRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import adminAnnouncementRoutes from "./routes/adminAnnouncementRoutes.js";
import adminReportRoutes from "./routes/adminReportRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";


import adminSkillRoutes from "./routes/adminSkillRoutes.js";
import adminVerificationRoutes from "./routes/adminVerificationRoutes.js";
import adminCollaborationRoutes from "./routes/adminCollaborationRoutes.js";
import adminAchievementRoutes from "./routes/adminAchievementRoutes.js";
import adminTransactionRoutes from "./routes/adminTransactionRoutes.js";


dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("SkillBarter Backend Running...");
});

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/profile", profileRoutes);
app.use("/skills", skillsRoutes);
app.use("/collaborations", collaborationRoutes);
app.use("/projects", projectRoutes);
app.use("/people", peopleRoutes);
app.use("/messages", messageRoutes);
app.use("/tasks", taskRoutes);
app.use("/achievements", achievementRoutes);
app.use("/admin", adminRoutes); 


app.use("/admin/dashboard", adminRoutes);
app.use("/admin/reports", adminReportRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/skills", adminSkillRoutes);
app.use("/admin/verifications", adminVerificationRoutes);
app.use("/admin/collaborations", adminCollaborationRoutes);
app.use("/admin/achievements", adminAchievementRoutes);
app.use("/admin/transactions", adminTransactionRoutes);
app.use("/admin/announcements", adminAnnouncementRoutes);
app.use("/admin/analytics", adminAnalyticsRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
