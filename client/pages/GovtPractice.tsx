import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  ArrowLeft,
  Zap,
  Clock,
  Target,
  BarChart3,
  Trophy,
  Shield,
  Train,
  Landmark,
  Building2,
} from "lucide-react";
import {
  ExamType,
  Subject,
  Difficulty,
  TestConfig,
  EXAM_LABELS,
  SUBJECT_LABELS,
  fetchQuestions,
} from "@/lib/govt-practice-data";

const examIcons: Record<ExamType, React.ReactNode> = {
  WBCS: <Landmark className="w-5 h-5" />,
  SSC: <Shield className="w-5 h-5" />,
  Railway: <Train className="w-5 h-5" />,
  Banking: <Building2 className="w-5 h-5" />,
  Police: <Shield className="w-5 h-5" />,
};

const difficultyColor: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const EXAM_OPTIONS: ExamType[] = ["WBCS", "SSC", "Railway", "Banking", "Police"];
const SUBJECT_OPTIONS: Subject[] = [
  "History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs",
];
const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Medium", "Hard"];
const COUNT_OPTIONS = [10, 25, 50, 100] as const;

export default function GovtPractice() {
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamType>("WBCS");
  const [subject, setSubject] = useState<Subject>("History");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [count, setCount] = useState<10 | 25 | 50 | 100>(25);
  const [language, setLanguage] = useState<"english" | "bengali">("english");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const config: TestConfig = { exam, subject, difficulty, count };
      const questions = await fetchQuestions(config);
      navigate("/govt-test", { state: { config, questions, language } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Government Exam Practice</span>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/prev-year-questions">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Previous Year
              </Button>
            </Link>
            <Link to="/current-affairs">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Current Affairs
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-10 max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5" />
            Government Exam Preparation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Configure Your Mock Test
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Practice WBCS, SSC, Railway, Banking, and Police exams with AI-generated questions in Bengali and English.
          </p>
        </div>

        {/* Config Card */}
        <Card className="p-6 sm:p-8 border-border/40 space-y-8">
          {/* Exam Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Exam Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXAM_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setExam(e)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    exam === e
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {examIcons[e]}
                  <span>{e}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pl-1">{EXAM_LABELS[exam]}</p>
          </div>

          {/* Subject */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Subject
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SUBJECT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                    subject === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {SUBJECT_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Difficulty Level
            </label>
            <div className="flex gap-3">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    difficulty === d
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${difficultyColor[d]}`}>
                    {d}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    count === n
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pl-1">
              Estimated time: ~{Math.round(count * 1.2)} minutes
            </p>
          </div>

          {/* Language preference */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Explanation Language
            </label>
            <div className="flex gap-3">
              {(["english", "bengali"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                    language === l
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {l === "english" ? "🇬🇧 English" : "🇮🇳 বাংলা"}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/40 rounded-xl p-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Test summary:</span>
            <Badge variant="outline">{exam}</Badge>
            <Badge variant="outline">{subject}</Badge>
            <Badge variant="outline" className={difficultyColor[difficulty]}>{difficulty}</Badge>
            <Badge variant="outline">{count} Questions</Badge>
            <Badge variant="outline">{language === "english" ? "English" : "বাংলা"}</Badge>
          </div>

          {/* Generate Button */}
          <Button
            size="lg"
            className="w-full gradient-primary text-base h-12 font-semibold"
            onClick={handleGenerate}
          >
            <Zap className="w-5 h-5 mr-2" />
            Generate Test
          </Button>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: "Previous Year Questions", icon: BookOpen, to: "/prev-year-questions", color: "text-blue-500" },
            { label: "Current Affairs", icon: Zap, to: "/current-affairs", color: "text-amber-500" },
            { label: "Leaderboard", icon: Trophy, to: "/leaderboard", color: "text-purple-500" },
          ].map((item) => (
            <Link key={item.to} to={item.to}>
              <Card className="p-4 text-center border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer h-full">
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                <p className="text-xs font-medium text-foreground leading-tight">{item.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
