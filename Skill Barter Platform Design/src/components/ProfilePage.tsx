import { motion } from "motion/react";
import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Camera, MapPin, Calendar, Star, Award, BookOpen, Users, Edit, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Passionate about web development and design. Love teaching and learning new skills!");

  const skills = [
    { name: "React", level: 90, category: "Teaching" },
    { name: "Python", level: 85, category: "Teaching" },
    { name: "UI/UX Design", level: 75, category: "Learning" },
    { name: "Photography", level: 80, category: "Teaching" },
    { name: "Public Speaking", level: 65, category: "Learning" },
  ];

  const projects = [
    {
      id: 1,
      title: "E-commerce Website",
      description: "Built a full-stack e-commerce platform",
      skills: ["React", "Node.js", "MongoDB"],
      date: "Oct 2024",
      status: "Completed",
    },
    {
      id: 2,
      title: "Mobile App Design",
      description: "Designed UI/UX for a fitness tracking app",
      skills: ["Figma", "UI Design"],
      date: "Nov 2024",
      status: "In Progress",
    },
  ];

  const reviews = [
    {
      id: 1,
      from: "Sarah Chen",
      rating: 5,
      text: "Excellent teacher! Very patient and knowledgeable.",
      skill: "React Development",
      date: "1 week ago",
    },
    {
      id: 2,
      from: "Mike Rodriguez",
      rating: 5,
      text: "Great collaboration! Learned so much about Python.",
      skill: "Python Basics",
      date: "2 weeks ago",
    },
  ];

  const achievements = [
    { id: 1, name: "Quick Learner", icon: "🚀", description: "Completed 5 skills in 30 days", rarity: "Gold" },
    { id: 2, name: "Great Teacher", icon: "👨‍🏫", description: "5-star rating from 10+ students", rarity: "Gold" },
    { id: 3, name: "Community Builder", icon: "🤝", description: "Connected with 50+ peers", rarity: "Silver" },
    { id: 4, name: "Early Adopter", icon: "⭐", description: "Joined in the first month", rarity: "Bronze" },
  ];

  const timeline = [
    { date: "Nov 2024", event: "Earned Gold Badge: Great Teacher", type: "achievement" },
    { date: "Oct 2024", event: "Completed project with Sarah Chen", type: "project" },
    { date: "Sep 2024", event: "Learned UI/UX Design from Mike Rodriguez", type: "skill" },
    { date: "Aug 2024", event: "Joined Skill Barter Platform", type: "milestone" },
  ];

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <GlassCard className="mb-6">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-[#6C63FF] via-[#4A90E2] to-[#FFC857] rounded-2xl mb-16" />

          {/* Profile Info */}
          <div className="absolute -bottom-8 left-8 flex items-end gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] rounded-full flex items-center justify-center shadow-lg"
              >
                <Camera className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          </div>

          <div className="mt-8 ml-48 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl">John Doe</h1>
                <Badge className="bg-gradient-to-r from-[#FFC857] to-[#FF9A56] text-white border-0">
                  Gold Member
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined Aug 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FFC857] text-[#FFC857]" />
                  <span>4.9 Rating</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white rounded-2xl"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? "Save Profile" : "Edit Profile"}
            </motion.button>
          </div>
        </div>

        <div className="mt-6">
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

        <div className="flex gap-8 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-3xl mb-1">1,284</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">48</p>
            <p className="text-sm text-muted-foreground">Connections</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">12</p>
            <p className="text-sm text-muted-foreground">Skills</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">23</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="w-full glass-panel rounded-2xl p-2 mb-6 grid grid-cols-4">
          <TabsTrigger value="skills" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="projects" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white">
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6C63FF] data-[state=active]:to-[#4A90E2] data-[state=active]:text-white">
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <GlassCard>
            <h3 className="mb-6">My Skills</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span>{skill.name}</span>
                      <Badge variant={skill.category === "Teaching" ? "default" : "outline"}>
                        {skill.category}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover>
                  <div className="flex items-start justify-between mb-4">
                    <h4>{project.title}</h4>
                    <Badge
                      variant={project.status === "Completed" ? "default" : "outline"}
                      className={project.status === "Completed" ? "bg-[#2ECC71] border-0" : ""}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="rounded-xl">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{project.date}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{review.from[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{review.from}</p>
                        <p className="text-sm text-muted-foreground">{review.skill}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FFC857] text-[#FFC857]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2 italic">"{review.text}"</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <GlassCard className={`border-2 ${
                  achievement.rarity === "Gold" ? "border-[#FFC857]" :
                  achievement.rarity === "Silver" ? "border-gray-400" :
                  "border-[#CD7F32]"
                }`}>
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      {achievement.icon}
                    </motion.div>
                    <Badge className={`mb-3 ${
                      achievement.rarity === "Gold" ? "bg-[#FFC857]" :
                      achievement.rarity === "Silver" ? "bg-gray-400" :
                      "bg-[#CD7F32]"
                    } text-white border-0`}>
                      {achievement.rarity}
                    </Badge>
                    <h4 className="mb-2">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Timeline */}
      <GlassCard className="mt-6">
        <h3 className="mb-6">Activity Timeline</h3>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === "achievement" ? "bg-gradient-to-br from-[#FFC857] to-[#FF9A56]" :
                  item.type === "project" ? "bg-gradient-to-br from-[#4A90E2] to-[#6C63FF]" :
                  item.type === "skill" ? "bg-gradient-to-br from-[#6C63FF] to-[#A855F7]" :
                  "bg-gradient-to-br from-[#2ECC71] to-[#27AE60]"
                } text-white`}>
                  {item.type === "achievement" && <Award className="w-5 h-5" />}
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
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
