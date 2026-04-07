import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  Calendar,
  Calculator,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
  User,
} from "lucide-react";

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "Age Calculator for Government Jobs 2026 — Check Eligibility | MedhaHub";

  const desc = "Free age calculator for government job eligibility. Calculate your exact age on any exam cut-off date. Check age limits for WBCS, SSC CGL, IBPS PO, UPSC, WB Police, Railway, TET & more. Includes OBC/SC/ST/PwD relaxation rules.";

  const kw = [
    "age calculator", "age calculator for government job",
    "age calculator for exam", "age limit calculator",
    "government job age limit", "age eligibility calculator",
    "WBCS age limit 2026", "SSC CGL age limit 2026",
    "IBPS PO age limit 2026", "UPSC age limit 2026",
    "WB Police age limit", "Railway age limit",
    "OBC age relaxation", "SC ST age relaxation",
    "age calculation from date of birth", "calculate exact age",
    "age on specific date calculator", "sarkari naukri age limit",
    "government exam age limit 2026", "date of birth age calculator",
    "age calculator online", "exact age calculator years months days",
  ].join(", ");

  const url = "https://medhahub.in/age-calculator";

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
  upsert("property", "og:title", "Age Calculator for Govt Jobs — Check Eligibility | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "Age Calculator for Government Jobs 2026 | MedhaHub");
  upsert("name", "twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }
}

// ── Exam Age Limits ──────────────────────────────────────────────────────────

interface ExamAgeLimit {
  exam: string;
  minAge: number;
  maxAge: number;
  generalRelax: number;
  obcRelax: number;
  scStRelax: number;
  pwdRelax: number;
  cutOffDate?: string;
}

const EXAM_AGE_LIMITS: ExamAgeLimit[] = [
  { exam: "WBCS", minAge: 21, maxAge: 36, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-01-01" },
  { exam: "WB Police SI", minAge: 21, maxAge: 32, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 5, cutOffDate: "2026-01-01" },
  { exam: "WB Police Constable", minAge: 18, maxAge: 27, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 5, cutOffDate: "2026-01-01" },
  { exam: "WBPSC Clerkship", minAge: 18, maxAge: 32, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-01-01" },
  { exam: "SSC CGL", minAge: 18, maxAge: 32, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-08-01" },
  { exam: "SSC CHSL", minAge: 18, maxAge: 27, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-08-01" },
  { exam: "SSC MTS", minAge: 18, maxAge: 27, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-01-01" },
  { exam: "IBPS PO", minAge: 20, maxAge: 30, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-08-01" },
  { exam: "IBPS Clerk", minAge: 20, maxAge: 28, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-07-01" },
  { exam: "SBI PO", minAge: 21, maxAge: 30, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-09-01" },
  { exam: "UPSC CSE", minAge: 21, maxAge: 32, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-08-01" },
  { exam: "NDA", minAge: 16.5, maxAge: 19.5, generalRelax: 0, obcRelax: 0, scStRelax: 0, pwdRelax: 0, cutOffDate: "2026-07-01" },
  { exam: "RRB NTPC", minAge: 18, maxAge: 33, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-07-01" },
  { exam: "Railway Group D", minAge: 18, maxAge: 33, generalRelax: 0, obcRelax: 3, scStRelax: 5, pwdRelax: 10, cutOffDate: "2026-07-01" },
  { exam: "CTET", minAge: 18, maxAge: 999, generalRelax: 0, obcRelax: 0, scStRelax: 0, pwdRelax: 0, cutOffDate: "2026-07-01" },
  { exam: "WB TET", minAge: 18, maxAge: 999, generalRelax: 0, obcRelax: 0, scStRelax: 0, pwdRelax: 0, cutOffDate: "2026-07-01" },
];

type ReservationCategory = "general" | "obc" | "sc-st" | "pwd";

// ── Component ────────────────────────────────────────────────────────────────

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().slice(0, 10));
  const [reservationCat, setReservationCat] = useState<ReservationCategory>("general");
  const [copied, setCopied] = useState(false);

  useEffect(() => { applySeo(); }, []);

  // ── Age Calculation ────────────────────────────────────────────────────

  const calculateAge = (birthStr: string, refStr: string) => {
    if (!birthStr || !refStr) return null;
    const birth = new Date(birthStr);
    const ref = new Date(refStr);
    if (isNaN(birth.getTime()) || isNaN(ref.getTime())) return null;
    if (ref < birth) return null;

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((ref.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  };

  const age = calculateAge(dob, targetDate);

  const getRelaxation = (exam: ExamAgeLimit): number => {
    if (reservationCat === "obc") return exam.obcRelax;
    if (reservationCat === "sc-st") return exam.scStRelax;
    if (reservationCat === "pwd") return exam.pwdRelax;
    return exam.generalRelax;
  };

  const checkEligibility = (exam: ExamAgeLimit) => {
    if (!age) return null;
    const refDate = exam.cutOffDate || targetDate;
    const ageOnCutoff = calculateAge(dob, refDate);
    if (!ageOnCutoff) return null;
    const ageInYears = ageOnCutoff.years + ageOnCutoff.months / 12;
    const relaxation = getRelaxation(exam);
    const effectiveMax = exam.maxAge === 999 ? 999 : exam.maxAge + relaxation;

    return {
      ageOnCutoff,
      eligible: ageInYears >= exam.minAge && ageInYears <= effectiveMax,
      tooYoung: ageInYears < exam.minAge,
      tooOld: ageInYears > effectiveMax,
      effectiveMax,
    };
  };

  const copyResult = () => {
    if (!age) return;
    const text = `Age: ${age.years} years, ${age.months} months, ${age.days} days (as on ${targetDate})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const CAT_OPTIONS: { key: ReservationCategory; label: string }[] = [
    { key: "general", label: "General / EWS" },
    { key: "obc", label: "OBC" },
    { key: "sc-st", label: "SC / ST" },
    { key: "pwd", label: "PwD" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
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
                <Calendar className="w-5 h-5 text-primary" />
                Age Calculator
              </h1>
              <p className="text-xs text-muted-foreground">Check age eligibility for govt jobs</p>
            </div>
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/60 bg-card p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Calculate Age On (Cut-off Date)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Reservation Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Reservation Category</label>
            <div className="flex flex-wrap gap-2">
              {CAT_OPTIONS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setReservationCat(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${reservationCat === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setDob(""); setTargetDate(new Date().toISOString().slice(0, 10)); }} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            {age && (
              <Button variant="outline" size="sm" onClick={copyResult} className="gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Age Result */}
        {age && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6"
          >
            <p className="text-sm text-muted-foreground mb-2 text-center">Your Age as on {targetDate}</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{age.years}</p>
                <p className="text-xs text-muted-foreground">Years</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{age.months}</p>
                <p className="text-xs text-muted-foreground">Months</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{age.days}</p>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">Total: {age.totalDays.toLocaleString()} days</p>
          </motion.div>
        )}

        {/* Eligibility Table */}
        {age && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border/60 bg-card overflow-hidden"
          >
            <div className="p-4 border-b border-border/40">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Exam Eligibility Check ({CAT_OPTIONS.find((c) => c.key === reservationCat)?.label})
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Based on official age limits for 2026 recruitment cycles</p>
            </div>
            <div className="divide-y divide-border/30">
              {EXAM_AGE_LIMITS.map((exam) => {
                const result = checkEligibility(exam);
                if (!result) return null;
                return (
                  <div key={exam.exam} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{exam.exam}</p>
                      <p className="text-xs text-muted-foreground">
                        {exam.minAge}–{exam.maxAge === 999 ? "No limit" : `${result.effectiveMax} yrs`}
                        {getRelaxation(exam) > 0 && ` (incl. +${getRelaxation(exam)} relaxation)`}
                        {exam.cutOffDate && ` • Cut-off: ${exam.cutOffDate}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {result.ageOnCutoff.years}y {result.ageOnCutoff.months}m
                      </span>
                      {result.eligible ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Eligible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          {result.tooYoung ? "Under-age" : "Over-age"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Cross-links */}
        <div className="flex flex-wrap gap-2">
          <Link to="/cgpa-calculator">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              CGPA Calculator
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
          <h2 className="text-sm font-semibold text-foreground/80">Age Calculator for Government Jobs 2026 — Check Eligibility | MedhaHub</h2>
          <p>
            Calculate your exact age in years, months, and days as on any cut-off date. Instantly check your age eligibility for WBCS, WB Police SI, WB Police Constable, WBPSC Clerkship, SSC CGL, SSC CHSL, SSC MTS, IBPS PO, IBPS Clerk, SBI PO, UPSC CSE, NDA, RRB NTPC, Railway Group D, CTET, and WB TET. Includes OBC, SC/ST, and PwD age relaxation as per latest government notifications.
          </p>
          <h3 className="text-xs font-medium text-foreground/70">Age Relaxation Rules for Government Jobs</h3>
          <p>
            OBC (Non-Creamy Layer): +3 years relaxation. SC/ST: +5 years relaxation. PwD (Persons with Disabilities): up to +10 years relaxation. Ex-servicemen: +5 years. These relaxations are applicable to most central and state government examinations. Always verify with the official notification.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { label: "CGPA Calculator", href: "/cgpa-calculator" },
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
              { name: "Age Calculator", url: "/age-calculator" },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: faqPageSchema([
              { question: "How to calculate age for government job?", answer: "Enter your date of birth and the exam cut-off date. Your exact age in years, months, and days will be calculated. Most government exams use January 1 or August 1 of the exam year as the cut-off date." },
              { question: "What is the age limit for WBCS 2026?", answer: "WBCS 2026 age limit is 21-36 years for General category. OBC candidates get +3 years relaxation (up to 39), SC/ST get +5 years (up to 41). Cut-off date is January 1, 2026." },
              { question: "What is the OBC age relaxation for SSC CGL?", answer: "OBC (Non-Creamy Layer) candidates get +3 years age relaxation for SSC CGL. The upper age limit becomes 35 years instead of 32 years." },
              { question: "Is there an age limit for CTET?", answer: "CTET has a minimum age of 18 years but no upper age limit. Candidates of any age can appear for CTET if they meet the educational qualification criteria." },
            ]),
          }}
        />
      </main>
    </div>
  );
}
