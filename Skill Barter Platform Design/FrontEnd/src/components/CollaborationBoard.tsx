import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function CollaborationBoard() {
  // TODO: Replace with real logged-in user id from auth
  const userId = 1;

  const apiBase = "http://localhost:5000";

  const [selectedTab, setSelectedTab] = useState<"kanban" | "chat">("kanban");

  // Collaboration data
  const [collabRequests, setCollabRequests] = useState<any[]>([]);
  const [activeCollabs, setActiveCollabs] = useState<any[]>([]);
  const [collabHistory, setCollabHistory] = useState<any[]>([]);
  const [currentCollab, setCurrentCollab] = useState<any | null>(null);
  const [processingCollabId, setProcessingCollabId] = useState<number | null>(
    null
  );

  // Chat
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Tasks
  const [tasks, setTasks] = useState<{
    todo: any[];
    inprogress: any[];
    done: any[];
  }>({ todo: [], inprogress: [], done: [] });

  // Task modal (create + edit)
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
  });

  // For "..." menu
  const [openMenuTaskId, setOpenMenuTaskId] = useState<number | null>(null);

  // Toast for actions
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  /* ------------------------------------------
            LOAD COLLABORATION DATA
  ------------------------------------------ */
  const loadCollaborations = async () => {
    const res = await fetch(
      `${apiBase}/collaborations/mine?user_id=${userId}`
    );
    const data = await res.json();

    const requests = data.filter((c: any) => c.status === "pending");
    const active = data.filter(
      (c: any) => c.status === "accepted" || c.status === "in_progress"
    );

    setCollabRequests(requests);
    setActiveCollabs(active);
    setCollabHistory(data);

    // Decide which collaboration is "current"
    let chosen: any | null = null;
    if (currentCollab) {
      chosen = active.find((c: any) => c.id === currentCollab.id) || null;
    }
    if (!chosen && active.length > 0) {
      chosen = active[0];
    }

    setCurrentCollab(chosen || null);

    if (chosen?.conversation_id) {
      setConversationId(chosen.conversation_id);
      loadChatMessages(chosen.conversation_id);
      loadTasks(chosen.id);
    } else {
      setConversationId(null);
      setChatMessages([]);
      setTasks({ todo: [], inprogress: [], done: [] });
    }
  };

  /* ------------------------------------------
                   CHAT
  ------------------------------------------ */
  const loadChatMessages = async (cid: number) => {
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
  const loadTasks = async (collabId: number) => {
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

  const openEditTaskModal = (task: any) => {
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
    if (!taskForm.title.trim()) {
      alert("Title is required.");
      return;
    }

    const body = {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      due_date: taskForm.due_date || null,
    };

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
          assignee_id: userId,
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

  const deleteTask = async (task: any) => {
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

    if (currentCollab) {
      loadTasks(currentCollab.id);
    }
  };

  /* ------------------------------------------
         ACCEPT / REJECT COLLAB REQUESTS
  ------------------------------------------ */
  const handleAccept = async (req: any) => {
    const confirmed = window.confirm(
      `Accept collaboration request from ${req.requester_name}?`
    );
    if (!confirmed) return;

    setProcessingCollabId(req.id);
    try {
      const res = await fetch(`${apiBase}/collaborations/${req.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to accept.");
      }

      setToast({
        show: true,
        type: "success",
        message: "Collaboration accepted.",
      });
      setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        2000
      );

      await loadCollaborations();
    } catch (err: any) {
      setToast({
        show: true,
        type: "error",
        message: err?.message || "Failed to accept collaboration.",
      });
      setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        3000
      );
    } finally {
      setProcessingCollabId(null);
    }
  };

  const handleReject = async (req: any) => {
    const confirmed = window.confirm(
      `Reject collaboration request from ${req.requester_name}?`
    );
    if (!confirmed) return;

    setProcessingCollabId(req.id);
    try {
      const res = await fetch(`${apiBase}/collaborations/${req.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to reject.");
      }

      setToast({
        show: true,
        type: "success",
        message: "Collaboration rejected.",
      });
      setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        2000
      );

      await loadCollaborations();
    } catch (err: any) {
      setToast({
        show: true,
        type: "error",
        message: err?.message || "Failed to reject collaboration.",
      });
      setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        3000
      );
    } finally {
      setProcessingCollabId(null);
    }
  };

  /* ------------------------------------------
        SELECT COLLAB (SIDEBAR / TABLE)
  ------------------------------------------ */
  const handleSelectCollab = (collab: any) => {
    setCurrentCollab(collab || null);
    if (collab?.conversation_id) {
      setConversationId(collab.conversation_id);
      loadChatMessages(collab.conversation_id);
      loadTasks(collab.id);
    } else {
      setConversationId(null);
      setChatMessages([]);
      setTasks({ todo: [], inprogress: [], done: [] });
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

  const priorityColor: Record<string, string> = {
    High: "#EF4444",
    Medium: "#F97316",
    Low: "#22C55E",
  };

  const getPartnerForCollab = (c: any) => {
    const isRequester = c.requester_id === userId;
    return {
      partnerName: isRequester ? c.provider_name : c.requester_name,
      roleLabel: isRequester ? "You are requester" : "You are provider",
    };
  };

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const currentPartner = currentCollab
    ? getPartnerForCollab(currentCollab).partnerName
    : null;

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
            Collaboration Board
          </h1>
          <p className="text-slate-400">
            {currentCollab && currentPartner
              ? `Working with ${currentPartner}`
              : "Select or accept a collaboration to get started."}
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
      <GlassCard className="p-6 mb-6 bg-slate-900/70 border border-slate-700/70">
        <h2 className="text-2xl mb-4 font-semibold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-sky-400" />
          Collaboration Requests
        </h2>

        {collabRequests.length === 0 && (
          <p className="text-slate-400 text-sm">No pending requests.</p>
        )}

        <div className="space-y-4">
          {collabRequests.map((req: any) => {
            const isProcessing = processingCollabId === req.id;
            const { partnerName, roleLabel } = getPartnerForCollab(req);

            return (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-800/80 flex justify-between items-start border border-slate-700/70 gap-4"
              >
                <div>
                  <p className="font-medium text-slate-100">{partnerName}</p>
                  <p className="text-xs text-slate-400 mb-1">{roleLabel}</p>
                  <p className="text-slate-300 text-sm">
                    {req.details || "No message provided."}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Requested at: {formatDate(req.requested_at)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
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

      {/* ONGOING COLLABORATIONS TABLE */}
      <GlassCard className="p-6 mb-8 bg-slate-900/80 border border-slate-800/80">
        <h2 className="text-2xl mb-4 font-semibold text-slate-100">
          Ongoing Collaborations
        </h2>

        {activeCollabs.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No ongoing collaborations. Accept a request to start.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-300 text-xs border-b border-slate-700/80">
                <tr className="[&>th]:py-2 [&>th]:px-3 text-left">
                  <th>Title</th>
                  <th>Requester</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Conversation ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeCollabs.map((c: any) => {
                  const { partnerName, roleLabel } = getPartnerForCollab(c);
                  const isActive = currentCollab && currentCollab.id === c.id;

                  return (
                    <tr
                      key={c.id}
                      className={`border-b border-slate-800 hover:bg-slate-800/60 cursor-pointer ${
                        isActive ? "bg-slate-800/80" : ""
                      }`}
                      onClick={() => handleSelectCollab(c)}
                    >
                      <td className="py-2 px-3 text-slate-100">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{c.title}</span>
                          <span className="text-[11px] text-slate-400">
                            {roleLabel} • Partner: {partnerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        {c.requester_name}
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        {c.provider_name}
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          className="border-0 text-[11px]"
                          variant="outline"
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-slate-300 text-xs">
                        {formatDate(c.requested_at)}
                      </td>
                      <td className="py-2 px-3 text-slate-300 text-xs">
                        {c.conversation_id || "-"}
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCollab(c);
                            setSelectedTab("chat");
                          }}
                          className="px-3 py-1 rounded-xl text-xs bg-sky-500/90 text-slate-950 hover:bg-sky-400"
                        >
                          Open Chat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* TABS (for right panel main area) */}
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

      {/* WHATSAPP-STYLE LAYOUT: left sidebar (collabs) + right panel (chat/tasks) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDEBAR: collaborations list */}
        <GlassCard className="p-4 bg-slate-900/80 border border-slate-800/80 h-[500px] lg:h-[580px] flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Chats
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {activeCollabs.length === 0 && (
              <p className="text-slate-400 text-sm">
                No active collaborations. Accept a request to start chatting.
              </p>
            )}

            {activeCollabs.map((c: any) => {
              const { partnerName } = getPartnerForCollab(c);
              const isActive = currentCollab && c.id === currentCollab.id;

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCollab(c)}
                  className={`w-full text-left p-3 rounded-2xl flex flex-col gap-1 border transition ${
                    isActive
                      ? "bg-slate-800 border-sky-500/70"
                      : "bg-slate-900/70 border-slate-800 hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-slate-100">
                      {partnerName}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {c.title || "No title"}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Started: {formatDate(c.requested_at)}
                  </p>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* RIGHT PANEL: spans 2 columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* KANBAN BOARD */}
          {selectedTab === "kanban" && (
            <>
              {currentCollab ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {columns.map((col) => (
                    <GlassCard
                      key={col.id}
                      className="min-h-[320px] p-5 bg-slate-900/80 border border-slate-800/80"
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
                        {tasks[col.id]?.map((task: any) => {
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
                                    background: `${
                                      priorityColor[task.priority] || "#6B7280"
                                    }33`,
                                    color:
                                      priorityColor[task.priority] ||
                                      "#E5E7EB",
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
              ) : (
                <GlassCard className="p-6 bg-slate-900/80 border border-slate-800/80">
                  <p className="text-slate-400">
                    Select an ongoing collaboration from the left to manage
                    tasks.
                  </p>
                </GlassCard>
              )}
            </>
          )}

          {/* CHAT PANEL */}
          {selectedTab === "chat" && (
            <GlassCard className="p-6 h-[500px] md:h-[580px] flex flex-col bg-slate-900/80 border border-slate-800/80">
              {!currentCollab ? (
                <p className="text-slate-400">
                  Select an ongoing collaboration from the left to start chatting.
                </p>
              ) : (
                <>
                  {/* CHAT HEADER */}
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="w-12 h-12 border border-slate-700">
                      <AvatarImage src={currentCollab.partner_avatar_url} />
                      <AvatarFallback>
                        {currentPartner ? currentPartner[0] : "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-100">
                        {currentPartner}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Conversation #{currentCollab.conversation_id || "—"}
                      </p>
                    </div>
                  </div>

                  {/* CHAT MESSAGES */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                    {chatMessages.map((msg: any) => (
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
                          <p className="text-[10px] mt-1 opacity-70">
                            {formatDate(msg.sent_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {chatMessages.length === 0 && (
                      <p className="text-slate-500 text-sm">
                        No messages yet. Say hi 👋
                      </p>
                    )}
                  </div>

                  {/* CHAT INPUT */}
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
        </div>
      </div>

      {/* PREVIOUS COLLABORATIONS */}
      <GlassCard className="p-6 mt-8 bg-slate-900/80 border border-slate-800/80">
        <h2 className="text-2xl mb-4 font-semibold text-slate-100">
          Previous Collaborations
        </h2>
        <div className="space-y-3">
          {collabHistory.map((h: any) => {
            const { partnerName } = getPartnerForCollab(h);
            return (
              <div
                key={h.id}
                className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80"
              >
                <p className="font-medium text-slate-100">{partnerName}</p>
                <p className="text-slate-400 text-sm mt-1">{h.details}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Status: {h.status} • Started: {formatDate(h.requested_at)}
                </p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* TASK MODAL (CREATE + EDIT) */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
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

      {/* TOAST */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white shadow-xl ${
              toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
