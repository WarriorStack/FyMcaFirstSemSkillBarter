import { motion } from "motion/react";
import { useState } from "react";
import { StatCard } from "./StatCard";
import { GlassCard } from "./GlassCard";
import { Target, TrendingUp, Users, Award, Bell, Search, Menu, Moon, Sun, Plus, Calendar, MessageSquare, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Switch } from "./ui/switch";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = [
    { title: "Total Points", value: "1,284", icon: Target, gradient: "bg-gradient-to-br from-[#6C63FF] to-[#4A90E2]" },
    { title: "Skills Learned", value: "12", icon: TrendingUp, gradient: "bg-gradient-to-br from-[#4A90E2] to-[#2ECC71]" },
    { title: "Connections", value: "48", icon: Users, gradient: "bg-gradient-to-br from-[#FFC857] to-[#FF9A56]" },
    { title: "Achievements", value: "23", icon: Award, gradient: "bg-gradient-to-br from-[#6C63FF] to-[#A855F7]" },
  ];

  const chartData = [
    { name: "Mon", points: 120 },
    { name: "Tue", points: 180 },
    { name: "Wed", points: 150 },
    { name: "Thu", points: 220 },
    { name: "Fri", points: 190 },
    { name: "Sat", points: 240 },
    { name: "Sun", points: 184 },
  ];

  const projects = [
    { id: 1, title: "Web Dev Course", partner: "Sarah Chen", status: "In Progress", progress: 75, color: "#4A90E2" },
    { id: 2, title: "Design Workshop", partner: "Mike Rodriguez", status: "In Progress", progress: 45, color: "#FFC857" },
    { id: 3, title: "Data Analysis", partner: "Emma Thompson", status: "Completed", progress: 100, color: "#2ECC71" },
  ];

  const notifications = [
    { id: 1, message: "Sarah sent you a collaboration request", time: "2 min ago", type: "request" },
    { id: 2, message: "You earned 50 points!", time: "1 hour ago", type: "points" },
    { id: 3, message: "New achievement unlocked: Quick Learner", time: "3 hours ago", type: "achievement" },
  ];

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
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
            { name: "Dashboard", icon: Target, active: true },
            { name: "Profile", icon: Users },
            { name: "Explore Skills", icon: Search },
            { name: "Collaboration", icon: MessageSquare },
            { name: "Achievements", icon: Award },
          ].map((item, index) => (
            <motion.button
              key={item.name}
              whileHover={{ x: 4, scale: 1.02 }}
              onClick={() => item.name !== "Dashboard" && onNavigate(item.name.toLowerCase().replace(" ", "-"))}
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
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass-panel border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B6B] rounded-full" />
              </motion.button>

              <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-[#4A90E2] ring-offset-2">
                <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-[#6C63FF]/10 via-[#4A90E2]/10 to-[#FFC857]/10"
          >
            <h1 className="text-4xl mb-2">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground">You've earned 184 points this week. Keep up the great work!</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} delay={index * 0.1} />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Points Chart */}
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3>Points Progress</h3>
                <Badge className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white border-0">
                  This Week
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.1)" />
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

            {/* Notifications */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3>Notifications</h3>
                <Badge variant="outline">{notifications.length}</Badge>
              </div>
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    <p className="text-sm mb-1">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </motion.div>
                ))}
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
              >
                <Plus className="w-4 h-4" />
                New Project
              </motion.button>
            </div>

            <div className="space-y-4">
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
                      <p className="text-sm text-muted-foreground">with {project.partner}</p>
                    </div>
                    <Badge
                      variant="outline"
                      style={{ borderColor: project.color, color: project.color }}
                    >
                      {project.status}
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
    </div>
  );
}
