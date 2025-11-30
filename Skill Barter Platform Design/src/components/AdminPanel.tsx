import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { StatCard } from "./StatCard";
import { Users, Activity, AlertTriangle, Award, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function AdminPanel() {
  const stats = [
    { title: "Total Users", value: "10,247", icon: Users, gradient: "bg-gradient-to-br from-[#6C63FF] to-[#4A90E2]" },
    { title: "Active Sessions", value: "1,834", icon: Activity, gradient: "bg-gradient-to-br from-[#4A90E2] to-[#2ECC71]" },
    { title: "Pending Reports", value: "12", icon: AlertTriangle, gradient: "bg-gradient-to-br from-[#FF6B6B] to-[#FF9A56]" },
    { title: "Skills Listed", value: "547", icon: Award, gradient: "bg-gradient-to-br from-[#FFC857] to-[#FF9A56]" },
  ];

  const userGrowthData = [
    { month: "Jan", users: 2400 },
    { month: "Feb", users: 3200 },
    { month: "Mar", users: 4100 },
    { month: "Apr", users: 5300 },
    { month: "May", users: 6800 },
    { month: "Jun", users: 8200 },
    { month: "Jul", users: 10247 },
  ];

  const skillCategoryData = [
    { name: "Technology", value: 240, color: "#6C63FF" },
    { name: "Design", value: 150, color: "#4A90E2" },
    { name: "Business", value: 90, color: "#FFC857" },
    { name: "Arts", value: 67, color: "#FF9A56" },
  ];

  const recentReports = [
    { id: 1, user: "John Doe", issue: "Inappropriate content", status: "pending", priority: "High" },
    { id: 2, user: "Jane Smith", issue: "Spam messages", status: "resolved", priority: "Medium" },
    { id: 3, user: "Bob Wilson", issue: "Fake profile", status: "investigating", priority: "High" },
  ];

  const recentUsers = [
    { id: 1, name: "Alice Johnson", joined: "2 hours ago", points: 0, status: "active" },
    { id: 2, name: "Mark Brown", joined: "5 hours ago", points: 50, status: "active" },
    { id: 3, name: "Lisa White", joined: "1 day ago", points: 120, status: "active" },
  ];

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-5xl mb-4">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">Monitor and manage the Skill Barter Platform</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.1)" />
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
                <span className="text-sm text-muted-foreground ml-auto">{category.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3>Recent Reports</h3>
            <Badge variant="outline" className="rounded-xl">
              {recentReports.length} Pending
            </Badge>
          </div>

          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p>{report.user}</p>
                    <p className="text-sm text-muted-foreground">{report.issue}</p>
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

                <div className="flex items-center gap-2">
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
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-[#FF6B6B]" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Users */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3>New Users</h3>
            <Badge className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white border-0">
              Today
            </Badge>
          </div>

          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.joined}</p>
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

      {/* Quick Actions */}
      <GlassCard className="mt-8">
        <h3 className="mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Send Announcement", icon: Activity, color: "#6C63FF" },
            { label: "Review Reports", icon: AlertTriangle, color: "#FF6B6B" },
            { label: "Manage Users", icon: Users, color: "#4A90E2" },
            { label: "View Analytics", icon: TrendingUp, color: "#2ECC71" },
          ].map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 bg-muted rounded-2xl hover:shadow-lg transition-all"
            >
              <action.icon
                className="w-8 h-8 mb-3 mx-auto"
                style={{ color: action.color }}
              />
              <p className="text-center">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
