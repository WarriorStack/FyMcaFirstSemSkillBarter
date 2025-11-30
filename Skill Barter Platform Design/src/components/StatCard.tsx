import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="glass-panel rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="text-xs text-muted-foreground"
        >
          +12% this week
        </motion.span>
      </div>
      <h4 className="text-muted-foreground mb-2">{title}</h4>
      <p className="text-3xl">{value}</p>
    </motion.div>
  );
}
