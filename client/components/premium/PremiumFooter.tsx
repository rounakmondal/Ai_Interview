import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const MotionLink = motion(Link);
const ease = [0.22, 1, 0.36, 1] as const;

export default function PremiumFooter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });

  const wrap = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  const linkWrap = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const linkItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  };

  return (
    <motion.footer
      ref={ref}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursor({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        });
      }}
      onMouseLeave={() => setCursor((c) => ({ ...c, active: false }))}
      className={`relative pt-24 pb-16 overflow-hidden transition-colors ${
        isDark ? "bg-slate-950" : "bg-white"
      }`}
      initial={{ backdropFilter: "blur(0px)" }}
      animate={inView ? { backdropFilter: "blur(12px)" } : {}}
      transition={{ duration: 0.8, ease }}
    >
      {/* Floating gradient mesh */}
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 20%, rgba(99,102,241,0.18), transparent 60%)," +
            "radial-gradient(50% 50% at 80% 30%, rgba(56,189,248,0.12), transparent 60%)," +
            "radial-gradient(55% 55% at 60% 80%, rgba(168,85,247,0.12), transparent 60%)",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Cursor glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: cursor.active ? 1 : 0 }}
        transition={{ duration: 0.4, ease }}
        style={{
          background: `radial-gradient(240px 240px at ${cursor.x}px ${cursor.y}px, rgba(99,102,241,0.18), transparent 60%)`,
        }}
      />

      {/* Divider */}
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease }}
        style={{
          transformOrigin: "left",
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 container max-w-7xl">
        <motion.div variants={wrap} initial="hidden" animate={inView ? "show" : "hidden"}>
          <div className="grid gap-12 md:grid-cols-6 lg:grid-cols-12">
            {/* Brand */}
            <motion.div variants={item} className="md:col-span-3 lg:col-span-4 space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="InterviewSathi" className="w-9 h-9 rounded-lg object-cover" />
                <span
                  className={`font-semibold text-lg ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  InterviewSathi
                </span>
              </Link>

              <p
                className={`text-sm max-w-xs ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Practice interviews with AI, get instant feedback, and improve with confidence.
              </p>

              <div className="flex gap-3 pt-2">
                <Link to="/setup">
                  <button className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition">
                    Get Started
                  </button>
                </Link>
                <Link to="#contact">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                      isDark
                        ? "border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                        : "border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    Contact
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Columns */}
            {[
              ["Product", ["Features", "Pricing", "Enterprise"]],
              ["Resources", ["Docs", "API", "Blog"]],
              ["Company", ["About", "Careers", "Contact"]],
              ["Legal", ["Privacy", "Terms", "Cookies"]],
            ].map(([title, links]) => (
              <motion.div
                key={title as string}
                variants={item}
                className="md:col-span-1 lg:col-span-2"
              >
                <h4
                  className={`text-xs font-semibold uppercase tracking-wide mb-4 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {title}
                </h4>
                <motion.ul variants={linkWrap} className="space-y-2">
                  {(links as string[]).map((l) => (
                    <motion.li key={l} variants={linkItem}>
                      <Link
                        to="#"
                        className={`text-sm transition ${
                          isDark
                            ? "text-slate-400 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {l}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom */}
          <motion.div
            variants={item}
            className={`mt-16 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <span className="text-xs text-slate-500">
              © {new Date().getFullYear()} InterviewSathi
            </span>

            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={`transition ${
                    isDark
                      ? "text-slate-500 hover:text-slate-300"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
