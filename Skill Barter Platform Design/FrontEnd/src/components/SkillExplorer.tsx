// frontend/src/components/SkillExplorer.tsx
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { SkillCard, SkillItem } from "./SkillCard";
import {
  Search,
  Filter,
  Users,
  Star,
  Sparkles,
  ArrowRight,
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
    setMessage("");
    setShowConnectDialog(true);
  };

  const openConnectSkill = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setSelectedPerson(null);
    setMessage("");
    setShowConnectDialog(true);
  };

  const sendRequest = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    try {
      const payload =
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
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Your collaboration request has been sent!");
      setShowConnectDialog(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to send request.");
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
                  <SkillCard skill={sk} onConnect={() => openConnectSkill(sk)} />
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
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-xl text-sm"
                      >
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
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="max-w-lg glass-panel rounded-3xl border-0">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedPerson
                ? `Connect with ${selectedPerson.full_name}`
                : selectedSkill
                ? `Learn ${selectedSkill.name}`
                : "Send collaboration request"}
            </DialogTitle>
            <DialogDescription>
              Your message should be short, polite and professional.
            </DialogDescription>
          </DialogHeader>

          {selectedPerson && (
            <div className="flex items-center gap-3 mt-3 mb-2">
              <Avatar className="w-10 h-10 ring-2 ring-[#4A90E2]">
                <AvatarImage
                  src={
                    selectedPerson.avatar_url?.startsWith("http")
                      ? selectedPerson.avatar_url
                      : selectedPerson.avatar_url
                      ? `${API_BASE}${selectedPerson.avatar_url}`
                      : undefined
                  }
                />
                <AvatarFallback>
                  {selectedPerson.full_name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-sm">
                <p className="font-medium">{selectedPerson.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedPerson.rating
                    ? `${selectedPerson.rating.toFixed(1)}★ · ${selectedPerson.points} pts`
                    : `${selectedPerson.points} pts`}
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <label>Message</label>
              <span className="text-muted-foreground">
                {message.length}/{messageLimit}
              </span>
            </div>

            <textarea
              rows={5}
              className="w-full bg-muted rounded-2xl p-4 focus:ring-2 focus:ring-[#4A90E2] text-sm"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, messageLimit))
              }
              placeholder="Introduce yourself and explain how you'd like to collaborate..."
            />
          </div>

          <div className="flex mt-6 gap-3">
            <button
              className="flex-1 px-4 py-2 bg-muted rounded-xl"
              onClick={() => setShowConnectDialog(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-xl"
              onClick={sendRequest}
            >
              Send Request
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Once sent, your message cannot be edited.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
