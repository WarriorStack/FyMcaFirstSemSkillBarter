// frontend/src/components/ProfilePage.tsx
import {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { GlassCard } from "./GlassCard";
import {
  Camera,
  MapPin,
  Calendar,
  Star,
  Award,
  BookOpen,
  Users,
  Edit,
  Save,
  Trash2,
  Plus,
  Pencil,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const API_BASE = "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop";

interface ProfileData {
  full_name: string;
  display_name: string;
  email: string;
  phone: string;
  college: string;
  student_number: string;
}

interface ProfileStats {
  skills: number;
  points: number;
  rating: number | null;
  rating_count: number;
}

type Proficiency = "beginner" | "intermediate" | "advanced" | "expert";

interface UserSkill {
  skill_id: number;
  skill_name: string;
  category: string | null;
  proficiency_level: Proficiency;
  years_experience: number | null;
}

interface SkillOption {
  id: number;
  skill_name: string;
  category: string | null;
}

interface SkillFormState {
  skill_id: string;
  proficiency_level: Proficiency;
  years_experience: string;
}

interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  from_user_name: string | null;
  project_name?: string | null;
}

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(
    "Passionate about web development and design. Love teaching and learning new skills!"
  );

  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    display_name: "",
    email: "",
    phone: "",
    college: "",
    student_number: "",
  });

  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Who's profile is this? (for now it's the logged-in user)
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Skills state
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [skillFormMode, setSkillFormMode] = useState<"add" | "edit">("add");
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState<SkillFormState>({
    skill_id: "",
    proficiency_level: "beginner",
    years_experience: "",
  });
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillError, setSkillError] = useState("");
  const [skillSuccess, setSkillSuccess] = useState("");

  // Reviews
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // ---------- PLACEHOLDER PROJECTS / ACHIEVEMENTS / TIMELINE ----------
  const projects = [
    {
      id: 1,
      title: "Example Project",
      description: "Real project listing integration coming soon.",
      skills: ["React", "Node.js"],
      date: "N/A",
      status: "In Progress",
    },
  ];

  const achievements = [
    {
      id: 1,
      name: "Getting Started",
      icon: "🎯",
      description: "Complete your profile to unlock real achievements.",
      rarity: "Bronze",
    },
  ];

  const timeline = [
    {
      date: "Now",
      event: "Joined SkillBarter profile page",
      type: "milestone",
    },
  ];

  // ---------- LOAD REVIEWS ----------
  const loadReviews = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/profile/reviews?user_id=${userId}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("LOAD REVIEWS ERROR:", err);
    }
  };

  // ---------- LOAD PROFILE + SKILLS + AVAILABLE SKILLS + REVIEWS ----------
  useEffect(() => {
    const loadAll = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      setProfileUserId(userId);

      try {
        setError("");
        const [profileRes, skillsRes, allSkillsRes] = await Promise.all([
          fetch(`${API_BASE}/profile?user_id=${userId}`),
          fetch(`${API_BASE}/profile/skills?user_id=${userId}`),
          fetch(`${API_BASE}/skills/list`),
        ]);

        if (!profileRes.ok) throw new Error(await profileRes.text());
        if (!skillsRes.ok) throw new Error(await skillsRes.text());
        if (!allSkillsRes.ok) throw new Error(await allSkillsRes.text());

        const profileData = await profileRes.json();
        const userSkillsData = await skillsRes.json();
        const allSkillsData = await allSkillsRes.json();

        // Profile
        setProfile({
          full_name: profileData.user?.full_name ?? "",
          display_name: profileData.user?.display_name ?? "",
          email: profileData.user?.email ?? "",
          phone: profileData.user?.phone ?? "",
          college: profileData.student?.college ?? "",
          student_number: profileData.student?.student_number ?? "",
        });

        // Avatar
        if (profileData.user?.avatar_url) {
          setAvatarUrl(`${API_BASE}${profileData.user.avatar_url}`);
        } else {
          setAvatarUrl(DEFAULT_AVATAR);
        }

        // Normalize stats safely
        const rawStats = profileData.stats ?? {};
        const rawRating = rawStats.rating;

        let normalizedRating: number | null = null;
        if (rawRating !== null && rawRating !== undefined) {
          const num = Number(rawRating);
          normalizedRating = Number.isFinite(num) ? num : null;
        }

        setStats({
          skills: Number(rawStats.skills ?? 0),
          points: Number(rawStats.points ?? 0),
          rating: normalizedRating,
          rating_count: Number(rawStats.rating_count ?? 0),
        });

        // Skills
        setUserSkills(userSkillsData || []);
        setAvailableSkills(allSkillsData || []);

        // Reviews
        await loadReviews(userId);
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // ---------- RE-CALCULATE PROFILE COMPLETION ----------
  useEffect(() => {
    const requiredFields = [
      profile.full_name,
      profile.display_name,
      profile.phone,
      profile.college,
      profile.student_number,
    ];

    const filled = requiredFields.filter((f) => f && f.trim().length > 0).length;
    const total = requiredFields.length;
    const completion = total === 0 ? 0 : Math.round((filled / total) * 100);

    setProfileCompletion(completion);
  }, [profile]);

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- AVATAR UPLOAD ----------
  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("user_id", userId);

    try {
      const res = await fetch(`${API_BASE}/profile/avatar`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.avatar_url) {
        setAvatarUrl(`${API_BASE}${data.avatar_url}`);
      } else {
        console.error("Avatar upload failed:", data);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    }
  };

  // ---------- SAVE PROFILE ----------
  const handleEditClick = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setSuccess("");
      setError("");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No user logged in");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          full_name: profile.full_name,
          display_name: profile.display_name,
          phone: profile.phone,
          college: profile.college,
          student_number: profile.student_number,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update profile");
      } else {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);
      setError("Server error while updating profile");
    } finally {
      setSaving(false);
    }
  };

  // ---------- SKILL FORM HELPERS ----------
  const resetSkillForm = () => {
    setSkillForm({
      skill_id: "",
      proficiency_level: "beginner",
      years_experience: "",
    });
    setEditingSkillId(null);
    setSkillError("");
    setSkillSuccess("");
  };

  const openAddSkillForm = () => {
    setSkillFormMode("add");
    resetSkillForm();
    setSkillFormOpen(true);
  };

  const openEditSkillForm = (skill: UserSkill) => {
    setSkillFormMode("edit");
    setEditingSkillId(skill.skill_id);
    setSkillForm({
      skill_id: String(skill.skill_id),
      proficiency_level: skill.proficiency_level,
      years_experience: skill.years_experience
        ? String(skill.years_experience)
        : "",
    });
    setSkillFormOpen(true);
    setSkillError("");
    setSkillSuccess("");
  };

  const handleSkillFormChange = (
    field: keyof SkillFormState,
    value: string
  ) => {
    setSkillForm((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- SAVE SKILL ----------
  const handleSkillSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setSkillError("No user logged in");
      return;
    }

    if (!skillForm.skill_id) {
      setSkillError("Please select a skill");
      return;
    }

    setSkillSaving(true);
    setSkillError("");
    setSkillSuccess("");

    try {
      const yearsNum = skillForm.years_experience
        ? parseInt(skillForm.years_experience, 10)
        : null;

      if (skillFormMode === "add") {
        const res = await fetch(`${API_BASE}/profile/skills`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            skill_id: Number(skillForm.skill_id),
            proficiency_level: skillForm.proficiency_level,
            years_experience: yearsNum,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setSkillError(data.message || "Failed to add skill");
        } else {
          setSkillSuccess("Skill added successfully!");

          const addedSkill = availableSkills.find(
            (s) => s.id === Number(skillForm.skill_id)
          );
          if (addedSkill) {
            setUserSkills((prev) => [
              ...prev,
              {
                skill_id: addedSkill.id,
                skill_name: addedSkill.skill_name,
                category: addedSkill.category,
                proficiency_level: skillForm.proficiency_level,
                years_experience: yearsNum,
              },
            ]);
          }

          setStats((prev) =>
            prev ? { ...prev, skills: prev.skills + 1 } : prev
          );
          resetSkillForm();
          setSkillFormOpen(false);
        }
      } else if (skillFormMode === "edit" && editingSkillId !== null) {
        const res = await fetch(
          `${API_BASE}/profile/skills/${editingSkillId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              proficiency_level: skillForm.proficiency_level,
              years_experience: yearsNum,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          setSkillError(data.message || "Failed to update skill");
        } else {
          setSkillSuccess("Skill updated successfully!");
          setUserSkills((prev) =>
            prev.map((s) =>
              s.skill_id === editingSkillId
                ? {
                    ...s,
                    proficiency_level: skillForm.proficiency_level,
                    years_experience: yearsNum,
                  }
                : s
            )
          );
          resetSkillForm();
          setSkillFormOpen(false);
        }
      }
    } catch (err) {
      console.error("SKILL SAVE ERROR:", err);
      setSkillError("Server error while saving skill");
    } finally {
      setSkillSaving(false);
    }
  };

  // ---------- DELETE SKILL ----------
  const handleDeleteSkill = async (skillId: number) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setSkillError("No user logged in");
      return;
    }

    if (!confirm("Remove this skill from your profile?")) return;

    try {
      const res = await fetch(
        `${API_BASE}/profile/skills/${skillId}?user_id=${userId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        setSkillError(data.message || "Failed to remove skill");
      } else {
        setUserSkills((prev) => prev.filter((s) => s.skill_id !== skillId));
        setStats((prev) =>
          prev ? { ...prev, skills: Math.max(0, prev.skills - 1) } : prev
        );
      }
    } catch (err) {
      console.error("DELETE SKILL ERROR:", err);
      setSkillError("Server error while removing skill");
    }
  };

  const points = stats?.points ?? 0;
  const skillsCount = stats?.skills ?? 0;
  const rating = stats?.rating ?? null;
  const ratingCount = (stats?.rating_count ?? reviews.length) || 0;


  // ---------- REVIEW SUBMISSION ----------
  const handleOpenReviewDialog = () => {
    setReviewError("");
    setReviewSuccess("");
    setReviewRating(5);
    setReviewComment("");
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();

    const fromUserId = localStorage.getItem("userId");
    const toUserId = profileUserId;

    if (!fromUserId || !toUserId) {
      setReviewError("Missing user information");
      return;
    }

    if (fromUserId === toUserId) {
      setReviewError("You cannot review your own profile.");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Rating must be between 1 and 5.");
      return;
    }

    setReviewSaving(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const res = await fetch(`${API_BASE}/profile/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_user_id: Number(fromUserId),
          to_user_id: Number(toUserId),
          rating: reviewRating,
          comment: reviewComment,
          project_id: null, // could later attach to a project
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.message || "Failed to submit review");
      } else {
        setReviewSuccess("Review submitted!");

        // refresh reviews + stats
        await loadReviews(toUserId);

        // Re-fetch profile stats to get updated rating + count
        const profileRes = await fetch(
          `${API_BASE}/profile?user_id=${toUserId}`
        );
        if (profileRes.ok) {
          const updatedProfile = await profileRes.json();
          const rawStats = updatedProfile.stats ?? {};
          const rawRating = rawStats.rating;
          let normalizedRating: number | null = null;
          if (rawRating !== null && rawRating !== undefined) {
            const num = Number(rawRating);
            normalizedRating = Number.isFinite(num) ? num : null;
          }
          setStats({
            skills: Number(rawStats.skills ?? 0),
            points: Number(rawStats.points ?? 0),
            rating: normalizedRating,
            rating_count: Number(rawStats.rating_count ?? 0),
          });
        }

        setTimeout(() => {
          setReviewDialogOpen(false);
        }, 700);
      }
    } catch (err) {
      console.error("SUBMIT REVIEW ERROR:", err);
      setReviewError("Server error while submitting review");
    } finally {
      setReviewSaving(false);
    }
  };

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel rounded-3xl px-8 py-6 shadow-2xl">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <GlassCard className="mb-6">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-[#6C63FF] via-[#4A90E2] to-[#FFC857] rounded-2xl mb-16" />

          {/* Profile Info */}
          <div className="absolute -bottom-8 left-8 flex items-end gap-6">
            <div className="relative transition-transform hover:scale-105">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={avatarUrl ?? DEFAULT_AVATAR} />
                <AvatarFallback>
                  {profile.full_name ? profile.full_name[0] : "U"}
                </AvatarFallback>
              </Avatar>

              {/* Hidden file input for avatar */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                onClick={handleAvatarButtonClick}
                className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="mt-8 ml-48 flex items-start justify-between gap-4 max-sm:ml-0 max-sm:flex-col max-sm:mt-16">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {isEditing ? (
                  <input
                    className="text-3xl md:text-4xl bg-transparent border-b border-border focus:outline-none focus:border-[#4A90E2] pb-1"
                    value={profile.full_name}
                    onChange={(e) =>
                      handleFieldChange("full_name", e.target.value)
                    }
                    placeholder="Full Name"
                  />
                ) : (
                  <h1 className="text-4xl">
                    {profile.full_name || "Your Name"}
                  </h1>
                )}

                <Badge className="bg-gradient-to-r from-[#FFC857] to-[#FF9A56] text-white border-0">
                  Gold Member
                </Badge>
              </div>

              {isEditing ? (
                <input
                  className="bg-transparent border-b border-border focus:outline-none focus:border-[#4A90E2] pb-1 mb-2 text-sm text-muted-foreground"
                  value={profile.display_name}
                  onChange={(e) =>
                    handleFieldChange("display_name", e.target.value)
                  }
                  placeholder="Display name / nickname"
                />
              ) : profile.display_name ? (
                <p className="text-sm text-muted-foreground mb-1">
                  @{profile.display_name}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.college || "Add your college / location"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FFC857] text-[#FFC857]" />
                  <span>
                    {typeof rating === "number"
                      ? `${rating.toFixed(1)} Rating`
                      : "No rating yet"}
                    {ratingCount > 0 && ` (${ratingCount} reviews)`}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleEditClick}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-2xl disabled:opacity-70 transition-transform hover:scale-105 active:scale-95"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Profile"}
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error / success messages */}
        {error && (
          <div className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl px-4 py-2">
            {success}
          </div>
        )}

        {/* Editable fields + bio */}
        <div className="mt-6 space-y-4">
          {isEditing && (
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="w-full p-3 rounded-2xl bg-muted focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Phone"
                value={profile.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
              />
              <input
                className="w-full p-3 rounded-2xl bg-muted focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="College / Organization"
                value={profile.college}
                onChange={(e) => handleFieldChange("college", e.target.value)}
              />
              <input
                className="w-full p-3 rounded-2xl bg-muted focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Student Number / ID"
                value={profile.student_number}
                onChange={(e) =>
                  handleFieldChange("student_number", e.target.value)
                }
              />
              <input
                className="w-full p-3 rounded-2xl bg-muted text-muted-foreground cursor-not-allowed"
                value={profile.email}
                readOnly
              />
            </div>
          )}

          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              rows={3}
            />
          ) : (
            <p className="text-muted-foreground">{bio}</p>
          )}
        </div>

        {/* Stats + profile completion bar */}
        <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t border-border">
          <div className="text-center min-w-[70px]">
            <p className="text-3xl mb-1">{points}</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </div>
          <div className="text-center min-w-[70px]">
            <p className="text-3xl mb-1">{skillsCount}</p>
            <p className="text-sm text-muted-foreground">Skills</p>
          </div>
          <div className="text-center min-w-[70px]">
            <p className="text-3xl mb-1">
              {typeof rating === "number" ? rating.toFixed(1) : "--"}
            </p>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
          <div className="text-center min-w-[70px]">
            <p className="text-3xl mb-1">{ratingCount}</p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Profile completion
            </span>
            <span className="text-sm font-medium">{profileCompletion}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] rounded-full"
              style={{
                width: `${profileCompletion}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="w-full glass-panel rounded-2xl p-2 mb-6 grid grid-cols-4">
          <TabsTrigger
            value="skills"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white"
          >
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white"
          >
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3>My Skills</h3>
              <button
                onClick={openAddSkillForm}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-xl text-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {/* Skill Form */}
            {skillFormOpen && (
              <div className="mb-6 p-4 rounded-2xl bg-muted">
                <form onSubmit={handleSkillSubmit} className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs mb-1 text-muted-foreground">
                        Skill
                      </label>
                      <select
                        className="w-full p-2 rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                        value={skillForm.skill_id}
                        onChange={(e) =>
                          handleSkillFormChange("skill_id", e.target.value)
                        }
                        disabled={skillFormMode === "edit"}
                      >
                        <option value="">Select a skill</option>
                        {availableSkills.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.skill_name}
                            {s.category ? ` (${s.category})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs mb-1 text-muted-foreground">
                        Proficiency
                      </label>
                      <select
                        className="w-full p-2 rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                        value={skillForm.proficiency_level}
                        onChange={(e) =>
                          handleSkillFormChange(
                            "proficiency_level",
                            e.target.value
                          )
                        }
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs mb-1 text-muted-foreground">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full p-2 rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                        value={skillForm.years_experience}
                        onChange={(e) =>
                          handleSkillFormChange(
                            "years_experience",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 2"
                      />
                    </div>
                  </div>

                  {skillError && (
                    <p className="text-xs text-red-500">{skillError}</p>
                  )}
                  {skillSuccess && (
                    <p className="text-xs text-green-600">{skillSuccess}</p>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetSkillForm();
                        setSkillFormOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl text-xs bg-background hover:bg-background/80"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={skillSaving}
                      className="px-4 py-2 rounded-xl text-xs bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white disabled:opacity-70"
                    >
                      {skillSaving
                        ? "Saving..."
                        : skillFormMode === "add"
                        ? "Add Skill"
                        : "Update Skill"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {userSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You haven't added any skills yet. Click “Add Skill” to get
                  started.
                </p>
              )}

              {userSkills.map((skill) => (
                <div
                  key={skill.skill_id}
                  className="p-4 rounded-2xl bg-muted transition-transform hover:translate-x-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium">{skill.skill_name}</span>
                      <Badge variant="outline">
                        {skill.category || "Skill"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">
                        {skill.proficiency_level}
                      </span>
                      {typeof skill.years_experience === "number" && (
                        <span>• {skill.years_experience} yrs</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-background hover:bg-background/70"
                      onClick={() => openEditSkillForm(skill)}
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      onClick={() => handleDeleteSkill(skill.skill_id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <GlassCard key={project.id} hover>
                <div className="flex items-start justify-between mb-4">
                  <h4>{project.title}</h4>
                  <Badge
                    variant={
                      project.status === "Completed" ? "default" : "outline"
                    }
                    className={
                      project.status === "Completed"
                        ? "bg-[#2ECC71] border-0"
                        : ""
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-xl">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.date}
                </p>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <div className="flex items-center justify-between mb-4">
            <h3>Reviews</h3>
            {/* In a full multi-user app, you'd only show this on others' profiles */}
            <button
              onClick={handleOpenReviewDialog}
              className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white hover:opacity-95"
            >
              Write a Review
            </button>
          </div>

          <div className="space-y-6">
            {reviews.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No reviews yet.
              </p>
            )}

            {reviews.map((review) => (
              <GlassCard key={review.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.from_user_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{review.from_user_name || "Unknown User"}</p>
                      {review.project_name && (
                        <p className="text-sm text-muted-foreground">
                          Project: {review.project_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.round(review.rating) }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#FFC857] text-[#FFC857]"
                        />
                      )
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-2 italic">
                  "{review.comment}"
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Review Dialog */}
          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogContent className="glass-panel border-0 rounded-3xl max-w-lg">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience learning from this instructor.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`p-1 rounded-full ${
                          star <= reviewRating ? "text-[#FFC857]" : "text-muted-foreground"
                        }`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? "fill-[#FFC857]"
                              : "fill-transparent"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {reviewRating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Comment
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-muted focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    rows={4}
                    placeholder="What did you learn? How was the teaching style?"
                  />
                </div>

                {reviewError && (
                  <p className="text-xs text-red-500">{reviewError}</p>
                )}
                {reviewSuccess && (
                  <p className="text-xs text-green-600">{reviewSuccess}</p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewDialogOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm bg-muted hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSaving}
                    className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white disabled:opacity-70"
                  >
                    {reviewSaving ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <GlassCard
                key={achievement.id}
                className={`border-2 ${
                  achievement.rarity === "Gold"
                    ? "border-[#FFC857]"
                    : achievement.rarity === "Silver"
                    ? "border-gray-400"
                    : "border-[#CD7F32]"
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{achievement.icon}</div>
                  <Badge
                    className={`mb-3 ${
                      achievement.rarity === "Gold"
                        ? "bg-[#FFC857]"
                        : achievement.rarity === "Silver"
                        ? "bg-gray-400"
                        : "bg-[#CD7F32]"
                    } text-white border-0`}
                  >
                    {achievement.rarity}
                  </Badge>
                  <h4 className="mb-2">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Timeline */}
      <GlassCard className="mt-6">
        <h3 className="mb-6">Activity Timeline</h3>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === "achievement"
                      ? "bg-gradient-to-br from-[#FFC857] to-[#FF9A56]"
                      : item.type === "project"
                      ? "bg-gradient-to-br from-[#4A90E2] to-[#6C63FF]"
                      : item.type === "skill"
                      ? "bg-gradient-to-br from-[#6C63FF] to-[#A855F7]"
                      : "bg-gradient-to-br from-[#2ECC71] to-[#27AE60]"
                  } text-white`}
                >
                  {item.type === "achievement" && (
                    <Award className="w-5 h-5" />
                  )}
                  {item.type === "project" && <Users className="w-5 h-5" />}
                  {item.type === "skill" && <BookOpen className="w-5 h-5" />}
                  {item.type === "milestone" && <Star className="w-5 h-5" />}
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-12 bg-border" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <p className="mb-1">{item.event}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export default ProfilePage;
