import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Star, ArrowLeft, Users, GraduationCap } from "lucide-react";

const API_BASE = "http://localhost:5000";

interface PublicProfileViewProps {
  userId: number | null;
  onNavigate: (page: string, payload?: any) => void;
}

interface PublicUserProfile {
  id: number;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  college: string | null;
  rating: number | null;
  rating_count: number;
  points: number;
  skills: { name: string; category: string }[];
  collaborations: number;
}

export default function PublicProfileView({
  userId,
  onNavigate,
}: PublicProfileViewProps) {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/people/profile/${userId}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("PUBLIC PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl text-muted-foreground">Profile not found.</p>
        <button
          onClick={() => onNavigate("explore-skills")}
          className="mt-4 px-6 py-2 rounded-xl bg-muted hover:bg-muted/70"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => onNavigate("explore-skills")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </button>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <Avatar className="w-24 h-24 ring-4 ring-[#4A90E2] ring-offset-2">
            <AvatarImage
              src={
                profile.avatar_url?.startsWith("http")
                  ? profile.avatar_url
                  : profile.avatar_url
                  ? `${API_BASE}${profile.avatar_url}`
                  : undefined
              }
            />
            <AvatarFallback>
              {profile.full_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {profile.full_name}
              {profile.display_name && (
                <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  @{profile.display_name}
                </span>
              )}
            </h1>

            {/* Stats Row */}
            <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#FFC857] text-[#FFC857]" />
                {profile.rating ? profile.rating.toFixed(1) : "No rating"}
              </span>

              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {profile.collaborations} collaborations
              </span>

              <span>{profile.points} pts</span>
            </div>

            {/* College */}
            {profile.college && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                {profile.college}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-3xl p-6 mt-6"
      >
        <h2 className="text-xl font-semibold mb-3">About</h2>
        {profile.bio ? (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        ) : (
          <p className="text-muted-foreground italic">
            This user has not written a bio yet.
          </p>
        )}
      </motion.div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-3xl p-6 mt-6"
      >
        <h2 className="text-xl font-semibold mb-3">Skills</h2>

        {profile.skills.length === 0 ? (
          <p className="text-muted-foreground italic">
            No skills added yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((s, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="px-3 py-1 text-sm rounded-xl"
              >
                {s.name}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>

      {/* Connect Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() =>
            onNavigate("explore-skills", {
              openConnectFor: profile.id,
            })
          }
          className="px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-2xl shadow hover:opacity-95 transition"
        >
          Connect
        </button>
      </div>
    </div>
  );
}
