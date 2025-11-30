import { motion } from "motion/react";
import { useState } from "react";
import { FloatingInput } from "./FloatingInput";
import { GradientButton } from "./GradientButton";
import { Github, Mail, Chrome, Eye, EyeOff } from "lucide-react";

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#6C63FF]/30 to-[#4A90E2]/30 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          rotate: [360, 180, 0],
          x: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#FFC857]/30 to-[#6C63FF]/30 blur-3xl"
      />

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full relative z-10">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col justify-center p-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] mb-8 flex items-center justify-center"
          >
            <span className="text-4xl text-white">SB</span>
          </motion.div>

          <h1 className="text-5xl mb-6">
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] bg-clip-text text-transparent">
              Skill Barter
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Connect with peers, exchange skills, and build your future together.
          </p>

          <div className="space-y-4">
            {["10,000+ Active Students", "500+ Skills Available", "4.9★ Average Rating"].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#4A90E2]" />
                <span className="text-muted-foreground">{stat}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="mb-8">
            <h2 className="text-4xl mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in to continue your journey" : "Start your skill exchange journey"}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-[#4A90E2] transition-all"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-[#4A90E2] transition-all"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </motion.button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <FloatingInput
                label="Full Name"
                value={name}
                onChange={setName}
                required
              />
            )}

            <FloatingInput
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              required
            />

            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-[#4A90E2] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <GradientButton className="w-full" size="lg">
              {isLogin ? "Sign In" : "Create Account"}
            </GradientButton>
          </form>

          <div className="mt-8 text-center">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            {" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#4A90E2] hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
