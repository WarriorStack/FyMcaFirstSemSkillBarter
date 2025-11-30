import { motion } from "motion/react";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function GradientButton({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "",
  size = "md" 
}: GradientButtonProps) {
  const variants = {
    primary: "gradient-primary",
    secondary: "gradient-secondary",
    accent: "bg-gradient-to-r from-[#6C63FF] to-[#A855F7]"
  };
  
  const sizes = {
    sm: "px-4 py-2 rounded-xl",
    md: "px-6 py-3 rounded-2xl",
    lg: "px-8 py-4 rounded-2xl"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} text-white shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
}
