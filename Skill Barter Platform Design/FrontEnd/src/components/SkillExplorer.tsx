// frontend/src/components/SkillExplorer.tsx
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { SkillCard, SkillItem } from "./SkillCard";
import {
  Search,
  Filter,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const API_BASE = "http://localhost:5000";

// ─────────────────────────────────────────────
// PERSON TYPE
// ─────────────────────────────────────────────
interface PersonItem {
  id: number;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  rating: number | null;
  points: number;
  skills: string[];
}

// ─────────────────────────────────────────────
// MAIN EXPLORER COMPONENT
// ─────────────────────────────────────────────
export function SkillExplorer({
  onNavigate,
  payload,
}: {
  onNavigate: (page: string, payload?: any) => void;
  payload?: any;
}) {
  const [mode, setMode] = useState<"skills" | "people">("skills");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [people, setPeople] = useState<PersonItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connect Dialog
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [message, setMessage] = useState("");
  const messageLimit = 500;

  // send state (for animation)
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [sendErrorText, setSendErrorText] = useState<string | null>(null);

  const categories = [
    "All",
    "Technology",
    "Design",
    "Business",
    "Arts",
    "Language",
    "Education",
    "Media",
    "Other",
  ];

  const resetDialogState = () => {
    setMessage("");
    setSending(false);
    setSendResult("idle");
    setSendErrorText(null);
  };

  // ─────────────────────────────────────────────
  // LOAD SKILLS + PEOPLE
  // ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [skillsRes, peopleRes] = await Promise.all([
          fetch(`${API_BASE}/skills`),
          fetch(`${API_BASE}/people/explore`),
        ]);

        if (!skillsRes.ok) throw new Error("Skill load failed");
        if (!peopleRes.ok) throw new Error("People load failed");

        const skillsJSON = await skillsRes.json();
        const peopleJSON = await peopleRes.json();

        setSkills(skillsJSON);

        const normalizedPeople: PersonItem[] = peopleJSON.map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          display_name: p.display_name ?? null,
          avatar_url: p.avatar_url ?? null,
          rating: p.rating ? Number(p.rating) : null,
          points: Number(p.points ?? 0),
          skills: Array.isArray(p.skills)
            ? p.skills
            : p.skills
            ? String(p.skills)
                .split(",")
                .map((s: string) => s.trim())
            : [],
        }));

        setPeople(normalizedPeople);

        // Auto-open connect dialog if payload instructs
        if (payload?.openConnectFor) {
          const target = normalizedPeople.find(
            (p) => p.id === payload.openConnectFor
          );
          if (target) {
            setSelectedPerson(target);
            resetDialogState();
            setShowConnectDialog(true);
          }
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [payload]);

  // ─────────────────────────────────────────────
  // FILTERING
  // ─────────────────────────────────────────────
  const filteredSkills = skills.filter((skill) => {
    const matchCat =
      selectedCategory === "All" || skill.category === selectedCategory;

    const matchSearch =
      searchQuery === "" ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchSearch;
  });

  const filteredPeople = people.filter((p) => {
    const q = searchQuery.toLowerCase();
    const skillsArray = p.skills || [];

    return (
      searchQuery === "" ||
      p.full_name.toLowerCase().includes(q) ||
      skillsArray.some((s) => s.toLowerCase().includes(q))
    );
  });

  // ─────────────────────────────────────────────
  // CONNECT HANDLERS
  // ─────────────────────────────────────────────
  const openConnectPerson = (p: PersonItem) => {
    setSelectedPerson(p);
    setSelectedSkill(null);
    resetDialogState();
    setShowConnectDialog(true);
  };

  const openConnectSkill = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setSelectedPerson(null);
    resetDialogState();
    setShowConnectDialog(true);
  };

  const sendRequest = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    try {
      setSending(true);
      setSendResult("idle");
      setSendErrorText(null);

      const payloadBody =
        selectedPerson !== null
          ? {
              requester_id: Number(userId),
              to_user_id: selectedPerson.id,
              message,
            }
          : {
              requester_id: Number(userId),
              skill_id: selectedSkill?.id,
              message,
            };

      const res = await fetch(`${API_BASE}/collaborations/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBody),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send request.");
      }

      // Success animation
      setSendResult("success");
      setMessage("");

      // Close dialog shortly after success
      setTimeout(() => {
        setShowConnectDialog(false);
        resetDialogState();
        setSelectedPerson(null);
        setSelectedSkill(null);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setSendResult("error");
      setSendErrorText(err?.message || "Failed to send request.");
    } finally {
      setSending(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-3">
            <Sparkles className="w-4 h-4 text-[#6C63FF]" />
            <span className="text-xs uppercase tracking-wide">
              Discover. Learn. Collaborate.
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl mb-2">Explore</h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            Find skills and talented peers. Connect instantly and start
            exchanging knowledge.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-4 flex gap-4 items-center justify-between md:w-80">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">
              Skills
            </p>
            <p className="text-2xl font-semibold">{skills.length}</p>
          </div>

          <div className="w-px h-10 bg-border" />

          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">
              People
            </p>
            <p className="text-2xl font-semibold flex items-center gap-2">
              {people.length}
              <Users className="w-4 h-4" />
            </p>
          </div>
        </div>
      </motion.div>

      {/* MODE SWITCH */}
      <div className="flex gap-4 mt-8 mb-6">
        {(["skills", "people"] as const).map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMode(tab)}
            className={`relative px-6 py-3 rounded-2xl transition-all ${
              mode === tab
                ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white shadow-lg"
                : "glass-panel"
            }`}
          >
            <span className="flex items-center gap-2">
              {tab === "skills" ? (
                <>
                  <Filter className="w-4 h-4" />
                  Skills
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  People
                </>
              )}
            </span>

            {mode === tab && (
              <motion.div
                layoutId="underline"
                className="absolute -bottom-1 left-4 right-4 h-0.5 bg-white/70"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="glass-panel rounded-3xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute w-5 h-5 left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${
                mode === "skills" ? "skills" : "people or skills"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted rounded-2xl focus:ring-2 focus:ring-[#4A90E2]"
            />
          </div>

          {mode === "skills" && (
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          )}
        </div>

        {/* CATEGORY FILTERS */}
        {mode === "skills" && (
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white shadow-md"
                    : "glass-panel hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT GRID */}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {mode === "skills" ? (
            // SKILLS GRID
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((sk, idx) => (
                <motion.div
                  key={sk.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <SkillCard
                    skill={sk}
                    onConnect={() => openConnectSkill(sk)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            // PEOPLE GRID
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeople.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                >
                  <div className="glass-panel rounded-2xl p-6 hover:shadow-xl flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-12 h-12 ring-2 ring-[#4A90E2]">
                        <AvatarImage
                          src={
                            p.avatar_url?.startsWith("http")
                              ? p.avatar_url
                              : p.avatar_url
                              ? `${API_BASE}${p.avatar_url}`
                              : undefined
                          }
                        />
                        <AvatarFallback>
                          {p.full_name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-xl flex items-center gap-2">
                          {p.full_name}
                          {p.display_name && (
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                              @{p.display_name}
                            </span>
                          )}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-[#FFC857] text-[#FFC857]" />
                          <span>
                            {p.rating !== null && p.rating !== undefined
                              ? p.rating.toFixed(1)
                              : "No rating"}
                          </span>
                          <span className="mx-1">•</span>
                          <span>{p.points} pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.skills.slice(0, 5).map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-muted rounded-xl text-xs"
                        >
                          {s}
                        </span>
                      ))}

                      {p.skills.length > 5 && (
                        <span className="text-xs text-muted-foreground">
                          +{p.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex gap-3">
                      <button
                        onClick={() =>
                          onNavigate("public-profile", { userId: p.id })
                        }
                        className="flex-1 px-4 py-2 bg-muted rounded-xl hover:opacity-90 flex items-center justify-center gap-1 text-sm"
                      >
                        View Profile <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openConnectPerson(p)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-xl text-sm flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-4 h-4" />
                        Connect
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CONNECT DIALOG */}

<Dialog open={showConnectDialog} onOpenChange={(open) => {
  setShowConnectDialog(open);
  if (!open) {
    resetDialogState();
    setSelectedPerson(null);
    setSelectedSkill(null);
  }
}}>
  <DialogContent
    className="
      max-w-xl 
      w-full
      max-h-[90vh]
      rounded-3xl 
      bg-white 
      shadow-2xl 
      border border-gray-300 
      p-0
      overflow-hidden
      flex 
      flex-col
    "
  >

    {/* HEADER */}
    <div className="p-6 border-b bg-white sticky top-0 z-20">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-800">
          {selectedPerson ? "Connect With a Mentor" : "Request a Skill Instructor"}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Write a short, professional message.
        </DialogDescription>
      </DialogHeader>
    </div>

    {/* MAIN SCROLL AREA (CONTENT) */}
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* PERSON CONNECT UI */}
      {selectedPerson && (
        <div className="space-y-6">

          {/* PERSON BOX */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-blue-500">
                <AvatarImage
                  src={
                    selectedPerson.avatar_url?.startsWith("http")
                      ? selectedPerson.avatar_url
                      : selectedPerson.avatar_url
                      ? `${API_BASE}${selectedPerson.avatar_url}`
                      : ""
                  }
                />
                <AvatarFallback>{selectedPerson.full_name[0]}</AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPerson.full_name}
                </h3>

                <p className="text-gray-600 mt-1 text-sm">
                  ⭐ {selectedPerson.rating ?? "No rating"} • {selectedPerson.points} pts
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPerson.skills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-200 text-blue-800 px-2 py-1 text-xs rounded-xl"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* REASON */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Reason</label>
            <select className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700">
              <option>Study Help</option>
              <option>Project Collaboration</option>
              <option>Skill Exchange</option>
              <option>Mentorship</option>
            </select>
          </div>

          {/* MESSAGE */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              className="
                w-full mt-1 p-4 
                bg-gray-100 border border-gray-300 
                rounded-2xl text-gray-700 
                focus:ring-2 focus:ring-blue-500
              "
              placeholder="Tell them briefly who you are and what you need..."
            />
          </div>
        </div>
      )}

      {/* SKILL CONNECT UI */}
      {selectedSkill && (
        <div className="space-y-6">

          {/* SKILL BOX */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
            <h3 className="text-xl font-bold text-purple-800">
              {selectedSkill.name}
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              Category: {selectedSkill.category}
            </p>
          </div>

          {/* GOALS */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Learning Goals</label>
            <textarea
              rows={3}
              className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-700"
              placeholder="What do you want to achieve?"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              className="
                w-full mt-1 p-4 
                bg-gray-100 border border-gray-300 
                rounded-2xl text-gray-700 
                focus:ring-2 focus:ring-purple-500
              "
              placeholder="Explain your goals briefly..."
            />
          </div>
        </div>
      )}

    </div>

    {/* FOOTER: ALWAYS VISIBLE BUTTONS */}
    <div className="
      sticky bottom-0 
      bg-white 
      border-t 
      p-4 
      flex 
      justify-end 
      gap-3 
      z-30
    ">
      <button
        onClick={() => setShowConnectDialog(false)}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
      >
        Cancel
      </button>

      <button
        onClick={sendRequest}
        className="
          px-6 py-2 
          rounded-xl 
          color-black 
          font-semibold
          transition 
          bg-blue-600 hover:bg-blue-700
        "
      >
        {selectedPerson ? "Send Request" : "Request Instructor"}
      </button>
    </div>
  </DialogContent>
</Dialog>


    </div>
  );
}
