import { motion } from "motion/react";
import { Star, Users, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    category: string;
    instructor: {
      name: string;
      avatar: string;
      rating: number;
    };
    students: number;
    duration: string;
    level: string;
    points: number;
  };
  onConnect: () => void;
}

export function SkillCard({ skill, onConnect }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <Badge className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white border-0">
          {skill.category}
        </Badge>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 5 }}
          className="text-[#FFC857]"
        >
          <Star className="w-5 h-5 fill-current" />
        </motion.div>
      </div>

      <h3 className="mb-3">{skill.name}</h3>

      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={skill.instructor.avatar} />
          <AvatarFallback>{skill.instructor.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-foreground">{skill.instructor.name}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#FFC857] text-[#FFC857]" />
            <span className="text-xs text-muted-foreground">{skill.instructor.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{skill.students}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{skill.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="outline" className="rounded-xl">
          {skill.level}
        </Badge>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
          className="px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#6C63FF] text-white rounded-xl"
        >
          {skill.points} pts
        </motion.button>
      </div>
    </motion.div>
  );
}
