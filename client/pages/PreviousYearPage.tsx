import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  PlayCircle,
  Download,
  GraduationCap,
  Shield,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { applyExamSeoPayload } from "@/lib/exam-seo";

// ─── Slug → Exam data mapping ────────────────────────────────────────────────

interface PYQEntry {
  /** Display title for the page hero */
  examName: string;
  /** Year of the paper */
  year: number;
  /** Sub-type like "Prelims", "Constable", "SI", "Clerkship", etc. */
  subType: string;
  /** Folder key used by QuestionHub / PDFMockTest */
  folder: string;
  /** Path to the JSON/PDF file within the public folder */
  filePath: string;
  /** Public folder base (e.g. "Police", "WBCS", "WBPSC") */
  publicPath: string;
  /** Parent exam landing page */
  parentRoute: string;
  parentLabel: string;
  /** SEO fields */
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  /** Related year slugs to show as internal links */
  relatedSlugs: string[];
  /** Sections / subjects in this paper */
  sections: string[];
  /** Approx question count */
  questionCount: number;
  /** Duration in minutes */
  duration: number;
}

const PYQ_CATALOG: Record<string, PYQEntry> = {
  // ─── WBCS Prelims ───────────────────────────────────────────────────────
  "wbcs-prelims-2023": {
    examName: "WBCS Preliminary Exam 2023",
    year: 2023,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2023.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2023 Question Paper with Answers Online | MedhaHub",
      description: "Solve WBCS Preliminary Exam 2023 question paper online. 200 MCQs with answers, timed practice, and performance analysis. Free WBCS 2023 previous year paper.",
      keywords: "WBCS prelims 2023 question paper, WBCS 2023 answers, WBCS previous year paper 2023, WBCS 2023 PDF download, ডব্লিউবিসিএস 2023 প্রশ্নপত্র",
    },
    relatedSlugs: ["wbcs-prelims-2022", "wbcs-prelims-2021", "wbcs-prelims-2020"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2022": {
    examName: "WBCS Preliminary Exam 2022",
    year: 2022,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2022.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2022 Question Paper with Answers | MedhaHub",
      description: "Practice WBCS 2022 Preliminary question paper online with instant scoring and detailed analysis. Free timed mock test.",
      keywords: "WBCS prelims 2022 question paper, WBCS 2022 answers, WBCS previous year paper 2022, WBCS 2022 PDF",
    },
    relatedSlugs: ["wbcs-prelims-2023", "wbcs-prelims-2021", "wbcs-prelims-2020"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2021": {
    examName: "WBCS Preliminary Exam 2021",
    year: 2021,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2021.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2021 Question Paper with Answers | MedhaHub",
      description: "WBCS 2021 Preliminary exam question paper. Practice online or download PDF with answer key.",
      keywords: "WBCS prelims 2021 question paper, WBCS 2021 answers, WBCS 2021 PDF download",
    },
    relatedSlugs: ["wbcs-prelims-2022", "wbcs-prelims-2020", "wbcs-prelims-2019"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2020": {
    examName: "WBCS Preliminary Exam 2020",
    year: 2020,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2020.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2020 Question Paper with Answers | MedhaHub",
      description: "WBCS 2020 Preliminary exam question paper as free online mock test. Timed MCQs with scoring.",
      keywords: "WBCS prelims 2020 question paper, WBCS 2020 answers, WBCS 2020 PDF",
    },
    relatedSlugs: ["wbcs-prelims-2021", "wbcs-prelims-2019", "wbcs-prelims-2018"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2019": {
    examName: "WBCS Preliminary Exam 2019",
    year: 2019,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2019.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2019 Question Paper Online Mock Test | MedhaHub",
      description: "Solve WBCS 2019 Preliminary question paper online with timer and instant scoring. Free previous year paper practice.",
      keywords: "WBCS prelims 2019 question paper, WBCS 2019 answers, WBCS 2019 mock test",
    },
    relatedSlugs: ["wbcs-prelims-2020", "wbcs-prelims-2018", "wbcs-prelims-2017"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2018": {
    examName: "WBCS Preliminary Exam 2018",
    year: 2018,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2018.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2018 Question Paper with Answers | MedhaHub",
      description: "WBCS Preliminary 2018 question paper. Practice online with timed mock test format.",
      keywords: "WBCS prelims 2018 question paper, WBCS 2018 answers",
    },
    relatedSlugs: ["wbcs-prelims-2019", "wbcs-prelims-2017", "wbcs-prelims-2016"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2017": {
    examName: "WBCS Preliminary Exam 2017",
    year: 2017,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2017.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2017 Question Paper Online | MedhaHub",
      description: "WBCS 2017 Preliminary question paper as free online mock test with answers.",
      keywords: "WBCS prelims 2017 question paper, WBCS 2017 answers",
    },
    relatedSlugs: ["wbcs-prelims-2018", "wbcs-prelims-2016", "wbcs-prelims-2015"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2016": {
    examName: "WBCS Preliminary Exam 2016",
    year: 2016,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2016.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2016 Question Paper with Answers | MedhaHub",
      description: "Solve WBCS 2016 Preliminary question paper online. Free previous year paper practice with scoring.",
      keywords: "WBCS prelims 2016 question paper, WBCS 2016 answers",
    },
    relatedSlugs: ["wbcs-prelims-2017", "wbcs-prelims-2015"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },
  "wbcs-prelims-2015": {
    examName: "WBCS Preliminary Exam 2015",
    year: 2015,
    subType: "Prelims",
    folder: "wbcs",
    filePath: "WBCS_Preliminary_Question_Paper_2015.pdf",
    publicPath: "WBCS",
    parentRoute: "/wbcs-mock-test",
    parentLabel: "WBCS Mock Tests",
    seo: {
      title: "WBCS Prelims 2015 Question Paper Online | MedhaHub",
      description: "WBCS 2015 Preliminary question paper. Practice online with timer and detailed results.",
      keywords: "WBCS prelims 2015 question paper, WBCS 2015 answers",
    },
    relatedSlugs: ["wbcs-prelims-2016", "wbcs-prelims-2017"],
    sections: ["General Studies", "English", "Bengali", "Mathematics", "Reasoning"],
    questionCount: 200,
    duration: 150,
  },

  // ─── WBP Constable ─────────────────────────────────────────────────────
  "wbp-constable-2021": {
    examName: "WBP Constable Preliminary 2021",
    year: 2021,
    subType: "Constable",
    folder: "police",
    filePath: "police-json-data/WBP CONSTABLE PYP 2021.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP Constable 2021 Previous Year Question Paper Online | MedhaHub",
      description: "Practice WBP Constable Preliminary 2021 question paper online. Free timed mock test with answers, scoring, and performance analysis.",
      keywords: "WBP constable 2021 question paper, WB police constable prelims 2021, WBP PYP 2021, পশ্চিমবঙ্গ পুলিশ কনস্টেবল 2021",
    },
    relatedSlugs: ["wbp-constable-2018", "wbp-constable-2016", "wbp-si-2021"],
    sections: ["General Knowledge", "Elementary Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 60,
  },
  "wbp-constable-2018": {
    examName: "WBP Constable Preliminary 2018",
    year: 2018,
    subType: "Constable",
    folder: "police",
    filePath: "police-json-data/WBP Constable Preliminary Question Paper 2018.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP Constable 2018 Question Paper with Answers Online | MedhaHub",
      description: "WBP Constable Preliminary 2018 question paper. Solve online with timer or download PDF. Free mock test with answer key.",
      keywords: "WBP constable 2018 question paper, WB police 2018 prelims paper, WBP constable 2018 PDF",
    },
    relatedSlugs: ["wbp-constable-2021", "wbp-constable-2016", "wbp-lady-constable-2018"],
    sections: ["General Knowledge", "Elementary Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 60,
  },
  "wbp-constable-2016": {
    examName: "WBP Constable Preliminary 2016",
    year: 2016,
    subType: "Constable",
    folder: "police",
    filePath: "police-json-data/WBP Constable Preliminary Question Paper 2016.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP Constable 2016 Previous Year Question Paper | MedhaHub",
      description: "WBP Constable Preliminary 2016 question paper online mock test. Timed practice with instant scoring and answer key.",
      keywords: "WBP constable 2016 question paper, WB police constable prelims 2016, WBP 2016 paper",
    },
    relatedSlugs: ["wbp-constable-2018", "wbp-constable-2015", "wbp-constable-2013"],
    sections: ["General Knowledge", "Elementary Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 60,
  },
  "wbp-constable-2015": {
    examName: "WBP Constable Preliminary 2015",
    year: 2015,
    subType: "Constable",
    folder: "police",
    filePath: "police-json-data/WBP Constable Preliminary Question Paper 2015.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP Constable 2015 Question Paper with Answers | MedhaHub",
      description: "Solve WBP Constable Preliminary 2015 question paper online. Free timed mock test with detailed scoring.",
      keywords: "WBP constable 2015 question paper, WB police constable prelims 2015, WBP 2015 paper",
    },
    relatedSlugs: ["wbp-constable-2016", "wbp-constable-2013", "wbp-constable-2018"],
    sections: ["General Knowledge", "Elementary Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 60,
  },
  "wbp-constable-2013": {
    examName: "WBP Constable Preliminary 2013",
    year: 2013,
    subType: "Constable",
    folder: "police",
    filePath: "police-json-data/WBP Constable Preliminary Question Paper 2013.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP Constable 2013 Previous Year Question Paper | MedhaHub",
      description: "WBP Constable Preliminary 2013 question paper online. Practice with timer and answer key for WB Police exam preparation.",
      keywords: "WBP constable 2013 question paper, WB police constable prelims 2013, WBP 2013 paper",
    },
    relatedSlugs: ["wbp-constable-2015", "wbp-constable-2016"],
    sections: ["General Knowledge", "Elementary Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 60,
  },

  // ─── WBP Lady Constable ────────────────────────────────────────────────
  "wbp-lady-constable-2018": {
    examName: "WBP Lady Constable Preliminary 2018",
    year: 2018,
    subType: "Lady Constable",
    folder: "police",
    filePath: "police-json-data/WBP Lady Constable Preliminary Question Paper 2018.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP Lady Constable 2018 Previous Year Question Paper | MedhaHub",
      description: "WBP Lady Constable Preliminary 2018 question paper. Free online mock test with timer, scoring, and answer key.",
      keywords: "WBP lady constable 2018 question paper, WB police lady constable prelims 2018, WBP lady constable paper",
    },
    relatedSlugs: ["wbp-constable-2018", "wbp-constable-2021"],
    sections: ["General Knowledge", "Elementary Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 60,
  },

  // ─── WBP SI (Sub-Inspector) ────────────────────────────────────────────
  "wbp-si-2025": {
    examName: "WBP Sub-Inspector (SI) 2025",
    year: 2025,
    subType: "SI",
    folder: "police",
    filePath: "police-json-data/SI/WBP-SI-Police-2025.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP SI 2025 Question Paper Online Mock Test | MedhaHub",
      description: "WBP Sub-Inspector (SI) 2025 question paper as a free online mock test. Timed practice with instant results and performance analysis.",
      keywords: "WBP SI 2025 question paper, WB police SI exam 2025, WBP SI mock test 2025, পশ্চিমবঙ্গ পুলিশ SI 2025",
    },
    relatedSlugs: ["wbp-si-2021", "wbp-si-2019", "wbp-si-2018"],
    sections: ["General Knowledge", "Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 90,
  },
  "wbp-si-2021": {
    examName: "WBP Sub-Inspector (SI) 2021",
    year: 2021,
    subType: "SI",
    folder: "police",
    filePath: "police-json-data/SI/WBP-SI-Police-2021.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP SI 2021 Previous Year Question Paper Online | MedhaHub",
      description: "Solve West Bengal Police SI 2021 paper online with detailed answers and performance tracking. Free mock test.",
      keywords: "WBP SI 2021 question paper, WB police SI prelims 2021, WBP SI 2021 answers",
    },
    relatedSlugs: ["wbp-si-2025", "wbp-si-2019", "wbp-constable-2021"],
    sections: ["General Knowledge", "Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 90,
  },
  "wbp-si-2019": {
    examName: "WBP Sub-Inspector (SI) 2019",
    year: 2019,
    subType: "SI",
    folder: "police",
    filePath: "police-json-data/SI/WBP-SI-Police-2019.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP SI 2019 Previous Year Question Paper | MedhaHub",
      description: "WBP Sub-Inspector 2019 question paper. Practice online with timer and instant scoring on MedhaHub.",
      keywords: "WBP SI 2019 question paper, WB police SI exam 2019, WBP SI 2019 answers",
    },
    relatedSlugs: ["wbp-si-2021", "wbp-si-2018", "wbp-si-2025"],
    sections: ["General Knowledge", "Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 90,
  },
  "wbp-si-2018": {
    examName: "WBP Sub-Inspector (SI) 2018",
    year: 2018,
    subType: "SI",
    folder: "police",
    filePath: "police-json-data/SI/WBP-SI-Police-2018.json",
    publicPath: "Police",
    parentRoute: "/wbp-police-mock-test",
    parentLabel: "WBP Police Mock Tests",
    seo: {
      title: "WBP SI 2018 Question Paper with Answers Online | MedhaHub",
      description: "WBP Sub-Inspector 2018 question paper as free online mock test. Solve with timer and get detailed performance analysis.",
      keywords: "WBP SI 2018 question paper, WB police SI prelims 2018, WBP SI 2018 answers",
    },
    relatedSlugs: ["wbp-si-2019", "wbp-si-2021", "wbp-constable-2018"],
    sections: ["General Knowledge", "Mathematics", "English", "Bengali", "Reasoning"],
    questionCount: 100,
    duration: 90,
  },

  // ─── WBPSC Clerkship ───────────────────────────────────────────────────
  "wbpsc-clerkship-2024": {
    examName: "WBPSC Clerkship 2024 (All Shifts)",
    year: 2024,
    subType: "Clerkship",
    folder: "wbpsc",
    filePath: "Wbpsc clerkship 2024 1st shift questions.json",
    publicPath: "WBPSC",
    parentRoute: "/wbpsc-clerkship-mock-test",
    parentLabel: "WBPSC Clerkship Mock Tests",
    seo: {
      title: "WBPSC Clerkship 2024 Question Paper All Shifts with Answers | MedhaHub",
      description: "WBPSC Clerkship 2024 question papers from all 4 shifts. Practice online with timer, scoring, and answer key. English, GK, Arithmetic.",
      keywords: "WBPSC clerkship 2024 question paper, WBPSC clerkship 2024 all shift, clerkship exam 2024 paper, ক্লার্কশিপ 2024 প্রশ্নপত্র",
    },
    relatedSlugs: ["wbpsc-clerkship-2020", "wbpsc-clerkship-2019"],
    sections: ["English", "General Studies", "Arithmetic"],
    questionCount: 100,
    duration: 90,
  },
  "wbpsc-clerkship-2020": {
    examName: "WBPSC Clerkship 2020 (Shift 2)",
    year: 2020,
    subType: "Clerkship",
    folder: "wbpsc",
    filePath: "WBPSC_Clerkship_2020_Shift2_Questions.json",
    publicPath: "WBPSC",
    parentRoute: "/wbpsc-clerkship-mock-test",
    parentLabel: "WBPSC Clerkship Mock Tests",
    seo: {
      title: "WBPSC Clerkship 2020 Question Paper with Answers | MedhaHub",
      description: "Solve WBPSC Clerkship 2020 Shift 2 question paper online with instant results. Free timed mock test.",
      keywords: "WBPSC clerkship 2020 question paper, clerkship 2020 answers, WBPSC 2020 shift 2",
    },
    relatedSlugs: ["wbpsc-clerkship-2024", "wbpsc-clerkship-2019"],
    sections: ["English", "General Studies", "Arithmetic"],
    questionCount: 100,
    duration: 90,
  },
  "wbpsc-clerkship-2019": {
    examName: "WBPSC Clerkship 2019 (Set 2)",
    year: 2019,
    subType: "Clerkship",
    folder: "wbpsc",
    filePath: "WBPSC-Clerkship-2019-Set-2.json",
    publicPath: "WBPSC",
    parentRoute: "/wbpsc-clerkship-mock-test",
    parentLabel: "WBPSC Clerkship Mock Tests",
    seo: {
      title: "WBPSC Clerkship 2019 Question Paper Set 2 Online | MedhaHub",
      description: "WBPSC Clerkship 2019 Set 2 question paper. Practice online with timer and detailed scoring.",
      keywords: "WBPSC clerkship 2019 question paper, clerkship 2019 set 2, WBPSC 2019 answers",
    },
    relatedSlugs: ["wbpsc-clerkship-2024", "wbpsc-clerkship-2020"],
    sections: ["English", "General Studies", "Arithmetic"],
    questionCount: 100,
    duration: 90,
  },

  // ─── WB Primary TET ────────────────────────────────────────────────────
  "wb-tet-2023": {
    examName: "WB Primary TET 2023",
    year: 2023,
    subType: "Primary TET",
    folder: "wb-primary-tet",
    filePath: "Wb primary tet 2023 questions .json",
    publicPath: "WB Primary TET Question",
    parentRoute: "/wb-tet-mock-test",
    parentLabel: "WB TET Mock Tests",
    seo: {
      title: "WB Primary TET 2023 Question Paper with Answers Online | MedhaHub",
      description: "WB Primary TET 2023 complete question paper. Practice online with section-wise analysis and scoring. Bengali, English, Child Dev, Math, EVS.",
      keywords: "WB TET 2023 question paper, WB primary TET 2023 answers, WB TET 2023 PDF, প্রাইমারি টেট 2023 প্রশ্নপত্র",
    },
    relatedSlugs: ["wb-tet-2022", "wb-tet-2017", "wb-tet-2015"],
    sections: ["Language I (Bengali)", "Language II (English)", "Child Development", "Mathematics", "Environmental Studies"],
    questionCount: 150,
    duration: 150,
  },
  "wb-tet-2022": {
    examName: "WB Primary TET 2022",
    year: 2022,
    subType: "Primary TET",
    folder: "wb-primary-tet",
    filePath: "WB Primary TET 2022.json",
    publicPath: "WB Primary TET Question",
    parentRoute: "/wb-tet-mock-test",
    parentLabel: "WB TET Mock Tests",
    seo: {
      title: "WB Primary TET 2022 Question Paper Online Mock Test | MedhaHub",
      description: "Solve WB Primary TET 2022 question paper online. All sections — Bengali, English, Child Dev, Math, EVS with answers.",
      keywords: "WB TET 2022 question paper, WB primary TET 2022 answers, WB TET 2022 online",
    },
    relatedSlugs: ["wb-tet-2023", "wb-tet-2017", "wb-tet-2015"],
    sections: ["Language I (Bengali)", "Language II (English)", "Child Development", "Mathematics", "Environmental Studies"],
    questionCount: 150,
    duration: 150,
  },
  "wb-tet-2017": {
    examName: "WB Primary TET 2017",
    year: 2017,
    subType: "Primary TET",
    folder: "wb-primary-tet",
    filePath: "WB Primary TET 2017 Question Paper.json",
    publicPath: "WB Primary TET Question",
    parentRoute: "/wb-tet-mock-test",
    parentLabel: "WB TET Mock Tests",
    seo: {
      title: "WB Primary TET 2017 Question Paper with Answers | MedhaHub",
      description: "WB Primary TET 2017 question paper as a free online mock test. All sections with answers and scoring.",
      keywords: "WB TET 2017 question paper, WB primary TET 2017, WB TET 2017 answers",
    },
    relatedSlugs: ["wb-tet-2022", "wb-tet-2023", "wb-tet-2015"],
    sections: ["Language I (Bengali)", "Language II (English)", "Child Development", "Mathematics", "Environmental Studies"],
    questionCount: 150,
    duration: 150,
  },
  "wb-tet-2015": {
    examName: "WB Primary TET 2015",
    year: 2015,
    subType: "Primary TET",
    folder: "wb-primary-tet",
    filePath: "WB Primary TET 2015.json",
    publicPath: "WB Primary TET Question",
    parentRoute: "/wb-tet-mock-test",
    parentLabel: "WB TET Mock Tests",
    seo: {
      title: "WB Primary TET 2015 Question Paper Online | MedhaHub",
      description: "Practice WB Primary TET 2015 question paper online with timer and instant results. Free mock test.",
      keywords: "WB TET 2015 question paper, WB primary TET 2015, WB TET 2015 answers",
    },
    relatedSlugs: ["wb-tet-2017", "wb-tet-2022", "wb-tet-2023"],
    sections: ["Language I (Bengali)", "Language II (English)", "Child Development", "Mathematics", "Environmental Studies"],
    questionCount: 150,
    duration: 150,
  },

  // ─── SSC MTS ───────────────────────────────────────────────────────────
  "ssc-mts-2023": {
    examName: "SSC MTS 2023 (All Shifts)",
    year: 2023,
    subType: "MTS",
    folder: "ssc",
    filePath: "MTS/MTS_14_09_2023_Morning_Questions.json",
    publicPath: "SSC",
    parentRoute: "/ssc-mts-mock-test",
    parentLabel: "SSC MTS Mock Tests",
    seo: {
      title: "SSC MTS 2023 Question Paper All Shifts Online | MedhaHub",
      description: "SSC MTS 2023 question papers — Morning, Afternoon, Evening shifts. Practice online with timer, instant scoring, and answer key.",
      keywords: "SSC MTS 2023 question paper, SSC MTS 2023 all shifts, SSC MTS 2023 answers, SSC MTS 2023 PDF",
    },
    relatedSlugs: ["ssc-mts-2019"],
    sections: ["General Knowledge", "Reasoning", "English", "Mathematics"],
    questionCount: 100,
    duration: 90,
  },
  "ssc-mts-2019": {
    examName: "SSC MTS 2019 (Non-Technical)",
    year: 2019,
    subType: "MTS",
    folder: "ssc",
    filePath: "MTS/MTS_05_08_2019_Non-Technical_Question.json",
    publicPath: "SSC",
    parentRoute: "/ssc-mts-mock-test",
    parentLabel: "SSC MTS Mock Tests",
    seo: {
      title: "SSC MTS 2019 Question Paper with Answers Online | MedhaHub",
      description: "SSC MTS 2019 Non-Technical question paper. Solve online with timer or download PDF. Free mock test with answer key.",
      keywords: "SSC MTS 2019 question paper, SSC MTS 2019 answers, SSC MTS 2019 PDF download",
    },
    relatedSlugs: ["ssc-mts-2023"],
    sections: ["General Knowledge", "Reasoning", "English", "Mathematics"],
    questionCount: 100,
    duration: 90,
  },

  // ─── IBPS PO ──────────────────────────────────────────────────────────
  "ibps-po-pre-2025": {
    examName: "IBPS PO Prelims 2025 (Memory Based, 23rd Aug 1st Shift)",
    year: 2025,
    subType: "Prelims",
    folder: "ibps",
    filePath: "IBPS PO Pre 2025 Memory Based Paper (23rd August 1st Shift).json",
    publicPath: "IBPS",
    parentRoute: "/ibps-po-mock-test",
    parentLabel: "IBPS PO Mock Tests",
    seo: {
      title: "IBPS PO Prelims 2025 Memory Based Question Paper Online | MedhaHub",
      description: "IBPS PO Prelims 2025 memory-based question paper (23rd Aug 1st Shift). Practice online with timer, instant scoring and answer key. Free banking mock test.",
      keywords: "IBPS PO prelims 2025 question paper, IBPS PO 2025 memory based, IBPS PO 2025 answers, banking exam 2025",
    },
    relatedSlugs: ["ibps-po-pre-2024", "ibps-po-pre-2023", "ibps-po-pre-2022"],
    sections: ["English Language", "Quantitative Aptitude", "Reasoning Ability"],
    questionCount: 100,
    duration: 60,
  },
  "ibps-po-pre-2024": {
    examName: "IBPS PO Prelims 2024 (Memory Based)",
    year: 2024,
    subType: "Prelims",
    folder: "ibps",
    filePath: "IBPS PO Prelims Memory Based 2024.json",
    publicPath: "IBPS",
    parentRoute: "/ibps-po-mock-test",
    parentLabel: "IBPS PO Mock Tests",
    seo: {
      title: "IBPS PO Prelims 2024 Memory Based Question Paper | MedhaHub",
      description: "Solve IBPS PO Prelims 2024 memory-based question paper online. Free timed mock test with answers and performance analysis for banking exam preparation.",
      keywords: "IBPS PO prelims 2024 question paper, IBPS PO 2024 memory based, IBPS PO 2024 answers",
    },
    relatedSlugs: ["ibps-po-pre-2025", "ibps-po-pre-2023", "ibps-po-pre-2022"],
    sections: ["English Language", "Quantitative Aptitude", "Reasoning Ability"],
    questionCount: 100,
    duration: 60,
  },
  "ibps-po-pre-2023": {
    examName: "IBPS PO Prelims 2023",
    year: 2023,
    subType: "Prelims",
    folder: "ibps",
    filePath: "IBPS PO Prelims Previous Year Paper 2023.json",
    publicPath: "IBPS",
    parentRoute: "/ibps-po-mock-test",
    parentLabel: "IBPS PO Mock Tests",
    seo: {
      title: "IBPS PO Prelims 2023 Question Paper with Answers Online | MedhaHub",
      description: "IBPS PO Prelims 2023 question paper. Practice online with timer and instant scoring. Free banking exam mock test.",
      keywords: "IBPS PO prelims 2023 question paper, IBPS PO 2023 answers, IBPS PO 2023 PDF",
    },
    relatedSlugs: ["ibps-po-pre-2024", "ibps-po-pre-2025", "ibps-po-pre-2022"],
    sections: ["English Language", "Quantitative Aptitude", "Reasoning Ability"],
    questionCount: 100,
    duration: 60,
  },
  "ibps-po-pre-2022": {
    examName: "IBPS PO Prelims 2022",
    year: 2022,
    subType: "Prelims",
    folder: "ibps",
    filePath: "IBPS PO Pre 2022.json",
    publicPath: "IBPS",
    parentRoute: "/ibps-po-mock-test",
    parentLabel: "IBPS PO Mock Tests",
    seo: {
      title: "IBPS PO Prelims 2022 Question Paper Online Mock Test | MedhaHub",
      description: "IBPS PO Prelims 2022 question paper as free online mock test. Timed practice with instant results for banking exam preparation.",
      keywords: "IBPS PO prelims 2022 question paper, IBPS PO 2022 answers, IBPS PO 2022 mock test",
    },
    relatedSlugs: ["ibps-po-pre-2023", "ibps-po-mains-2022", "ibps-po-pre-2024"],
    sections: ["English Language", "Quantitative Aptitude", "Reasoning Ability"],
    questionCount: 100,
    duration: 60,
  },
  "ibps-po-mains-2022": {
    examName: "IBPS PO Mains 2022",
    year: 2022,
    subType: "Mains",
    folder: "ibps",
    filePath: "IBPS PO Mains 2022.json",
    publicPath: "IBPS",
    parentRoute: "/ibps-po-mock-test",
    parentLabel: "IBPS PO Mock Tests",
    seo: {
      title: "IBPS PO Mains 2022 Question Paper with Answers | MedhaHub",
      description: "IBPS PO Mains 2022 question paper. Solve Reasoning, English, Quantitative Aptitude and General Awareness online with timer and scoring.",
      keywords: "IBPS PO mains 2022 question paper, IBPS PO mains 2022 answers, IBPS PO mains mock test",
    },
    relatedSlugs: ["ibps-po-pre-2022", "ibps-po-mains-2021", "ibps-po-pre-2023"],
    sections: ["Reasoning & Computer Aptitude", "English Language", "Data Analysis & Interpretation", "General/Economy/Banking Awareness"],
    questionCount: 155,
    duration: 180,
  },
  "ibps-po-mains-2021": {
    examName: "IBPS PO Mains 2021 (Memory Based)",
    year: 2021,
    subType: "Mains",
    folder: "ibps",
    filePath: "IBPS PO Mains Memory Based 2021.json",
    publicPath: "IBPS",
    parentRoute: "/ibps-po-mock-test",
    parentLabel: "IBPS PO Mock Tests",
    seo: {
      title: "IBPS PO Mains 2021 Memory Based Question Paper | MedhaHub",
      description: "IBPS PO Mains 2021 memory-based question paper. Practice online with detailed scoring and analysis. Free banking exam preparation.",
      keywords: "IBPS PO mains 2021 question paper, IBPS PO mains 2021 memory based, IBPS PO 2021 answers",
    },
    relatedSlugs: ["ibps-po-mains-2022", "ibps-po-pre-2022", "ibps-po-pre-2023"],
    sections: ["Reasoning & Computer Aptitude", "English Language", "Data Analysis & Interpretation", "General/Economy/Banking Awareness"],
    questionCount: 155,
    duration: 180,
  },
};

// Also add missing WBCS years to the sitemap (2020–2015) — already in catalog above

/** Export catalog for use elsewhere */
export { PYQ_CATALOG };
export type { PYQEntry };

// ─── Component ───────────────────────────────────────────────────────────────

export default function PreviousYearPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const entry = useMemo(() => (slug ? PYQ_CATALOG[slug] : undefined), [slug]);

  // Apply SEO
  useEffect(() => {
    if (!entry || !slug) return;
    applyExamSeoPayload({
      title: entry.seo.title,
      description: entry.seo.description,
      keywords: entry.seo.keywords,
      canonicalPath: `/previous-year/${slug}`,
      ogTitle: entry.seo.title,
      ogDescription: entry.seo.description,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: entry.examName,
        description: entry.seo.description,
        url: `${window.location.origin}/previous-year/${slug}`,
        educationalLevel: "Competitive Exam",
        about: {
          "@type": "EducationalOccupationalProgram",
          name: entry.examName,
        },
        provider: {
          "@type": "Organization",
          name: "MedhaHub",
          url: "https://medhahub.in",
        },
      },
    });
    window.scrollTo(0, 0);
  }, [entry, slug]);

  // Not found
  if (!entry || !slug) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Paper Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The question paper you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/question-hub">
            <Button>Browse All Papers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const resolvedRelated = entry.relatedSlugs
    .map((s) => ({ slug: s, data: PYQ_CATALOG[s] }))
    .filter((r) => r.data);

  const handleStartTest = () => {
    const pdfPath = `${entry.publicPath}/${entry.filePath}`;
    navigate("/pdf-mock-test", {
      state: {
        pdfPath,
        pdfFileName: entry.examName,
        testType: "pdf",
        folder: entry.folder,
      },
    });
  };

  const handleDownload = () => {
    const pdfPath = `/${entry.publicPath}/${entry.filePath}`;
    window.open(pdfPath, "_blank");
  };

  const examIcon = entry.folder === "police" ? (
    <Shield className="w-8 h-8" />
  ) : (
    <GraduationCap className="w-8 h-8" />
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
      </div>

      {/* ── Breadcrumb ── */}
      <nav className="container max-w-5xl mx-auto px-4 pt-6">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          </li>
          <ChevronRight className="w-3 h-3" />
          <li>
            <Link to="/question-hub" className="hover:text-foreground transition-colors">Previous Question Set</Link>
          </li>
          <ChevronRight className="w-3 h-3" />
          <li>
            <Link to={entry.parentRoute} className="hover:text-foreground transition-colors">
              {entry.parentLabel}
            </Link>
          </li>
          <ChevronRight className="w-3 h-3" />
          <li className="text-foreground font-medium">{entry.year}</li>
        </ol>
      </nav>

      {/* ── Hero Section ── */}
      <header className="container max-w-5xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
              {examIcon}
            </div>
            <div>
              <p className="text-sm text-primary font-medium mb-1 uppercase tracking-wider">
                {entry.subType} • Previous Year Paper
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {entry.examName}
              </h1>
              <h2 className="text-lg text-muted-foreground mt-2">
                Question Paper with Answers — Practice Online Free
              </h2>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <FileText className="w-4 h-4" />
              <span>{entry.questionCount} Questions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{entry.duration} Minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <BookOpen className="w-4 h-4" />
              <span>{entry.sections.length} Sections</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4" />
              <span>1K+ Attempted</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={handleStartTest} className="gap-2">
              <PlayCircle className="w-5 h-5" />
              Start Mock Test
            </Button>
            <Button size="lg" variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
            <Link to={entry.parentRoute}>
              <Button size="lg" variant="ghost" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                All {entry.parentLabel}
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      {/* ── Content sections for SEO ── */}
      <main className="container max-w-5xl mx-auto px-4 pb-12 space-y-10">
        {/* Paper overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            About This Paper
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {entry.seo.description} This paper is part of the{" "}
            <strong className="text-foreground">{entry.examName.split(" ")[0]} {entry.examName.split(" ")[1]}</strong>{" "}
            series on MedhaHub. Practice online with a real exam-like timer, get instant scoring, and review detailed answers after submission.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Questions</p>
              <p className="text-lg font-bold">{entry.questionCount}</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-lg font-bold">{entry.duration} min</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Answers</p>
              <p className="text-lg font-bold">Included</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">AI Analysis</p>
              <p className="text-lg font-bold">Yes</p>
            </div>
          </div>
        </motion.section>

        {/* Sections covered */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Sections Covered
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {entry.sections.map((section) => (
              <div
                key={section}
                className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm">{section}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How to use */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            How to Practice {entry.examName}
          </h2>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">1</span>
              <span>Click <strong className="text-foreground">"Start Mock Test"</strong> above to begin the timed practice session.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">2</span>
              <span>Answer all {entry.questionCount} MCQs within {entry.duration} minutes — just like the real exam.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</span>
              <span>Submit to get your <strong className="text-foreground">instant score, section-wise analysis, and AI-powered insights</strong>.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">4</span>
              <span>Review answers, track progress on your Dashboard, and retake to improve.</span>
            </li>
          </ol>
        </motion.section>

        {/* Related papers — internal linking for SEO */}
        {resolvedRelated.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              More Previous Year Papers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resolvedRelated.map(({ slug: rSlug, data }) => (
                <Link
                  key={rSlug}
                  to={`/previous-year/${rSlug}`}
                  className="group bg-card border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                  <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                    {data.subType} • {data.year}
                  </p>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {data.examName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {data.seo.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                    <FileText className="w-3 h-3" />
                    {data.questionCount} Qs
                    <Clock className="w-3 h-3 ml-2" />
                    {data.duration} min
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Call to action banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-gradient-to-r from-primary/10 to-red-500/10 border border-primary/20 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Start the {entry.examName} mock test now. Timed, scored, and
            completely free on MedhaHub.
          </p>
          <Button size="lg" onClick={handleStartTest} className="gap-2">
            <PlayCircle className="w-5 h-5" />
            Start {entry.examName} Mock Test
          </Button>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
