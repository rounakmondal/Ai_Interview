import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  Calculator,
  ArrowRightLeft,
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  GraduationCap,
  BookOpen,
} from "lucide-react";

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "CGPA to Percentage Calculator 2026 — CGPA ↔ Percentage ↔ SGPA Converter | MedhaHub";

  const desc = "Free CGPA to Percentage calculator. Convert CGPA to percentage, percentage to CGPA, and SGPA to CGPA instantly. Works for all universities — 10-point, 7-point, 5-point, 4-point grading scales. Perfect for job applications, higher studies & exam eligibility.";

  const kw = [
    "cgpa to percentage calculator", "cgpa to percentage", "percentage to cgpa",
    "sgpa to cgpa calculator", "cgpa calculator", "cgpa to percentage converter",
    "10 point cgpa to percentage", "7 point cgpa to percentage",
    "how to convert cgpa to percentage", "cgpa to marks",
    "university cgpa calculator", "gpa calculator india",
    "cgpa percentage formula", "cgpa to percentage for placement",
    "anna university cgpa calculator", "mumbai university cgpa calculator",
    "mdu cgpa to percentage", "ktu cgpa calculator",
    "vtu cgpa to percentage", "aktu cgpa calculator",
    "cbse cgpa to percentage", "ignou cgpa to percentage",
    "cgpa calculator online free", "semester gpa calculator",
  ].join(", ");

  const url = "https://medhahub.in/cgpa-calculator";

  function upsert(attr: "name" | "property", key: string, content: string) {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (el) el.content = content;
    else { el = document.createElement("meta"); el.setAttribute(attr, key); el.content = content; document.head.appendChild(el); }
  }

  upsert("name", "description", desc);
  upsert("name", "keywords", kw);
  upsert("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
  upsert("property", "og:type", "website");
  upsert("property", "og:url", url);
  upsert("property", "og:site_name", "MedhaHub");
  upsert("property", "og:title", "CGPA to Percentage Calculator — Free Online Converter | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "CGPA to Percentage Calculator 2026 | MedhaHub");
  upsert("name", "twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }
}

// ── Types ────────────────────────────────────────────────────────────────────

type Mode = "cgpa-to-pct" | "pct-to-cgpa" | "sgpa-to-cgpa";
type Scale = 10 | 7 | 5 | 4;

interface SemesterEntry {
  id: number;
  sgpa: string;
  credits: string;
}

const SCALE_MULTIPLIER: Record<Scale, number> = { 10: 9.5, 7: 14.28, 5: 20, 4: 25 };

// ── Component ────────────────────────────────────────────────────────────────

export default function CGPACalculator() {
  const [mode, setMode] = useState<Mode>("cgpa-to-pct");
  const [scale, setScale] = useState<Scale>(10);
  const [cgpaInput, setCgpaInput] = useState("");
  const [pctInput, setPctInput] = useState("");
  const [semesters, setSemesters] = useState<SemesterEntry[]>([
    { id: 1, sgpa: "", credits: "" },
    { id: 2, sgpa: "", credits: "" },
  ]);
  const [copied, setCopied] = useState(false);
  let nextId = semesters.length > 0 ? Math.max(...semesters.map((s) => s.id)) + 1 : 1;

  useEffect(() => { applySeo(); }, []);

  // ── Calculations ───────────────────────────────────────────────────────

  const cgpaToPercentage = (cgpa: number): number => cgpa * SCALE_MULTIPLIER[scale];
  const percentageToCgpa = (pct: number): number => pct / SCALE_MULTIPLIER[scale];

  const calculateSgpaToCgpa = (): number | null => {
    const valid = semesters.filter((s) => s.sgpa && s.credits);
    if (valid.length === 0) return null;
    const totalCredits = valid.reduce((sum, s) => sum + parseFloat(s.credits), 0);
    if (totalCredits === 0) return null;
    const weightedSum = valid.reduce((sum, s) => sum + parseFloat(s.sgpa) * parseFloat(s.credits), 0);
    return weightedSum / totalCredits;
  };

  const getResult = () => {
    if (mode === "cgpa-to-pct") {
      const v = parseFloat(cgpaInput);
      if (!cgpaInput || isNaN(v) || v < 0 || v > scale) return null;
      const pct = cgpaToPercentage(v);
      return { label: "Percentage", value: `${pct.toFixed(2)}%`, sub: `${v} CGPA × ${SCALE_MULTIPLIER[scale]} = ${pct.toFixed(2)}%` };
    }
    if (mode === "pct-to-cgpa") {
      const v = parseFloat(pctInput);
      if (!pctInput || isNaN(v) || v < 0 || v > 100) return null;
      const cgpa = percentageToCgpa(v);
      return { label: "CGPA", value: cgpa.toFixed(2), sub: `${v}% ÷ ${SCALE_MULTIPLIER[scale]} = ${cgpa.toFixed(2)} CGPA` };
    }
    const cgpa = calculateSgpaToCgpa();
    if (cgpa === null) return null;
    const pct = cgpaToPercentage(cgpa);
    return { label: "CGPA", value: cgpa.toFixed(2), sub: `Equivalent to ${pct.toFixed(2)}%` };
  };

  const result = getResult();

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.label}: ${result.value}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const resetAll = () => {
    setCgpaInput("");
    setPctInput("");
    setSemesters([{ id: 1, sgpa: "", credits: "" }, { id: 2, sgpa: "", credits: "" }]);
  };

  const addSemester = () => {
    setSemesters((prev) => [...prev, { id: nextId++, sgpa: "", credits: "" }]);
  };

  const removeSemester = (id: number) => {
    if (semesters.length <= 1) return;
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSemester = (id: number, field: "sgpa" | "credits", value: string) => {
    setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const MODES: { key: Mode; label: string; icon: React.ReactNode }[] = [
    { key: "cgpa-to-pct", label: "CGPA → %", icon: <Calculator className="w-4 h-4" /> },
    { key: "pct-to-cgpa", label: "% → CGPA", icon: <ArrowRightLeft className="w-4 h-4" /> },
    { key: "sgpa-to-cgpa", label: "SGPA → CGPA", icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                CGPA Calculator
              </h1>
              <p className="text-xs text-muted-foreground">CGPA ↔ Percentage ↔ SGPA Converter</p>
            </div>
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m.key ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>

        {/* Scale Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Grading Scale:</span>
          <div className="flex gap-2">
            {([10, 7, 5, 4] as Scale[]).map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${scale === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {s}-point
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/60 bg-card p-5 space-y-4"
        >
          {mode === "cgpa-to-pct" && (
            <div>
              <label className="text-sm font-medium mb-2 block">Enter your CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={scale}
                value={cgpaInput}
                onChange={(e) => setCgpaInput(e.target.value)}
                placeholder={`Enter CGPA (0 - ${scale})`}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <p className="text-xs text-muted-foreground mt-2">Formula: CGPA × {SCALE_MULTIPLIER[scale]} = Percentage</p>
            </div>
          )}

          {mode === "pct-to-cgpa" && (
            <div>
              <label className="text-sm font-medium mb-2 block">Enter your Percentage</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={pctInput}
                onChange={(e) => setPctInput(e.target.value)}
                placeholder="Enter Percentage (0 - 100)"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <p className="text-xs text-muted-foreground mt-2">Formula: Percentage ÷ {SCALE_MULTIPLIER[scale]} = CGPA</p>
            </div>
          )}

          {mode === "sgpa-to-cgpa" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Semester-wise SGPA & Credits</label>
                <Button variant="outline" size="sm" onClick={addSemester} className="text-xs gap-1.5 h-8">
                  <Plus className="w-3.5 h-3.5" />
                  Add Semester
                </Button>
              </div>
              {semesters.map((sem, i) => (
                <div key={sem.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8 flex-shrink-0">S{i + 1}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={scale}
                    value={sem.sgpa}
                    onChange={(e) => updateSemester(sem.id, "sgpa", e.target.value)}
                    placeholder="SGPA"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={sem.credits}
                    onChange={(e) => updateSemester(sem.id, "credits", e.target.value)}
                    placeholder="Credits"
                    className="w-24 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    onClick={() => removeSemester(sem.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Formula: Σ(SGPA × Credits) ÷ Σ(Credits) = CGPA</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={resetAll} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            {result && (
              <Button variant="outline" size="sm" onClick={copyResult} className="gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Result"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center"
          >
            <p className="text-sm text-muted-foreground mb-1">{result.label}</p>
            <p className="text-4xl font-bold text-primary">{result.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{result.sub}</p>
          </motion.div>
        )}

        {/* Quick Reference Table */}
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Quick CGPA to Percentage Reference ({scale}-point scale)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Array.from({ length: scale * 2 }, (_, i) => (i + 1) * 0.5)
              .filter((v) => v >= 4 && v <= scale)
              .map((cgpa) => (
                <div key={cgpa} className="flex justify-between px-3 py-2 rounded-lg bg-muted/50">
                  <span className="font-medium">{cgpa.toFixed(1)} CGPA</span>
                  <span className="text-muted-foreground">{(cgpa * SCALE_MULTIPLIER[scale]).toFixed(1)}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Cross-links */}
        <div className="flex flex-wrap gap-2">
          <Link to="/age-calculator">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              Age Calculator
            </Button>
          </Link>
          <Link to="/salary-calculator">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              Salary Calculator
            </Button>
          </Link>
          <Link to="/exam-calendar">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Exam Calendar
            </Button>
          </Link>
        </div>

        {/* SEO Footer */}
        <div className="text-xs text-muted-foreground/70 space-y-3 border-t border-border/40 pt-6">
          <h2 className="text-sm font-semibold text-foreground/80">CGPA to Percentage Calculator — Free Online Converter | MedhaHub</h2>
          <p>
            Convert CGPA to percentage and percentage to CGPA instantly with MedhaHub's free calculator. Supports 10-point, 7-point, 5-point, and 4-point grading scales used by all Indian universities including Anna University, Mumbai University, VTU, AKTU, KTU, MDU, CBSE, IGNOU, and more. Calculate your SGPA to CGPA across multiple semesters with credit-weighted average. Perfect for job applications, higher studies admissions, competitive exam eligibility, and placement forms.
          </p>
          <h3 className="text-xs font-medium text-foreground/70">How to Convert CGPA to Percentage?</h3>
          <p>
            For a 10-point scale: Multiply your CGPA by 9.5. For example, 8.5 CGPA × 9.5 = 80.75%. For a 7-point scale: Multiply by 14.28. For a 5-point scale: Multiply by 20. For a 4-point scale: Multiply by 25. The exact formula may vary by university — check your university guidelines.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { label: "Age Calculator", href: "/age-calculator" },
              { label: "Salary Calculator", href: "/salary-calculator" },
              { label: "Eligibility Checker", href: "/eligibility-checker" },
              { label: "Typing Speed Test", href: "/typing-test" },
              { label: "Exam Calendar 2026", href: "/exam-calendar" },
              { label: "All Free Tools", href: "/tools" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-primary/60 hover:text-primary underline">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "CGPA Calculator", url: "/cgpa-calculator" },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: faqPageSchema([
              { question: "How to convert CGPA to percentage?", answer: "Multiply your CGPA by 9.5 for a 10-point scale. For example, 8.0 CGPA × 9.5 = 76%. Different scales use different multipliers: 7-point uses 14.28, 5-point uses 20, 4-point uses 25." },
              { question: "What is the formula for percentage to CGPA?", answer: "Divide your percentage by the scale multiplier. For 10-point scale: Percentage ÷ 9.5 = CGPA. For example, 85% ÷ 9.5 = 8.95 CGPA." },
              { question: "How to calculate CGPA from SGPA?", answer: "CGPA = Sum of (SGPA × Credits for each semester) ÷ Total Credits across all semesters. This gives a credit-weighted average of your semester GPAs." },
              { question: "Is this CGPA calculator valid for all universities?", answer: "Yes, MedhaHub's calculator supports 10-point, 7-point, 5-point, and 4-point grading scales used by most Indian universities. Check your specific university guidelines for exact conversion formulas." },
            ]),
          }}
        />
      </main>
    </div>
  );
}
