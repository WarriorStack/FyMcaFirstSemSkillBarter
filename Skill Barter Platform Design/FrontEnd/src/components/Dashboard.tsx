// frontend/src/components/Dashboard.tsx
import { motion } from "motion/react";
import { useState, useEffect, FormEvent } from "react";
import { StatCard } from "./StatCard";
import { GlassCard } from "./GlassCard";
import {
  Target,
  TrendingUp,
  Users,
  Award,
  Bell,
  Search,
  Menu,
  Plus,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

const API_BASE = "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface DashboardStats {
  points: number;
  skills: number;
  connections: number;
  achievements: number;
}

interface NotificationItem {
  id: number;
  message: string;
  time: string;
  is_read?: boolean;
  type?: string; // ✅ notification_type from backend ("announcement", etc.)
}

interface ProjectItem {
  id: number;
  title: string;
  partner: string;
  status: string;
  progress: number;
  color: string;
}

interface ChartPoint {
  name: string;
  points: number;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [userName, setUserName] = useState("User");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState<ChartPoint[]>([
    { name: "Mon", points: 0 },
    { name: "Tue", points: 0 },
    { name: "Wed", points: 0 },
    { name: "Thu", points: 0 },
    { name: "Fri", points: 0 },
    { name: "Sat", points: 0 },
    { name: "Sun", points: 0 },
  ]);

  // Dialog states
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  // Project form state
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectStatus, setProjectStatus] = useState<
    "open" | "in_progress" | "completed" | "cancelled"
  >("open");
  const [projectStart, setProjectStart] = useState("");
  const [projectEnd, setProjectEnd] = useState("");
  const [projectMaxParticipants, setProjectMaxParticipants] = useState("");
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState("");

  // ---------- LOAD DATA + HANDLE ADMIN REDIRECT ----------
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.warn("No userId in localStorage. Did you set it on login?");
      setLoading(false);
      return;
    }

    let storedUserType: string | null = localStorage.getItem("userType");

    if (!storedUserType) {
      try {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
          const parsed = JSON.parse(userRaw);
          storedUserType = parsed?.user_type || parsed?.type || null;
        }
      } catch {
        // ignore parsing errors
      }
    }

    if (storedUserType === "admin") {
      onNavigate("admin-dashboard");
      return;
    }

    setUserType(storedUserType);

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/dashboard?user_id=${userId}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();

        // User details from backend
        if (data.user) {
          if (data.user.name) setUserName(data.user.name);
          if (data.user.avatar_url) {
            const avatarPath: string = data.user.avatar_url;
            setUserAvatar(
              avatarPath.startsWith("http")
                ? avatarPath
                : `${API_BASE}${avatarPath}`
            );
          } else {
            setUserAvatar(DEFAULT_AVATAR);
          }
          if (data.user.user_type) {
            setUserType(data.user.user_type);
            if (data.user.user_type === "admin") {
              onNavigate("admin-dashboard");
              return;
            }
          }
        } else {
          setUserAvatar(DEFAULT_AVATAR);
        }

        // Stats
        if (data.stats) {
          setDashboardStats({
            points: Number(data.stats.points ?? 0),
            skills: Number(data.stats.skills ?? 0),
            connections: Number(data.stats.connections ?? 0),
            achievements: Number(data.stats.achievements ?? 0),
          });
        } else {
          setDashboardStats({
            points: 0,
            skills: 0,
            connections: 0,
            achievements: 0,
          });
        }

        // Weekly chart points
        if (Array.isArray(data.weeklyPoints) && data.weeklyPoints.length > 0) {
          setChartData(
            data.weeklyPoints.map((p: any) => ({
              name: p.name,
              points: Number(p.points ?? 0),
            }))
          );
        }

        // Notifications (includes announcements via type === "announcement")
        if (Array.isArray(data.notifications)) {
          setNotifications(
            data.notifications.map((n: any) => ({
              id: n.id,
              message: n.message,
              time: n.time,
              is_read: n.is_read,
              type: n.type, // ✅ coming from backend
            }))
          );
        }

        // Projects
        if (Array.isArray(data.projects)) {
          const colors = ["#4A90E2", "#FFC857", "#2ECC71", "#A855F7"];
          const mappedProjects: ProjectItem[] = data.projects.map(
            (p: any, index: number) => {
              let progress = 0;
              switch (p.status) {
                case "open":
                  progress = 20;
                  break;
                case "in_progress":
                  progress = 60;
                  break;
                case "completed":
                  progress = 100;
                  break;
                case "cancelled":
                default:
                  progress = 0;
              }

              return {
                id: p.id,
                title: p.title || p.project_name || "Untitled Project",
                partner:
                  p.partner_name ||
                  p.role ||
                  (p.is_owner ? "Owner" : "Collaborator"),
                status: p.status,
                progress,
                color: colors[index % colors.length],
              };
            }
          );
          setProjects(mappedProjects);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [onNavigate]);

  // ---------- ANNOUNCEMENTS FROM NOTIFICATIONS ----------
  const announcementNotifications = notifications.filter(
    (n) => n.type === "announcement"
  );
  const latestAnnouncement = announcementNotifications[0] || null;

  // ---------- STAT CARDS ----------
  const statCards = [
    {
      title: "Total Points",
      value: dashboardStats?.points ?? 0,
      icon: Target,
      gradient: "bg-gradient-to-br from-[#6C63FF] to-[#4A90E2]",
    },
    {
      title: "Skills Learned",
      value: dashboardStats?.skills ?? 0,
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-[#4A90E2] to-[#2ECC71]",
    },
    {
      title: "Connections",
      value: dashboardStats?.connections ?? 0,
      icon: Users,
      gradient: "bg-gradient-to-br from-[#FFC857] to-[#FF9A56]",
    },
    {
      title: "Achievements",
      value: dashboardStats?.achievements ?? 0,
      icon: Award,
      gradient: "bg-gradient-to-br from-[#6C63FF] to-[#A855F7]",
    },
  ];

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  // ---------- PROJECT CREATION ----------
  const resetProjectForm = () => {
    setProjectName("");
    setProjectDesc("");
    setProjectStatus("open");
    setProjectStart("");
    setProjectEnd("");
    setProjectMaxParticipants("");
    setProjectError("");
  };

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setProjectError("No user logged in");
      return;
    }

    if (!projectName.trim()) {
      setProjectError("Project title is required");
      return;
    }

    setProjectSaving(true);
    setProjectError("");

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          created_by: Number(userId),
          project_name: projectName.trim(),
          description: projectDesc.trim() || null,
          status: projectStatus,
          starts_at: projectStart || null,
          ends_at: projectEnd || null,
          max_participants: projectMaxParticipants
            ? Number(projectMaxParticipants)
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      const colors = ["#4A90E2", "#FFC857", "#2ECC71", "#A855F7"];
      const color = colors[projects.length % colors.length];

      const newProject: ProjectItem = {
        id: data.project?.id || Date.now(),
        title: projectName.trim(),
        partner: "Owner",
        status: projectStatus,
        progress: projectStatus === "completed" ? 100 : 20,
        color,
      };

      setProjects((prev) => [newProject, ...prev]);
      resetProjectForm();
      setShowProjectDialog(false);
    } catch (err: any) {
      console.error("CREATE PROJECT ERROR:", err);
      setProjectError(err.message || "Server error while creating project");
    } finally {
      setProjectSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-border p-6 z-50"
      >
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] flex items-center justify-center mb-4">
            <span className="text-xl text-white">SB</span>
          </div>
          <h3>Skill Barter</h3>
        </div>

        <nav className="space-y-2">
          {[
            { name: "Dashboard", icon: Target, active: true, page: "dashboard" },
            { name: "Profile", icon: Users, page: "profile" },
            { name: "Explore Skills", icon: Search, page: "explore-skills" },
            { name: "Collaboration", icon: MessageSquare, page: "collaboration" },
            { name: "Achievements", icon: Award, page: "achievements" },
          ].map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ x: 4, scale: 1.02 }}
              onClick={() =>
                !item.active && onNavigate(item.page)
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                item.active
                  ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white shadow-lg"
                  : "hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </motion.button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Dark Mode</span>
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass-panel border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </motion.button>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search skills, people..."
                  className="pl-12 pr-4 py-2 w-80 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 hover:bg-muted rounded-xl transition-colors"
                onClick={() => setShowNotificationsDialog(true)}
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B6B] rounded-full" />
                )}
              </motion.button>

              <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-[#4A90E2] ring-offset-2">
                <AvatarImage src={userAvatar ?? DEFAULT_AVATAR} />
                <AvatarFallback>
                  {userName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Section + Latest Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-[#6C63FF]/10 via-[#4A90E2]/10 to-[#FFC857]/10"
          >
            <h1 className="text-4xl mb-2">Welcome back, {userName}! 👋</h1>
            <p className="text-muted-foreground">
              {dashboardStats
                ? `You've earned ${dashboardStats.points} points in total. Keep up the great work!`
                : loading
                ? "Loading your progress..."
                : "No stats available yet."}
            </p>

            {/* ✅ Latest Announcement preview */}
            {latestAnnouncement && (
              <div className="mt-4 p-4 rounded-2xl bg-muted border border-border flex gap-3 items-start">
                <div className="mt-1">
                  <Megaphone className="w-5 h-5 text-[#FF9A56]" />
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    Latest Announcement
                    <Badge className="bg-[#FF9A56] text-white border-0 text-[10px]">
                      New
                    </Badge>
                  </p>
                  <p className="text-sm mt-1">{latestAnnouncement.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {latestAnnouncement.time}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <StatCard key={stat.title} {...stat} delay={index * 0.1} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Points Chart */}
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3>Points Progress</h3>
                <Badge className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white border-0">
                  Last 7 Days
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(74, 144, 226, 0.1)"
                  />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
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
                    dataKey="points"
                    stroke="#4A90E2"
                    strokeWidth={3}
                    dot={{ fill: "#4A90E2", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Notifications overview */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3>Notifications</h3>
                <Badge variant="outline">{notifications.length}</Badge>
              </div>
              <div className="space-y-4">
                {notifications.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No notifications yet.
                  </p>
                )}
                {notifications.slice(0, 3).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm">{notification.message}</p>
                      {notification.type === "announcement" && (
                        <Badge className="bg-[#FF9A56] text-white border-0 text-[10px]">
                          Announcement
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </motion.div>
                ))}
                {notifications.length > 3 && (
                  <button
                    onClick={() => setShowNotificationsDialog(true)}
                    className="text-xs text-[#4A90E2] hover:underline"
                  >
                    View all notifications
                  </button>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Active Projects */}
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3>Active Projects</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-xl"
                onClick={() => setShowProjectDialog(true)}
              >
                <Plus className="w-4 h-4" />
                New Project
              </motion.button>
            </div>

            <div className="space-y-4">
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You’re not part of any projects yet.
                </p>
              )}

              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="mb-1">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.partner}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: project.color,
                        color: project.color,
                        textTransform: "capitalize",
                      }}
                    >
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ background: project.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </main>
      </div>

      {/* Notification Dialog */}
      <Dialog
        open={showNotificationsDialog}
        onOpenChange={setShowNotificationsDialog}
      >
        <DialogContent className="glass-panel rounded-3xl border-0 max
        -h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Notifications</DialogTitle>
            <DialogDescription>
              All your recent notifications and announcements.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-2">
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You don’t have any notifications yet.
              </p>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-muted flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  {n.type === "announcement" && (
                    <Megaphone className="w-4 h-4 text-[#FF9A56]" />
                  )}
                  <p className="text-sm">{n.message}</p>
                  {n.type === "announcement" && (
                    <Badge className="bg-[#FF9A56] text-white border-0 text-[10px] ml-auto">
                      Announcement
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            <button
              className="px-4 py-2 rounded-2xl bg-muted text-sm hover:bg-muted/80"
              onClick={() => setShowNotificationsDialog(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="glass-panel rounded-3xl border-0 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Project</DialogTitle>
            <DialogDescription>
              Set up a new collaboration project and invite peers to join.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm mb-1">Project Title</label>
              <input
                type="text"
                className="w-full p-3 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., React Study Group"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                className="w-full p-3 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                rows={3}
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="Describe what this project is about..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  className="w-full p-2 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  value={projectStatus}
                  onChange={(e) =>
                    setProjectStatus(e.target.value as any)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  value={projectStart}
                  onChange={(e) => setProjectStart(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  value={projectEnd}
                  onChange={(e) => setProjectEnd(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Max Participants</label>
              <input
                type="number"
                min={1}
                className="w-full p-2 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                value={projectMaxParticipants}
                onChange={(e) => setProjectMaxParticipants(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>

            {projectError && (
              <p className="text-sm text-red-500">{projectError}</p>
            )}

            <DialogFooter className="mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded-2xl bg-muted text-sm hover:bg-muted/80"
                onClick={() => {
                  resetProjectForm();
                  setShowProjectDialog(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={projectSaving}
                className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white text-sm disabled:opacity-70"
              >
                {projectSaving ? "Creating..." : "Create Project"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
