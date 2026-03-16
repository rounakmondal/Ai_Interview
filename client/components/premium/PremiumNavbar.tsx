import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";

export default function PremiumNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to the "How It Works" section, navigating to home first if needed
  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const scrollToSection = () => {
      const el = document.getElementById("how-it-works");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation + render before scrolling
      setTimeout(scrollToSection, 400);
    } else {
      scrollToSection();
    }
  };

  const navItems = [
    { label: "How It Works", href: "#how-it-works", onClick: handleHowItWorksClick },
    { label: "Govt Practice", href: "/govt-practice", isRoute: true },
    { label: "AI Chat", href: "/chatbot", isRoute: true },
    { label: "Study", href: "/study-with-me", isRoute: true },
    { label: "About", href: "/about", isRoute: true },
  ];

  const smoothEase = [0.25, 0.1, 0.25, 1] as const;

  return (
    <>
      {/* Navbar Container */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"
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
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20"
              >
                AI
              </motion.div>
              <span
                className={`font-semibold text-[15px] hidden sm:inline tracking-tight transition-colors duration-300 ${isDark ? "text-white/95" : "text-slate-900"
                  }`}
              >
                InterviewAI
              </span>
            </Link>

            {/* Center Section - Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, idx) => (
                item.isRoute ? (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05, duration: 0.4, ease: smoothEase }}
                  >
                    <Link
                      to={item.href}
                      className={`relative px-4 py-2 text-[14px] font-medium transition-colors duration-200 group ${isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      {item.label}
                      <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-indigo-400 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={idx}
                    href={item.href}
                    onClick={item.onClick}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05, duration: 0.4, ease: smoothEase }}
                    className={`relative px-4 py-2 text-[14px] font-medium transition-colors duration-200 group cursor-pointer ${isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    {item.label}
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-indigo-400 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </motion.a>
                )
              ))}
            </div>

            {/* Right Section - Auth */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Get Started Button */}
              <Link to="/setup">
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4, ease: smoothEase }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group px-5 py-2.5 rounded-full text-[14px] font-semibold text-white overflow-hidden"
                >
                  {/* Button background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300" />

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Glow shadow on hover */}
                  <div className="absolute -inset-1 bg-indigo-500/30 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10" />

                  <span className="relative flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
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
              className={`fixed top-24 left-4 right-4 backdrop-blur-xl border rounded-2xl z-50 md:hidden shadow-2xl overflow-hidden ${isDark
                ? "bg-slate-900/98 border-white/10 shadow-black/20"
                : "bg-white/98 border-slate-200 shadow-slate-200/50"
                }`}
            >
              <div className="p-4 space-y-1">
                {navItems.map((item, idx) => (
                  item.isRoute ? (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`block px-4 py-3 text-[15px] font-medium rounded-lg transition-colors duration-200 ${isDark
                          ? "text-white/80 hover:text-white hover:bg-white/5"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.a
                      key={idx}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={item.onClick ?? (() => setIsMobileOpen(false))}
                      className={`block px-4 py-3 text-[15px] font-medium rounded-lg transition-colors duration-200 cursor-pointer ${isDark
                        ? "text-white/80 hover:text-white hover:bg-white/5"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                      {item.label}
                    </motion.a>
                  )
                ))}
              </div>

              <div className={`p-4 pt-2 border-t ${isDark ? "border-white/10" : "border-slate-200"}`}>
                <motion.a
                  href="#features"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setIsMobileOpen(false)}
                  className={`block px-4 py-3 text-[15px] font-medium rounded-lg transition-colors duration-200 mb-2 ${isDark
                    ? "text-white/60 hover:text-white hover:bg-white/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                >
                  Sign In
                </motion.a>

                <Link to="/setup" onClick={() => setIsMobileOpen(false)}>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
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
