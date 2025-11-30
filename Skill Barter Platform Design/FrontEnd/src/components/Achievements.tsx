import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Award, Plus } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

const API_BASE = "http://localhost:5000";

interface Achievement {
  id: number;
  title: string;
  description: string;
  points_reward: number;
  icon: string;
  earned_at: string;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [points, setPoints] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAchievements = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`${API_BASE}/achievements?user_id=${userId}`);
        const data = await res.json();
        setAchievements(data);
      } catch (err) {
        console.error("Achievements error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  const createAchievement = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/achievements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title: title.trim(),
          description: desc.trim(),
          points_reward: Number(points),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAchievements((prev) => [
        {
          id: data.achievement_id,
          title,
          description: desc,
          points_reward: Number(points),
          icon: "award",
          earned_at: new Date().toISOString(),
        },
        ...prev
      ]);

      setTitle("");
      setDesc("");
      setPoints("");
      setShowAddDialog(false);

    } catch (err) {
      console.error("CREATE ACHIEVEMENT ERROR", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Award className="w-8 h-8 text-[#6C63FF]" /> Achievements
        </h1>

        <button
          onClick={() => setShowAddDialog(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {loading ? (
        <p>Loading achievements...</p>
      ) : achievements.length === 0 ? (
        <p>No achievements yet. Earn your first one!</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((a) => (
            <GlassCard key={a.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Award className="w-10 h-10 text-[#FFC857]" />
                <div>
                  <h3 className="text-xl font-semibold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(a.earned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-3">{a.description}</p>

              <span className="text-sm bg-muted px-3 py-1 rounded-xl">
                +{a.points_reward} points
              </span>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add Achievement Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md glass-panel rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add New Achievement</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <input
              className="w-full p-3 bg-muted rounded-2xl"
              placeholder="Achievement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full p-3 bg-muted rounded-2xl"
              placeholder="Description"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <input
              className="w-full p-3 bg-muted rounded-2xl"
              placeholder="Points reward"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <button
              className="px-4 py-2 bg-muted rounded-xl"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-xl"
              onClick={createAchievement}
            >
              {saving ? "Saving..." : "Save Achievement"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
