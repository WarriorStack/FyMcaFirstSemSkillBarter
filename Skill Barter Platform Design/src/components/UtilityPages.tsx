import { motion } from "motion/react";
import { AlertCircle, Loader, Wrench, Home, ArrowLeft } from "lucide-react";
import { GradientButton } from "./GradientButton";

interface UtilityPageProps {
  onNavigate?: (page: string) => void;
}

export function NotFoundPage({ onNavigate }: UtilityPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#4A90E2]/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#FFC857]/20 to-[#6C63FF]/20 blur-3xl"
      />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-9xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] bg-clip-text text-transparent inline-block"
          >
            404
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl mb-4">Page Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
          </p>

          <div className="flex gap-4 justify-center">
            <GradientButton
              onClick={() => onNavigate?.("landing")}
              variant="primary"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </GradientButton>
            <GradientButton
              onClick={() => window.history.back()}
              variant="secondary"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </GradientButton>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12"
        >
          <div className="w-48 h-48 mx-auto rounded-3xl bg-gradient-to-br from-[#6C63FF]/20 to-[#4A90E2]/20 flex items-center justify-center">
            <AlertCircle className="w-24 h-24 text-[#4A90E2]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#4A90E2]/20 blur-3xl"
      />

      <div className="relative z-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] flex items-center justify-center animate-glow">
            <Loader className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl mb-4">Loading Skill Barter</h2>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted-foreground"
          >
            Preparing your collaborative experience...
          </motion.p>
        </motion.div>

        <motion.div
          className="flex gap-2 justify-center mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#4A90E2]"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#4A90E2]/20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-[#FFC857]/20 to-[#6C63FF]/20 blur-3xl"
      />

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-[#FFC857] to-[#FF9A56] flex items-center justify-center">
            <Wrench className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl mb-4">Under Maintenance</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're currently upgrading the platform to serve you better. We'll be back shortly!
          </p>

          <div className="glass-panel rounded-3xl p-8 mb-8">
            <h3 className="mb-4">Expected downtime</h3>
            <motion.div
              className="text-4xl bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] bg-clip-text text-transparent"
            >
              2 hours
            </motion.div>
          </div>

          <p className="text-muted-foreground mb-4">
            Follow us for updates:
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass-panel rounded-2xl hover:shadow-lg transition-all"
            >
              Twitter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass-panel rounded-2xl hover:shadow-lg transition-all"
            >
              Discord
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
