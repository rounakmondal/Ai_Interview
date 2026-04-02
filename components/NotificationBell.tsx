import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, BookOpen, FileText, ChevronRight } from "lucide-react";
import { useTheme } from "./premium/ThemeProvider";
import { hasPendingMockTest, getIncompleteTaskCount } from "@/lib/notification-service";
import { getDailyTasks } from "@/lib/daily-tasks";
import { isLoggedIn } from "@/lib/auth-api";

const STORAGE_KEY = "mock_paper_cache";

interface RecommendedQuestion {
  question: string;
  subject: string;
  topic: string;
}

function getRecommendedQuestions(): RecommendedQuestion[] {
  try {
    const keys = Object.keys(localStorage);
    const cacheKey = keys.find((k) => k.startsWith(STORAGE_KEY + "_"));
    if (!cacheKey) return [];
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return [];
    const cached = JSON.parse(raw);
    const questions = cached?.data?.questions ?? [];
    // Return 3 random questions as recommendations
    return questions
      .slice(0, 3)
      .map((q: any) => ({
        question: q.question,
        subject: q.subject ?? "General",
        topic: q.topic ?? "GK",
      }));
  } catch {
    return [];
  }
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [incompleteCount, setIncompleteCount] = useState(0);
  const [pendingMockTest, setPendingMockTest] = useState(false);
  const [incompleteTasks, setIncompleteTasks] = useState<{ label: string; id: string }[]>([]);
  const [recommendedQuestions, setRecommendedQuestions] = useState<RecommendedQuestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!isLoggedIn()) return;

    const refresh = () => {
      const count = getIncompleteTaskCount();
      const mockPending = hasPendingMockTest();
      const state = getDailyTasks();
      const tasks = state?.tasks.filter((t) => !t.completed).map((t) => ({ label: t.label, id: t.id })) ?? [];
      const questions = getRecommendedQuestions();

      setIncompleteCount(count);
      setPendingMockTest(mockPending);
      setIncompleteTasks(tasks);
      setRecommendedQuestions(questions);
    };

    refresh();
    const interval = setInterval(refresh, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn()) return null;

  const totalBadge = incompleteCount + (pendingMockTest ? 1 : 0);
  const hasNotifications = totalBadge > 0 || recommendedQuestions.length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={() => setIsOpen(true)}
        whileTap={{ scale: 0.92 }}
        className={`relative p-2 rounded-full transition-colors duration-200 ${isDark
          ? "text-white hover:text-white hover:bg-white/10"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
      >
        <Bell className="w-5 h-5" />
        {totalBadge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold"
          >
            {totalBadge}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            onMouseLeave={() => setIsOpen(false)}
            className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-[100] overflow-hidden ${isDark
              ? "bg-slate-900/98 border-white/10 shadow-black/40"
              : "bg-white border-slate-200 shadow-slate-200/60"
              }`}
            style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            {/* Header */}
            <div
              className={`px-4 py-3 flex items-center justify-between border-b ${isDark ? "border-white/10" : "border-slate-100"
                }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span className={`text-[13px] font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Notifications
                </span>
              </div>
              {totalBadge > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/15 text-red-500">
                  {totalBadge} pending
                </span>
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {/* Incomplete Daily Tasks */}
              {incompleteTasks.length > 0 && (
                <div className={`px-4 py-3 border-b ${isDark ? "border-white/5" : "border-slate-50"}`}>
                  <p className={`text-[11px] uppercase tracking-widest font-semibold mb-2 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    Daily Tasks
                  </p>
                  <div className="space-y-1.5">
                    {incompleteTasks.map((task) => (
                      <Link
                        to="/daily-tasks"
                        key={task.id}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors group ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                          }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <span className={`text-[13px] flex-1 truncate ${isDark ? "text-white/80" : "text-slate-700"}`}>
                          {task.label}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Mock Test */}
              {pendingMockTest && (
                <div className={`px-4 py-3 border-b ${isDark ? "border-white/5" : "border-slate-50"}`}>
                  <p className={`text-[11px] uppercase tracking-widest font-semibold mb-2 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    Mock Test
                  </p>
                  <Link
                    to="/mock-test"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors group ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                      }`}
                  >
                    <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-medium ${isDark ? "text-white/90" : "text-slate-800"}`}>
                        New paper available — 4 PM refresh
                      </p>
                      <p className={`text-[11px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                        Tap to take the test now
                      </p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                  </Link>
                </div>
              )}

              {/* Recommended Questions */}
              {recommendedQuestions.length > 0 && (
                <div className="px-4 py-3">
                  <p className={`text-[11px] uppercase tracking-widest font-semibold mb-2 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    Recommended Questions
                  </p>
                  <div className="space-y-1.5">
                    {recommendedQuestions.map((q, idx) => (
                      <Link
                        to="/mock-test"
                        key={idx}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-start gap-2.5 px-3 py-2 rounded-lg transition-colors group ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                          }`}
                      >
                        <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] leading-snug line-clamp-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                            {q.question}
                          </p>
                          <div className="flex gap-1.5 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isDark ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                              {q.subject}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isDark ? "bg-white/10 text-white/50" : "bg-slate-100 text-slate-500"}`}>
                              {q.topic}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!hasNotifications && (
                <div className="px-4 py-8 flex flex-col items-center gap-2">
                  <Bell className={`w-8 h-8 ${isDark ? "text-white/20" : "text-slate-300"}`} />
                  <p className={`text-[13px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-4 py-2.5 border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
              <Link
                to="/daily-tasks"
                onClick={() => setIsOpen(false)}
                className={`text-[12px] font-medium transition-colors ${isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
              >
                View all tasks →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
