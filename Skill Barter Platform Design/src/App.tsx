import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { ProfilePage } from "./components/ProfilePage";
import { SkillExplorer } from "./components/SkillExplorer";
import { CollaborationBoard } from "./components/CollaborationBoard";
import { AdminPanel } from "./components/AdminPanel";
import { NotFoundPage, LoadingPage, MaintenancePage } from "./components/UtilityPages";
import { Toaster } from "./components/ui/sonner";

type Page =
  | "landing"
  | "auth"
  | "dashboard"
  | "profile"
  | "explore-skills"
  | "collaboration"
  | "admin"
  | "404"
  | "loading"
  | "maintenance";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (page: Page) => {
    // Show loading state for page transitions
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  };

  const handleGetStarted = () => {
    navigateTo("auth");
  };

  const handleLogin = () => {
    navigateTo("dashboard");
  };

  const renderPage = () => {
    if (isLoading) {
      return <LoadingPage />;
    }

    switch (currentPage) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} />;
      case "auth":
        return <AuthPage onLogin={handleLogin} />;
      case "dashboard":
        return <Dashboard onNavigate={navigateTo} />;
      case "profile":
        return <ProfilePage />;
      case "explore-skills":
        return <SkillExplorer />;
      case "collaboration":
        return <CollaborationBoard />;
      case "admin":
        return <AdminPanel />;
      case "maintenance":
        return <MaintenancePage />;
      case "404":
        return <NotFoundPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Global Navigation Helper (Dev Mode) */}
      {currentPage !== "landing" && currentPage !== "auth" && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-50 glass-panel rounded-2xl p-4 shadow-2xl"
        >
          <p className="text-xs text-muted-foreground mb-3">Quick Navigation</p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Dashboard", page: "dashboard" as Page },
              { label: "Profile", page: "profile" as Page },
              { label: "Explore", page: "explore-skills" as Page },
              { label: "Collaborate", page: "collaboration" as Page },
              { label: "Admin", page: "admin" as Page },
              { label: "Logout", page: "landing" as Page },
            ].map((item) => (
              <motion.button
                key={item.page}
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo(item.page)}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  currentPage === item.page
                    ? "bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white"
                    : "hover:bg-muted"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <Toaster position="top-right" />
    </>
  );
}
