import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  BookOpen,
  Shield,
  FileText,
  Zap,
  TrendingUp,
  Users,
  Trophy,
  ChevronRight,
  Loader2,
  GraduationCap,
  AlertCircle,
  Clock,
  Sparkles,
  Flame,
  Star,
  X,
  Info,
  Search,
  Play,
  ChevronsUpDown,
} from "lucide-react";
import jsPDF from "jspdf";
import { extractPDFQuestions } from "@/lib/pdf-questions";
import { QUESTIONS_API_BASE } from "@/lib/api-client";
import {
  applyQuestionHubExamSeo,
  type ExamSeoProfile,
} from "@/lib/exam-seo";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface PDFItem {
  /** File name (or relative path) identifying the PDF */
  path: string;
  /** Short display label */
  name: string;
  /** Full public URL when returned by API (e.g. /Police/file.pdf) */
  downloadHref?: string;
  year?: number;
  type?: string;
}

type ColorKey = "terracotta" | "forest" | "mustard";

interface FolderData {
  name: string;
  nameBn: string;
  icon: React.ReactNode;
  colorKey: ColorKey;
  badge: string;
  description: string;
  files: PDFItem[];
  /** Subfolder name under public/ (case-sensitive) */
  publicPath: string;
}

const FOLDER_COLORS: Record<
  ColorKey,
  {
    selectedBorder: string;
    iconBg: string;
    chevron: string;
    badge: string;
    fileIconBg: string;
    fileIconText: string;
    ctaBg: string;
    ctaBorder: string;
  }
> = {
  terracotta: {
    selectedBorder: "border-orange-700 bg-orange-900/10 dark:bg-orange-800/15",
    iconBg: "from-orange-700/25 to-amber-700/20",
    chevron: "text-orange-700 dark:text-orange-400",
    badge: "bg-orange-800/15 text-orange-800 dark:text-orange-300",
    fileIconBg: "from-orange-700/20 to-amber-700/15",
    fileIconText: "text-orange-700 dark:text-orange-400",
    ctaBg: "from-orange-900/10 to-amber-800/5",
    ctaBorder: "border-orange-700/30",
  },
  forest: {
    selectedBorder: "border-emerald-800 bg-emerald-900/10 dark:bg-emerald-800/15",
    iconBg: "from-emerald-800/25 to-green-900/20",
    chevron: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-800/15 text-emerald-800 dark:text-emerald-300",
    fileIconBg: "from-emerald-800/20 to-green-900/15",
    fileIconText: "text-emerald-700 dark:text-emerald-400",
    ctaBg: "from-emerald-900/10 to-green-900/5",
    ctaBorder: "border-emerald-800/30",
  },
  mustard: {
    selectedBorder: "border-amber-600 bg-amber-700/10 dark:bg-amber-700/15",
    iconBg: "from-amber-600/25 to-yellow-700/20",
    chevron: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-700/15 text-amber-800 dark:text-amber-300",
    fileIconBg: "from-amber-600/20 to-yellow-700/15",
    fileIconText: "text-amber-700 dark:text-amber-400",
    ctaBg: "from-amber-700/10 to-yellow-800/5",
    ctaBorder: "border-amber-600/30",
  },
};

// Alpona-inspired SVG pattern for backgrounds
const AlponaPattern = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="alpona" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* Central motif - lotus-inspired */}
        <circle cx="30" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
        {/* Petal arcs */}
        <path d="M30 20 Q35 25 30 30 Q25 25 30 20" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
        <path d="M40 30 Q35 35 30 30 Q35 25 40 30" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
        <path d="M30 40 Q25 35 30 30 Q35 35 30 40" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
        <path d="M20 30 Q25 25 30 30 Q25 35 20 30" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
        {/* Corner diamonds */}
        <path d="M0 0 L5 5 L0 10 L-5 5 Z" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" transform="translate(0,0)" />
        <path d="M60 0 L55 5 L60 10 L65 5 Z" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" transform="translate(0,0)" />
        <path d="M0 60 L5 55 L0 50 L-5 55 Z" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" transform="translate(0,0)" />
        <path d="M60 60 L55 55 L60 50 L65 55 Z" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" transform="translate(0,0)" />
        {/* Connecting dots */}
        <circle cx="0" cy="30" r="1.5" fill="currentColor" opacity="0.06" />
        <circle cx="60" cy="30" r="1.5" fill="currentColor" opacity="0.06" />
        <circle cx="30" cy="0" r="1.5" fill="currentColor" opacity="0.06" />
        <circle cx="30" cy="60" r="1.5" fill="currentColor" opacity="0.06" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#alpona)" />
  </svg>
);

const FOLDERS: Record<string, FolderData> = {
  police: {
    name: "Police Recruitment (WBP)",
    nameBn: "পুলিশ ভর্তি",
    icon: <Shield className="w-6 h-6" />,
    colorKey: "terracotta",
    badge: "Popular",
    publicPath: "Police",
    description:
      "West Bengal Police Constable, Sub-Inspector & Lady Constable recruitment question papers - 10+ years of previous year question papers for WBP exam preparation",
    files: [
      // SI (Sub-Inspector) Papers
      {
        name: "WBP SI (Sub-Inspector) 2025",
        path: "SI/WBP-SI-Police-2025.json",
        year: 2025,
        type: "SI",
      },
      {
        name: "WBP SI (Sub-Inspector) 2021",
        path: "SI/WBP-SI-Police-2021.json",
        year: 2021,
        type: "SI",
      },
      {
        name: "WBP SI (Sub-Inspector) 2019",
        path: "SI/WBP-SI-Police-2019.json",
        year: 2019,
        type: "SI",
      },
      {
        name: "WBP SI (Sub-Inspector) 2018",
        path: "SI/WBP-SI-Police-2018.json",
        year: 2018,
        type: "SI",
      },
      // Constable Papers
      {
        name: "WBP Constable Preliminary 2021",
        path: "WBP Constable Preliminary Question Paper 2021.pdf",
        year: 2021,
        type: "Constable",
      },
      {
        name: "WBP Constable Preliminary 2021 (Bengali)",
        path: "WBP-CONSTABLE-PYP-2021-BENG-2.pdf",
        year: 2021,
        type: "Constable",
      },
      {
        name: "WBP Lady Constable Preliminary 2018",
        path: "WBP Lady Constable Preliminary Question Paper 2018.pdf",
        year: 2018,
        type: "Lady Constable",
      },
      {
        name: "WBP Constable Preliminary 2018",
        path: "WBP Constable Prelims 2018.pdf",
        year: 2018,
        type: "Constable",
      },
      {
        name: "WBP Constable Preliminary 2016",
        path: "WBP Constable Prelims 2016.pdf",
        year: 2016,
        type: "Constable",
      },
      {
        name: "WBP Constable Preliminary 2015",
        path: "WBP Constable Prelims 2015.pdf",
        year: 2015,
        type: "Constable",
      },
      {
        name: "WBP Constable Preliminary 2013",
        path: "WBP Constable Prelims 2013.pdf",
        year: 2013,
        type: "Constable",
      },
    ],
  },
  wbcs: {
    name: "WBCS (West Bengal Civil Service)",
    nameBn: "ডব্লিউবিসিএস",
    icon: <BookOpen className="w-6 h-6" />,
    colorKey: "forest",
    badge: "New",
    publicPath: "WBCS",
    description:
      "West Bengal Civil Service (Exe.) & allied services previous year question papers for WBCS Prelims and Mains preparation",
    files: [
      {
        name: "WBCS Preliminary 2023",
        path: "WBCS_Preliminary_Question_Paper_2023.pdf",
        year: 2023,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2022",
        path: "WBCS_Preliminary_Question_Paper_2022.pdf",
        year: 2022,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2021",
        path: "WBCS_Preliminary_Question_Paper_2021.pdf",
        year: 2021,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2020",
        path: "WBCS_Preliminary_Question_Paper_2020.pdf",
        year: 2020,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2019",
        path: "WBCS_Preliminary_Question_Paper_2019.pdf",
        year: 2019,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2018",
        path: "WBCS_Preliminary_Question_Paper_2018.pdf",
        year: 2018,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2017",
        path: "WBCS_Preliminary_Question_Paper_2017.pdf",
        year: 2017,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2016",
        path: "WBCS_Preliminary_Question_Paper_2016.pdf",
        year: 2016,
        type: "Prelims",
      },
      {
        name: "WBCS Preliminary 2015",
        path: "WBCS_Preliminary_Question_Paper_2015.pdf",
        year: 2015,
        type: "Prelims",
      },
    ],
  },
  ssc: {
    name: "SSC (Staff Selection Commission)",
    nameBn: "এসএসসি",
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "mustard",
    badge: "New",
    publicPath: "SSC",
    description:
      "SSC MTS previous year question papers (2019 & 2023 all shifts) for Multi Tasking Staff exam preparation",
    files: [
      {
        name: "SSC MTS 14 Sep 2023 Morning Shift",
        path: "MTS/MTS_14_09_2023_Morning_Questions.json",
        year: 2023,
        type: "MTS",
      },
      {
        name: "SSC MTS 14 Sep 2023 Afternoon Shift",
        path: "MTS/ssc_mts_14_09_2023_Aftertoon_Question.json",
        year: 2023,
        type: "MTS",
      },
      {
        name: "SSC MTS 14 Sep 2023 Evening Shift",
        path: "MTS/MTS_!4_09_2023_EveningShift_Question.json",
        year: 2023,
        type: "MTS",
      },
      {
        name: "SSC MTS 5 Aug 2019 Non-Technical",
        path: "MTS/MTS_05_08_2019_Non-Technical_Question.json",
        year: 2019,
        type: "MTS",
      },
      {
        name: "SSC MTS 2019",
        path: "MTS/ssc_mts_2019.json",
        year: 2019,
        type: "MTS",
      },
    ],
  },
  wbpsc: {
    name: "WBPSC (West Bengal Public Service Commission)",
    nameBn: "ডব্লিউবিপিএসসি",
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "forest",
    badge: "New",
    publicPath: "WBPSC",
    description:
      "WBPSC Clerkship previous year question papers (2019, 2020, 2024 all shifts) for West Bengal state government job preparation",
    files: [
      {
        name: "WBPSC Clerkship 2024 (1st Shift)",
        path: "Wbpsc clerkship 2024 1st shift questions.json",
        year: 2024,
        type: "Clerkship",
      },
      {
        name: "WBPSC Clerkship 2024 (2nd Shift)",
        path: "WBPSC_Clerkship_2024_Questions 2nd shift.json",
        year: 2024,
        type: "Clerkship",
      },
      {
        name: "WBPSC Clerkship 2024 (3rd Shift)",
        path: "WBPSC_Clerkship_Questions 3rd shift.json",
        year: 2024,
        type: "Clerkship",
      },
      {
        name: "WBPSC Clerkship 2024 (4th Shift)",
        path: "WBPSC_Clerkship_Questions 4th shift.json",
        year: 2024,
        type: "Clerkship",
      },
      {
        name: "WBPSC Clerkship 2020 (Shift 2)",
        path: "WBPSC_Clerkship_2020_Shift2_Questions.json",
        year: 2020,
        type: "Clerkship",
      },
      {
        name: "WBPSC Clerkship 2019 (Set 2)",
        path: "WBPSC-Clerkship-2019-Set-2.json",
        year: 2019,
        type: "Clerkship",
      },
    ],
  },
  "wb-primary-tet": {
    name: "WB Primary TET",
    nameBn: "প্রাইমারি টেট",
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "mustard",
    badge: "New",
    publicPath: "WB Primary TET Question",
    description:
      "West Bengal Primary TET previous year question papers for primary school teacher eligibility test preparation",
    files: [
      {
        name: "WB Primary TET 2023",
        path: "Wb primary tet 2023 questions .json",
        year: 2023,
        type: "Primary TET",
      },
      {
        name: "WB Primary TET 2022",
        path: "WB Primary TET 2022.json",
        year: 2022,
        type: "Primary TET",
      },
      {
        name: "WB Primary TET 2017",
        path: "WB Primary TET 2017 Question Paper.json",
        year: 2017,
        type: "Primary TET",
      },
      {
        name: "WB Primary TET 2015",
        path: "WB Primary TET 2015.json",
        year: 2015,
        type: "Primary TET",
      },
    ],
  },
  ibps: {
    name: "IBPS PO (Probationary Officer)",
    nameBn: "আইবিপিএস পিও",
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "terracotta",
    badge: "New",
    publicPath: "IBPS",
    description:
      "IBPS PO Prelims & Mains previous year question papers for banking exam preparation — 2021 to 2025",
    files: [
      {
        name: "IBPS PO Pre 2025 (Memory Based, 23rd Aug 1st Shift)",
        path: "IBPS PO Pre 2025 Memory Based Paper (23rd August 1st Shift).json",
        year: 2025,
        type: "Prelims",
      },
      {
        name: "IBPS PO Prelims 2024 (Memory Based)",
        path: "IBPS PO Prelims Memory Based 2024.json",
        year: 2024,
        type: "Prelims",
      },
      {
        name: "IBPS PO Prelims 2023",
        path: "IBPS PO Prelims Previous Year Paper 2023.json",
        year: 2023,
        type: "Prelims",
      },
      {
        name: "IBPS PO Pre 2022",
        path: "IBPS PO Pre 2022.json",
        year: 2022,
        type: "Prelims",
      },
      {
        name: "IBPS PO Mains 2022",
        path: "IBPS PO Mains 2022.json",
        year: 2022,
        type: "Mains",
      },
      {
        name: "IBPS PO Mains 2021 (Memory Based)",
        path: "IBPS PO Mains Memory Based 2021.json",
        year: 2021,
        type: "Mains",
      },
    ],
  },
  jtet: {
    name: "JTET (Jharkhand TET)",
    nameBn: "ঝাড়খণ্ড টেট",
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "forest",
    badge: "New",
    publicPath: "JTET",
    description:
      "Jharkhand Teacher Eligibility Test (JTET) previous year question papers — Paper I & Paper II for primary & upper primary teacher recruitment",
    files: [
      {
        name: "JTET 2012 Previous Paper - Paper I",
        path: "JTET 2012 Previous Paper - Paper I.json",
        year: 2012,
        type: "Paper I",
      },
    ],
  },
  "rrb-ntpc": {
    name: "RRB NTPC (Railway)",
    nameBn: "আরআরবি এনটিপিসি",
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "terracotta",
    badge: "New",
    publicPath: "RRB-NTPC",
    description:
      "RRB NTPC (Railway Recruitment Board Non-Technical Popular Categories) previous year question papers for CBT 1 & CBT 2 exam preparation",
    files: [
      {
        name: "RRB NTPC 2026 CBT 1 (16 Mar 2026)",
        path: "rrb_ntpc_2026_questions.json",
        year: 2026,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC 2015 (Bengali)",
        path: "rrb_questions_bengali.json",
        year: 2015,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 03 (English)",
        path: "RRB-NTPC-Previous-Year-Paper-03-English.json",
        year: 2019,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 04",
        path: "RRB NTPC Previous Year Paper 04.json",
        year: 2019,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 05",
        path: "RRB NTPC Previous Year Paper 05.json",
        year: 2019,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 06 (English)",
        path: "RRB NTPC Previous Year Paper 06 (English).json",
        year: 2019,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 08",
        path: "RRB NTPC Previous Year Paper 08.json",
        year: 2020,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 09",
        path: "RRB NTPC Previous Year Paper 09.json",
        year: 2020,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 10 (English)",
        path: "RRB NTPC Previous Year Paper 10 (English).json",
        year: 2020,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 12",
        path: "RRB NTPC Previous Year Paper 12.json",
        year: 2021,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 13 (English)",
        path: "RRB NTPC Previous Year Paper 13 (English).json",
        year: 2021,
        type: "CBT 1",
      },
      {
        name: "RRB NTPC Previous Year Paper 15",
        path: "RRB NTPC Previous Year Paper 15.json",
        year: 2021,
        type: "CBT 2",
      },
      {
        name: "RRB NTPC Previous Year Paper 16",
        path: "RRB NTPC Previous Year Paper 16.json",
        year: 2021,
        type: "CBT 2",
      },
      {
        name: "RRB NTPC Previous Year Paper 17",
        path: "RRB NTPC Previous Year Paper 17.json",
        year: 2022,
        type: "CBT 2",
      },
      {
        name: "RRB NTPC Previous Year Paper 19",
        path: "RRB NTPC Previous Year Paper 19.json",
        year: 2022,
        type: "CBT 2",
      },
      {
        name: "RRB NTPC Previous Year Paper 20 (English)",
        path: "RRB NTPC Previous Year Paper 20 (English).json",
        year: 2022,
        type: "CBT 2",
      },
      {
        name: "RRB NTPC 2015-16 Previous Year Paper",
        path: "rrb-ntpc-015.json",
        year: 2016,
        type: "CBT 1",
      },
    ],
  },
};

const STATS = [
  { icon: <FileText className="w-4 h-4" />, label: "Question Papers", value: "50+", color: "text-emerald-700 dark:text-emerald-400" },
  { icon: <Users className="w-4 h-4" />, label: "Active Users", value: "10K+", color: "text-amber-700 dark:text-amber-400" },
  { icon: <Trophy className="w-4 h-4" />, label: "Tests Attempted", value: "100K+", color: "text-orange-700 dark:text-orange-400" },
  { icon: <TrendingUp className="w-4 h-4" />, label: "Success Rate", value: "87%", color: "text-emerald-800 dark:text-emerald-300" },
];

function titleFromFilename(fileName: string): string {
  // 1. Remove directory path if present (e.g. SI/WBP-SI-2019.json -> WBP-SI-2019.json)
  const baseName = fileName.split('/').pop() || fileName;

  return baseName
    .replace(/\.(pdf|json)$/i, "") // 2. Remove file extension
    .replace(/json[-_]data/gi, "") // 3. Remove "json-data" or "json_data"
    .replace(/json/gi, "")        // 4. Remove the word "JSON" case-insensitive
    .replace(/[_-]/g, " ")        // 5. Replace underscores and hyphens with spaces
    .replace(/\s+/g, " ")         // 6. Replace multiple spaces with a single space
    .trim();
}


function yearFromFilename(fileName: string): number | undefined {
  const m = fileName.match(/(19|20)\d{2}/);
  return m ? parseInt(m[0], 10) : undefined;
}

function encodePathPreserveSlashes(filePath: string): string {
  return filePath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

// Group files by position type for Police
function groupFilesByType(files: PDFItem[], folder: string): Record<string, PDFItem[]> {
  if (folder !== "police") {
    return { all: files };
  }
  
  const grouped: Record<string, PDFItem[]> = {
    SI: [],
    Constable: [],
    "Lady Constable": [],
  };
  
  files.forEach(file => {
    const type = file.type || "Constable";
    if (grouped[type]) {
      grouped[type].push(file);
    }
  });
  
  return grouped;
}

// ─── Demo Mock Questions per Exam ─────────────────────────────────────────────
interface MockDemoQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface MockExamGroup {
  exam: string;
  examBn: string;
  icon: string;
  bgClass: string;
  practiceExam: string;
  questions: MockDemoQuestion[];
}

const MOCK_DEMO_QUESTIONS: MockExamGroup[] = [
  {
    exam: "WB Police (SI / Constable)",
    examBn: "পুলিশ ভর্তি",
    icon: "🛡️",
    bgClass: "bg-orange-500/10",
    practiceExam: "Police",
    questions: [
      { question: "Which Article of the Indian Constitution deals with the Right to Equality?", options: ["Article 12", "Article 14", "Article 19", "Article 21"], correctIndex: 1, subject: "Polity", difficulty: "Easy" },
      { question: "The Headquarters of the National Investigation Agency (NIA) is located in?", options: ["Mumbai", "Kolkata", "New Delhi", "Hyderabad"], correctIndex: 2, subject: "Current Affairs", difficulty: "Easy" },
      { question: "What is the SI unit of Force?", options: ["Joule", "Watt", "Newton", "Pascal"], correctIndex: 2, subject: "Math", difficulty: "Easy" },
      { question: "Who founded the Indian National Army (INA)?", options: ["Subhas Chandra Bose", "Bhagat Singh", "Rashbehari Bose", "Surya Sen"], correctIndex: 0, subject: "History", difficulty: "Medium" },
    ],
  },
  {
    exam: "WBCS (Civil Service)",
    examBn: "ডব্লিউবিসিএস",
    icon: "🏛️",
    bgClass: "bg-emerald-500/10",
    practiceExam: "WBCS",
    questions: [
      { question: "The Permanent Settlement was introduced in Bengal by?", options: ["Lord Cornwallis", "Lord Wellesley", "Lord Hastings", "Lord Dalhousie"], correctIndex: 0, subject: "History", difficulty: "Medium" },
      { question: "Which river forms the boundary between India and Bangladesh in West Bengal?", options: ["Hooghly", "Teesta", "Ichamati", "Damodar"], correctIndex: 2, subject: "Geography", difficulty: "Medium" },
      { question: "The 73rd Constitutional Amendment is related to?", options: ["Panchayati Raj", "Municipalities", "Fundamental Rights", "Emergency Provisions"], correctIndex: 0, subject: "Polity", difficulty: "Easy" },
      { question: "Who was the first Chief Minister of West Bengal?", options: ["Bidhan Chandra Roy", "Prafulla Chandra Ghosh", "Jyoti Basu", "Ajoy Mukherjee"], correctIndex: 1, subject: "History", difficulty: "Hard" },
    ],
  },
  {
    exam: "SSC (MTS / CGL)",
    examBn: "এসএসসি",
    icon: "📋",
    bgClass: "bg-amber-500/10",
    practiceExam: "SSC",
    questions: [
      { question: "If the cost price of an article is ₹200 and the selling price is ₹250, what is the profit percentage?", options: ["20%", "25%", "30%", "15%"], correctIndex: 1, subject: "Math", difficulty: "Easy" },
      { question: "Choose the correct synonym of 'Abundant':", options: ["Scarce", "Plentiful", "Meagre", "Rare"], correctIndex: 1, subject: "Reasoning", difficulty: "Easy" },
      { question: "The Tropic of Cancer passes through how many Indian states?", options: ["6", "7", "8", "9"], correctIndex: 2, subject: "Geography", difficulty: "Medium" },
      { question: "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?", options: ["36 km/h", "45 km/h", "54 km/h", "72 km/h"], correctIndex: 0, subject: "Math", difficulty: "Medium" },
    ],
  },
  {
    exam: "RRB NTPC (Railway)",
    examBn: "আরআরবি এনটিপিসি",
    icon: "🚂",
    bgClass: "bg-blue-500/10",
    practiceExam: "Railway",
    questions: [
      { question: "Indian Railways is divided into how many zones?", options: ["16", "17", "18", "19"], correctIndex: 2, subject: "Current Affairs", difficulty: "Easy" },
      { question: "The first railway line in India ran between?", options: ["Delhi to Agra", "Bombay to Thane", "Calcutta to Delhi", "Madras to Bangalore"], correctIndex: 1, subject: "History", difficulty: "Easy" },
      { question: "Find the missing number: 2, 6, 12, 20, ?", options: ["28", "30", "32", "36"], correctIndex: 1, subject: "Reasoning", difficulty: "Medium" },
      { question: "Which is the longest railway platform in India?", options: ["Gorakhpur", "Kharagpur", "Hubballi", "Kollam"], correctIndex: 0, subject: "Current Affairs", difficulty: "Medium" },
    ],
  },
  {
    exam: "IBPS PO (Banking)",
    examBn: "আইবিপিএস পিও",
    icon: "🏦",
    bgClass: "bg-violet-500/10",
    practiceExam: "Banking",
    questions: [
      { question: "What is the full form of NEFT?", options: ["National Electronic Funds Transfer", "National Emergency Fund Transfer", "New Electronic Fund Transaction", "National E-Fund Transfer"], correctIndex: 0, subject: "Current Affairs", difficulty: "Easy" },
      { question: "A sum of ₹5000 is deposited at 10% simple interest. What is the interest after 3 years?", options: ["₹1000", "₹1500", "₹2000", "₹1200"], correctIndex: 1, subject: "Math", difficulty: "Easy" },
      { question: "Who is the current Governor of the Reserve Bank of India (as of 2026)?", options: ["Shaktikanta Das", "Sanjay Malhotra", "Raghuram Rajan", "Urjit Patel"], correctIndex: 1, subject: "Current Affairs", difficulty: "Medium" },
      { question: "In a certain code, 'BANK' is written as 'DCPM'. How is 'LOAN' written?", options: ["NQCP", "NPCQ", "MQBP", "MPCO"], correctIndex: 0, subject: "Reasoning", difficulty: "Hard" },
    ],
  },
  {
    exam: "WBPSC Clerkship",
    examBn: "ডব্লিউবিপিএসসি",
    icon: "📝",
    bgClass: "bg-teal-500/10",
    practiceExam: "WBCS",
    questions: [
      { question: "Who wrote 'Gitanjali'?", options: ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarat Chandra Chattopadhyay", "Kazi Nazrul Islam"], correctIndex: 1, subject: "History", difficulty: "Easy" },
      { question: "Kolkata is situated on the banks of which river?", options: ["Ganga", "Hooghly", "Damodar", "Brahmaputra"], correctIndex: 1, subject: "Geography", difficulty: "Easy" },
      { question: "The Fundamental Duties are mentioned in which part of the Constitution?", options: ["Part III", "Part IV", "Part IVA", "Part V"], correctIndex: 2, subject: "Polity", difficulty: "Medium" },
      { question: "If 15% of a number is 45, what is the number?", options: ["200", "250", "300", "350"], correctIndex: 2, subject: "Math", difficulty: "Easy" },
    ],
  },
  {
    exam: "WB Primary TET",
    examBn: "প্রাইমারি টেট",
    icon: "🎓",
    bgClass: "bg-pink-500/10",
    practiceExam: "WBCS",
    questions: [
      { question: "According to Piaget, which stage of cognitive development involves 'conservation'?", options: ["Sensorimotor", "Pre-operational", "Concrete operational", "Formal operational"], correctIndex: 2, subject: "Reasoning", difficulty: "Medium" },
      { question: "The Right to Education Act was enacted in which year?", options: ["2005", "2009", "2010", "2012"], correctIndex: 1, subject: "Polity", difficulty: "Easy" },
      { question: "Which of the following is NOT a primary color?", options: ["Red", "Blue", "Green", "Yellow"], correctIndex: 2, subject: "Reasoning", difficulty: "Easy" },
      { question: "Vygotsky's Zone of Proximal Development (ZPD) refers to?", options: ["Tasks a child does alone", "Tasks beyond reach", "Tasks done with guidance", "Innate abilities"], correctIndex: 2, subject: "Reasoning", difficulty: "Hard" },
    ],
  },
];

export default function QuestionHub({
  seoProfile = "default",
}: {
  seoProfile?: ExamSeoProfile;
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFolder, setSelectedFolder] = useState<string>(() => {
    // Persist folder selection in URL so browser back button remembers it
    const urlFolder = searchParams.get("tab");
    if (urlFolder && FOLDERS[urlFolder]) return urlFolder;
    return seoProfile === "wbcs" ? "wbcs"
      : seoProfile === "wbpsc-clerkship" ? "wbpsc"
      : seoProfile === "wb-tet" ? "wb-primary-tet"
      : seoProfile === "ssc-mts" ? "ssc"
      : seoProfile === "ibps-po" ? "ibps"
      : seoProfile === "rrb-ntpc" ? "rrb-ntpc"
      : "police";
  });
  const [testNavLoading, setTestNavLoading] = useState(false);
  const [filesFromApi, setFilesFromApi] = useState<PDFItem[] | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExamDrawerOpen, setIsExamDrawerOpen] = useState(false);

  const currentFolder = FOLDERS[selectedFolder];
  const colors = FOLDER_COLORS[currentFolder?.colorKey ?? "terracotta"];

  useEffect(() => {
    applyQuestionHubExamSeo(seoProfile);
  }, [seoProfile]);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setFilesFromApi(null);

    fetch(`${QUESTIONS_API_BASE}/questions/${selectedFolder}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.success || !Array.isArray(data.files)) {
          if (!cancelled) setFilesFromApi(null);
          return;
        }
        const mapped: PDFItem[] = data.files.map(
          (f: { name: string; path: string }) => ({
            path: f.name,
            name: titleFromFilename(f.name),
            downloadHref: f.path,
            year: yearFromFilename(f.name),
            type:
              selectedFolder === "police"
                ? /lady/i.test(f.name)
                  ? "Lady Constable"
                  : /si/i.test(f.name)
                  ? "SI"
                  : "Constable"
                : undefined,
          })
        );
        if (!cancelled) setFilesFromApi(mapped.length > 0 ? mapped : null);
      })
      .catch(() => {
        if (!cancelled) setFilesFromApi(null);
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedFolder]);

  const allPapersForFolder: PDFItem[] =
    filesFromApi && filesFromApi.length > 0
      ? filesFromApi
      : currentFolder?.files ?? [];

  const papersForFolder: PDFItem[] = searchQuery.trim()
    ? allPapersForFolder.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.type ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(f.year ?? "").includes(searchQuery)
      )
    : allPapersForFolder;

  const isSearching = searchQuery.trim().length > 0;

  const globalSearchResults: (PDFItem & { folderKey: string; folderName: string })[] = isSearching
    ? Object.entries(FOLDERS).flatMap(([key, folder]) =>
        folder.files
          .filter(
            (f) =>
              f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (f.type ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
              String(f.year ?? "").includes(searchQuery)
          )
          .map((f) => ({ ...f, folderKey: key, folderName: folder.name }))
      )
    : [];

  const handleDownload = async (file: PDFItem, folder: FolderData = currentFolder) => {
    try {
      setTestNavLoading(true);
      const pdfPath = file.downloadHref ?? `${folder.publicPath}/${encodePathPreserveSlashes(file.path)}`;
      const relativePdfPath = pdfPath.replace(/^\//, "");
      
      // 1. Fetch questions (this now uses JSON source on the backend)
      const data = await extractPDFQuestions(relativePdfPath);
      
      if (!data || !data.questions || data.questions.length === 0) {
        throw new Error("No data found for this paper.");
      }

      // 2. Generate Safe PDF (reusing logic from MockTestPage)
      const visible = data.questions;
      const paperTitle = data.title || file.name;
      
      const hasUnicodeText = (text: string) => /[^\u0000-\u00ff]/.test(text);
      const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      const OPTION_LABELS = ["A", "B", "C", "D"];

      const containsUnicode = hasUnicodeText(paperTitle) || visible.some(q => hasUnicodeText(q.question) || q.options.some(opt => hasUnicodeText(opt)));

      if (containsUnicode) {
        const generatedAt = new Date().toLocaleDateString("en-IN");
        const html = `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(paperTitle)}</title>
  <style>
    body { font-family: "Nirmala UI", "Segoe UI", Arial, sans-serif; margin: 40px; color: #111; line-height: 1.5; }
    h1 { font-size: 24px; margin: 0 0 10px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    .meta { font-size: 13px; color: #64748b; margin-bottom: 30px; }
    .q-container { margin-bottom: 25px; page-break-inside: avoid; border-left: 3px solid #f1f5f9; padding-left: 15px; }
    .question { font-weight: 700; margin-bottom: 12px; font-size: 16px; color: #0f172a; }
    .options { margin-left: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .option { font-size: 14px; margin: 4px 0; }
    .answer { margin-top: 10px; font-size: 13px; color: #059669; font-weight: 600; background: #ecfdf5; padding: 4px 8px; border-radius: 4px; display: inline-block; }
    .exp { font-size: 12px; color: #64748b; margin-top: 6px; font-style: italic; }
    @media print { body { margin: 20px; } .q-container { border-color: #e2e8f0; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(paperTitle)}</h1>
  <div class="meta">${visible.length} Questions | Generated by MedhaHub Safe-Extract | ${generatedAt}</div>
  ${visible.map((q, i) => `
    <div class="q-container">
      <div class="question">Q${i + 1}. ${escapeHtml(q.question)}</div>
      <div class="options">
        ${q.options.map((opt, oi) => `<div class="option">${OPTION_LABELS[oi]}. ${escapeHtml(opt)}</div>`).join("")}
      </div>
      <div class="answer">Correct Answer: ${OPTION_LABELS[q.correct_index || 0]}</div>
      <div class="exp">Explanation: ${escapeHtml(q.explanation || "No detailed explanation available.")}</div>
    </div>`).join("")}
</body>
</html>`;

        const iframe = document.createElement("iframe");
        iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
        document.body.appendChild(iframe);
        const idoc = iframe.contentDocument;
        const iwin = iframe.contentWindow;
        if (idoc && iwin) {
          idoc.open(); idoc.write(html); idoc.close();
          setTimeout(() => {
            try { iwin.focus(); iwin.print(); } catch { window.print(); }
            setTimeout(() => iframe.remove(), 1000);
          }, 500);
        } else {
          const blob = new Blob([`\ufeff${html}`], { type: "text/html;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${paperTitle.replace(/\s+/g, "_")}_Safe.html`;
          a.click();
          iframe.remove();
        }
      } else {
        // Standard jsPDF for English only
        const doc = new jsPDF();
        let y = 20;
        doc.setFontSize(18);
        doc.text(paperTitle, 20, y);
        y += 15;
        doc.setFontSize(10);
        doc.text(`Generated by MedhaHub Safe-Extract | ${new Date().toLocaleDateString()}`, 20, y);
        y += 15;

        visible.forEach((q, i) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const qLines = doc.splitTextToSize(`Q${i + 1}. ${q.question}`, 170);
          doc.text(qLines, 20, y);
          y += qLines.length * 7;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          q.options.forEach((opt, oi) => {
             doc.text(`${OPTION_LABELS[oi]}. ${opt}`, 25, y);
             y += 6;
          });
          doc.setTextColor(0, 150, 0);
          doc.text(`Correct: ${OPTION_LABELS[q.correct_index || 0]}`, 25, y);
          doc.setTextColor(0, 0, 0);
          y += 10;
        });
        doc.save(`${paperTitle.replace(/\s+/g, "_")}_Safe.pdf`);
      }
    } catch (err) {
      console.error("Safe download failed:", err);
      // Fallback to original download if extraction fails
      const href = file.downloadHref ?? `/${folder.publicPath}/${encodePathPreserveSlashes(file.path)}`;
      const link = document.createElement("a");
      link.href = href;
      link.download = file.path;
      link.click();
    } finally {
      setTestNavLoading(false);
    }
  };

  const handleStartTest = (file: PDFItem, folder: FolderData = currentFolder, fKey: string = selectedFolder) => {
    setTestNavLoading(true);
    const pdfPath =
      file.downloadHref ??
      `${folder.publicPath}/${encodePathPreserveSlashes(file.path)}`;
    // Ensure the path is relative to the public folder (no leading slash)
    const relativePdfPath = pdfPath.replace(/^\//, "");
    navigate("/pdf-mock-test", {
      state: {
        pdfPath: relativePdfPath,
        pdfFileName: file.name,
        testType: "pdf",
        folder: fKey,
      },
    });
    setTestNavLoading(false);
  };

  const handleSelectFolder = (folderKey: string) => {
    setSelectedFolder(folderKey);
    setSearchParams({ tab: folderKey }, { replace: true });
    setIsExamDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background — forest green + mustard warm glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-15"
          style={{
            background:
              "radial-gradient(ellipse, rgba(5,46,22,0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-[30%] right-0 w-[500px] h-[400px] opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, rgba(180,130,20,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[300px] opacity-8"
          style={{
            background:
              "radial-gradient(ellipse, rgba(180,80,20,0.15) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        {/* Alpona pattern overlay */}
        <AlponaPattern className="absolute inset-0 text-emerald-900 dark:text-emerald-400 opacity-40 dark:opacity-20" />
      </div>

      {/* Header — warm forest green accent */}
      <header className="border-b border-emerald-900/10 dark:border-emerald-800/20 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-amber-700/40 dark:text-amber-500/30">/</span>
          <span className="text-sm font-medium text-foreground">Previous Question Set</span>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/govt-practice" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 text-xs font-medium transition-all">
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Exam Test</span>
            </Link>
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-10 max-w-5xl mx-auto">

        {/* Info Modal */}
        <AnimatePresence>
          {showInfoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-4"
              style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", background: "rgba(15,23,42,0.5)" }}
              onClick={() => setShowInfoModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-3xl bg-background border border-border shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 pt-5 pb-4">
                  <h2 className="text-lg font-bold text-foreground">Quick Links</h2>
                  <button onClick={() => setShowInfoModal(false)} className="p-1.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-4 pb-5 space-y-3">
                  {/* Syllabus Card */}
                  <div className="rounded-2xl border border-emerald-600/25 bg-gradient-to-br from-emerald-500/8 to-amber-500/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">Exam Syllabus & Pattern</h3>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/exam-syllabus" onClick={() => setShowInfoModal(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-colors">
                        <BookOpen className="w-3.5 h-3.5" /> View Syllabus
                      </Link>
                      <Link to="/exam-syllabus#pattern" onClick={() => setShowInfoModal(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-emerald-600/40 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[13px] font-semibold transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" /> Exam Pattern
                      </Link>
                    </div>
                  </div>
                  {/* Calendar Card */}
                  <div className="rounded-2xl border border-blue-600/25 bg-gradient-to-br from-blue-500/8 to-violet-500/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">Exam Calendar 2026</h3>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/exam-calendar" onClick={() => setShowInfoModal(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold transition-colors">
                        <Clock className="w-3.5 h-3.5" /> All Dates
                      </Link>
                      <Link to="/exam-calendar#upcoming" onClick={() => setShowInfoModal(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-blue-600/40 hover:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[13px] font-semibold transition-colors">
                        <Flame className="w-3.5 h-3.5" /> Upcoming
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero — heading only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between gap-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              {seoProfile === "wbcs"
                ? "WBCS Mock Test & Previous Year Papers"
                : seoProfile === "police"
                  ? "WBP Police Mock Test & Previous Year Papers"
                  : seoProfile === "wbpsc-clerkship"
                    ? "WBPSC Clerkship Mock Test & Previous Year Papers"
                    : seoProfile === "wb-tet"
                      ? "WB Primary TET Mock Test & Previous Year Papers"
                      : seoProfile === "ssc-mts"
                        ? "SSC MTS Mock Test & Previous Year Papers"
                        : seoProfile === "ibps-po"
                          ? "IBPS PO Mock Test & Previous Year Papers"
                          : "Previous Question Set"}
            </h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="mt-2 flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-600/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[13px] font-medium transition-colors"
            >
              <Info className="w-3.5 h-3.5" /> Syllabus & Dates
            </button>
          </div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papers, year, type…"
                className="w-full pl-8 pr-8 py-2 text-sm rounded-xl border border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
          </div>
        </motion.div>

        {/* Folder Selector — compact trigger + drawer list */}
        {!isSearching && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-700 to-amber-600" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Select Exam
              </h2>
            </div>
          </div>
          <div className="max-w-xl">
            <button
              onClick={() => setIsExamDrawerOpen(true)}
              className="w-full flex items-center justify-between gap-3 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/20 bg-card/70 hover:bg-card px-4 py-3.5 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 bg-gradient-to-br ${colors.iconBg} rounded-lg shrink-0`}>
                  {currentFolder.icon}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground">Current exam</p>
                  <p className="font-semibold text-foreground truncate">{currentFolder.name}</p>
                </div>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          </div>

          <Drawer open={isExamDrawerOpen} onOpenChange={setIsExamDrawerOpen}>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader className="text-left">
                <DrawerTitle>Select Exam Category</DrawerTitle>
                <DrawerDescription>
                  Choose one exam to load relevant question papers.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-5 overflow-y-auto">
                <div className="space-y-2">
                  {Object.entries(FOLDERS).map(([key, folder]) => {
                    const fc = FOLDER_COLORS[folder.colorKey];
                    const isSelected = selectedFolder === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectFolder(key)}
                        className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                          isSelected
                            ? fc.selectedBorder
                            : "border-emerald-900/10 dark:border-emerald-800/20 bg-card/60 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 bg-gradient-to-br ${fc.iconBg} rounded-lg shrink-0`}>
                            {folder.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{folder.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{folder.nameBn}</p>
                          </div>
                          {isSelected ? (
                            <ChevronRight className={`w-4 h-4 ${fc.chevron} shrink-0`} />
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </motion.section>
        )}

        {/* Global Search Results */}
        {isSearching && (
          <motion.section
            key={`search-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-emerald-700 to-amber-600" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {globalSearchResults.length > 0
                    ? `${globalSearchResults.length} result${globalSearchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`
                    : `No results for "${searchQuery}"`}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Searching across all exam categories</p>
              </div>
            </div>

            {globalSearchResults.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <Search className="w-12 h-12 text-muted-foreground/30" />
                <div>
                  <p className="font-semibold text-foreground mb-1">No papers found</p>
                  <p className="text-sm text-muted-foreground">Try a different keyword, year (e.g. 2023), or exam type</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {globalSearchResults.map((file, idx) => {
                  const fdata = FOLDERS[file.folderKey];
                  const fc = FOLDER_COLORS[fdata.colorKey];
                  return (
                    <motion.div
                      key={`${file.folderKey}-${file.path}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="bg-card/80 border border-emerald-900/8 dark:border-emerald-800/15 rounded-xl p-5 hover:border-amber-600/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className={`p-3 bg-gradient-to-br ${fc.fileIconBg} rounded-lg shrink-0 self-start`}>
                          <FileText className={`w-5 h-5 ${fc.fileIconText}`} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-foreground text-base">
                                {file.name}
                              </h3>
                              {file.year ? (
                                <span className="text-xs px-2 py-1 bg-amber-700/15 text-amber-800 dark:text-amber-300 rounded-full">
                                  {file.year}
                                </span>
                              ) : null}
                              {file.type ? (
                                <span className="text-xs px-2 py-1 bg-emerald-800/12 text-emerald-800 dark:text-emerald-300 rounded-full">
                                  {file.type}
                                </span>
                              ) : null}
                              <span className={`text-xs px-2 py-1 rounded-full ${fc.badge}`}>
                                {fdata.name.split("(")[0].trim()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 w-full sm:w-auto justify-center border-emerald-800/15 dark:border-emerald-700/20 hover:bg-emerald-900/5"
                              onClick={() => handleDownload(file, fdata)}
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </Button>
                            <Button
                              size="sm"
                              className="gap-2 w-full sm:w-auto justify-center bg-emerald-700 hover:bg-emerald-800 text-white"
                              onClick={() => handleStartTest(file, fdata, file.folderKey)}
                              disabled={testNavLoading}
                            >
                              {testNavLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Opening…
                                </>
                              ) : (
                                <>
                                  <BookOpen className="w-4 h-4" />
                                  Take Mock Test
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}

        {/* Files List */}
        {!isSearching && currentFolder && (
          <motion.section
            key={selectedFolder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-600 to-emerald-700" />
              <h2 className="text-2xl font-bold text-foreground">
                {currentFolder.name} — Previous Year Papers
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6 ml-4">
              {currentFolder.nameBn} • Download original PDFs or take mock tests directly
            </p>

            {/* AI Mock Test CTA */}
            <Link
              to={`/mock-test?exam=${encodeURIComponent(currentFolder.name.split("(")[0].trim())}`}
              className="group block mb-8 rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-yellow-500/5 hover:border-orange-500/50 hover:shadow-lg transition-all p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm group-hover:text-orange-600 transition-colors">
                    ⚡ Take AI-Powered Mock Test — {currentFolder.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AI-generated question paper with timer, instant scoring &amp; subject-wise analysis
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>

            {listLoading ? (
              <div className="flex items-center gap-3 py-12 justify-center text-emerald-700 dark:text-emerald-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading question papers…</span>
              </div>
            ) : papersForFolder.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <AlertCircle className="w-12 h-12 text-amber-600/40 dark:text-amber-500/30" />
                <div>
                  <p className="font-semibold text-foreground mb-1">No papers available yet</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Papers for {currentFolder.name} are being added. Coming soon!
                  </p>
                </div>
              </div>
            ) : (
            <>
              {selectedFolder === "police" ? (
                // Separate grid sections for Police: SI Inspector and Constable
                <>
                  {(() => {
                    const grouped = groupFilesByType(papersForFolder, selectedFolder);
                    return Object.entries(grouped).map(([category, files]) => {
                      if (files.length === 0) return null;
                      return (
                        <motion.section
                          key={category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="mb-16"
                        >
                          {/* Category Header */}
                          <div className="mb-8 pb-4 border-b-2 border-emerald-900/10 dark:border-emerald-800/15">
                            <div className="flex items-center gap-3 mb-2">
                              {category === "SI" && (
                                <>
                                  <div className="p-3 bg-emerald-800/15 dark:bg-emerald-700/20 rounded-lg">
                                    <Shield className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                                  </div>
                                  <div>
                                    <h2 className="text-3xl font-bold text-foreground">
                                      Sub-Inspector (SI) Exam
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      সাব-ইন্সপেক্টর পরীক্ষা • Practice papers
                                    </p>
                                  </div>
                                </>
                              )}
                              {category === "Constable" && (
                                <>
                                  <div className="p-3 bg-orange-800/12 dark:bg-orange-700/15 rounded-lg">
                                  </div>
                                  
                                </>
                              )}
                              {category === "Lady Constable" && null}
                            </div>
                          </div>

                          {/* Papers Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {files
                              .sort((a, b) => (b.year || 0) - (a.year || 0))
                              .map((file, idx) => (
                                <motion.div
                                  key={file.path}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className={`rounded-xl border p-5 transition-all hover:shadow-lg ${
                                    category === "SI"
                                      ? "bg-emerald-900/5 dark:bg-emerald-800/8 border-emerald-800/15 hover:border-emerald-700/30"
                                      : "bg-orange-900/5 dark:bg-orange-800/8 border-orange-800/15 hover:border-orange-700/30"
                                  }`}
                                >
                                  <div className="flex flex-col gap-4 h-full">
                                    {/* Title and Year */}
                                    <div>
                                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                                        {file.name}
                                      </h3>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {file.year ? (
                                          <span className="text-xs px-2.5 py-1 bg-amber-700/15 text-amber-800 dark:text-amber-300 rounded-full font-medium">
                                            {file.year}
                                          </span>
                                        ) : null}
                                        {category === "SI" && (
                                          <span className="text-xs px-2.5 py-1 bg-emerald-800/15 text-emerald-800 dark:text-emerald-300 rounded-full font-medium">
                                            SI Exam
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                      Previous year question paper
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-auto">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 gap-1.5 text-xs border-emerald-800/15 dark:border-emerald-700/20 hover:bg-emerald-900/5"
                                        onClick={() => handleDownload(file)}
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                      </Button>
                                      <Button
                                        size="sm"
                                        className={`flex-1 gap-1.5 text-xs text-white ${
                                          category === "SI"
                                            ? "bg-emerald-700 hover:bg-emerald-800"
                                            : "bg-orange-700 hover:bg-orange-800"
                                        }`}
                                        onClick={() => handleStartTest(file)}
                                        disabled={testNavLoading}
                                      >
                                        {testNavLoading ? (
                                          <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Opening…
                                          </>
                                        ) : (
                                          <>
                                            <BookOpen className="w-3.5 h-3.5" />
                                            Take Test
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </motion.section>
                      );
                    });
                  })()}
                </>
              ) : (
                // Default layout for non-Police exams
                <div className="space-y-4">
              {papersForFolder.map((file, idx) => (
                <motion.div
                  key={file.path}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card/80 border border-emerald-900/8 dark:border-emerald-800/15 rounded-xl p-5 hover:border-amber-600/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br ${colors.fileIconBg} rounded-lg shrink-0 self-start`}>
                      <FileText className={`w-5 h-5 ${colors.fileIconText}`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-foreground text-base sm:text-lg">
                            {file.name}
                          </h3>
                          {file.year ? (
                            <span className="text-xs px-2 py-1 bg-amber-700/15 text-amber-800 dark:text-amber-300 rounded-full">
                              {file.year}
                            </span>
                          ) : null}
                          {file.type ? (
                            <span className="text-xs px-2 py-1 bg-emerald-800/12 text-emerald-800 dark:text-emerald-300 rounded-full">
                              {file.type}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {currentFolder.name} • Previous year question paper
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 w-full sm:w-auto justify-center border-emerald-800/15 dark:border-emerald-700/20 hover:bg-emerald-900/5"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2 w-full sm:w-auto justify-center bg-emerald-700 hover:bg-emerald-800 text-white"
                          onClick={() => handleStartTest(file)}
                          disabled={testNavLoading}
                        >
                          {testNavLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Opening…
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-4 h-4" />
                              Take Mock Test
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
              )}
            </>
            )}

            {/* CTA Section — warm Bengali encouragement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 relative overflow-hidden rounded-xl border border-emerald-800/15 dark:border-emerald-700/20 p-8 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(5,46,22,0.06) 0%, rgba(180,130,20,0.04) 50%, rgba(180,80,20,0.03) 100%)",
              }}
            >
              {/* Alpona corner accents */}
              <div className="absolute top-0 left-0 w-24 h-24 opacity-[0.06] text-emerald-900 dark:text-emerald-400">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="0" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M0 0 Q20 10 10 30" fill="none" stroke="currentColor" strokeWidth="0.6" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.06] text-amber-700 dark:text-amber-500 rotate-180">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="0" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M0 0 Q20 10 10 30" fill="none" stroke="currentColor" strokeWidth="0.6" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                Start Your Preparation Today
              </h3>
              <p className="text-sm text-emerald-800/70 dark:text-emerald-400/60 font-medium mb-1">
                "One step at a time — success will follow!"
              </p>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm">
                Practice with real question papers, get instant results, and identify your weak areas with AI-powered analysis.
              </p>
              <Link to="/govt-practice">
                <Button size="lg" className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white">
                  <Sparkles className="w-5 h-5" />
                  Start AI Interview Practice
                </Button>
              </Link>
            </motion.div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
