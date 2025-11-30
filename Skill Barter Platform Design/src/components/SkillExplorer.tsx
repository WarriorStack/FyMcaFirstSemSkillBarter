import { motion } from "motion/react";
import { useState } from "react";
import { SkillCard } from "./SkillCard";
import { Search, Filter, TrendingUp, Star, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export function SkillExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  const categories = ["All", "Technology", "Design", "Business", "Arts", "Language", "Science"];

  const skills = [
    {
      id: "1",
      name: "React Development",
      category: "Technology",
      instructor: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", rating: 4.9 },
      students: 245,
      duration: "8 weeks",
      level: "Intermediate",
      points: 150,
    },
    {
      id: "2",
      name: "UI/UX Design",
      category: "Design",
      instructor: { name: "Mike Rodriguez", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", rating: 4.8 },
      students: 189,
      duration: "6 weeks",
      level: "Beginner",
      points: 120,
    },
    {
      id: "3",
      name: "Python for Data Science",
      category: "Technology",
      instructor: { name: "Emma Thompson", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", rating: 5.0 },
      students: 312,
      duration: "10 weeks",
      level: "Advanced",
      points: 200,
    },
    {
      id: "4",
      name: "Digital Marketing",
      category: "Business",
      instructor: { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", rating: 4.7 },
      students: 156,
      duration: "4 weeks",
      level: "Beginner",
      points: 100,
    },
    {
      id: "5",
      name: "Photography Basics",
      category: "Arts",
      instructor: { name: "Lisa Wang", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", rating: 4.9 },
      students: 203,
      duration: "5 weeks",
      level: "Beginner",
      points: 110,
    },
    {
      id: "6",
      name: "Spanish Conversation",
      category: "Language",
      instructor: { name: "Carlos Martinez", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", rating: 4.8 },
      students: 178,
      duration: "12 weeks",
      level: "Intermediate",
      points: 130,
    },
  ];

  const filteredSkills = skills.filter(
    (skill) =>
      (selectedCategory === "All" || skill.category === selectedCategory) &&
      (searchQuery === "" || skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleConnect = (skill: any) => {
    setSelectedSkill(skill);
    setShowConnectDialog(true);
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-5xl mb-4">Explore Skills</h1>
        <p className="text-xl text-muted-foreground">
          Discover and connect with peers who can teach you new skills
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-3xl p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
            />
          </div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-2xl"
          >
            <Filter className="w-5 h-5" />
            Filters
          </motion.button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mt-6">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white shadow-lg"
                  : "glass-panel hover:shadow-md"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-6 mb-8"
      >
        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl">{filteredSkills.length}</p>
            <p className="text-sm text-muted-foreground">Available Skills</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFC857] to-[#FF9A56] flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl">1,283</p>
            <p className="text-sm text-muted-foreground">Active Learners</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl">4.8★</p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <SkillCard skill={skill} onConnect={() => handleConnect(skill)} />
          </motion.div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-2xl text-muted-foreground">No skills found matching your criteria</p>
        </motion.div>
      )}

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="glass-panel border-0 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Connect with {selectedSkill?.instructor.name}</DialogTitle>
            <DialogDescription>
              Send a collaboration request to learn {selectedSkill?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="glass-panel rounded-2xl p-4">
              <h4 className="mb-2">Course Details</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Duration: {selectedSkill?.duration}</p>
                <p>Level: {selectedSkill?.level}</p>
                <p>Points Required: {selectedSkill?.points}</p>
                <p>Current Students: {selectedSkill?.students}</p>
              </div>
            </div>

            <div>
              <label className="block mb-2">Your Message</label>
              <textarea
                placeholder="Introduce yourself and explain why you want to learn this skill..."
                className="w-full p-4 bg-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConnectDialog(false)}
                className="flex-1 px-6 py-3 bg-muted rounded-2xl"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowConnectDialog(false);
                  // Show success toast
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-2xl"
              >
                Send Request
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
