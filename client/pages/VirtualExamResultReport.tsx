import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Download, Share2, Trophy, AlertCircle, CheckCircle2,
  X, Target, TrendingUp, Brain, BookOpen, Zap, Award,
  BarChart3, PieChart as PieChartIcon, Clock, ChevronDown,
  MessageSquare, Lightbulb, AlertTriangle
} from "lucide-react";
import ProfileButton from "@/components/ProfileButton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────
type Language = "english" | "hindi" | "bengali";
type QuestionStatus = "not-attempted" | "attempted" | "correct" | "wrong" | "marked";

interface Question {
  id: string;
  questionNumber: number;
  text: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  subject?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

interface QuestionAttempt {
  questionId: string;
  userAnswer: string | number | null;
  status: QuestionStatus;
  timeTaken: number;
  isMarkedForReview: boolean;
}

interface TestResult {
  totalScore: number;
  totalMarks: number;
  accuracy: number;
  subjectWiseAnalysis: Array<{
    subject: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  difficultyAnalysis: Array<{
    difficulty: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  timeAnalysis: {
    averageTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
  };
  strengths: string[];
  weakAreas: string[];
  recommendations: string[];
}

interface LocationState {
  exam: string;
  subject: string;
  language: Language;
  attempts: QuestionAttempt[];
  questions: Question[];
  result: TestResult;
}

// ─── Main Component ────────────────────────────────────────────────
export default function VirtualExamResultReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const state = location.state as LocationState;

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { exam, subject, language, attempts, questions, result } = state;
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("performance");

  // ─── Calculated Stats ──────────────────────────────────────────────
  const stats = useMemo(() => {
    const correct = attempts.filter((a) => a.status === "correct").length;
    const wrong = attempts.filter((a) => a.status === "wrong").length;
    const attempted = attempts.filter((a) => a.userAnswer !== null).length;
    const notAttempted = attempts.filter((a) => a.userAnswer === null).length;

    return { correct, wrong, attempted, notAttempted, total: attempts.length };
  }, [attempts]);

  // ─── Language-based Tips ────────────────────────────────────────────
  const getTips = (
    lang: Language,
    weakAreas: string[]
  ): { tip: string; icon: React.ReactNode }[] => {
    const tips = {
      english: [
        {
          tip: "Read each question twice before selecting an answer.",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          tip: "Focus on weak areas: Practice mock tests daily.",
          icon: <Target className="w-4 h-4" />,
        },
        {
          tip: "Time management is key - allocate 2-3 minutes per question.",
          icon: <Clock className="w-4 h-4" />,
        },
        {
          tip: "Review previous year papers for pattern recognition.",
          icon: <TrendingUp className="w-4 h-4" />,
        },
      ],
      hindi: [
        {
          tip: "प्रत्येक प्रश्न को दो बार पढ़ें फिर उत्तर दें।",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          tip: "कमजोर विषयों पर रोज़ अभ्यास करें।",
          icon: <Target className="w-4 h-4" />,
        },
        {
          tip: "समय प्रबंधन करें - प्रति प्रश्न 2-3 मिनट।",
          icon: <Clock className="w-4 h-4" />,
        },
        {
          tip: "पिछले साल के प्रश्नपत्र देखें।",
          icon: <TrendingUp className="w-4 h-4" />,
        },
      ],
      bengali: [
        {
          tip: "প্রতিটি প্রশ্ন দুইবার পড়ুন।",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          tip: "দুর্বল বিষয়ে প্রতিদিন অনুশীলন করুন।",
          icon: <Target className="w-4 h-4" />,
        },
        {
          tip: "সময় ব্যবস্থাপনা করুন।",
          icon: <Clock className="w-4 h-4" />,
        },
        {
          tip: "গত বছরের প্রশ্নপত্র পর্যালোচনা করুন।",
          icon: <TrendingUp className="w-4 h-4" />,
        },
      ],
    };
    return tips[lang] || tips.english;
  };

  const tips = getTips(language, result.weakAreas);

  // ─── Export to PDF ─────────────────────────────────────────────────
  const exportToPDF = () => {
    toast({
      title: "Exporting",
      description: "Your result report is being generated...",
    });
    // Implementation: use @react-pdf/renderer or similar
  };

  // ─── Performance Data for Charts ────────────────────────────────────
  const subjectChartData = result.subjectWiseAnalysis.map((s) => ({
    name: s.subject,
    correct: s.correct,
    wrong: s.total - s.correct,
  }));

  const difficultyChartData = result.difficultyAnalysis.map((d) => ({
    name: d.difficulty,
    percentage: d.percentage,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-white text-xl">{exam} - {subject} Results</h1>
            <p className="text-xs text-slate-400">Test completed</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Score Card */}
        <ScoreCard result={result} stats={stats} />

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Subject-wise Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Subject-wise Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                />
                <Legend />
                <Bar dataKey="correct" stackId="a" fill="#10b981" />
                <Bar dataKey="wrong" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Difficulty Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              Difficulty-wise Accuracy
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultyChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {difficultyChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0 ? "#10b981" : index === 1 ? "#f59e0b" : "#ef4444"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Performance Matrix */}
        <PerformanceMatrix result={result} language={language} />

        {/* Tips and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TipsCard language={language} tips={tips} />
          <RecommendationsCard result={result} language={language} />
        </div>

        {/* Question Answer Detail */}
        <QuestionAnswerDetail 
          attempts={attempts}
          questions={questions}
          language={language}
        />
      </main>
    </div>
  );
}

// ─── Score Card Component ──────────────────────────────────────────
function ScoreCard({
  result,
  stats,
}: {
  result: TestResult;
  stats: { correct: number; wrong: number; attempted: number; notAttempted: number; total: number };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-lg p-8 mb-8"
    >
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
        <div className="text-center">
          <p className="text-slate-300 text-sm font-semibold">Score</p>
          <p className="text-4xl font-bold text-orange-400 mt-2">
            {result.totalScore}
          </p>
          <p className="text-slate-400 text-xs mt-1">/{result.totalMarks}</p>
        </div>

        <div className="text-center">
          <p className="text-slate-300 text-sm font-semibold">Accuracy</p>
          <p className="text-4xl font-bold text-emerald-400 mt-2">
            {result.accuracy}%
          </p>
          <p className="text-slate-400 text-xs mt-1">Success Rate</p>
        </div>

        <div className="text-center">
          <p className="text-slate-300 text-sm font-semibold">Correct</p>
          <p className="text-4xl font-bold text-emerald-500 mt-2">
            {stats.correct}
          </p>
          <p className="text-slate-400 text-xs mt-1">/{stats.total}</p>
        </div>

        <div className="text-center">
          <p className="text-slate-300 text-sm font-semibold">Wrong</p>
          <p className="text-4xl font-bold text-red-500 mt-2">
            {stats.wrong}
          </p>
          <p className="text-slate-400 text-xs mt-1">Incorrect</p>
        </div>

        <div className="text-center">
          <p className="text-slate-300 text-sm font-semibold">Skipped</p>
          <p className="text-4xl font-bold text-slate-400 mt-2">
            {stats.notAttempted}
          </p>
          <p className="text-slate-400 text-xs mt-1">Not Attempted</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Performance Matrix Component ─────────────────────────────────
function PerformanceMatrix({
  result,
  language,
}: {
  result: TestResult;
  language: Language;
}) {
  const getLabel = () => {
    const labels = {
      english: "Performance Matrix",
      hindi: "प्रदर्शन मैट्रिक्स",
      bengali: "কর্মক্ষমতা ম্যাট্রিক্স",
    };
    return labels[language] || "Performance Matrix";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6"
    >
      <h3 className="font-semibold text-white mb-6 flex items-center gap-2 text-lg">
        <Target className="w-5 h-5" />
        {getLabel()}
      </h3>

      {/* Subject-wise */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-300 mb-4">
          {language === "english"
            ? "Subject-wise Analysis"
            : language === "hindi"
              ? "विषय-वार विश्लेषण"
              : "বিষয় অনুযায়ী বিশ্লেষণ"}
        </h4>
        <div className="space-y-3">
          {result.subjectWiseAnalysis.map((s) => (
            <div key={s.subject} className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">{s.subject}</span>
              <div className="flex items-center gap-4 flex-1 ml-8">
                <div className="h-2 bg-slate-700 rounded-full flex-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentage}%` }}
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-500"
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  "text-sm font-bold w-12 text-right",
                  s.percentage >= 75
                    ? "text-emerald-400"
                    : s.percentage >= 50
                      ? "text-amber-400"
                      : "text-red-400"
                )}
              >
                {s.percentage}%
              </span>
              <span className="text-xs text-slate-400 w-12 text-right">
                {s.correct}/{s.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty-wise */}
      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-4">
          {language === "english"
            ? "Difficulty-wise Analysis"
            : language === "hindi"
              ? "कठिनाई-वार विश्लेषण"
              : "কঠিনতা অনুযায়ী বিশ্লেষণ"}
        </h4>
        <div className="space-y-3">
          {result.difficultyAnalysis.map((d) => (
            <div key={d.difficulty} className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">{d.difficulty}</span>
              <div className="flex items-center gap-4 flex-1 ml-8">
                <div className="h-2 bg-slate-700 rounded-full flex-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.percentage}%` }}
                    className={cn(
                      "h-full",
                      d.difficulty === "Easy"
                        ? "bg-emerald-500"
                        : d.difficulty === "Medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    )}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              <span
                className={cn(
                  "text-sm font-bold w-12 text-right",
                  d.percentage >= 75
                    ? "text-emerald-400"
                    : d.percentage >= 50
                      ? "text-amber-400"
                      : "text-red-400"
                )}
              >
                {d.percentage}%
              </span>
              <span className="text-xs text-slate-400 w-12 text-right">
                {d.correct}/{d.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tips Card Component ────────────────────────────────────────────
function TipsCard({
  language,
  tips,
}: {
  language: Language;
  tips: { tip: string; icon: React.ReactNode }[];
}) {
  const getTitle = () => {
    const titles = {
      english: "Expert Tips for Success",
      hindi: "सफलता के लिए विशेषज्ञ सुझाव",
      bengali: "সাফল্যের জন্য বিশেষজ্ঞ পরামর্শ",
    };
    return titles[language] || "Expert Tips for Success";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6"
    >
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        {getTitle()}
      </h3>
      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <div key={idx} className="flex gap-3 p-3 bg-slate-700/50 rounded-lg">
            <div className="text-orange-400 flex-shrink-0">{tip.icon}</div>
            <p className="text-sm text-slate-300">{tip.tip}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Recommendations Card Component ──────────────────────────────
function RecommendationsCard({
  result,
  language,
}: {
  result: TestResult;
  language: Language;
}) {
  const getTitle = () => {
    const titles = {
      english: "Focus Areas",
      hindi: "ध्यान केंद्रित करने के क्षेत्र",
      bengali: "মনোনিবেশের ক্ষেত্রসমূহ",
    };
    return titles[language] || "Focus Areas";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6"
    >
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        {getTitle()}
      </h3>
      <div className="space-y-3">
        {result.weakAreas.map((area, idx) => (
          <div key={idx} className="flex gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">{area}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Question Answer Detail Component ──────────────────────────────
function QuestionAnswerDetail({
  attempts,
  questions,
  language,
}: {
  attempts: QuestionAttempt[];
  questions: Question[];
  language: Language;
}) {
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  const getTitle = () => {
    const titles = {
      english: "Question Answer Analysis",
      hindi: "प्रश्न उत्तर विश्लेषण",
      bengali: "প্রশ্ন উত্তর বিশ্লেষণ",
    };
    return titles[language] || "Question Answer Analysis";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6"
    >
      <h3 className="font-semibold text-white mb-6 flex items-center gap-2 text-lg">
        <MessageSquare className="w-5 h-5" />
        {getTitle()}
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {questions.slice(0, 50).map((question, idx) => {
          const attempt = attempts[idx];
          const isCorrect = attempt?.status === "correct";

          return (
            <div
              key={question.id}
              className="border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition"
            >
              <button
                onClick={() =>
                  setExpandedQId(expandedQId === question.id ? null : question.id)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">
                      Q{idx + 1}: {question.text.substring(0, 60)}...
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {question.subject} • {question.difficulty}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-400 transition",
                    expandedQId === question.id && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {expandedQId === question.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="border-t border-slate-700 bg-slate-900/50 p-4 space-y-3"
                  >
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Your Answer:</p>
                      <p className="text-sm font-semibold text-white">
                        {attempt?.userAnswer !== null
                          ? attempt?.userAnswer
                          : "Not Attempted"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Correct Answer:</p>
                      <p className="text-sm font-semibold text-emerald-400">
                        {question.correctAnswer}
                      </p>
                    </div>
                    {question.explanation && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Explanation:</p>
                        <p className="text-sm text-slate-300">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
