import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import {
  Plus,
  Video,
  Send,
  Paperclip,
  MoreVertical,
  Check,
  X,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function CollaborationBoard() {
  // TODO: Replace with real logged-in user id from auth
  const userId = 1;

  const [selectedTab, setSelectedTab] = useState<"kanban" | "chat">("kanban");

  // Collaboration data
  const [collabRequests, setCollabRequests] = useState([]);
  const [collabHistory, setCollabHistory] = useState([]);
  const [currentCollab, setCurrentCollab] = useState(null);
  const [processingCollabId, setProcessingCollabId] = useState(null);

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [message, setMessage] = useState("");

  // Tasks
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });

  // Task modal (create + edit)
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
  });

  // For "..." menu
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);

  const apiBase = "http://localhost:5000";

  /* ------------------------------------------
            LOAD COLLABORATION DATA
  ------------------------------------------ */
  const loadCollaborations = async () => {
    const res = await fetch(`${apiBase}/collaborations/mine?user_id=${userId}`);
    const data = await res.json();

    const requests = data.filter((c) => c.status === "pending");
    const active = data.filter((c) => c.status === "accepted");

    setCollabRequests(requests);
    setCollabHistory(data);
    setCurrentCollab(active[0] || null);

    if (active[0]?.conversation_id) {
      setConversationId(active[0].conversation_id);
      loadChatMessages(active[0].conversation_id);
      loadTasks(active[0].id);
    } else {
      setConversationId(null);
      setChatMessages([]);
      setTasks({ todo: [], inprogress: [], done: [] });
    }
  };

  /* ------------------------------------------
                   CHAT
  ------------------------------------------ */
  const loadChatMessages = async (cid) => {
    const res = await fetch(`${apiBase}/messages/conversation/${cid}`);
    setChatMessages(await res.json());
  };

  const sendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    await fetch(`${apiBase}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        sender_id: userId,
        content: message,
      }),
    });

    setMessage("");
    loadChatMessages(conversationId);
  };

  /* ------------------------------------------
                   TASKS
  ------------------------------------------ */
  const loadTasks = async (collabId) => {
    if (!collabId) return;

    const res = await fetch(`${apiBase}/tasks/collab/${collabId}`);
    const data = await res.json();
    setTasks(data || { todo: [], inprogress: [], done: [] });
  };

  const openCreateTaskModal = () => {
    setEditingTaskId(null);
    setTaskForm({
      title: "",
      description: "",
      priority: "Medium",
      due_date: "",
    });
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    // Permission A: only "creator" can edit.
    // In this version, we treat assignee as creator (since only current user creates tasks).
    if (task.assignee_id !== userId) return;

    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      due_date: task.due_date ? task.due_date.substring(0, 10) : "",
    });
    setShowTaskModal(true);
  };

  const saveTask = async () => {
    if (!currentCollab) {
      alert("No active collaboration.");
      return;
    }

    const body = {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      due_date: taskForm.due_date || null,
    };

    if (!taskForm.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (editingTaskId) {
      // UPDATE
      const res = await fetch(`${apiBase}/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Failed to update task.");
        return;
      }
    } else {
      // CREATE
      const res = await fetch(`${apiBase}/tasks/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collaboration_id: currentCollab.id,
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          status: "todo",
          assignee_id: userId, // creator = current user
          due_date: taskForm.due_date || null,
        }),
      });

      if (!res.ok) {
        alert("Failed to create task.");
        return;
      }
    }

    setShowTaskModal(false);
    setEditingTaskId(null);
    setTaskForm({
      title: "",
      description: "",
      priority: "Medium",
      due_date: "",
    });

    loadTasks(currentCollab.id);
  };

  const deleteTask = async (task) => {
    if (task.assignee_id !== userId) return;

    const confirmed = window.confirm(
      `Delete task "${task.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    const res = await fetch(`${apiBase}/tasks/${task.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete task.");
      return;
    }

    loadTasks(currentCollab.id);
  };

  /* ------------------------------------------
         ACCEPT / REJECT COLLAB REQUESTS
  ------------------------------------------ */
  const handleAccept = async (req) => {
    const confirmed = window.confirm(
      `Accept collaboration request from ${req.requester_name}?`
    );
    if (!confirmed) return;

    setProcessingCollabId(req.id);
    try {
      await fetch(`${apiBase}/collaborations/${req.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      await loadCollaborations();
    } finally {
      setProcessingCollabId(null);
    }
  };

  const handleReject = async (req) => {
    const confirmed = window.confirm(
      `Reject collaboration request from ${req.requester_name}?`
    );
    if (!confirmed) return;

    setProcessingCollabId(req.id);
    try {
      await fetch(`${apiBase}/collaborations/${req.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      await loadCollaborations();
    } finally {
      setProcessingCollabId(null);
    }
  };

  /* ------------------------------------------
                INITIAL LOAD
  ------------------------------------------ */
  useEffect(() => {
    loadCollaborations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------
                  UI HELPERS
  ------------------------------------------ */

  const columns = [
    { id: "todo", title: "To Do", color: "#6366F1", icon: Clock },
    { id: "inprogress", title: "In Progress", color: "#0EA5E9", icon: AlertCircle },
    { id: "done", title: "Done", color: "#22C55E", icon: CheckCircle },
  ];

  const priorityColor = {
    High: "#EF4444",
    Medium: "#F97316",
    Low: "#22C55E",
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
            Collaboration Board
          </h1>
          <p className="text-slate-400">
            {currentCollab
              ? `Working with ${currentCollab.provider_name}`
              : "No active collaboration selected yet."}
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-2 border border-slate-600/60"
          >
            <Video className="w-5 h-5" />
            <span>Start Call</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreateTaskModal}
            className="px-5 py-3 rounded-2xl flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 text-slate-950 font-medium shadow-lg shadow-sky-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </motion.button>
        </div>
      </div>

      {/* COLLAB REQUESTS */}
      <GlassCard className="p-6 mb-8 bg-slate-900/70 border border-slate-700/70">
        <h2 className="text-2xl mb-4 font-semibold text-slate-100">
          Collaboration Requests
        </h2>

        {collabRequests.length === 0 && (
          <p className="text-slate-400 text-sm">No pending requests.</p>
        )}

        <div className="space-y-4">
          {collabRequests.map((req) => {
            const isProcessing = processingCollabId === req.id;
            return (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-800/80 flex justify-between items-center border border-slate-700/70"
              >
                <div>
                  <p className="font-medium text-slate-100">
                    {req.requester_name}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    {req.details || "No message provided."}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleAccept(req)}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition ${
                      isProcessing
                        ? "bg-emerald-900/50 text-emerald-300/60 cursor-not-allowed"
                        : "bg-emerald-500/90 hover:bg-emerald-400 text-slate-950"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleReject(req)}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition ${
                      isProcessing
                        ? "bg-rose-900/50 text-rose-300/60 cursor-not-allowed"
                        : "bg-rose-500/90 hover:bg-rose-400 text-slate-950"
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* TABS */}
      <div className="glass-panel p-1 rounded-2xl inline-flex gap-1 mb-6 bg-slate-900/80 border border-slate-700/60">
        <button
          onClick={() => setSelectedTab("kanban")}
          className={`px-5 py-2 rounded-xl text-sm md:text-base transition ${
            selectedTab === "kanban"
              ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-slate-950 shadow-md"
              : "text-slate-300 hover:bg-slate-800/80"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setSelectedTab("chat")}
          className={`px-5 py-2 rounded-xl text-sm md:text-base transition ${
            selectedTab === "chat"
              ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-slate-950 shadow-md"
              : "text-slate-300 hover:bg-slate-800/80"
          }`}
        >
          Chat
        </button>
      </div>

      {/* KANBAN BOARD */}
      {selectedTab === "kanban" && currentCollab && (
        <div className="grid lg:grid-cols-3 gap-6">
          {columns.map((col) => (
            <GlassCard
              key={col.id}
              className="min-h-[500px] p-5 bg-slate-900/80 border border-slate-800/80"
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${col.color}, transparent 55%), radial-gradient(circle at 80% 80%, ${col.color}aa, transparent 55%)`,
                  }}
                >
                  <col.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">
                    {col.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {tasks[col.id]?.length || 0} tasks
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {tasks[col.id]?.map((task) => {
                  const canEdit = task.assignee_id === userId;
                  const isMenuOpen = openMenuTaskId === task.id;

                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="relative p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 cursor-pointer"
                      onClick={() => openEditTaskModal(task)}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className="font-medium text-slate-100">
                          {task.title}
                        </p>

                        {canEdit && (
                          <div
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="p-1 rounded-lg hover:bg-slate-700/70"
                              onClick={() =>
                                setOpenMenuTaskId(
                                  isMenuOpen ? null : task.id
                                )
                              }
                            >
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-20 text-sm overflow-hidden">
                                <button
                                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-800 text-slate-100"
                                  onClick={() => {
                                    setOpenMenuTaskId(null);
                                    openEditTaskModal(task);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-rose-900/70 text-rose-200"
                                  onClick={() => {
                                    setOpenMenuTaskId(null);
                                    deleteTask(task);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                        {task.description || "No description."}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <Badge
                          className="border-0 text-xs"
                          style={{
                            background: `${priorityColor[task.priority] || "#6B7280"}33`,
                            color: priorityColor[task.priority] || "#E5E7EB",
                          }}
                        >
                          {task.priority} priority
                        </Badge>

                        {task.due_date && (
                          <span className="text-[11px] text-slate-400">
                            Due: {task.due_date.substring(0, 10)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {selectedTab === "kanban" && !currentCollab && (
        <p className="text-slate-400">
          Accept a collaboration to start managing tasks.
        </p>
      )}

      {/* CHAT */}
      {selectedTab === "chat" && (
        <GlassCard className="p-6 mt-4 h-[650px] flex flex-col bg-slate-900/80 border border-slate-800/80">
          {!currentCollab ? (
            <p className="text-slate-400">No active collaboration to chat.</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12 border border-slate-700">
                  <AvatarImage src={currentCollab.avatar_url} />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-100">
                    {currentCollab.provider_name}
                  </h3>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[70%] text-sm ${
                        msg.sender_id === userId
                          ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-slate-950"
                          : "bg-slate-800 text-slate-100"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 items-center">
                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700">
                  <Paperclip className="w-5 h-5 text-slate-300" />
                </button>

                <input
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />

                <button
                  onClick={sendMessage}
                  className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-slate-950 border border-sky-400/40"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </GlassCard>
      )}

      {/* PREVIOUS COLLABORATIONS */}
      <GlassCard className="p-6 mt-8 bg-slate-900/80 border border-slate-800/80">
        <h2 className="text-2xl mb-4 font-semibold text-slate-100">
          Previous Collaborations
        </h2>
        <div className="space-y-3">
          {collabHistory.map((h) => (
            <div
              key={h.id}
              className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80"
            >
              <p className="font-medium text-slate-100">
                {h.provider_name || h.requester_name}
              </p>
              <p className="text-slate-400 text-sm mt-1">{h.details}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Status: {h.status}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* TASK MODAL (CREATE + EDIT) */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="bg-red-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-100">
                {editingTaskId ? "Edit Task" : "Create Task"}
              </h2>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTaskId(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
              />

              <textarea
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 min-h-[80px]"
                placeholder="Description"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
              />

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs mb-1 text-slate-400">
                    Priority
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, priority: e.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs mb-1 text-slate-400">
                    Due date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                    value={taskForm.due_date}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, due_date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              {editingTaskId && (
                <button
                  onClick={async () => {
                    // For delete inside modal we reuse deleteTask logic
                    const fakeTask = {
                      id: editingTaskId,
                      title: taskForm.title,
                      assignee_id: userId,
                    };
                    await deleteTask(fakeTask);
                    setShowTaskModal(false);
                    setEditingTaskId(null);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-rose-900/50 text-rose-200 hover:bg-rose-800/70"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}

              <div className="ml-auto flex gap-3">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTaskId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTask}
                  className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-indigo-500 to-sky-500 text-slate-950 font-medium"
                >
                  {editingTaskId ? "Save changes" : "Create task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
