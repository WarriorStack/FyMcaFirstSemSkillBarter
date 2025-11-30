import { motion } from "motion/react";
import { useState } from "react";

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function FloatingInput({ 
  label, 
  type = "text", 
  value, 
  onChange,
  required = false 
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value;

  return (
    <div className="relative">
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-[#4A90E2] focus:outline-none transition-all duration-300"
        animate={{
          borderColor: isFocused ? "#4A90E2" : undefined,
        }}
      />
      <motion.label
        animate={{
          top: isFloating ? "-0.75rem" : "0.75rem",
          fontSize: isFloating ? "0.75rem" : "1rem",
          color: isFocused ? "#4A90E2" : "#6B7280",
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-4 px-2 bg-background pointer-events-none"
      >
        {label}
      </motion.label>
    </div>
  );
}
