import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  BookOpen,
  GraduationCap,
  Calendar,
  User,
} from "lucide-react";
import RelatedToolsBanner from "@/components/RelatedToolsBanner";

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "Exam Eligibility Checker 2026 — Which Govt Exams Can You Apply For? | MedhaHub";

  const desc = "Check your eligibility for all major government exams in India. Enter your age, education & category to see which exams you qualify for — WBCS, SSC CGL, IBPS PO, UPSC, Railway, WB Police, TET & more.";

  const kw = [
    "exam eligibility checker", "government exam eligibility",
    "which govt exam can I give", "sarkari exam eligibility",
    "SSC CGL eligibility 2026", "WBCS eligibility 2026",
    "IBPS PO eligibility", "UPSC eligibility checker",
    "exam eligibility by age", "exam eligibility by qualification",
    "govt job eligibility calculator", "age limit for government exams",
    "qualification for government exams", "exam eligibility tool",
    "which exams can I apply for", "government exam qualifier",
    "OBC SC ST eligibility relaxation", "exam age limit checker",
  ].join(", ");

  const url = "https://medhahub.in/eligibility-checker";

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
  upsert("property", "og:title", "Exam Eligibility Checker 2026 | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "Exam Eligibility Checker 2026 | MedhaHub");
  upsert("name", "twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }
}

// ── Exam Data ────────────────────────────────────────────────────────────────

type Qualification = "10th" | "12th" | "graduation" | "post-graduation";
type Category = "general" | "obc" | "sc-st" | "pwd";

interface ExamInfo {
  name: string;
  conducting: string;
  minQualification: Qualification;
  specificDegrees?: string[];
  minAge: number;
  maxAge: Record<Category, number>;
  cutOffDate: string;
  approxSalary: string;
  vacancies2026?: string;
  notificationMonth?: string;
  tag: string;
}

const EXAMS: ExamInfo[] = [
  {
    name: "UPSC CSE (IAS/IPS/IFS)",
    conducting: "UPSC",
    minQualification: "graduation",
    minAge: 21,
    maxAge: { general: 32, obc: 35, "sc-st": 37, pwd: 42 },
    cutOffDate: "2026-08-01",
    approxSalary: "₹56,100 – ₹2,50,000",
    vacancies2026: "~1000",
    notificationMonth: "Feb",
    tag: "central",
  },
  {
    name: "SSC CGL",
    conducting: "SSC",
    minQualification: "graduation",
    minAge: 18,
    maxAge: { general: 32, obc: 35, "sc-st": 37, pwd: 42 },
    cutOffDate: "2026-08-01",
    approxSalary: "₹25,500 – ₹44,900",
    vacancies2026: "~14,000",
    notificationMonth: "Apr",
    tag: "central",
  },
  {
    name: "SSC CHSL",
    conducting: "SSC",
    minQualification: "12th",
    minAge: 18,
    maxAge: { general: 27, obc: 30, "sc-st": 32, pwd: 37 },
    cutOffDate: "2026-08-01",
    approxSalary: "₹19,900 – ₹25,500",
    vacancies2026: "~6,000",
    notificationMonth: "May",
    tag: "central",
  },
  {
    name: "SSC MTS",
    conducting: "SSC",
    minQualification: "10th",
    minAge: 18,
    maxAge: { general: 27, obc: 30, "sc-st": 32, pwd: 37 },
    cutOffDate: "2026-01-01",
    approxSalary: "₹18,000 – ₹22,000",
    vacancies2026: "~8,000",
    notificationMonth: "Jan",
    tag: "central",
  },
  {
    name: "RRB NTPC",
    conducting: "Railway",
    minQualification: "graduation",
    minAge: 18,
    maxAge: { general: 33, obc: 36, "sc-st": 38, pwd: 43 },
    cutOffDate: "2026-07-01",
    approxSalary: "₹21,700 – ₹35,400",
    vacancies2026: "~11,000",
    notificationMonth: "Mar",
    tag: "railway",
  },
  {
    name: "Railway Group D",
    conducting: "Railway",
    minQualification: "10th",
    minAge: 18,
    maxAge: { general: 33, obc: 36, "sc-st": 38, pwd: 43 },
    cutOffDate: "2026-07-01",
    approxSalary: "₹18,000 – ₹21,700",
    vacancies2026: "~32,000",
    notificationMonth: "Mar",
    tag: "railway",
  },
  {
    name: "IBPS PO",
    conducting: "IBPS",
    minQualification: "graduation",
    minAge: 20,
    maxAge: { general: 30, obc: 33, "sc-st": 35, pwd: 40 },
    cutOffDate: "2026-08-01",
    approxSalary: "₹36,000 – ₹63,840",
    vacancies2026: "~4,000",
    notificationMonth: "Aug",
    tag: "banking",
  },
  {
    name: "IBPS Clerk",
    conducting: "IBPS",
    minQualification: "graduation",
    minAge: 20,
    maxAge: { general: 28, obc: 31, "sc-st": 33, pwd: 38 },
    cutOffDate: "2026-07-01",
    approxSalary: "₹19,900 – ₹47,920",
    vacancies2026: "~6,000",
    notificationMonth: "Jul",
    tag: "banking",
  },
  {
    name: "SBI PO",
    conducting: "SBI",
    minQualification: "graduation",
    minAge: 21,
    maxAge: { general: 30, obc: 33, "sc-st": 35, pwd: 40 },
    cutOffDate: "2026-09-01",
    approxSalary: "₹41,960 – ₹63,840",
    vacancies2026: "~2,000",
    notificationMonth: "Sep",
    tag: "banking",
  },
  {
    name: "SBI Clerk",
    conducting: "SBI",
    minQualification: "graduation",
    minAge: 20,
    maxAge: { general: 28, obc: 31, "sc-st": 33, pwd: 38 },
    cutOffDate: "2026-10-01",
    approxSalary: "₹22,600 – ₹47,920",
    vacancies2026: "~8,000",
    notificationMonth: "Oct",
    tag: "banking",
  },
  {
    name: "WBCS (Executive)",
    conducting: "WBPSC",
    minQualification: "graduation",
    minAge: 21,
    maxAge: { general: 36, obc: 39, "sc-st": 41, pwd: 46 },
    cutOffDate: "2026-01-01",
    approxSalary: "₹53,100 – ₹1,77,500",
    vacancies2026: "~800",
    notificationMonth: "Dec",
    tag: "wb-state",
  },
  {
    name: "WBPSC Clerkship",
    conducting: "WBPSC",
    minQualification: "graduation",
    minAge: 18,
    maxAge: { general: 32, obc: 35, "sc-st": 37, pwd: 42 },
    cutOffDate: "2026-01-01",
    approxSalary: "₹22,700 – ₹58,000",
    vacancies2026: "~700",
    notificationMonth: "Jan",
    tag: "wb-state",
  },
  {
    name: "WB Police SI",
    conducting: "WB Police Recruitment Board",
    minQualification: "graduation",
    minAge: 21,
    maxAge: { general: 32, obc: 35, "sc-st": 37, pwd: 37 },
    cutOffDate: "2026-01-01",
    approxSalary: "₹30,200 – ₹70,000",
    vacancies2026: "~1,000",
    notificationMonth: "Feb",
    tag: "wb-state",
  },
  {
    name: "WB Police Constable",
    conducting: "WB Police Recruitment Board",
    minQualification: "10th",
    minAge: 18,
    maxAge: { general: 27, obc: 30, "sc-st": 32, pwd: 32 },
    cutOffDate: "2026-01-01",
    approxSalary: "₹22,700 – ₹53,000",
    vacancies2026: "~8,000",
    notificationMonth: "Mar",
    tag: "wb-state",
  },
  {
    name: "CTET",
    conducting: "CBSE",
    minQualification: "graduation",
    specificDegrees: ["B.Ed / D.El.Ed required"],
    minAge: 18,
    maxAge: { general: 999, obc: 999, "sc-st": 999, pwd: 999 },
    cutOffDate: "2026-07-01",
    approxSalary: "₹35,400 – ₹44,900 (KVS/NVS)",
    notificationMonth: "Jul",
    tag: "teaching",
  },
  {
    name: "WB TET (Primary)",
    conducting: "WB Board of Primary Education",
    minQualification: "12th",
    specificDegrees: ["12th + D.El.Ed / B.Ed"],
    minAge: 18,
    maxAge: { general: 999, obc: 999, "sc-st": 999, pwd: 999 },
    cutOffDate: "2026-07-01",
    approxSalary: "₹27,300 – ₹50,000",
    notificationMonth: "Jun",
    tag: "teaching",
  },
  {
    name: "WB TET (Upper Primary)",
    conducting: "WB Board of Secondary Education",
    minQualification: "graduation",
    specificDegrees: ["Graduation + B.Ed"],
    minAge: 18,
    maxAge: { general: 999, obc: 999, "sc-st": 999, pwd: 999 },
    cutOffDate: "2026-07-01",
    approxSalary: "₹30,200 – ₹58,000",
    notificationMonth: "Jun",
    tag: "teaching",
  },
  {
    name: "NDA (Army/Navy/Air Force)",
    conducting: "UPSC",
    minQualification: "12th",
    minAge: 16,
    maxAge: { general: 19, obc: 19, "sc-st": 19, pwd: 19 },
    cutOffDate: "2026-07-01",
    approxSalary: "₹56,100 (Lt.) + allowances",
    vacancies2026: "~400",
    notificationMonth: "Jan",
    tag: "defence",
  },
];

const QUAL_ORDER: Qualification[] = ["10th", "12th", "graduation", "post-graduation"];
const QUAL_LABELS: Record<Qualification, string> = {
  "10th": "10th Pass (Madhyamik)",
  "12th": "12th Pass (HS / Intermediate)",
  "graduation": "Graduate (BA/BSc/BCom/BTech)",
  "post-graduation": "Post-Graduate (MA/MSc/MCom/MTech)",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ExamEligibilityChecker() {
  const [dob, setDob] = useState("");
  const [qualification, setQualification] = useState<Qualification>("graduation");
  const [category, setCategory] = useState<Category>("general");
  const [tagFilter, setTagFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { applySeo(); }, []);

  const ageOnDate = (birthStr: string, refStr: string): number | null => {
    if (!birthStr || !refStr) return null;
    const birth = new Date(birthStr);
    const ref = new Date(refStr);
    if (isNaN(birth.getTime()) || isNaN(ref.getTime())) return null;
    let age = ref.getFullYear() - birth.getFullYear();
    const m = ref.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age--;
    return age;
  };

  const qualificationLevel = QUAL_ORDER.indexOf(qualification);

  type EligibilityStatus = "eligible" | "age-issue" | "qualification-issue" | "ineligible";

  const results = useMemo(() => {
    if (!dob) return [];

    return EXAMS.map(exam => {
      const age = ageOnDate(dob, exam.cutOffDate);
      if (age === null) return { exam, status: "ineligible" as EligibilityStatus, reason: "Invalid date" };

      const maxAge = exam.maxAge[category];
      const qualOk = QUAL_ORDER.indexOf(exam.minQualification) <= qualificationLevel;
      const ageTooYoung = age < exam.minAge;
      const ageTooOld = maxAge < 999 && age > maxAge;
      const noAgeLimit = maxAge >= 999;

      if (qualOk && !ageTooYoung && !ageTooOld) {
        return { exam, status: "eligible" as EligibilityStatus, age, reason: noAgeLimit ? "No upper age limit" : `Age ${age} within ${exam.minAge}–${maxAge}` };
      }
      if (!qualOk) {
        return { exam, status: "qualification-issue" as EligibilityStatus, age, reason: `Requires ${QUAL_LABELS[exam.minQualification]}` };
      }
      if (ageTooYoung) {
        return { exam, status: "age-issue" as EligibilityStatus, age, reason: `Too young (min age: ${exam.minAge})` };
      }
      return { exam, status: "age-issue" as EligibilityStatus, age, reason: `Age ${age} exceeds max ${maxAge} for ${category}` };
    });
  }, [dob, qualification, category, qualificationLevel]);

  const filtered = results.filter(r => {
    if (tagFilter !== "all" && r.exam.tag !== tagFilter) return false;
    if (searchQuery && !r.exam.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const eligibleCount = filtered.filter(r => r.status === "eligible").length;

  const tags = ["all", "central", "railway", "banking", "wb-state", "teaching", "defence"];
  const tagLabels: Record<string, string> = {
    all: "All", central: "Central", railway: "Railway",
    banking: "Banking", "wb-state": "WB State", teaching: "Teaching", defence: "Defence",
  };

  const faqs = [
    { question: "How to check eligibility for government exams?", answer: "Enter your date of birth, highest qualification, and reservation category. Our tool instantly shows which exams you qualify for based on current age limits and educational requirements." },
    { question: "What is the age relaxation for OBC/SC/ST candidates?", answer: "OBC candidates typically get 3 years relaxation, SC/ST candidates get 5 years, and PwD candidates get up to 10 years relaxation in most central government exams." },
    { question: "Can I apply for SSC CGL with a 12th pass?", answer: "No, SSC CGL requires a graduation degree from a recognized university. You can apply for SSC CHSL or SSC MTS with 12th or 10th pass respectively." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tools", url: "/" },
          { name: "Eligibility Checker", url: "/eligibility-checker" },
        ])
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageSchema(faqs) }} />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-orange-600" />
                Exam Eligibility Checker
              </h1>
              <p className="text-muted-foreground text-sm">Which govt exams can you apply for?</p>
            </div>
          </div>
          <ProfileButton />
        </div>

        {/* Input Section */}
        <div className="bg-white border rounded-xl p-4 space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-1 mb-1">
                <Calendar className="h-3.5 w-3.5" /> Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-1 mb-1">
                <GraduationCap className="h-3.5 w-3.5" /> Highest Qualification
              </label>
              <select
                value={qualification}
                onChange={e => setQualification(e.target.value as Qualification)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {QUAL_ORDER.map(q => (
                  <option key={q} value={q}>{QUAL_LABELS[q]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-1 mb-1">
                <User className="h-3.5 w-3.5" /> Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="general">General</option>
                <option value="obc">OBC (Non-Creamy Layer)</option>
                <option value="sc-st">SC / ST</option>
                <option value="pwd">PwD (Person with Disability)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters + Results */}
        {dob && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{eligibleCount}</p>
                <p className="text-xs text-green-600">Eligible</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-orange-700">
                  {filtered.filter(r => r.status === "age-issue").length}
                </p>
                <p className="text-xs text-orange-600">Age Issue</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-700">
                  {filtered.filter(r => r.status === "qualification-issue").length}
                </p>
                <p className="text-xs text-red-600">Qualification</p>
              </div>
            </div>

            {/* Tag Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <button
                    key={t}
                    onClick={() => setTagFilter(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      tagFilter === t
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tagLabels[t]}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Exam Cards */}
            <div className="space-y-2">
              {filtered
                .sort((a, b) => {
                  const order: Record<EligibilityStatus, number> = { eligible: 0, "age-issue": 1, "qualification-issue": 2, ineligible: 3 };
                  return order[a.status] - order[b.status];
                })
                .map(({ exam, status, reason }) => (
                  <motion.div
                    key={exam.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border rounded-xl p-4 transition ${
                      status === "eligible"
                        ? "border-green-300 bg-green-50/50"
                        : status === "age-issue"
                          ? "border-orange-200 bg-orange-50/30"
                          : "border-red-200 bg-red-50/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {status === "eligible" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                          ) : status === "age-issue" ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                          )}
                          <h3 className="font-semibold text-sm">{exam.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground ml-7 mt-0.5">
                          {exam.conducting} • {reason}
                        </p>
                        {exam.specificDegrees && (
                          <p className="text-xs text-orange-600 ml-7 mt-0.5">
                            ⚠ {exam.specificDegrees.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-green-700">{exam.approxSalary}</p>
                        {exam.vacancies2026 && (
                          <p className="text-xs text-muted-foreground">{exam.vacancies2026} posts</p>
                        )}
                        {exam.notificationMonth && (
                          <p className="text-xs text-blue-600">📅 {exam.notificationMonth} 2026</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No exams match your filters</p>
              </div>
            )}
          </motion.div>
        )}

        {!dob && (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Enter your details above</p>
            <p className="text-sm">We'll show which government exams you can apply for</p>
          </div>
        )}

        {/* Related Tools */}
        <RelatedToolsBanner currentPath="/eligibility-checker" />

        {/* FAQ */}
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white border rounded-xl p-4 group">
              <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                {faq.question}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
