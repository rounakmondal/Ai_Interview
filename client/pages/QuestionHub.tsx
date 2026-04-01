import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import jsPDF from "jspdf";
import { extractPDFQuestions } from "@/lib/pdf-questions";
import {
  applyQuestionHubExamSeo,
  type ExamSeoProfile,
} from "@/lib/exam-seo";

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

type ColorKey = "rose" | "indigo" | "amber";

interface FolderData {
  name: string;
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
  rose: {
    selectedBorder: "border-rose-500 bg-rose-500/10",
    iconBg: "from-rose-500/20 to-pink-500/20",
    chevron: "text-rose-500",
    badge: "bg-rose-500/20 text-rose-600 dark:text-rose-400",
    fileIconBg: "from-rose-500/20 to-pink-500/20",
    fileIconText: "text-rose-500",
    ctaBg: "from-rose-500/10 to-pink-500/10",
    ctaBorder: "border-rose-500/30",
  },
  indigo: {
    selectedBorder: "border-indigo-500 bg-indigo-500/10",
    iconBg: "from-indigo-500/20 to-blue-500/20",
    chevron: "text-indigo-500",
    badge: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    fileIconBg: "from-indigo-500/20 to-blue-500/20",
    fileIconText: "text-indigo-500",
    ctaBg: "from-indigo-500/10 to-blue-500/10",
    ctaBorder: "border-indigo-500/30",
  },
  amber: {
    selectedBorder: "border-amber-500 bg-amber-500/10",
    iconBg: "from-amber-500/20 to-orange-500/20",
    chevron: "text-amber-500",
    badge: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    fileIconBg: "from-amber-500/20 to-orange-500/20",
    fileIconText: "text-amber-500",
    ctaBg: "from-amber-500/10 to-orange-500/10",
    ctaBorder: "border-amber-500/30",
  },
};

const FOLDERS: Record<string, FolderData> = {
  police: {
    name: "Police Recruitment (WBP)",
    icon: <Shield className="w-6 h-6" />,
    colorKey: "rose",
    badge: "Popular",
    publicPath: "Police",
    description:
      "West Bengal Police Constable, Sub-Inspector & Lady Constable recruitment question papers - 10+ years of previous year question papers for WBP exam preparation",
    files: [
      // SI (Sub-Inspector) Papers
      {
        name: "WBP SI (Sub-Inspector) 2025",
        path: "police-json-data/SI/WBP-SI-Police-2025.json",
        year: 2025,
        type: "SI",
      },
      {
        name: "WBP SI (Sub-Inspector) 2021",
        path: "police-json-data/SI/WBP-SI-Police-2021.json",
        year: 2021,
        type: "SI",
      },
      {
        name: "WBP SI (Sub-Inspector) 2019",
        path: "police-json-data/SI/WBP-SI-Police-2019.json",
        year: 2019,
        type: "SI",
      },
      {
        name: "WBP SI (Sub-Inspector) 2018",
        path: "police-json-data/SI/WBP-SI-Police-2018.json",
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
    icon: <BookOpen className="w-6 h-6" />,
    colorKey: "indigo",
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
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "amber",
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
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "indigo",
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
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "amber",
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
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "indigo",
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
};

const STATS = [
  { icon: <FileText className="w-4 h-4" />, label: "Question Papers", value: "50+", color: "text-blue-500" },
  { icon: <Users className="w-4 h-4" />, label: "Active Users", value: "10K+", color: "text-emerald-500" },
  { icon: <Trophy className="w-4 h-4" />, label: "Tests Attempted", value: "100K+", color: "text-amber-500" },
  { icon: <TrendingUp className="w-4 h-4" />, label: "Success Rate", value: "87%", color: "text-rose-500" },
];

function titleFromFilename(fileName: string): string {
  // 1. Remove directory path if present (e.g. police-json-data/SI/WBP-SI-2019.json -> WBP-SI-2019.json)
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
      : "police";
  });
  const [testNavLoading, setTestNavLoading] = useState(false);
  const [filesFromApi, setFilesFromApi] = useState<PDFItem[] | null>(null);
  const [listLoading, setListLoading] = useState(true);

  const currentFolder = FOLDERS[selectedFolder];
  const colors = FOLDER_COLORS[currentFolder?.colorKey ?? "rose"];

  useEffect(() => {
    applyQuestionHubExamSeo(seoProfile);
  }, [seoProfile]);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setFilesFromApi(null);

    // For police, fetch manifest.json from public folder; fallback to API for others
    if (selectedFolder === "police") {
      fetch(`/Police/police-json-data/manifest.json`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (cancelled || !Array.isArray(data)) {
            if (!cancelled) setFilesFromApi(null);
            return;
          }
          const mapped: PDFItem[] = data.map(
            (f: { name: string }) => ({
              path: `police-json-data/${f.name}`,
              name: titleFromFilename(f.name),
              downloadHref: `/Police/police-json-data/${encodePathPreserveSlashes(f.name)}`,
              year: yearFromFilename(f.name),
              type:
                /lady/i.test(f.name)
                  ? "Lady Constable"
                  : /si/i.test(f.name)
                  ? "SI"
                  : "Constable",
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
    } else {
      fetch(`/api/questions/${selectedFolder}`)
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
              type: undefined,
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
    }
    return () => {
      cancelled = true;
    };
  }, [selectedFolder]);

  const papersForFolder: PDFItem[] =
    filesFromApi && filesFromApi.length > 0
      ? filesFromApi
      : currentFolder?.files ?? [];

  const handleDownload = async (file: PDFItem) => {
    try {
      setTestNavLoading(true);
      const pdfPath = file.downloadHref ?? `${currentFolder.publicPath}/${encodePathPreserveSlashes(file.path)}`;
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
      const href = file.downloadHref ?? `/${currentFolder.publicPath}/${encodePathPreserveSlashes(file.path)}`;
      const link = document.createElement("a");
      link.href = href;
      link.download = file.path;
      link.click();
    } finally {
      setTestNavLoading(false);
    }
  };

  const handleStartTest = (file: PDFItem) => {
    setTestNavLoading(true);
    const pdfPath =
      file.downloadHref ??
      `${currentFolder.publicPath}/${encodePathPreserveSlashes(file.path)}`;
    // Ensure the path is relative to the public folder (no leading slash)
    const relativePdfPath = pdfPath.replace(/^\//, "");
    navigate("/pdf-mock-test", {
      state: {
        pdfPath: relativePdfPath,
        pdfFileName: file.name,
        testType: "pdf",
        folder: selectedFolder,
      },
    });
    setTestNavLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(239,68,68,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Question Hub</span>
          <div className="ml-auto">
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-12 max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
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
                        : "Question Hub"}
          </h1>
          <p className="text-lg text-muted-foreground mb-2 max-w-2xl">
            {seoProfile === "wbcs" ? (
              <>
                Free <strong className="text-foreground">WBCS prelims</strong> previous year question papers and{" "}
                <strong className="text-foreground">online mock tests</strong> with timer and instant results — aligned with West Bengal Civil Service (Exe.) preparation.
              </>
            ) : seoProfile === "police" ? (
              <>
                <strong className="text-foreground">West Bengal Police (WBP)</strong> Constable &amp; Lady Constable{" "}
                <strong className="text-foreground">previous year mock tests</strong> online — built from official-style PYP PDFs for exam practice.
              </>
            ) : seoProfile === "wbpsc-clerkship" ? (
              <>
                <strong className="text-foreground">WBPSC Clerkship</strong> previous year question papers (2019–2024, all shifts) as{" "}
                <strong className="text-foreground">free online mock tests</strong> — English, GK, and Arithmetic with instant scoring.
              </>
            ) : seoProfile === "wb-tet" ? (
              <>
                <strong className="text-foreground">WB Primary TET</strong> previous year question papers (2015–2023) as{" "}
                <strong className="text-foreground">free online mock tests</strong> — Bengali, English, Child Development, Math &amp; EVS sections.
              </>
            ) : seoProfile === "ssc-mts" ? (
              <>
                <strong className="text-foreground">SSC MTS</strong> previous year question papers (2019 &amp; 2023, all shifts) as{" "}
                <strong className="text-foreground">free online mock tests</strong> — GK, Reasoning &amp; English sections with instant results.
              </>
            ) : seoProfile === "ibps-po" ? (
              <>
                <strong className="text-foreground">IBPS PO</strong> Prelims &amp; Mains previous year question papers (2021–2025) as{" "}
                <strong className="text-foreground">free online mock tests</strong> — Reasoning, English, Quantitative Aptitude &amp; General Awareness with instant scoring.
              </>
            ) : (
              <>
                Download <strong className="text-foreground">WBP Constable</strong>, <strong className="text-foreground">WBCS</strong>, <strong className="text-foreground">WBPSC Clerkship</strong>, <strong className="text-foreground">WB TET</strong>, <strong className="text-foreground">SSC</strong> &amp; <strong className="text-foreground">IBPS PO</strong> previous year question papers free — and attempt unlimited AI-powered mock tests online.
              </>
            )}
          </p>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            WBP Constable &amp; SI Prelims 2013–2025 • WBCS Prelims 2015–2023 • WBPSC Clerkship 2019–2024 • WB TET 2015–2023 • SSC MTS 2019–2023 • IBPS PO 2021–2025
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border/50 rounded-lg p-4"
              >
                <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Folder Selector */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Select Exam Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(FOLDERS).map(([key, folder]) => {
              const fc = FOLDER_COLORS[folder.colorKey];
              return (
              <motion.button
                key={key}
                onClick={() => {
                  setSelectedFolder(key);
                  setSearchParams({ tab: key }, { replace: true });
                }}
                whileHover={{ scale: 1.02 }}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  selectedFolder === key
                    ? fc.selectedBorder
                    : `border-border/50 bg-card/50 hover:border-border`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-gradient-to-br ${fc.iconBg} rounded-lg`}>
                    {folder.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-sm leading-tight">
                        {folder.name}
                      </h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${fc.badge}`}>
                      {folder.badge}
                    </span>
                  </div>
                  {selectedFolder === key && (
                    <ChevronRight className={`w-5 h-5 ${fc.chevron} shrink-0`} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                  {folder.description}
                </p>
              </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Files List */}
        {currentFolder && (
          <motion.section
            key={selectedFolder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              {currentFolder.name} - Previous Year Papers
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Download the original PDF or start an MCQ-style mock test generated from that paper.
            </p>

            {listLoading ? (
              <div className="flex items-center gap-3 py-12 justify-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading question papers…</span>
              </div>
            ) : papersForFolder.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
                <div>
                  <p className="font-semibold text-foreground mb-1">No papers available yet</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    We're working on adding question papers for {currentFolder.name}. Check back soon!
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
                          <div className="mb-8 pb-4 border-b-2 border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                              {category === "SI" && (
                                <>
                                  <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <Shield className="w-6 h-6 text-blue-500" />
                                  </div>
                                  <div>
                                    <h2 className="text-3xl font-bold text-foreground">
                                      Sub-Inspector (SI) Exams
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Practice papers for West Bengal Police Sub-Inspector recruitment
                                    </p>
                                  </div>
                                </>
                              )}
                              {category === "Constable" && (
                                <>
                                  <div className="p-3 bg-rose-500/20 rounded-lg">
                                    {/* <Shield className="w-6 h-6 text-rose-500" /> */}
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
                                  className={`rounded-lg border p-5 transition-all hover:shadow-lg ${
                                    category === "SI"
                                      ? "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40"
                                      : "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
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
                                          <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full font-medium">
                                            {file.year}
                                          </span>
                                        ) : null}
                                        {category === "SI" && (
                                          <span className="text-xs px-2.5 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                                            SI Exam
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                      Previous Year Question Paper
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-auto">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 gap-1.5 text-xs"
                                        onClick={() => handleDownload(file)}
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                      </Button>
                                      <Button
                                        size="sm"
                                        className={`flex-1 gap-1.5 text-xs text-white ${
                                          category === "SI"
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "gradient-primary"
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
                                            Test
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
                  className="bg-card border border-border/50 rounded-lg p-5 hover:border-border transition-all"
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
                            <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                              {file.year}
                            </span>
                          ) : null}
                          {file.type ? (
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded">
                              {file.type}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {currentFolder.name} • Previous Year Question Paper
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 w-full sm:w-auto justify-center"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2 gradient-primary w-full sm:w-auto justify-center"
                          onClick={() => handleStartTest(file)}
                          disabled={testNavLoading}
                        >
                          {testNavLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Opening test…
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-4 h-4" />
                              Attempt mock test
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

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-12 bg-gradient-to-r ${colors.ctaBg} border ${colors.ctaBorder} rounded-xl p-8 text-center`}
            >
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Ready to Master Your Exam?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Practice with real question papers, get instant feedback, and track your progress with our AI-powered assessment system.
              </p>
              <Link to="/setup">
                <Button size="lg" className="gap-2">
                  <Zap className="w-5 h-5" />
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
