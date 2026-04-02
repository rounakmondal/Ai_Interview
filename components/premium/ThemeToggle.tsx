import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

// Smooth easing - no bounce
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: smoothEase }}
      className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Outer hover glow ring */}
      <motion.div
        className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        animate={{
          background: isDark
            ? "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-[68px] h-[34px] rounded-full overflow-hidden">
        {/* Track background with the requested linear-gradient for Dark Mode */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: isDark
              ? "linear-gradient(90deg, #f97316, #ef4444)" // orange to red
              : "rgba(241, 245, 249, 1)",
            boxShadow: isDark
              ? "inset 0 2px 4px rgba(0, 0, 0, 0.2)"
              : "inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.06)",
          }}
          transition={{ duration: 0.4, ease: smoothEase }}
        />

        {/* Sliding Knob */}
        <motion.div
          className="absolute top-[3px] w-[28px] h-[28px] rounded-full flex items-center justify-center z-10"
          animate={{
            left: isDark ? "37px" : "3px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
          transition={{ type: "tween", duration: 0.35, ease: smoothEase }}
        >
          {/* Icons nested inside knob */}
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {/* Moon is now Red to match the sunset vibe */}
                <Moon className="w-[14px] h-[14px] text-red-600" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 30, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -30, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-[14px] h-[14px] text-orange-500" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Subtle Hover Shadow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}