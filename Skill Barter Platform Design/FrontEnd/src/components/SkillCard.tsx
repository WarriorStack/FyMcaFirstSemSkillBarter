// frontend/src/components/SkillCard.tsx
import { motion } from "motion/react";
import { Star, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

export interface SkillInstructor {
  id: number;
  name: string;
  avatar: string;
  rating: number | null;
  rating_count: number;
}

export interface SkillItem {
  id: number;
  name: string;
  category: string;
  description?: string;
  verified: boolean;
  instructor: SkillInstructor | null;
  students: number;
  duration: string;
  level: string;
  points: number;
}

interface SkillCardProps {
  skill: SkillItem;
  onConnect: () => void;
}

export function SkillCard({ skill, onConnect }: SkillCardProps) {
  const { instructor } = skill;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-panel rounded-3xl p-6 h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            {skill.category}
          </Badge>
          {skill.verified && (
            <Badge className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white border-0 rounded-full text-xs">
              Verified
            </Badge>
          )}
        </div>

        <h3 className="text-xl mb-2">{skill.name}</h3>
        {skill.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {skill.description}
          </p>
        )}

        {instructor && (
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-9 h-9">
              <AvatarImage src={instructor.avatar} />
              <AvatarFallback>
                {instructor.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{instructor.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-[#FFC857] text-[#FFC857]" />
                <span>
                  {typeof instructor.rating === "number"
                    ? instructor.rating.toFixed(1)
                    : "No rating"}
                </span>
                {instructor.rating_count > 0 && (
                  <span>({instructor.rating_count})</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-4">
          <div>
            <p className="font-medium text-foreground">{skill.level}</p>
            <p>Level</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{skill.duration}</p>
            <p>Duration</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{skill.points}</p>
            <p>Points</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{skill.students} learners</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
          className="px-4 py-2 rounded-2xl text-sm bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white"
        >
          Connect
        </motion.button>
      </div>
    </motion.div>
  );
}
