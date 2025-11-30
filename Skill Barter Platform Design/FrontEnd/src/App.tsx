import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Pages
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { ProfilePage } from "./components/ProfilePage";
import { SkillExplorer } from "./components/SkillExplorer";
import PublicProfileView from "./components/PublicProfileView";
import { CollaborationBoard } from "./components/CollaborationBoard";
import { AdminPanel } from "./components/AdminPanel";
import Achievements from "./components/Achievements";

import {
  NotFoundPage,
  LoadingPage,
  MaintenancePage,
} from "./components/UtilityPages";

import { Toaster } from "./components/ui/sonner";

// App Page Types
type Page =
  | "landing"
  | "auth"
  | "dashboard"
  | "profile"
  | "public-profile"
  | "explore-skills"
  | "collaboration"
  | "achievements"
  | "admin"
  | "404"
  | "loading"
  | "maintenance";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [profileUserId, setProfileUserId] = useState<number | null>(null);
  const [explorePayload, setExplorePayload] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------
  // UNIVERSAL NAVIGATION HANDLER
  // -----------------------------
  const navigateTo = (page: Page, payload?: any) => {
    if (payload?.userId) {
      setProfileUserId(payload.userId);
    }

    if (page === "explore-skills") {
      setExplorePayload(payload || null);
    }

    setIsLoading(true);

    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  // -----------------------------
  // LOGIN REDIRECT LOGIC
  // -----------------------------
  const handleLogin = () => {
    const userType = localStorage.getItem("userType");

    if (userType === "admin") {
      return navigateTo("admin");
    }

    navigateTo("dashboard");
  };

  const handleGetStarted = () => navigateTo("auth");

  // -----------------------------
  // PAGE RENDERING LOGIC
  // -----------------------------
  const renderPage = () => {
    if (isLoading) return <LoadingPage />;

    const userType = localStorage.getItem("userType");

    switch (currentPage) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} />;

      case "auth":
        return <AuthPage onLogin={handleLogin} />;

      case "dashboard":
        return <Dashboard onNavigate={navigateTo} />;

      case "profile":
        return <ProfilePage userId={profileUserId} />;

      case "public-profile":
        return (
          <PublicProfileView userId={profileUserId} onNavigate={navigateTo} />
        );

      case "explore-skills":
        return (
          <SkillExplorer onNavigate={navigateTo} payload={explorePayload} />
        );

      case "collaboration":
        return <CollaborationBoard />;

      case "achievements":
        return <Achievements />;

      // -----------------------------
      // ADMIN AUTH CHECK
      // -----------------------------
      case "admin":
        if (userType !== "admin") {
          return (
            <NotFoundPage
              onNavigate={navigateTo}
              message="Unauthorized access — Admins only."
            />
          );
        }
        return <AdminPanel />;

      case "maintenance":
        return <MaintenancePage />;

      case "404":
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  // -----------------------------
  // QUICK NAVIGATION FLOAT MENU
  // -----------------------------
  const renderQuickNavigation = () => {
    if (currentPage === "landing" || currentPage === "auth") return null;

    const userType = localStorage.getItem("userType");

    const navItems = [
      { label: "Dashboard", page: "dashboard" as Page },
      { label: "My Profile", page: "profile" as Page },
      { label: "Explore", page: "explore-skills" as Page },
      { label: "Collaborate", page: "collaboration" as Page },
      { label: "Achievements", page: "achievements" as Page },
      ...(userType === "admin"
        ? [{ label: "Admin", page: "admin" as Page }]
        : []),
      { label: "Logout", page: "landing" as Page },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 right-8 z-50 glass-panel rounded-2xl p-4 shadow-2xl"
      >
        <p className="text-xs text-muted-foreground mb-3">Quick Navigation</p>

        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
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
    );
  };

  // -----------------------------
  // MAIN APP RENDER
  // -----------------------------
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

      {renderQuickNavigation()}

      <Toaster position="top-right" />
    </>
  );
}
