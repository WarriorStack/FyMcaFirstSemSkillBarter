import { motion } from "motion/react";
import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Plus, MessageSquare, Video, Send, Paperclip, MoreVertical, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function CollaborationBoard() {
  const [selectedTab, setSelectedTab] = useState<"kanban" | "chat">("kanban");
  const [message, setMessage] = useState("");

  const columns = [
    { id: "todo", title: "To Do", color: "#6C63FF", icon: Clock },
    { id: "inprogress", title: "In Progress", color: "#4A90E2", icon: AlertCircle },
    { id: "done", title: "Done", color: "#2ECC71", icon: CheckCircle },
  ];

  const tasks = {
    todo: [
      { id: 1, title: "Review React Hooks documentation", assignee: "Sarah Chen", priority: "High", dueDate: "Nov 5" },
      { id: 2, title: "Create wireframes for dashboard", assignee: "You", priority: "Medium", dueDate: "Nov 6" },
    ],
    inprogress: [
      { id: 3, title: "Build user authentication flow", assignee: "You", priority: "High", dueDate: "Nov 4" },
      { id: 4, title: "Design color scheme", assignee: "Sarah Chen", priority: "Low", dueDate: "Nov 5" },
    ],
    done: [
      { id: 5, title: "Setup project repository", assignee: "Sarah Chen", priority: "High", dueDate: "Nov 1" },
      { id: 6, title: "Initial project planning", assignee: "You", priority: "Medium", dueDate: "Nov 2" },
    ],
  };

  const chatMessages = [
    { id: 1, sender: "Sarah Chen", message: "Hey! Ready to start our React session?", time: "10:30 AM", isOwn: false },
    { id: 2, sender: "You", message: "Yes! I've reviewed the materials you sent.", time: "10:32 AM", isOwn: true },
    { id: 3, sender: "Sarah Chen", message: "Great! Let's start with hooks today.", time: "10:33 AM", isOwn: false },
    { id: 4, sender: "You", message: "Perfect! I have some questions about useEffect.", time: "10:35 AM", isOwn: true },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#FF6B6B";
      case "Medium":
        return "#FFC857";
      case "Low":
        return "#2ECC71";
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl mb-4">Collaboration Board</h1>
          <p className="text-xl text-muted-foreground">Working with Sarah Chen on React Development</p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 glass-panel rounded-2xl hover:shadow-lg transition-all"
          >
            <Video className="w-5 h-5" />
            Start Call
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-2xl"
          >
            <Plus className="w-5 h-5" />
            New Task
          </motion.button>
        </div>
      </div>

      {/* Tab Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-2 mb-8 inline-flex gap-2"
      >
        <button
          onClick={() => setSelectedTab("kanban")}
          className={`px-6 py-3 rounded-xl transition-all ${
            selectedTab === "kanban"
              ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white shadow-lg"
              : "hover:bg-muted"
          }`}
        >
          Kanban Board
        </button>
        <button
          onClick={() => setSelectedTab("chat")}
          className={`px-6 py-3 rounded-xl transition-all ${
            selectedTab === "chat"
              ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white shadow-lg"
              : "hover:bg-muted"
          }`}
        >
          Live Chat
        </button>
      </motion.div>

      {/* Kanban View */}
      {selectedTab === "kanban" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
            >
              <GlassCard className="min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${column.color}, ${column.color}dd)` }}
                    >
                      <column.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3>{column.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(tasks[column.id as keyof typeof tasks] || []).length} tasks
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-muted rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {(tasks[column.id as keyof typeof tasks] || []).map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: columnIndex * 0.1 + taskIndex * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="p-4 bg-muted rounded-2xl cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="flex-1 text-sm">{task.title}</h4>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 hover:bg-background rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          style={{
                            background: getPriorityColor(task.priority),
                            color: "white",
                            border: "none",
                          }}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {task.assignee[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{task.assignee}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chat View */}
      {selectedTab === "chat" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <GlassCard className="h-[700px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#2ECC71] rounded-full"></span>
                      Online
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 hover:bg-muted rounded-xl transition-colors"
                >
                  <Video className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${msg.isOwn ? "flex flex-col items-end" : ""}`}>
                      <div
                        className={`inline-block max-w-[70%] p-4 rounded-2xl ${
                          msg.isOwn
                            ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white"
                            : "bg-muted"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-muted rounded-xl transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-4 py-3 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-xl"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <h3 className="mb-6">Collaboration Info</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Project</p>
                  <p>React Development Course</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Duration</p>
                  <p>8 weeks</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Progress</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Week 3 of 8</span>
                      <span>37%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "37%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#6C63FF] to-[#4A90E2]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Shared Resources</p>
                  <div className="space-y-2">
                    {["React Docs.pdf", "Hooks Examples.zip", "Project Template.fig"].map(
                      (resource, index) => (
                        <motion.div
                          key={resource}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="p-3 bg-muted rounded-xl hover:bg-muted/80 cursor-pointer transition-colors"
                        >
                          <p className="text-sm">{resource}</p>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Next Session</p>
                  <div className="p-4 bg-gradient-to-br from-[#6C63FF]/10 to-[#4A90E2]/10 rounded-xl">
                    <p>Tomorrow, 3:00 PM</p>
                    <p className="text-sm text-muted-foreground mt-1">React Hooks Deep Dive</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
