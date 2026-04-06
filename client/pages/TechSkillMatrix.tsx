import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Brain,
  Code2,
  Database,
  Globe,
  Layers,
  BarChart3,
  Target,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  Save,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  Zap,
} from "lucide-react";

// ── SEO ──────────────────────────────────────────────────────────────────────
function applyPageSeo() {
  document.title =
    "Tech Interview Skill Matrix | Assess Your Strengths & Weaknesses | MedhaHub";
  const meta = document.querySelector('meta[name="description"]');
  const content =
    "Self-assess your tech interview readiness across DSA, System Design, Web Dev, DBMS, OOP, Aptitude & more. Get a personalized skill matrix with improvement recommendations.";
  if (meta) {
    meta.setAttribute("content", content);
  } else {
    const m = document.createElement("meta");
    m.name = "description";
    m.content = content;
    document.head.appendChild(m);
  }
}

// ── Skill Definitions ────────────────────────────────────────────────────────

export interface SkillArea {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  color: string; // tailwind bg-* for the bar
  description: string;
  subSkills: string[];
  resources: { label: string; tip: string }[];
  companyRelevance: string[]; // which company types value this most
}

const SKILL_AREAS: SkillArea[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    icon: Code2,
    color: "bg-blue-500",
    description:
      "Arrays, Linked Lists, Trees, Graphs, Sorting, Searching, Dynamic Programming, Recursion, Greedy algorithms.",
    subSkills: [
      "Arrays & Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Trees & BST",
      "Graphs & BFS/DFS",
      "Dynamic Programming",
      "Sorting & Searching",
      "Recursion & Backtracking",
    ],
    resources: [
      { label: "LeetCode 75 Study Plan", tip: "Start with Easy → Medium pattern" },
      { label: "Striver's A2Z DSA Sheet", tip: "Comprehensive coverage with video explanations" },
      { label: "NeetCode Roadmap", tip: "Pattern-based approach — group by topic" },
    ],
    companyRelevance: ["Google", "Amazon", "Microsoft", "Meta", "Flipkart", "Zoho", "Samsung"],
  },
  {
    id: "system-design",
    name: "System Design",
    shortName: "System Design",
    icon: Layers,
    color: "bg-orange-500",
    description:
      "Scalability, Load Balancers, Caching, Databases, Microservices, Message Queues, API Design.",
    subSkills: [
      "Scalability Basics",
      "Load Balancing",
      "Caching (Redis, CDN)",
      "Database Sharding",
      "Microservices Architecture",
      "Message Queues (Kafka, RabbitMQ)",
      "API Design (REST/GraphQL)",
      "CAP Theorem & Consistency",
    ],
    resources: [
      { label: "System Design Primer (GitHub)", tip: "Start here for fundamentals" },
      { label: "Grokking System Design", tip: "Great for structured learning" },
      { label: "Alex Xu's System Design Interview Vol 1 & 2", tip: "Industry-standard reference" },
    ],
    companyRelevance: ["Google", "Amazon", "Microsoft", "Uber", "Flipkart", "Razorpay", "PhonePe"],
  },
  {
    id: "web-dev",
    name: "Web Development",
    shortName: "Web Dev",
    icon: Globe,
    color: "bg-emerald-500",
    description:
      "HTML/CSS, JavaScript, React/Angular, Node.js, REST APIs, Authentication, State Management.",
    subSkills: [
      "HTML5 & CSS3",
      "JavaScript (ES6+)",
      "React / Angular / Vue",
      "Node.js & Express",
      "REST API Design",
      "Authentication & Security",
      "State Management",
      "Performance Optimization",
    ],
    resources: [
      { label: "Frontend Masters Courses", tip: "Deep-dive into JS & React" },
      { label: "MDN Web Docs", tip: "Authoritative HTML/CSS/JS reference" },
      { label: "Full Stack Open (Helsinki)", tip: "Free, project-based full-stack course" },
    ],
    companyRelevance: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Atlassian", "Swiggy"],
  },
  {
    id: "dbms",
    name: "Database & SQL",
    shortName: "DBMS",
    icon: Database,
    color: "bg-amber-500",
    description:
      "SQL queries, Normalization, Indexing, Transactions, NoSQL vs SQL, ER Diagrams, Joins, Aggregations.",
    subSkills: [
      "SQL Queries & Joins",
      "Normalization (1NF–BCNF)",
      "Indexing & Query Optimization",
      "Transactions & ACID",
      "ER Diagrams",
      "NoSQL (MongoDB, Redis)",
      "Stored Procedures & Triggers",
      "Database Design Patterns",
    ],
    resources: [
      { label: "SQLZoo & LeetCode SQL", tip: "Practice writing queries daily" },
      { label: "Database System Concepts (Silberschatz)", tip: "Academic reference for theory" },
      { label: "Use The Index, Luke", tip: "Master indexing & query performance" },
    ],
    companyRelevance: ["Oracle", "IBM", "TCS", "Infosys", "Deloitte", "JPMorgan", "Goldman Sachs"],
  },
  {
    id: "oop",
    name: "OOP & Design Patterns",
    shortName: "OOP",
    icon: Brain,
    color: "bg-pink-500",
    description:
      "Encapsulation, Inheritance, Polymorphism, Abstraction, SOLID principles, Design Patterns, UML.",
    subSkills: [
      "Four Pillars (Encapsulation, Inheritance, Polymorphism, Abstraction)",
      "SOLID Principles",
      "Creational Patterns (Singleton, Factory, Builder)",
      "Structural Patterns (Adapter, Decorator, Proxy)",
      "Behavioral Patterns (Observer, Strategy, Command)",
      "UML Diagrams",
      "Clean Code Practices",
      "Dependency Injection",
    ],
    resources: [
      { label: "Head First Design Patterns", tip: "Best visual introduction to patterns" },
      { label: "Refactoring.Guru", tip: "Interactive examples of all GoF patterns" },
      { label: "Clean Code by Robert C. Martin", tip: "Write maintainable, readable code" },
    ],
    companyRelevance: ["TCS", "Wipro", "Capgemini", "HCL", "Cognizant", "Tech Mahindra", "Adobe"],
  },
  {
    id: "os-networking",
    name: "OS & Networking",
    shortName: "OS & Networks",
    icon: Layers,
    color: "bg-cyan-500",
    description:
      "Process Management, Threading, Memory, Deadlocks, TCP/IP, HTTP, DNS, OSI Model.",
    subSkills: [
      "Process & Thread Management",
      "CPU Scheduling Algorithms",
      "Memory Management & Virtual Memory",
      "Deadlocks & Synchronization",
      "TCP/IP & UDP",
      "HTTP/HTTPS & DNS",
      "OSI & TCP/IP Model",
      "Socket Programming Basics",
    ],
    resources: [
      { label: "Operating System Concepts (Galvin)", tip: "Standard textbook - focus on Ch 1-8" },
      { label: "Computer Networking: A Top-Down Approach", tip: "Kurose & Ross — great for interviews" },
      { label: "Neso Academy (YouTube)", tip: "Quick revision of OS & CN concepts" },
    ],
    companyRelevance: ["Google", "Amazon", "Samsung", "Oracle", "IBM", "Microsoft", "Cisco"],
  },
  {
    id: "aptitude",
    name: "Aptitude & Reasoning",
    shortName: "Aptitude",
    icon: BarChart3,
    color: "bg-orange-500",
    description:
      "Quantitative Aptitude, Logical Reasoning, Verbal Ability, Probability, Number Systems.",
    subSkills: [
      "Number Systems & HCF/LCM",
      "Percentages & Profit/Loss",
      "Time, Speed & Distance",
      "Probability & Permutations",
      "Logical Reasoning (Puzzles)",
      "Data Interpretation",
      "Verbal Ability & Grammar",
      "Blood Relations & Coding-Decoding",
    ],
    resources: [
      { label: "RS Aggarwal Quantitative Aptitude", tip: "Classic for aptitude fundamentals" },
      { label: "IndiaBIX.com", tip: "Free online aptitude practice with solutions" },
      { label: "PrepInsta", tip: "Company-specific aptitude question sets" },
    ],
    companyRelevance: ["TCS", "Infosys", "Wipro", "Capgemini", "Accenture", "Cognizant", "HCL"],
  },
  {
    id: "behavioral",
    name: "HR & Behavioral",
    shortName: "HR / Soft Skills",
    icon: Target,
    color: "bg-rose-500",
    description:
      "Tell Me About Yourself, Strengths/Weaknesses, Teamwork, Conflict Resolution, Leadership, STAR Method.",
    subSkills: [
      "Self Introduction (Tell Me About Yourself)",
      "Strengths & Weaknesses",
      "STAR Method Answers",
      "Teamwork & Collaboration",
      "Conflict Resolution",
      "Leadership Examples",
      "Why This Company?",
      "Salary Negotiation",
    ],
    resources: [
      { label: "STAR Method Practice", tip: "Structure every behavioral answer as Situation→Task→Action→Result" },
      { label: "Glassdoor HR Questions", tip: "Company-specific HR question banks" },
      { label: "Mock Interviews (MedhaHub)", tip: "Practice with AI interviewer for real-time feedback" },
    ],
    companyRelevance: ["All Companies"],
  },
];

// ── Scoring helpers ──────────────────────────────────────────────────────────

type SkillLevel = 0 | 1 | 2 | 3 | 4 | 5;

const LEVEL_LABELS: Record<SkillLevel, { label: string; emoji: string; color: string }> = {
  0: { label: "Not Started", emoji: "⬜", color: "text-muted-foreground" },
  1: { label: "Beginner", emoji: "🟥", color: "text-red-500" },
  2: { label: "Basic", emoji: "🟧", color: "text-orange-500" },
  3: { label: "Intermediate", emoji: "🟨", color: "text-yellow-500" },
  4: { label: "Advanced", emoji: "🟩", color: "text-emerald-500" },
  5: { label: "Expert", emoji: "🟦", color: "text-blue-500" },
};

function getOverallReadiness(scores: Record<string, SkillLevel>): {
  percentage: number;
  label: string;
  color: string;
} {
  const values = Object.values(scores);
  if (values.length === 0) return { percentage: 0, label: "Not Assessed", color: "text-muted-foreground" };
  const avg = values.reduce((a, b) => a + b, 0) / (values.length * 5);
  const pct = Math.round(avg * 100);
  if (pct >= 80) return { percentage: pct, label: "Interview Ready", color: "text-emerald-500" };
  if (pct >= 60) return { percentage: pct, label: "Good Progress", color: "text-blue-500" };
  if (pct >= 40) return { percentage: pct, label: "Needs Work", color: "text-yellow-500" };
  if (pct >= 20) return { percentage: pct, label: "Getting Started", color: "text-orange-500" };
  return { percentage: pct, label: "Just Beginning", color: "text-red-500" };
}

function getWeakAreas(scores: Record<string, SkillLevel>): SkillArea[] {
  return SKILL_AREAS.filter((s) => (scores[s.id] ?? 0) <= 2).sort(
    (a, b) => (scores[a.id] ?? 0) - (scores[b.id] ?? 0)
  );
}

function getStrongAreas(scores: Record<string, SkillLevel>): SkillArea[] {
  return SKILL_AREAS.filter((s) => (scores[s.id] ?? 0) >= 4).sort(
    (a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0)
  );
}

// ── localStorage persistence ─────────────────────────────────────────────────

const STORAGE_KEY = "medhahub_skill_matrix";
const API_BASE = import.meta.env.VITE_API_URL || "/api";

function loadScores(): Record<string, SkillLevel> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveScoresLocal(scores: Record<string, SkillLevel>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

// ── API helpers (server-side persistence) ────────────────────────────────────

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

async function fetchScoresFromServer(): Promise<Record<string, SkillLevel> | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/skill-matrix`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.scores ?? null;
  } catch {
    return null;
  }
}

async function saveScoresToServer(scores: Record<string, SkillLevel>): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/skill-matrix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ scores }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchSkillPractice(
  skillId: string
): Promise<SkillPracticeResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/skill-matrix/practice/${skillId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export interface SkillPracticeQuestion {
  id: number;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface SkillPracticeResponse {
  success: boolean;
  skillId: string;
  skillName: string;
  totalQuestions: number;
  questions: SkillPracticeQuestion[];
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function TechSkillMatrix() {
  const [scores, setScores] = useState<Record<string, SkillLevel>>(loadScores);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    applyPageSeo();
    // Try to load scores from server (merge with localStorage)
    fetchScoresFromServer().then((serverScores) => {
      if (serverScores && Object.keys(serverScores).length > 0) {
        setScores((prev) => {
          const merged = { ...prev, ...serverScores };
          saveScoresLocal(merged);
          return merged;
        });
      }
    });
  }, []);

  const updateScore = useCallback((skillId: string, level: SkillLevel) => {
    setScores((prev) => {
      const next = { ...prev, [skillId]: level };
      saveScoresLocal(next);
      return next;
    });
    setSaved(false);
  }, []);

  const resetAll = useCallback(() => {
    setScores({});
    localStorage.removeItem(STORAGE_KEY);
    saveScoresToServer({});
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    saveScoresLocal(scores);
    setSyncing(true);
    const ok = await saveScoresToServer(scores);
    setSyncing(false);
    setSaved(true);
    if (!ok) {
      // Silently fallback — localStorage already saved
    }
    setTimeout(() => setSaved(false), 2000);
    setTimeout(() => setSaved(false), 2000);
  }, [scores]);

  const readiness = useMemo(() => getOverallReadiness(scores), [scores]);
  const weakAreas = useMemo(() => getWeakAreas(scores), [scores]);
  const strongAreas = useMemo(() => getStrongAreas(scores), [scores]);
  const assessed = Object.keys(scores).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/interview-questions">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Tech Interview Skill Matrix
              </h1>
              <p className="text-xs text-muted-foreground">
                Assess yourself • Find weak spots • Get recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={resetAll}
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1"
              onClick={handleSave}
              disabled={syncing}
            >
              {syncing ? (
                <>
                  <Save className="w-3 h-3 animate-spin" /> Syncing...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" /> Save
                </>
              )}
            </Button>
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Overall Readiness Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-red-500/10 to-emerald-500/10 border border-border/40 p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Overall Interview Readiness
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className={`text-4xl font-bold ${readiness.color}`}>
                  {readiness.percentage}%
                </span>
                <span className={`text-sm font-medium ${readiness.color}`}>
                  {readiness.label}
                </span>
              </div>
              <Progress
                value={readiness.percentage}
                className="h-2.5 bg-muted/50"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {assessed}/{SKILL_AREAS.length} areas assessed
                {weakAreas.length > 0 && (
                  <span>
                    {" "}
                    •{" "}
                    <span className="text-orange-500 font-medium">
                      {weakAreas.length} area{weakAreas.length > 1 ? "s" : ""} need
                      improvement
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Mini radar summary */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {SKILL_AREAS.slice(0, 8).map((skill) => {
                const val = scores[skill.id] ?? 0;
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.id}
                    className="flex flex-col items-center gap-0.5"
                    title={`${skill.shortName}: ${LEVEL_LABELS[val as SkillLevel].label}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                        val >= 4
                          ? skill.color
                          : val >= 2
                          ? "bg-muted-foreground/30"
                          : "bg-muted/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] text-muted-foreground text-center leading-tight">
                      {skill.shortName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Weak Areas Alert */}
        {weakAreas.length > 0 && assessed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-orange-600 dark:text-orange-400 mb-1">
                  Focus Areas — Priority Improvement Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {weakAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() =>
                        setExpandedId(expandedId === area.id ? null : area.id)
                      }
                      className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs font-medium hover:bg-orange-500/20 transition-colors"
                    >
                      {area.shortName} ({LEVEL_LABELS[(scores[area.id] ?? 0) as SkillLevel].label})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Strong Areas */}
        {strongAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 mb-1">
                  Your Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {strongAreas.map((area) => (
                    <span
                      key={area.id}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
                    >
                      {area.shortName} ({LEVEL_LABELS[(scores[area.id] ?? 0) as SkillLevel].label})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skill Assessment Cards */}
        <div className="space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Rate Your Skills
          </h2>
          <p className="text-xs text-muted-foreground mb-2">
            Honestly rate yourself from 0 (Not Started) to 5 (Expert) in each area. Click any card to see sub-skills & resources.
          </p>

          {SKILL_AREAS.map((skill, i) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              level={(scores[skill.id] ?? 0) as SkillLevel}
              onLevelChange={(lvl) => updateScore(skill.id, lvl)}
              expanded={expandedId === skill.id}
              onToggleExpand={() =>
                setExpandedId(expandedId === skill.id ? null : skill.id)
              }
              index={i}
            />
          ))}
        </div>

        {/* Recommended Study Plan */}
        {assessed >= 4 && weakAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-6"
          >
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-primary" />
              Personalized Study Priority
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your self-assessment, here's a suggested priority order for
              maximum interview readiness:
            </p>
            <div className="space-y-3">
              {weakAreas.map((area, idx) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-border/40"
                  >
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-lg ${area.color} flex items-center justify-center text-white`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{area.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Current:{" "}
                        <span className="font-medium">
                          {LEVEL_LABELS[(scores[area.id] ?? 0) as SkillLevel].label}
                        </span>{" "}
                        → Target: <span className="text-emerald-500 font-medium">Advanced</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Zap className="w-3 h-3 inline text-amber-500" />{" "}
                        {area.resources[0]?.tip}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CTA to practice */}
        <div className="text-center py-6">
          <Link to="/interview-questions">
            <Button className="gap-2">
              <BookOpen className="w-4 h-4" />
              Practice Company-Specific Questions
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

// ── Skill Card ───────────────────────────────────────────────────────────────

interface SkillCardProps {
  skill: SkillArea;
  level: SkillLevel;
  onLevelChange: (level: SkillLevel) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  index: number;
}

function SkillCard({
  skill,
  level,
  onLevelChange,
  expanded,
  onToggleExpand,
  index,
}: SkillCardProps) {
  const Icon = skill.icon;
  const info = LEVEL_LABELS[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="rounded-xl border border-border/60 bg-card overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`h-1 ${skill.color}`} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl ${skill.color} flex items-center justify-center text-white flex-shrink-0`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-sm">{skill.name}</h3>
              <button
                onClick={onToggleExpand}
                className="p-1 rounded-md hover:bg-muted/50 transition-colors"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {skill.description}
            </p>
          </div>
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-1.5 mb-2">
          {([0, 1, 2, 3, 4, 5] as SkillLevel[]).map((lvl) => {
            const active = level >= lvl && lvl > 0;
            const lvlInfo = LEVEL_LABELS[lvl];
            return (
              <button
                key={lvl}
                onClick={() => onLevelChange(lvl)}
                title={lvlInfo.label}
                className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all border ${
                  level === lvl
                    ? `${skill.color} text-white border-transparent shadow-sm`
                    : active
                    ? `${skill.color}/20 border-transparent`
                    : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Current level display */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${info.color}`}>
            {info.emoji} {info.label}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Valued by: {skill.companyRelevance.slice(0, 3).join(", ")}
            {skill.companyRelevance.length > 3 && " +more"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${skill.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(level / 5) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/30 pt-3 space-y-3">
              {/* Sub-skills */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Key Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skill.subSkills.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-1 rounded-md bg-muted/40 text-xs text-foreground/80"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Recommended Resources
                </h4>
                <div className="space-y-2">
                  {skill.resources.map((res) => (
                    <div
                      key={res.label}
                      className="flex items-start gap-2 text-xs"
                    >
                      <TrendingUp className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{res.label}</span>
                        <span className="text-muted-foreground"> — {res.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company relevance */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  High Relevance at
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skill.companyRelevance.map((company) => (
                    <span
                      key={company}
                      className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
