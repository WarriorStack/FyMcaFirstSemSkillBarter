import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { StatCard } from "./StatCard";
import {
  Users,
  Activity,
  AlertTriangle,
  Award,
  TrendingUp,
  Megaphone,
  BarChart2,
  MessageCircle,
  Hammer,
  ShieldCheck,
  Star,
  Settings,
  BadgeCheck,
  Coins,
  Layers,
  FolderOpen,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "../lib/utils";

const API_BASE = "http://localhost:5000";

// =======================
// TYPES
// =======================

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  pendingReports: number;
  totalSkills: number;
}

interface UserGrowthPoint {
  month: string;
  users: number;
}

interface SkillCategory {
  name: string;
  value: number;
  color: string;
}

interface Report {
  id: number;
  user: string;
  issue: string;
  status: "pending" | "resolved" | "investigating" | "dismissed" | string;
  priority: "Low" | "Medium" | "High" | string;
}

interface RecentUser {
  id: number;
  name: string;
  joined: string;
  points: number;
  status: "active" | "inactive" | string;
}

interface Announcement {
  id: number;
  title: string;
  message: string;
  admin_name: string;
  created_at: string;
}

interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  user_type: string;
  is_active: 0 | 1;
  created_at: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  topSkills: { skill_name: string; count: number }[];
}

interface DashboardData {
  stats: DashboardStats;
  userGrowth: UserGrowthPoint[];
  skillCategories: SkillCategory[];
  recentReports: Report[];
  recentUsers: RecentUser[];
}

// Skill verification
interface SkillVerification {
  id: number;
  skill_id: number;
  requester_id: number;
  verifier_id: number | null;
  status: "requested" | "approved" | "rejected" | "revoked" | string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  skill_name?: string;
  requester_name?: string;
}

// Collaborations
interface Collaboration {
  id: number;
  requester_id: number;
  provider_id: number;
  requester_name?: string;
  provider_name?: string;
  project_id: number | null;
  title: string | null;
  details: string | null;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "in_progress"
    | "completed"
    | "cancelled"
    | string;
  requested_at: string;
  responded_at: string | null;
}

// Achievements
interface Achievement {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  points_reward: number;
  icon: string;
  earned_at: string;
  user_name?: string;
}

// Skills
interface Skill {
  id: number;
  skill_name: string;
  category: string | null;
  description: string | null;
  verified: 0 | 1 | boolean;
  created_at: string;
}

// Projects
interface Project {
  id: number;
  project_name: string;
  description: string | null;
  status: "open" | "in_progress" | "completed" | "cancelled" | string;
  starts_at: string | null;
  ends_at: string | null;
  max_participants: number | null;
  created_by: number | null;
}

// Transactions
interface Transaction {
  id: number;
  from_user_id: number | null;
  to_user_id: number | null;
  transaction_type: "earn" | "redeem" | "transfer" | "admin_adjustment" | string;
  amount: number;
  balance_after: number | null;
  description: string | null;
  created_at: string;
  from_name?: string;
  to_name?: string;
}

// SETTINGS STATE
interface PlatformSettings {
  maintenanceMode: boolean;
  defaultRewardPoints: number;
  spamFilterEnabled: boolean;
}

type Section =
  | "dashboard"
  | "reports"
  | "users"
  | "announcements"
  | "analytics"
  | "verifications"
  | "collaborations"
  | "achievements"
  | "skills"
  | "projects"
  | "transactions"
  | "settings";

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  // Dashboard
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Reports
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementSending, setAnnouncementSending] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Skill verifications
  const [verifications, setVerifications] = useState<SkillVerification[]>([]);
  const [verificationsLoading, setVerificationsLoading] = useState(false);

  // Collaborations
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [collabsLoading, setCollabsLoading] = useState(false);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = useState("");
  const [newAchievementDescription, setNewAchievementDescription] =
    useState("");
  const [newAchievementPoints, setNewAchievementPoints] = useState(50);

  // Skills
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillDescription, setSkillDescription] = useState("");

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [pointsAdjustUserId, setPointsAdjustUserId] = useState<number | null>(
    null
  );
  const [pointsAdjustAmount, setPointsAdjustAmount] = useState(0);
  const [pointsAdjustReason, setPointsAdjustReason] = useState("");

  // Settings (frontend only demo, you can back it with DB/config)
  const [settings, setSettings] = useState<PlatformSettings>({
    maintenanceMode: false,
    defaultRewardPoints: 50,
    spamFilterEnabled: true,
  });

  const token = localStorage.getItem("token");

  // =======================
  // INITIAL DASHBOARD FETCH
  // =======================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!token) {
          setError("No auth token found. Please log in again.");
          setDashboardLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await res.text();
        if (!res.ok) {
          console.error("Dashboard error response:", text);
          throw new Error("Failed to load admin dashboard");
        }

        const json = JSON.parse(text);
        setDashboardData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  // =======================
  // LAZY LOADERS
  // =======================

  const loadReports = async () => {
    try {
      setReportsLoading(true);
      const res = await fetch(`${API_BASE}/admin/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load reports");
      setReports(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load reports");
    } finally {
      setReportsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load users");
      setUsers(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      const res = await fetch(`${API_BASE}/admin/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || "Failed to load announcements");
      setAnnouncements(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load announcements");
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await fetch(`${API_BASE}/admin/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load analytics");
      setAnalytics(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Skill verifications (requires backend route like: GET /admin/verifications)
  const loadVerifications = async () => {
    try {
      setVerificationsLoading(true);
      const res = await fetch(`${API_BASE}/admin/skill-verifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        // If you haven't implemented this yet, don't explode the UI
        console.warn("Skill verifications route not implemented yet");
        setVerifications([]);
        return;
      }
      const json = await res.json();
      setVerifications(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load verifications");
    } finally {
      setVerificationsLoading(false);
    }
  };

  // Collaborations (requires backend route like: GET /admin/collaborations)
  const loadCollaborations = async () => {
    try {
      setCollabsLoading(true);
      const res = await fetch(`${API_BASE}/admin/collaborations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.warn("Collaborations route not implemented yet");
        setCollaborations([]);
        return;
      }
      const json = await res.json();
      setCollaborations(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load collaborations");
    } finally {
      setCollabsLoading(false);
    }
  };

  // Achievements (requires backend route like: GET /admin/achievements)
  const loadAchievements = async () => {
    try {
      setAchievementsLoading(true);
      const res = await fetch(`${API_BASE}/admin/achievements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.warn("Achievements route not implemented yet");
        setAchievements([]);
        return;
      }
      const json = await res.json();
      setAchievements(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load achievements");
    } finally {
      setAchievementsLoading(false);
    }
  };

  // Skills (requires backend route like: GET /admin/skills)
  const loadSkills = async () => {
    try {
      setSkillsLoading(true);
      const res = await fetch(`${API_BASE}/admin/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.warn("Skills admin route not implemented yet");
        setSkills([]);
        return;
      }
      const json = await res.json();
      setSkills(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load skills");
    } finally {
      setSkillsLoading(false);
    }
  };

  // Projects (requires backend route like: GET /admin/projects)
  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      const res = await fetch(`${API_BASE}/admin/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.warn("Projects admin route not implemented yet");
        setProjects([]);
        return;
      }
      const json = await res.json();
      setProjects(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  // Transactions (requires backend route like: GET /admin/transactions)
  const loadTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const res = await fetch(`${API_BASE}/admin/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.warn("Transactions admin route not implemented yet");
        setTransactions([]);
        return;
      }
      const json = await res.json();
      setTransactions(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setTransactionsLoading(false);
    }
  };

  // =======================
  // SECTION CHANGE
  // =======================
  const handleSectionChange = (section: Section) => {
    setActiveSection(section);

    if (section === "reports" && reports.length === 0) {
      loadReports();
    }
    if (section === "users" && users.length === 0) {
      loadUsers();
    }
    if (section === "announcements" && announcements.length === 0) {
      loadAnnouncements();
    }
    if (section === "analytics" && !analytics) {
      loadAnalytics();
    }
    if (section === "verifications" && verifications.length === 0) {
      loadVerifications();
    }
    if (section === "collaborations" && collaborations.length === 0) {
      loadCollaborations();
    }
    if (section === "achievements" && achievements.length === 0) {
      loadAchievements();
    }
    if (section === "skills" && skills.length === 0) {
      loadSkills();
    }
    if (section === "projects" && projects.length === 0) {
      loadProjects();
    }
    if (section === "transactions" && transactions.length === 0) {
      loadTransactions();
    }
  };

  // =======================
  // REPORT ACTIONS
  // =======================
  const updateReportStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update report");

      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update report");
    }
  };

  // =======================
  // USER ACTIONS
  // =======================
  const toggleUserActive = async (id: number, active: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/activate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update user");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_active: active ? 1 : 0 } : u
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update user");
    }
  };

  const promoteToAdmin = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/promote/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to promote user");

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, user_type: "admin" } : u))
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to promote user");
    }
  };

  // Example: promote to mentor/trainer (needs backend route)
  const promoteToMentor = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/promote-mentor/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.warn("Promote to mentor route not implemented yet");
        return;
      }
      await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, user_type: "mentor" } : u
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to promote to mentor");
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete user");
    }
  };

  // =======================
  // ANNOUNCEMENTS
  // =======================
  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementMessage) return;

    try {
      setAnnouncementSending(true);
      const res = await fetch(`${API_BASE}/admin/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: announcementTitle,
          message: announcementMessage,
        }),
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || "Failed to send announcement");

      setAnnouncementTitle("");
      setAnnouncementMessage("");
      await loadAnnouncements();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send announcement");
    } finally {
      setAnnouncementSending(false);
    }
  };

  // =======================
  // VERIFICATION ACTIONS
  // =======================
  const updateVerificationStatus = async (
    id: number,
    status: string,
    notes?: string
  ) => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/skill-verifications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, notes }),
        }
      );

      if (!res.ok) {
        console.warn("Update verification route not implemented yet");
        return;
      }

      setVerifications((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status, notes: notes ?? v.notes } : v
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update verification");
    }
  };

  // =======================
  // ACHIEVEMENT ACTIONS
  // =======================
  const handleCreateAchievement = async () => {
    if (!newAchievementTitle) return;

    try {
      const res = await fetch(`${API_BASE}/admin/achievements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newAchievementTitle,
          description: newAchievementDescription,
          points_reward: newAchievementPoints,
        }),
      });

      if (!res.ok) {
        console.warn("Create achievement route not implemented yet");
        return;
      }

      setNewAchievementTitle("");
      setNewAchievementDescription("");
      setNewAchievementPoints(50);
      await loadAchievements();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create achievement");
    }
  };

  const handleAssignAchievement = async (achievementId: number, userId: number) => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/achievements/${achievementId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (!res.ok) {
        console.warn("Assign achievement route not implemented yet");
        return;
      }

      await loadAchievements();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to assign achievement");
    }
  };

  // =======================
  // SKILLS ACTIONS
  // =======================
  const handleCreateSkill = async () => {
    if (!skillName) return;

    try {
      const res = await fetch(`${API_BASE}/admin/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skill_name: skillName,
          category: skillCategory || null,
          description: skillDescription || null,
        }),
      });

      if (!res.ok) {
        console.warn("Create skill route not implemented yet");
        return;
      }

      setSkillName("");
      setSkillCategory("");
      setSkillDescription("");
      await loadSkills();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create skill");
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn("Delete skill route not implemented yet");
        return;
      }

      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete skill");
    }
  };

  // =======================
  // PROJECT ACTIONS
  // =======================
  const updateProjectStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        console.warn("Update project route not implemented yet");
        return;
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update project");
    }
  };

  // =======================
  // TRANSACTION / POINTS ACTIONS
  // =======================
  const handleAdjustPoints = async () => {
    if (!pointsAdjustUserId || !pointsAdjustAmount) return;

    try {
      const res = await fetch(`${API_BASE}/admin/transactions/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: pointsAdjustUserId,
          amount: pointsAdjustAmount,
          description: pointsAdjustReason,
        }),
      });

      if (!res.ok) {
        console.warn("Points adjust route not implemented yet");
        return;
      }

      setPointsAdjustUserId(null);
      setPointsAdjustAmount(0);
      setPointsAdjustReason("");
      await loadTransactions();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to adjust points");
    }
  };

  // =======================
  // DERIVED DATA
  // =======================
  const statsConfig =
    dashboardData &&
    [
      {
        title: "Total Users",
        value: dashboardData.stats.totalUsers.toLocaleString(),
        icon: Users,
        gradient: "bg-gradient-to-br from-[#6C63FF] to-[#4A90E2]",
      },
      {
        title: "Active Sessions",
        value: dashboardData.stats.activeSessions.toLocaleString(),
        icon: Activity,
        gradient: "bg-gradient-to-br from-[#4A90E2] to-[#2ECC71]",
      },
      {
        title: "Pending Reports",
        value: dashboardData.stats.pendingReports.toString(),
        icon: AlertTriangle,
        gradient: "bg-gradient-to-br from-[#FF6B6B] to-[#FF9A56]",
      },
      {
        title: "Skills Listed",
        value: dashboardData.stats.totalSkills.toString(),
        icon: Award,
        gradient: "bg-gradient-to-br from-[#FFC857] to-[#FF9A56]",
      },
    ];

  const userGrowthData = dashboardData?.userGrowth ?? [];
  const skillCategoryData = dashboardData?.skillCategories ?? [];
  const recentReports = dashboardData?.recentReports ?? [];
  const recentUsers = dashboardData?.recentUsers ?? [];

  const pendingReportsCount = reports.length
    ? reports.filter((r) => r.status === "pending").length
    : recentReports.filter((r) => r.status === "pending").length;

  // =======================
  // LOADING / ERROR
  // =======================
  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="max-w-md w-full text-center">
          <h2 className="mb-2">Error loading dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-xs text-muted-foreground">
            Make sure you are logged in as an admin and the backend is running.
          </p>
        </GlassCard>
      </div>
    );
  }

  // =======================
  // SECTION RENDERERS
  // =======================

  // DASHBOARD
  const renderDashboardSection = () => (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">
          High-level metrics for the Skill Barter platform
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig?.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <h3 className="mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(74, 144, 226, 0.1)"
              />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4A90E2"
                strokeWidth={3}
                dot={{ fill: "#4A90E2", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-6">Skills by Category</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {skillCategoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm">{category.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {category.value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Snapshots */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3>Recent Reports</h3>
            <Badge variant="outline" className="rounded-xl">
              {pendingReportsCount} Pending
            </Badge>
          </div>
          <div className="space-y-4">
            {recentReports.slice(0, 5).map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p>{report.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.issue}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor:
                        report.priority === "High"
                          ? "#FF6B6B"
                          : report.priority === "Medium"
                          ? "#FFC857"
                          : "#2ECC71",
                      color:
                        report.priority === "High"
                          ? "#FF6B6B"
                          : report.priority === "Medium"
                          ? "#FFC857"
                          : "#2ECC71",
                    }}
                  >
                    {report.priority}
                  </Badge>
                </div>
                <Badge
                  className={`${
                    report.status === "resolved"
                      ? "bg-[#2ECC71]"
                      : report.status === "investigating"
                      ? "bg-[#4A90E2]"
                      : "bg-[#FFC857]"
                  } text-white border-0`}
                >
                  {report.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3>New Users</h3>
            <Badge className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white border-0">
              Latest
            </Badge>
          </div>
          <div className="space-y-4">
            {recentUsers.slice(0, 5).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined{" "}
                        {new Date(user.joined).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{user.points} pts</p>
                    <Badge className="bg-[#2ECC71] text-white border-0 text-xs">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );

  // REPORTS
  const renderReportsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Reports</h2>
          <p className="text-muted-foreground">
            Review and moderate user reports.
          </p>
        </div>
        <Badge variant="outline" className="rounded-xl">
          {pendingReportsCount} Pending
        </Badge>
      </div>

      <GlassCard>
        {reportsLoading ? (
          <p className="text-muted-foreground">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground">No reports found.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p>{report.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.issue}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor:
                        report.priority === "High"
                          ? "#FF6B6B"
                          : report.priority === "Medium"
                          ? "#FFC857"
                          : "#2ECC71",
                      color:
                        report.priority === "High"
                          ? "#FF6B6B"
                          : report.priority === "Medium"
                          ? "#FFC857"
                          : "#2ECC71",
                    }}
                  >
                    {report.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={`${
                      report.status === "resolved"
                        ? "bg-[#2ECC71]"
                        : report.status === "investigating"
                        ? "bg-[#4A90E2]"
                        : "bg-[#FFC857]"
                    } text-white border-0`}
                  >
                    {report.status}
                  </Badge>
                  <div className="flex gap-2 ml-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#4A90E2]/10 hover:bg-[#4A90E2]/20 text-xs"
                      onClick={() =>
                        updateReportStatus(report.id, "investigating")
                      }
                    >
                      Investigate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-xs"
                      onClick={() =>
                        updateReportStatus(report.id, "resolved")
                      }
                    >
                      Resolve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-xs"
                      onClick={() =>
                        updateReportStatus(report.id, "dismissed")
                      }
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </>
  );

  // USERS
  const renderUsersSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and status.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr,1.2fr] gap-6">
        <GlassCard>
          {usersLoading ? (
            <p className="text-muted-foreground">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    "p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors cursor-pointer",
                    selectedUser?.id === user.id && "ring-2 ring-[#6C63FF]"
                  )}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email} • {user.user_type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={
                          user.is_active
                            ? "bg-[#2ECC71] text-white border-0"
                            : "bg-gray-400 text-white border-0"
                        }
                      >
                        {user.is_active ? "Active" : "Suspended"}
                      </Badge>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 rounded-lg bg-muted text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUserActive(user.id, !Boolean(user.is_active));
                          }}
                        >
                          {user.is_active ? "Suspend" : "Reactivate"}
                        </motion.button>

                        {user.user_type !== "admin" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 rounded-lg bg-[#4A90E2]/10 text-[#4A90E2] text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                promoteToMentor(user.id);
                              }}
                            >
                              Promote to Mentor
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 rounded-lg bg-[#FFC857]/10 text-[#D48A00] text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                promoteToAdmin(user.id);
                              }}
                            >
                              Make Admin
                            </motion.button>
                          </>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(user.id);
                          }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* User Detail Panel (frontend-only summary) */}
        <GlassCard>
          <h3 className="mb-3 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4" />
            User Details
          </h3>
          {selectedUser ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">{selectedUser.full_name}</p>
                <p className="text-muted-foreground">{selectedUser.email}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">{selectedUser.user_type}</Badge>
                <Badge
                  className={
                    selectedUser.is_active
                      ? "bg-[#2ECC71] text-white border-0"
                      : "bg-gray-400 text-white border-0"
                  }
                >
                  {selectedUser.is_active ? "Active" : "Suspended"}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Joined{" "}
                  {new Date(selectedUser.created_at).toLocaleString()}
                </p>
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Profile Insights
                </p>
                <p className="text-xs text-muted-foreground">
                  • Skills, collaborations, projects, ratings and reports can
                  be exposed here via extra admin APIs (e.g.
                  <code className="ml-1">/admin/users/:id/details</code>).
                </p>
                <p className="text-xs text-muted-foreground">
                  • You can extend this panel to show deep user analytics.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select a user from the list to see more details.
            </p>
          )}
        </GlassCard>
      </div>
    </>
  );

  // ANNOUNCEMENTS
  const renderAnnouncementsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Announcements</h2>
          <p className="text-muted-foreground">
            Send platform-wide messages to all users.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="mb-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            New Announcement
          </h3>
          <form onSubmit={handleSendAnnouncement} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. New Feature Launch"
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Message</label>
              <textarea
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm min-h-[120px]"
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                placeholder="Write your announcement..."
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={announcementSending}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white text-sm disabled:opacity-60"
            >
              {announcementSending ? "Sending..." : "Send Announcement"}
            </motion.button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4">Recent Announcements</h3>
          {announcementsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="text-muted-foreground">No announcements yet.</p>
          ) : (
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{a.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {a.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sent by {a.admin_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );

  // ANALYTICS
  const renderAnalyticsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Analytics</h2>
          <p className="text-muted-foreground">
            Deep dive into platform performance.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <GlassCard>
          <h3 className="mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Total Users
          </h3>
          <p className="text-3xl">
            {analytics?.totalUsers ??
              dashboardData?.stats.totalUsers ??
              0}
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Active Users
          </h3>
          <p className="text-3xl">
            {analytics?.activeUsers ??
              dashboardData?.stats.activeSessions ??
              0}
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-2 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Engagement Ratio
          </h3>
          <p className="text-3xl">
            {analytics && analytics.totalUsers > 0
              ? `${Math.round(
                  (analytics.activeUsers / analytics.totalUsers) * 100
                )}%`
              : "—"}
          </p>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="mb-4">Top Skills</h3>
          {analyticsLoading ? (
            <p className="text-muted-foreground">Loading analytics...</p>
          ) : analytics && analytics.topSkills.length ? (
            <div className="space-y-3">
              {analytics.topSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm w-6 text-muted-foreground">
                    #{index + 1}
                  </span>
                  <span className="flex-1">{skill.skill_name}</span>
                  <Badge variant="outline">{skill.count} users</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No skill analytics yet.</p>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4">User Growth (from dashboard)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={userGrowthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(74, 144, 226, 0.1)"
              />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#6C63FF"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </>
  );

  // VERIFICATIONS
  const renderVerificationsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Skill Verifications</h2>
          <p className="text-muted-foreground">
            Approve or reject skill verification requests.
          </p>
        </div>
      </div>

      <GlassCard>
        {verificationsLoading ? (
          <p className="text-muted-foreground">Loading verifications...</p>
        ) : verifications.length === 0 ? (
          <p className="text-muted-foreground">
            No verification requests yet or route not implemented.
          </p>
        ) : (
          <div className="space-y-4">
            {verifications.map((v, index) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {v.skill_name ?? `Skill #${v.skill_id}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Requested by {v.requester_name ?? `User #${v.requester_id}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: {v.status}
                    </p>
                    {v.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Notes: {v.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#2ECC71]/10 text-xs"
                      onClick={() =>
                        updateVerificationStatus(v.id, "approved")
                      }
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 text-xs"
                      onClick={() =>
                        updateVerificationStatus(v.id, "rejected")
                      }
                    >
                      Reject
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </>
  );

  // COLLABORATIONS
  const renderCollaborationsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Collaborations</h2>
          <p className="text-muted-foreground">
            Monitor and moderate user collaborations.
          </p>
        </div>
      </div>

      <GlassCard>
        {collabsLoading ? (
          <p className="text-muted-foreground">Loading collaborations...</p>
        ) : collaborations.length === 0 ? (
          <p className="text-muted-foreground">
            No collaborations or admin route not implemented.
          </p>
        ) : (
          <div className="space-y-4">
            {collaborations.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {c.title ?? `Collaboration #${c.id}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {c.requester_name ?? `User #${c.requester_id}`} →
                      {"  "}
                      {c.provider_name ?? `User #${c.provider_id}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: {c.status}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requested at{" "}
                      {new Date(c.requested_at).toLocaleString()}
                    </p>
                    {c.details && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {c.details}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="outline" className="text-xs">
                      {c.status}
                    </Badge>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#2ECC71]/10 text-xs"
                      onClick={() => {
                        // Example: mark completed (needs admin route)
                        console.warn(
                          "Implement /admin/collaborations/:id/status to force-resolve"
                        );
                      }}
                    >
                      Mark Completed
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 text-xs"
                      onClick={() => {
                        console.warn(
                          "Implement /admin/collaborations/:id/status to cancel"
                        );
                      }}
                    >
                      Cancel Collaboration
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </>
  );

  // ACHIEVEMENTS
  const renderAchievementsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Achievements & Rewards</h2>
          <p className="text-muted-foreground">
            Create and assign achievements to users.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Create Achievement
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                value={newAchievementTitle}
                onChange={(e) => setNewAchievementTitle(e.target.value)}
                placeholder="e.g. Top Collaborator"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Description
              </label>
              <textarea
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm min-h-[80px]"
                value={newAchievementDescription}
                onChange={(e) =>
                  setNewAchievementDescription(e.target.value)
                }
                placeholder="What does this achievement mean?"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Reward Points
              </label>
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                value={newAchievementPoints}
                onChange={(e) =>
                  setNewAchievementPoints(Number(e.target.value) || 0)
                }
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white text-sm"
              onClick={handleCreateAchievement}
            >
              Save Achievement
            </motion.button>
            <p className="text-xs text-muted-foreground">
              NOTE: this requires <code>/admin/achievements</code> backend
              route to be implemented.
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Recent Achievements
          </h3>
          {achievementsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : achievements.length === 0 ? (
            <p className="text-muted-foreground">
              No achievements or admin route not implemented.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-muted rounded-xl flex justify-between items-center gap-3"
                >
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.user_name ?? `User #${a.user_id}`} •{" "}
                      {a.points_reward} pts
                    </p>
                    {a.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {a.description}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-lg bg-[#6C63FF]/10 text-xs"
                    onClick={() => {
                      if (!selectedUser) {
                        alert("Select a user in Users tab to assign.");
                        return;
                      }
                      handleAssignAchievement(a.id, selectedUser.id);
                    }}
                  >
                    Assign to Selected User
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );

  // SKILLS
  const renderSkillsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Skills Database</h2>
          <p className="text-muted-foreground">
            Manage platform-wide skills and categories.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Add Skill
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Web Development"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                placeholder="e.g. Programming"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Description
              </label>
              <textarea
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm min-h-[80px]"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white text-sm"
              onClick={handleCreateSkill}
            >
              Save Skill
            </motion.button>
            <p className="text-xs text-muted-foreground">
              NOTE: this requires <code>/admin/skills</code> backend route.
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3">Existing Skills</h3>
          {skillsLoading ? (
            <p className="text-muted-foreground">Loading skills...</p>
          ) : skills.length === 0 ? (
            <p className="text-muted-foreground">
              No skills or admin route not implemented.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-muted rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium">{s.skill_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.category ?? "Uncategorized"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        s.verified ? "bg-[#2ECC71]" : "bg-gray-400"
                      )}
                    >
                      {s.verified ? "Verified" : "Unverified"}
                    </Badge>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 text-xs"
                      onClick={() => handleDeleteSkill(s.id)}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );

  // PROJECTS
  const renderProjectsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Projects</h2>
          <p className="text-muted-foreground">
            Monitor and manage user projects.
          </p>
        </div>
      </div>

      <GlassCard>
        {projectsLoading ? (
          <p className="text-muted-foreground">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground">
            No projects or admin route not implemented.
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-muted rounded-2xl flex justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{p.project_name}</p>
                  {p.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: {p.status}
                  </p>
                  {p.starts_at && (
                    <p className="text-xs text-muted-foreground">
                      Starts: {new Date(p.starts_at).toLocaleString()}
                    </p>
                  )}
                  {p.ends_at && (
                    <p className="text-xs text-muted-foreground">
                      Ends: {new Date(p.ends_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant="outline" className="text-xs">
                    {p.status}
                  </Badge>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 text-xs"
                    onClick={() => updateProjectStatus(p.id, "cancelled")}
                  >
                    Force Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-lg bg-[#2ECC71]/10 text-xs"
                    onClick={() => updateProjectStatus(p.id, "open")}
                  >
                    Reopen
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </>
  );

  // TRANSACTIONS
  const renderTransactionsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Points & Transactions</h2>
          <p className="text-muted-foreground">
            Adjust user points and review transactions.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="mb-3 flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Adjust Points
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="text-xs text-muted-foreground">
                User ID
              </label>
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                value={pointsAdjustUserId ?? ""}
                onChange={(e) =>
                  setPointsAdjustUserId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="User ID"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Amount (+/-)
              </label>
              <input
                type="number"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
                value={pointsAdjustAmount}
                onChange={(e) =>
                  setPointsAdjustAmount(Number(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Reason / Note
              </label>
              <textarea
                className="mt-1 w-full px-3 py-2 rounded-xl bg-background border border-border text-sm min-h-[80px]"
                value={pointsAdjustReason}
                onChange={(e) => setPointsAdjustReason(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white text-sm"
              onClick={handleAdjustPoints}
            >
              Apply Adjustment
            </motion.button>
            <p className="text-xs text-muted-foreground">
              NOTE: this requires <code>/admin/transactions/adjust</code>{" "}
              backend route.
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Recent Transactions
          </h3>
          {transactionsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground">
              No transactions or admin route not implemented.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 text-xs">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-muted rounded-xl flex justify-between gap-3"
                >
                  <div>
                    <p className="font-medium">
                      {t.transaction_type.toUpperCase()} • {t.amount} pts
                    </p>
                    <p className="text-muted-foreground">
                      {t.from_name ?? (t.from_user_id && `From #${t.from_user_id}`)}
                      {" → "}
                      {t.to_name ?? (t.to_user_id && `To #${t.to_user_id}`)}
                    </p>
                    {t.description && (
                      <p className="text-muted-foreground line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-muted-foreground">
                    <p>{new Date(t.created_at).toLocaleString()}</p>
                    {t.balance_after !== null && (
                      <p className="text-[10px] mt-1">
                        Balance after: {t.balance_after}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );

  // SETTINGS
  const renderSettingsSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Platform Settings</h2>
          <p className="text-muted-foreground">
            Global admin controls for the Skill Barter platform.
          </p>
        </div>
      </div>

      <GlassCard>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Hammer className="w-4 h-4" />
                Maintenance Mode
              </p>
              <p className="text-xs text-muted-foreground">
                Temporarily restrict platform usage for maintenance windows.
              </p>
            </div>
            <button
              className={cn(
                "px-3 py-1 rounded-xl text-xs",
                settings.maintenanceMode
                  ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                  : "bg-muted text-muted-foreground"
              )}
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  maintenanceMode: !prev.maintenanceMode,
                }))
              }
            >
              {settings.maintenanceMode ? "Disable" : "Enable"}
            </button>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                Default Reward Points
              </p>
              <p className="text-xs text-muted-foreground">
                Default points for common actions and achievements.
              </p>
            </div>
            <input
              type="number"
              className="w-24 px-3 py-1 rounded-xl bg-background border border-border text-xs"
              value={settings.defaultRewardPoints}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  defaultRewardPoints: Number(e.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Spam & Abuse Filter
              </p>
              <p className="text-xs text-muted-foreground">
                Enable automatic detection of spam / abusive messages.
              </p>
            </div>
            <button
              className={cn(
                "px-3 py-1 rounded-xl text-xs",
                settings.spamFilterEnabled
                  ? "bg-[#2ECC71]/10 text-[#2ECC71]"
                  : "bg-muted text-muted-foreground"
              )}
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  spamFilterEnabled: !prev.spamFilterEnabled,
                }))
              }
            >
              {settings.spamFilterEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground pt-2">
            NOTE: these settings are currently stored in frontend state only.
            Persist them by wiring to a settings table or config service
            (e.g. <code>/admin/settings</code>).
          </p>
        </div>
      </GlassCard>
    </>
  );

  // =======================
  // MAIN RENDER
  // =======================
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 hidden md:flex flex-col gap-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold mb-1">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">
            Skill Barter platform controls
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "reports", label: "Reports", icon: AlertTriangle },
            { id: "users", label: "Users", icon: Users },
            { id: "verifications", label: "Verifications", icon: BadgeCheck },
            { id: "collaborations", label: "Collaborations", icon: MessageCircle },
            { id: "achievements", label: "Achievements", icon: Star },
            { id: "skills", label: "Skills", icon: Layers },
            { id: "projects", label: "Projects", icon: FolderOpen },
            { id: "transactions", label: "Points & Txn", icon: Coins },
            { id: "announcements", label: "Announcements", icon: Megaphone },
            { id: "analytics", label: "Analytics", icon: BarChart2 },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id as Section)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all",
                activeSection === item.id
                  ? "bg-gradient-to-r from-[#6C63FF]/10 to-[#4A90E2]/10 text-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        {activeSection === "dashboard" && renderDashboardSection()}
        {activeSection === "reports" && renderReportsSection()}
        {activeSection === "users" && renderUsersSection()}
        {activeSection === "announcements" && renderAnnouncementsSection()}
        {activeSection === "analytics" && renderAnalyticsSection()}
        {activeSection === "verifications" && renderVerificationsSection()}
        {activeSection === "collaborations" && renderCollaborationsSection()}
        {activeSection === "achievements" && renderAchievementsSection()}
        {activeSection === "skills" && renderSkillsSection()}
        {activeSection === "projects" && renderProjectsSection()}
        {activeSection === "transactions" && renderTransactionsSection()}
        {activeSection === "settings" && renderSettingsSection()}
      </main>
    </div>
  );
}
