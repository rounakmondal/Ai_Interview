import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, User, BookOpen, Flame, Clock, ChevronRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";
import { isLoggedIn, getSession } from "@/lib/auth-api";
import { useNotificationCheck } from "@/hooks/use-notification-check";
import NotificationBell from "../NotificationBell";

const TODAYS_PAPERS = [
  { label: "WBCS Prelims 2023",    href: "/previous-year/wbcs-prelims-2023",     tag: "WBCS",       color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300" },
  { label: "WBP SI 2025",          href: "/previous-year/wbp-si-2025",           tag: "WB Police",  color: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300" },
  { label: "WBP Constable 2021",   href: "/previous-year/wbp-constable-2021",    tag: "WB Police",  color: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300" },
  { label: "WBPSC Clerkship 2024", href: "/previous-year/wbpsc-clerkship-2024",  tag: "WBPSC",      color: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300" },
  { label: "WB TET 2023",          href: "/previous-year/wb-tet-2023",           tag: "WB TET",     color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { label: "SSC MTS 2023",         href: "/previous-year/ssc-mts-2023",          tag: "SSC",        color: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" },
  { label: "IBPS PO Pre 2025",     href: "/previous-year/ibps-po-pre-2025",      tag: "Banking",    color: "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300" },
];

function TodaysPaperModal({ onClose }: { onClose: () => void }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", background: isDark ? "rgba(2,6,23,0.75)" : "rgba(15,23,42,0.45)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${isDark ? "bg-slate-900 border border-slate-700/60" : "bg-white border border-slate-200"}`}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <p className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? "text-orange-400" : "text-orange-500"}`}>
                    Recommended for Today
                  </p>
                </div>
                <h2 className={`text-xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Today's Practice Papers
                </h2>
                <p className={`text-[13px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{today}</p>
              </div>
              <button
                onClick={onClose}
                className={`mt-0.5 p-1.5 rounded-xl transition-colors ${isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className={`mx-6 h-px ${isDark ? "bg-slate-700/60" : "bg-slate-100"}`} />

          {/* Paper list */}
          <div className="px-3 py-3 space-y-1">
            {TODAYS_PAPERS.map((paper, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05 }}
              >
                <Link
                  to={paper.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-150 ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <BookOpen className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                    </div>
                    <span className={`text-[14px] font-medium ${isDark ? "text-slate-200 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>
                      {paper.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${paper.color}`}>{paper.tag}</span>
                    <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 flex items-center justify-between border-t ${isDark ? "border-slate-700/60" : "border-slate-100"}`}>
            <div className={`flex items-center gap-1.5 text-[12px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>7 papers updated daily</span>
            </div>
            <button
              onClick={onClose}
              className={`text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors ${isDark ? "bg-white/8 hover:bg-white/12 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = resolvedTheme === "dark";

  useNotificationCheck();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show modal once per session after full page load
  useEffect(() => {
    const shown = sessionStorage.getItem("todaysPaperModalShown");
    if (shown) return;
    const timer = setTimeout(() => {
      setShowPaperModal(true);
      sessionStorage.setItem("todaysPaperModalShown", "1");
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { label: t("dailyTasks"),   href: "/daily-tasks" },
    { label: t("govtPractice"), href: "/govt-practice" },
    { label: t("questionBank"), href: "/question-hub" },
    { label: "Tools",           href: "/tools" },
    { label: t("aiChat"),       href: "/chatbot" },
    { label: t("about"),        href: "/about" },
  ];

  const smoothEase = [0.25, 0.1, 0.25, 1] as const;

  return (
    <>
      {/* Today's Paper Modal */}
      {showPaperModal && <TodaysPaperModal onClose={() => setShowPaperModal(false)} />}

      {/* Navbar Container */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className={`fixed top-2 sm:top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"
          }`}
      >
        {/* Pill-shaped container */}
        <div
          className={`max-w-6xl mx-auto rounded-full px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isDark
            ? "bg-slate-900/95 border border-slate-700/50"
            : "bg-white/95 border border-slate-200/80"
            } ${isScrolled ? "shadow-lg" : "shadow-md"}`}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="h-14 sm:h-16 flex items-center justify-between">
            {/* Left Section - Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #1e1b4b, #3730a3)" }}
              >
                <svg viewBox="0 0 36 36" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 28 L4 8 L18 20 L32 8 L32 28 L28 28 L28 12 L18 22 L8 12 L8 28 Z" fill="white"/>
                  <circle cx="18" cy="6" r="3.5" fill="#fb923c"/>
                </svg>
              </motion.div>
              <span
                className={`font-semibold text-[15px] hidden sm:inline tracking-tight transition-colors duration-300 ${isDark ? "text-white/95" : "text-slate-900"
                  }`}
              >
                MedhaHub
              </span>
            </Link>

            {/* Center Section - Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05, duration: 0.4, ease: smoothEase }}
                >
                  <Link
                    to={item.href}
                    className={`relative px-4 py-2 text-[14px] font-medium transition-colors duration-200 group ${isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    {item.label}
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-orange-400 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section - Auth */}
            <div className="hidden md:flex items-center gap-3 border border-orange-400/40 px-3 py-1 rounded-full">
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* Language Toggle */}
              <LanguageToggle />
             
              {/* Theme Toggle */}
              <ThemeToggle />

              {isLoggedIn() ? (
                <Link to="/profile">
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4, ease: smoothEase }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group px-4 py-2.5 rounded-full text-[14px] font-semibold text-white overflow-hidden flex items-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {getSession()?.user.name.split(" ")[0] || t("profile")}
                    </span>
                  </motion.button>
                </Link>
              ) : (
                <Link to="/auth">
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4, ease: smoothEase }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group px-5 py-2.5 rounded-full text-[14px] font-semibold text-white overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute -inset-1 bg-orange-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
                    <span className="relative flex items-center gap-2">
                      {t("getStarted")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </span>
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <NotificationBell />
              <LanguageToggle />
              <ThemeToggle />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`p-2 rounded-lg border transition-colors duration-200 ${isDark
                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                  }`}
              >
                <AnimatePresence mode="wait">
                  {isMobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className={`fixed inset-0 backdrop-blur-sm z-40 md:hidden ${isDark ? "bg-slate-900/60" : "bg-slate-600/30"
                }`}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: smoothEase }}
              className={`fixed top-28 sm:top-32 left-4 right-4 backdrop-blur-xl border rounded-2xl z-50 md:hidden shadow-2xl overflow-hidden ${isDark
                ? "bg-slate-900/98 border-white/10 shadow-black/20"
                : "bg-white/98 border-slate-200 shadow-slate-200/50"
                }`}
            >
              <div className="p-4 space-y-1">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`block px-4 py-3 text-[15px] font-medium rounded-lg transition-colors duration-200 ${isDark ? "text-white/80 hover:text-white hover:bg-white/5" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className={`p-4 pt-2 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
                {isLoggedIn() ? (
                  <Link to="/profile" onClick={() => setIsMobileOpen(false)}>
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                      <User className="w-4 h-4" />
                      {getSession()?.user.name.split(" ")[0] || t("profile")}
                    </motion.button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMobileOpen(false)}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`block px-4 py-3 text-[15px] font-medium rounded-lg transition-colors duration-200 mb-2 text-center ${isDark
                          ? "text-white/60 hover:text-white hover:bg-white/5"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                      >
                        {t("signIn")}
                      </motion.div>
                    </Link>
                    <Link to="/setup" onClick={() => setIsMobileOpen(false)}>
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                      >
                        {t("getStarted")}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-20 sm:h-24" />
    </>
  );
}
