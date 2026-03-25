import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";

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
      "West Bengal Police Constable & Lady Constable recruitment question papers - 10+ years of previous year question papers for WBP exam preparation",
    files: [
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
    files: [],
  },
  ssc: {
    name: "SSC (Staff Selection Commission)",
    icon: <GraduationCap className="w-6 h-6" />,
    colorKey: "amber",
    badge: "Coming Soon",
    publicPath: "SSC",
    description:
      "SSC CGL, CHSL, MTS and other Staff Selection Commission exam papers for Central Government job preparation",
    files: [],
  },
};

const STATS = [
  { icon: <FileText className="w-4 h-4" />, label: "Question Papers", value: "50+", color: "text-blue-500" },
  { icon: <Users className="w-4 h-4" />, label: "Active Users", value: "10K+", color: "text-emerald-500" },
  { icon: <Trophy className="w-4 h-4" />, label: "Tests Attempted", value: "100K+", color: "text-amber-500" },
  { icon: <TrendingUp className="w-4 h-4" />, label: "Success Rate", value: "87%", color: "text-rose-500" },
];

function titleFromFilename(fileName: string): string {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/_/g, " ")
    .trim();
}

function yearFromFilename(fileName: string): number | undefined {
  const m = fileName.match(/(19|20)\d{2}/);
  return m ? parseInt(m[0], 10) : undefined;
}

export default function QuestionHub() {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<string>("police");
  const [testNavLoading, setTestNavLoading] = useState(false);
  const [filesFromApi, setFilesFromApi] = useState<PDFItem[] | null>(null);
  const [listLoading, setListLoading] = useState(true);

  const currentFolder = FOLDERS[selectedFolder];
  const colors = FOLDER_COLORS[currentFolder?.colorKey ?? "rose"];

  useEffect(() => {
    // ── SEO meta tags ──────────────────────────────────────────────────────
    document.title =
      "WBP & WBCS Previous Year Question Papers Free Download | SSC Mock Test | InterviewSathi";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta(
      "description",
      "Download WBP Constable & Lady Constable previous year question papers free PDF. WBCS Prelims & Mains old question papers. SSC CGL, CHSL previous year papers. Attempt unlimited AI-powered mock tests online for West Bengal government exam preparation."
    );

    setMeta(
      "keywords",
      [
        // WBP / Police keywords
        "WBP previous year question paper download",
        "WBP constable question paper PDF",
        "WBP lady constable question paper",
        "West Bengal Police previous year question",
        "WBP constable prelims 2021 2018 2016 2015 2013",
        "West Bengal Police exam practice test",
        "police constable mock test West Bengal",
        "WBP question paper Bengali",
        // WBCS keywords
        "WBCS previous year question paper download",
        "WBCS prelims question paper PDF",
        "WBCS mains question paper free",
        "West Bengal Civil Service question paper",
        "WBPSC previous year question",
        "WBCS exam preparation mock test",
        // SSC keywords
        "SSC CGL previous year question paper",
        "SSC CHSL question paper PDF download",
        "SSC MTS question paper free",
        "Staff Selection Commission mock test",
        // General
        "government exam previous year question papers West Bengal",
        "free PDF download question papers",
        "online mock test government exam India",
        "সরকারি চাকরির পুরনো প্রশ্নপত্র ডাউনলোড",
        "WBP WBCS SSC প্রশ্নপত্র",
      ].join(", ")
    );

    // Open Graph
    setProperty("og:title", "WBP & WBCS Previous Year Question Papers Free Download | InterviewSathi");
    setProperty(
      "og:description",
      "Download WBP Constable, WBCS & SSC previous year question papers as free PDFs and attempt AI-powered mock tests online. Best resource for West Bengal government exam preparation."
    );
    setProperty("og:type", "website");

    // Canonical
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/question-hub`;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setFilesFromApi(null);

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
            type:
              selectedFolder === "police"
                ? /lady/i.test(f.name)
                  ? "Lady Constable"
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

  const papersForFolder: PDFItem[] =
    filesFromApi && filesFromApi.length > 0
      ? filesFromApi
      : currentFolder?.files ?? [];

  const handleDownload = (file: PDFItem) => {
    const href =
      file.downloadHref ??
      `/${currentFolder.publicPath}/${encodeURIComponent(file.path)}`;
    const link = document.createElement("a");
    link.href = href;
    link.download = file.path;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartTest = (file: PDFItem) => {
    setTestNavLoading(true);
    const pdfPath =
      file.downloadHref ??
      `/${currentFolder.publicPath}/${encodeURIComponent(file.path)}`;
    navigate("/pdf-mock-test", {
      state: {
        pdfPath,
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
            Question Hub
          </h1>
          <p className="text-lg text-muted-foreground mb-2 max-w-2xl">
            Download <strong className="text-foreground">WBP Constable</strong>, <strong className="text-foreground">WBCS</strong> &amp; <strong className="text-foreground">SSC</strong> previous year question papers free — and attempt unlimited AI-powered mock tests online.
          </p>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            WBP Constable Prelims 2013–2021 • WBCS Prelims &amp; Mains • SSC CGL / CHSL / MTS
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
                onClick={() => setSelectedFolder(key)}
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
                          {currentFolder.name} — saved as{" "}
                          <span className="font-mono text-xs opacity-80 truncate block sm:inline sm:max-w-md">
                            {file.path}
                          </span>
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
