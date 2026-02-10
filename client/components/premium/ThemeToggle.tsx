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
      className="relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Premium pill-shaped toggle */}
      <div className="relative w-[68px] h-[34px] rounded-full overflow-hidden">
        {/* Track background with smooth color transition */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            backgroundColor: isDark
              ? "rgba(30, 41, 59, 0.95)" // Dark: deep slate (night feel)
              : "rgba(241, 245, 249, 0.95)", // Light: soft gray-white
            boxShadow: isDark
              ? "inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.15)"
              : "inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.06)",
          }}
          transition={{ duration: 0.4, ease: smoothEase }}
        />

        {/* Subtle inner glow for depth */}
        <motion.div
          className="absolute inset-[2px] rounded-full pointer-events-none"
          animate={{
            background: isDark
              ? "linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 50%)"
              : "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, transparent 50%)",
          }}
          transition={{ duration: 0.4, ease: smoothEase }}
        />

        {/* Stars/dots for night sky effect (dark mode only) */}
        <AnimatePresence>
          {isDark && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="absolute w-1 h-1 rounded-full bg-white/30 top-[8px] left-[12px]" />
              <div className="absolute w-0.5 h-0.5 rounded-full bg-white/20 top-[18px] left-[8px]" />
              <div className="absolute w-0.5 h-0.5 rounded-full bg-white/25 top-[12px] left-[20px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle knob */}
        <motion.div
          className="absolute top-[3px] w-[28px] h-[28px] rounded-full flex items-center justify-center"
          animate={{
            left: isDark ? "37px" : "3px",
            backgroundColor: isDark
              ? "rgba(51, 65, 85, 1)" // Dark knob: charcoal
              : "rgba(255, 255, 255, 1)", // Light knob: pure white
            boxShadow: isDark
              ? "0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(139, 92, 246, 0.2), inset 0 1px 1px rgba(99, 102, 241, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
          transition={{
            type: "tween",
            duration: 0.35,
            ease: smoothEase,
          }}
        >
          {/* Icon container with cross-fade */}
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                transition={{ duration: 0.25, ease: smoothEase }}
              >
                <Moon className="w-[15px] h-[15px] text-violet-400" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -30, scale: 0.8 }}
                transition={{ duration: 0.25, ease: smoothEase }}
              >
                <Sun className="w-[15px] h-[15px] text-amber-500" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          animate={{
            boxShadow: isDark
              ? "0 0 16px rgba(139, 92, 246, 0.3)"
              : "0 0 16px rgba(251, 191, 36, 0.25)",
          }}
          transition={{ duration: 0.2 }}
          style={{ opacity: 0 }}
        />
      </div>

      {/* Outer hover glow ring */}
      <motion.div
        className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        animate={{
          background: isDark
            ? "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%)",
        }}
      />
    </motion.button>
  );
}
