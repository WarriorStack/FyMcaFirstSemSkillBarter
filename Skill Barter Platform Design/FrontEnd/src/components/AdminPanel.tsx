import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { StatCard } from "./StatCard";
import {
  Users,
  Activity,
  AlertTriangle,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Megaphone,
  BarChart2,
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
import { cn } from "../lib/utils"; // if you have a cn helper; otherwise remove & inline classes

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
  status: "pending" | "resolved" | "investigating" | string;
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

type Section = "dashboard" | "reports" | "users" | "announcements" | "analytics";

const API_BASE = "http://localhost:5000";

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

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

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementSending, setAnnouncementSending] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // -----------------------------
  // INITIAL DASHBOARD FETCH
  // -----------------------------
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

        if (!res.ok) {
          const text = await res.text();
          console.error("Dashboard error response:", text);
          throw new Error("Server error");
        }


        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load admin dashboard");
        }

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

  // -----------------------------
  // LAZY-LOADERS FOR OTHER SECTIONS
  // -----------------------------
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

  // -----------------------------
  // HANDLE SECTION CHANGE
  // -----------------------------
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
  };

  // -----------------------------
  // REPORT ACTIONS
  // -----------------------------
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

  // -----------------------------
  // USER ACTIONS
  // -----------------------------
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
        prev.map((u) =>
          u.id === id ? { ...u, user_type: "admin" } : u
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to promote user");
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

  // -----------------------------
  // ANNOUNCEMENTS ACTION
  // -----------------------------
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

  // -----------------------------
  // SECTION RENDERERS
  // -----------------------------
  const renderDashboardSection = () => (
    <>
      {/* Header */}
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
        {/* User Growth */}
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

        {/* Skill Categories */}
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

      {/* Quick Snapshot Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reports snapshot */}
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
                  className={`${report.status === "resolved"
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

        {/* New users snapshot */}
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
                    className={`${report.status === "resolved"
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
                      onClick={() => updateReportStatus(report.id, "investigating")}
                    >
                      Investigate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 text-xs"
                      onClick={() => updateReportStatus(report.id, "resolved")}
                    >
                      Resolve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-xs"
                      onClick={() => updateReportStatus(report.id, "rejected")}
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

  const renderUsersSection = () => (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles and status.
          </p>
        </div>
      </div>

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
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
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
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 rounded-lg bg-muted text-xs"
                        onClick={() =>
                          toggleUserActive(user.id, !Boolean(user.is_active))
                        }
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </motion.button>

                      {user.user_type !== "admin" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 rounded-lg bg-[#4A90E2]/10 text-[#4A90E2] text-xs"
                          onClick={() => promoteToAdmin(user.id)}
                        >
                          Promote to Admin
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs"
                        onClick={() => deleteUser(user.id)}
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
    </>
  );

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
        {/* Form */}
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

        {/* List */}
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
            {analytics?.totalUsers ?? dashboardData?.stats.totalUsers ?? 0}
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Active Users
          </h3>
          <p className="text-3xl">
            {analytics?.activeUsers ?? dashboardData?.stats.activeSessions ?? 0}
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

  // -----------------------------
  // MAIN RENDER
  // -----------------------------
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

        <nav className="flex flex-col gap-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "reports", label: "Reports", icon: AlertTriangle },
            { id: "users", label: "Users", icon: Users },
            { id: "announcements", label: "Announcements", icon: Megaphone },
            { id: "analytics", label: "Analytics", icon: BarChart2 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id as Section)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-all",
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
      </main>
    </div>
  );
}
