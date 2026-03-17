// ─────────────────────────────────────────────────────────────────────────────
// Exam Syllabus Data — full syllabus for all target exams
// ─────────────────────────────────────────────────────────────────────────────

import type {
  StudyExamType,
  ExamSyllabus,
  SyllabusSubject,
  Chapter,
  StudyPlanTemplate,
  ChapterQuestion,
} from "@shared/study-types";

// ── Helper to build chapter ───────────────────────────────────────────────────
let _cid = 0;
function ch(name: string, nameBn: string, qCount = 10): Chapter {
  return {
    id: `ch_${++_cid}`,
    name,
    nameBn,
    status: "not_started",
    progress: 0,
    questionCount: qCount,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// ██  WBCS  ████████████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════════

const WBCS_SUBJECTS: SyllabusSubject[] = [
  {
    id: "wbcs_history", name: "History", nameBn: "ইতিহাস", icon: "📜",
    chapters: [
      ch("Ancient India", "প্রাচীন ভারত"),
      ch("Medieval India", "মধ্যযুগীয় ভারত"),
      ch("Modern India", "আধুনিক ভারত"),
      ch("Indian National Movement", "ভারতীয় জাতীয় আন্দোলন"),
      ch("World History", "বিশ্ব ইতিহাস"),
      ch("Bengal Renaissance", "বাংলার নবজাগরণ"),
    ],
  },
  {
    id: "wbcs_geography", name: "Geography", nameBn: "ভূগোল", icon: "🌍",
    chapters: [
      ch("Physical Geography", "ভৌত ভূগোল"),
      ch("Indian Geography", "ভারতের ভূগোল"),
      ch("West Bengal Geography", "পশ্চিমবঙ্গের ভূগোল"),
      ch("World Geography", "বিশ্ব ভূগোল"),
      ch("Climatology", "জলবায়ুবিদ্যা"),
    ],
  },
  {
    id: "wbcs_polity", name: "Polity", nameBn: "রাষ্ট্রবিজ্ঞান", icon: "⚖️",
    chapters: [
      ch("Indian Constitution", "ভারতীয় সংবিধান"),
      ch("Fundamental Rights & Duties", "মৌলিক অধিকার ও কর্তব্য"),
      ch("Parliament & Legislature", "সংসদ ও আইনসভা"),
      ch("Judiciary", "বিচার বিভাগ"),
      ch("Panchayati Raj", "পঞ্চায়েতি রাজ"),
      ch("Public Administration", "জনপ্রশাসন"),
    ],
  },
  {
    id: "wbcs_reasoning", name: "Reasoning", nameBn: "রিজনিং", icon: "🧩",
    chapters: [
      ch("Verbal Reasoning", "মৌখিক রিজনিং"),
      ch("Non-Verbal Reasoning", "অমৌখিক রিজনিং"),
      ch("Logical Reasoning", "যৌক্তিক রিজনিং"),
      ch("Data Interpretation", "তথ্য বিশ্লেষণ"),
    ],
  },
  {
    id: "wbcs_math", name: "Mathematics", nameBn: "গণিত", icon: "📐",
    chapters: [
      ch("Number System", "সংখ্যা পদ্ধতি"),
      ch("Arithmetic", "পাটিগণিত"),
      ch("Algebra", "বীজগণিত"),
      ch("Geometry & Mensuration", "জ্যামিতি ও পরিমিতি"),
      ch("Statistics & Probability", "পরিসংখ্যান ও সম্ভাবনা"),
    ],
  },
  {
    id: "wbcs_ca", name: "Current Affairs", nameBn: "সাম্প্রতিকী", icon: "📰",
    chapters: [
      ch("National Affairs", "জাতীয় বিষয়"),
      ch("International Affairs", "আন্তর্জাতিক বিষয়"),
      ch("West Bengal Affairs", "পশ্চিমবঙ্গ বিষয়"),
      ch("Science & Technology", "বিজ্ঞান ও প্রযুক্তি"),
      ch("Economy & Budget", "অর্থনীতি ও বাজেট"),
    ],
  },
  {
    id: "wbcs_english", name: "English", nameBn: "ইংরেজি", icon: "📝",
    chapters: [
      ch("Grammar", "ব্যাকরণ"),
      ch("Vocabulary", "শব্দভাণ্ডার"),
      ch("Comprehension", "পাঠবোধ"),
      ch("Essay Writing", "প্রবন্ধ"),
    ],
  },
  {
    id: "wbcs_bengali", name: "Bengali", nameBn: "বাংলা", icon: "🖊️",
    chapters: [
      ch("Bengali Grammar", "বাংলা ব্যাকরণ"),
      ch("Bengali Literature", "বাংলা সাহিত্য"),
      ch("Comprehension (Bengali)", "পাঠবোধ (বাংলা)"),
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// ██  WBPSC  ███████████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════════

const WBPSC_SUBJECTS: SyllabusSubject[] = [
  {
    id: "wbpsc_gk", name: "General Knowledge", nameBn: "সাধারণ জ্ঞান", icon: "📚",
    chapters: [
      ch("Indian History", "ভারতের ইতিহাস"),
      ch("Geography", "ভূগোল"),
      ch("Indian Polity", "ভারতীয় রাষ্ট্রনীতি"),
      ch("Economy", "অর্থনীতি"),
      ch("Science", "বিজ্ঞান"),
      ch("West Bengal Special", "পশ্চিমবঙ্গ বিশেষ"),
    ],
  },
  {
    id: "wbpsc_reasoning", name: "Reasoning & Mental Ability", nameBn: "রিজনিং ও মানসিক ক্ষমতা", icon: "🧩",
    chapters: [
      ch("Analytical Reasoning", "বিশ্লেষণাত্মক রিজনিং"),
      ch("Logical Sequence", "যৌক্তিক ক্রম"),
      ch("Number Series", "সংখ্যা সিরিজ"),
      ch("Coding-Decoding", "কোডিং-ডিকোডিং"),
    ],
  },
  {
    id: "wbpsc_math", name: "Arithmetic", nameBn: "পাটিগণিত", icon: "📐",
    chapters: [
      ch("Number System", "সংখ্যা পদ্ধতি"),
      ch("Percentage & Ratio", "শতকরা ও অনুপাত"),
      ch("Profit, Loss & Interest", "লাভ, ক্ষতি ও সুদ"),
      ch("Time, Speed & Work", "সময়, গতি ও কাজ"),
    ],
  },
  {
    id: "wbpsc_english", name: "English", nameBn: "ইংরেজি", icon: "📝",
    chapters: [
      ch("Grammar Fundamentals", "ব্যাকরণ মৌলিক"),
      ch("Vocabulary & Synonyms", "শব্দভাণ্ডার"),
      ch("Reading Comprehension", "পাঠবোধ"),
    ],
  },
  {
    id: "wbpsc_bengali", name: "Bengali", nameBn: "বাংলা", icon: "🖊️",
    chapters: [
      ch("Bengali Grammar", "বাংলা ব্যাকরণ"),
      ch("Bengali Literature", "বাংলা সাহিত্য"),
    ],
  },
  {
    id: "wbpsc_ca", name: "Current Affairs", nameBn: "সাম্প্রতিকী", icon: "📰",
    chapters: [
      ch("National & International", "জাতীয় ও আন্তর্জাতিক"),
      ch("Awards & Sports", "পুরস্কার ও খেলাধুলা"),
      ch("West Bengal Current Affairs", "পশ্চিমবঙ্গ সাম্প্রতিকী"),
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// ██  Police SI  ██████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════════

const POLICE_SI_SUBJECTS: SyllabusSubject[] = [
  {
    id: "psi_gk", name: "General Knowledge", nameBn: "সাধারণ জ্ঞান", icon: "📚",
    chapters: [
      ch("Indian History", "ভারতের ইতিহাস"),
      ch("Geography", "ভূগোল"),
      ch("Indian Polity", "ভারতীয় রাষ্ট্রনীতি"),
      ch("General Science", "সাধারণ বিজ্ঞান"),
      ch("West Bengal Special", "পশ্চিমবঙ্গ বিশেষ"),
    ],
  },
  {
    id: "psi_reasoning", name: "Reasoning", nameBn: "রিজনিং", icon: "🧩",
    chapters: [
      ch("Analytical Reasoning", "বিশ্লেষণাত্মক রিজনিং"),
      ch("Logical Deduction", "যৌক্তিক অনুমান"),
      ch("Pattern Recognition", "প্যাটার্ন চিনতে পারা"),
      ch("Blood Relations & Directions", "রক্তসম্পর্ক ও দিক"),
    ],
  },
  {
    id: "psi_math", name: "Mathematics", nameBn: "গণিত", icon: "📐",
    chapters: [
      ch("Arithmetic", "পাটিগণিত"),
      ch("Algebra Basics", "বীজগণিত মৌলিক"),
      ch("Geometry", "জ্যামিতি"),
      ch("Data Interpretation", "তথ্য বিশ্লেষণ"),
    ],
  },
  {
    id: "psi_english", name: "English", nameBn: "ইংরেজি", icon: "📝",
    chapters: [
      ch("Grammar", "ব্যাকরণ"),
      ch("Vocabulary", "শব্দভাণ্ডার"),
      ch("Comprehension", "পাঠবোধ"),
    ],
  },
  {
    id: "psi_bengali", name: "Bengali", nameBn: "বাংলা", icon: "🖊️",
    chapters: [
      ch("Bengali Grammar", "বাংলা ব্যাকরণ"),
      ch("Bengali Literature", "বাংলা সাহিত্য"),
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// ██  SSC CGL  ████████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════════

const SSC_CGL_SUBJECTS: SyllabusSubject[] = [
  {
    id: "ssc_reasoning", name: "General Intelligence & Reasoning", nameBn: "সাধারণ বুদ্ধিমত্তা", icon: "🧩",
    chapters: [
      ch("Analogy & Classification", "সাদৃশ্য ও শ্রেণীবিভাগ"),
      ch("Coding-Decoding", "কোডিং-ডিকোডিং"),
      ch("Series & Patterns", "সিরিজ ও প্যাটার্ন"),
      ch("Syllogism", "ন্যায়বিচার"),
      ch("Venn Diagrams", "ভেন ডায়াগ্রাম"),
      ch("Non-Verbal Reasoning", "অমৌখিক রিজনিং"),
    ],
  },
  {
    id: "ssc_math", name: "Quantitative Aptitude", nameBn: "পরিমাণগত দক্ষতা", icon: "📐",
    chapters: [
      ch("Number System & Simplification", "সংখ্যা পদ্ধতি"),
      ch("Percentage, Ratio & Proportion", "শতকরা, অনুপাত"),
      ch("Profit, Loss & Discount", "লাভ, ক্ষতি ও ছাড়"),
      ch("Time & Work", "সময় ও কাজ"),
      ch("Speed, Distance & Time", "গতি, দূরত্ব ও সময়"),
      ch("Algebra", "বীজগণিত"),
      ch("Geometry & Trigonometry", "জ্যামিতি ও ত্রিকোণমিতি"),
      ch("Statistics", "পরিসংখ্যান"),
    ],
  },
  {
    id: "ssc_english", name: "English Language", nameBn: "ইংরেজি", icon: "📝",
    chapters: [
      ch("Spot the Error", "ভুল চিহ্নিতকরণ"),
      ch("Fill in the Blanks", "শূন্যস্থান পূরণ"),
      ch("Synonyms & Antonyms", "সমার্থক ও বিপরীত শব্দ"),
      ch("Idioms & Phrases", "বাগ্ধারা"),
      ch("One Word Substitution", "এক শব্দে প্রকাশ"),
      ch("Reading Comprehension", "পাঠবোধ"),
    ],
  },
  {
    id: "ssc_gk", name: "General Awareness", nameBn: "সাধারণ সচেতনতা", icon: "📚",
    chapters: [
      ch("Indian History", "ভারতের ইতিহাস"),
      ch("Geography", "ভূগোল"),
      ch("Indian Polity", "ভারতীয় রাষ্ট্রনীতি"),
      ch("Economy", "অর্থনীতি"),
      ch("General Science", "সাধারণ বিজ্ঞান"),
      ch("Current Affairs", "সাম্প্রতিকী"),
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// ██  Banking IBPS/SBI  ███████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════════

const BANKING_SUBJECTS: SyllabusSubject[] = [
  {
    id: "bank_reasoning", name: "Reasoning Ability", nameBn: "রিজনিং ক্ষমতা", icon: "🧩",
    chapters: [
      ch("Seating Arrangement", "আসন বিন্যাস"),
      ch("Puzzles", "ধাঁধা"),
      ch("Syllogism", "ন্যায়বিচার"),
      ch("Inequality", "অসমতা"),
      ch("Blood Relations", "রক্তসম্পর্ক"),
      ch("Direction & Distance", "দিক ও দূরত্ব"),
      ch("Coding-Decoding", "কোডিং-ডিকোডিং"),
    ],
  },
  {
    id: "bank_quant", name: "Quantitative Aptitude", nameBn: "পরিমাণগত দক্ষতা", icon: "📐",
    chapters: [
      ch("Number Series", "সংখ্যা সিরিজ"),
      ch("Simplification & Approximation", "সরলীকরণ"),
      ch("Data Interpretation", "তথ্য বিশ্লেষণ"),
      ch("Percentage & Average", "শতকরা ও গড়"),
      ch("Profit, Loss & Interest", "লাভ, ক্ষতি ও সুদ"),
      ch("Time, Speed & Distance", "সময়, গতি ও দূরত্ব"),
      ch("Quadratic Equations", "দ্বিঘাত সমীকরণ"),
    ],
  },
  {
    id: "bank_english", name: "English Language", nameBn: "ইংরেজি", icon: "📝",
    chapters: [
      ch("Reading Comprehension", "পাঠবোধ"),
      ch("Cloze Test", "ক্লোজ টেস্ট"),
      ch("Error Detection", "ভুল সনাক্তকরণ"),
      ch("Para Jumbles", "প্যারা জাম্বল"),
      ch("Vocabulary", "শব্দভাণ্ডার"),
    ],
  },
  {
    id: "bank_ga", name: "General Awareness", nameBn: "সাধারণ সচেতনতা", icon: "📚",
    chapters: [
      ch("Banking Awareness", "ব্যাংকিং সচেতনতা"),
      ch("Financial Awareness", "আর্থিক সচেতনতা"),
      ch("Static GK", "স্থিতিশীল সাধারণ জ্ঞান"),
      ch("Current Affairs", "সাম্প্রতিকী"),
    ],
  },
  {
    id: "bank_computer", name: "Computer Knowledge", nameBn: "কম্পিউটার জ্ঞান", icon: "💻",
    chapters: [
      ch("Computer Fundamentals", "কম্পিউটার মৌলিক"),
      ch("Networking & Internet", "নেটওয়ার্কিং ও ইন্টারনেট"),
      ch("MS Office", "এমএস অফিস"),
      ch("Cyber Security Basics", "সাইবার নিরাপত্তা"),
    ],
  },
];

// ── Master syllabus map ───────────────────────────────────────────────────────
export const EXAM_SYLLABUS: Record<StudyExamType, ExamSyllabus> = {
  WBCS:      { examId: "WBCS",      subjects: WBCS_SUBJECTS },
  WBPSC:     { examId: "WBPSC",     subjects: WBPSC_SUBJECTS },
  Police_SI: { examId: "Police_SI", subjects: POLICE_SI_SUBJECTS },
  SSC_CGL:   { examId: "SSC_CGL",   subjects: SSC_CGL_SUBJECTS },
  Banking:   { examId: "Banking",   subjects: BANKING_SUBJECTS },
};

// ── Fixed Study Plan Templates ────────────────────────────────────────────────
export const STUDY_TEMPLATES: Record<StudyExamType, StudyPlanTemplate> = {
  WBCS: {
    examId: "WBCS",
    phases: [
      {
        phase: 1, title: "Foundation Building", duration: "Weeks 1–8", description: "Cover all core subjects at a conceptual level.",
        topics: [
          { subject: "History", chapters: ["Ancient India", "Medieval India", "Modern India"] },
          { subject: "Geography", chapters: ["Physical Geography", "Indian Geography"] },
          { subject: "Polity", chapters: ["Indian Constitution", "Fundamental Rights"] },
          { subject: "Mathematics", chapters: ["Number System", "Arithmetic"] },
        ],
      },
      {
        phase: 2, title: "Deep Dive & Practice", duration: "Weeks 9–16", description: "Subject-wise practice + mock tests + weak area focus.",
        topics: [
          { subject: "History", chapters: ["Indian National Movement", "Bengal Renaissance", "World History"] },
          { subject: "Geography", chapters: ["West Bengal Geography", "Climatology", "World Geography"] },
          { subject: "Polity", chapters: ["Parliament", "Judiciary", "Panchayati Raj"] },
          { subject: "Reasoning", chapters: ["Verbal Reasoning", "Logical Reasoning", "Data Interpretation"] },
        ],
      },
      {
        phase: 3, title: "Revision & Mock Tests", duration: "Weeks 17–22", description: "Full-length mocks, revision of weak areas, current affairs catch-up.",
        topics: [
          { subject: "Current Affairs", chapters: ["National", "International", "West Bengal", "Science & Tech"] },
          { subject: "English", chapters: ["Grammar", "Vocabulary", "Comprehension"] },
          { subject: "Bengali", chapters: ["Bengali Grammar", "Bengali Literature"] },
        ],
      },
    ],
  },
  WBPSC: {
    examId: "WBPSC",
    phases: [
      {
        phase: 1, title: "Core GK & Reasoning", duration: "Weeks 1–6",
        description: "Build strong GK base + start reasoning practice.",
        topics: [
          { subject: "General Knowledge", chapters: ["Indian History", "Geography", "Indian Polity"] },
          { subject: "Reasoning", chapters: ["Analytical Reasoning", "Number Series"] },
        ],
      },
      {
        phase: 2, title: "Math & Language", duration: "Weeks 7–12",
        description: "Strengthen arithmetic and language skills.",
        topics: [
          { subject: "Arithmetic", chapters: ["Percentage & Ratio", "Profit, Loss & Interest", "Time, Speed & Work"] },
          { subject: "English", chapters: ["Grammar Fundamentals", "Vocabulary & Synonyms"] },
          { subject: "Bengali", chapters: ["Bengali Grammar", "Bengali Literature"] },
        ],
      },
      {
        phase: 3, title: "Revision & Full Mocks", duration: "Weeks 13–16",
        description: "Revise all subjects + attempt full-length mock tests.",
        topics: [
          { subject: "General Knowledge", chapters: ["Economy", "Science", "WB Special"] },
          { subject: "Current Affairs", chapters: ["National & International", "WB Current Affairs"] },
        ],
      },
    ],
  },
  Police_SI: {
    examId: "Police_SI",
    phases: [
      {
        phase: 1, title: "Foundation", duration: "Weeks 1–5",
        description: "Cover GK, Reasoning fundamentals, basic math.",
        topics: [
          { subject: "General Knowledge", chapters: ["Indian History", "Geography", "General Science"] },
          { subject: "Reasoning", chapters: ["Analytical Reasoning", "Logical Deduction"] },
        ],
      },
      {
        phase: 2, title: "Practice & Depth", duration: "Weeks 6–10",
        description: "Advance reasoning + Math problem solving + language.",
        topics: [
          { subject: "Mathematics", chapters: ["Arithmetic", "Algebra Basics", "Geometry"] },
          { subject: "English", chapters: ["Grammar", "Vocabulary", "Comprehension"] },
          { subject: "Bengali", chapters: ["Bengali Grammar", "Bengali Literature"] },
        ],
      },
      {
        phase: 3, title: "Mock Tests & Revision", duration: "Weeks 11–14",
        description: "Full mocks + weak area focus + current affairs.",
        topics: [
          { subject: "General Knowledge", chapters: ["Indian Polity", "WB Special"] },
          { subject: "Reasoning", chapters: ["Pattern Recognition", "Blood Relations"] },
        ],
      },
    ],
  },
  SSC_CGL: {
    examId: "SSC_CGL",
    phases: [
      {
        phase: 1, title: "Tier I Foundation", duration: "Weeks 1–8",
        description: "Reasoning + Quant basics + English grammar.",
        topics: [
          { subject: "Reasoning", chapters: ["Analogy", "Coding-Decoding", "Series & Patterns", "Syllogism"] },
          { subject: "Quantitative Aptitude", chapters: ["Number System", "Percentage & Ratio", "Profit, Loss"] },
          { subject: "English", chapters: ["Spot the Error", "Synonyms & Antonyms"] },
        ],
      },
      {
        phase: 2, title: "Advanced Practice", duration: "Weeks 9–16",
        description: "Advanced quant + GK + full-length sectional tests.",
        topics: [
          { subject: "Quantitative Aptitude", chapters: ["Algebra", "Geometry & Trigonometry", "Statistics"] },
          { subject: "General Awareness", chapters: ["Indian History", "Polity", "Economy", "Science"] },
          { subject: "English", chapters: ["Idioms", "One Word", "Reading Comprehension"] },
        ],
      },
      {
        phase: 3, title: "Mock Tests & Revision", duration: "Weeks 17–22",
        description: "Full-length mocks + current affairs + revision.",
        topics: [
          { subject: "General Awareness", chapters: ["Geography", "Current Affairs"] },
          { subject: "Reasoning", chapters: ["Venn Diagrams", "Non-Verbal Reasoning"] },
        ],
      },
    ],
  },
  Banking: {
    examId: "Banking",
    phases: [
      {
        phase: 1, title: "Prelims Preparation", duration: "Weeks 1–8",
        description: "Focus on Reasoning, Quant and English for Prelims.",
        topics: [
          { subject: "Reasoning", chapters: ["Seating Arrangement", "Puzzles", "Syllogism", "Inequality"] },
          { subject: "Quantitative Aptitude", chapters: ["Number Series", "Simplification", "Data Interpretation"] },
          { subject: "English", chapters: ["Reading Comprehension", "Cloze Test", "Error Detection"] },
        ],
      },
      {
        phase: 2, title: "Mains Deep Dive", duration: "Weeks 9–16",
        description: "Advanced topics + GA + Computer Knowledge.",
        topics: [
          { subject: "Reasoning", chapters: ["Blood Relations", "Direction", "Coding-Decoding"] },
          { subject: "Quantitative Aptitude", chapters: ["Percentage", "Profit/Loss", "Time/Speed", "Quadratic Eq."] },
          { subject: "General Awareness", chapters: ["Banking Awareness", "Financial Awareness", "Current Affairs"] },
          { subject: "Computer Knowledge", chapters: ["Fundamentals", "Networking", "MS Office"] },
        ],
      },
      {
        phase: 3, title: "Mocks & Interview Prep", duration: "Weeks 17–20",
        description: "Full-length mocks + interview preparation.",
        topics: [
          { subject: "English", chapters: ["Para Jumbles", "Vocabulary"] },
          { subject: "General Awareness", chapters: ["Static GK", "Current Affairs"] },
        ],
      },
    ],
  },
};

// ── Chapter question banks (sample questions per chapter) ─────────────────────
// In production these come from the API; here we seed a few per chapter pattern

function generateChapterQuestions(chapterId: string, chapterName: string): ChapterQuestion[] {
  // Generate 10 contextual MCQs for any chapter
  const templates: Array<{
    q: string; opts: [string, string, string, string]; correct: number; exp: string;
  }> = [
    {
      q: `Which of the following is most closely related to ${chapterName}?`,
      opts: ["Option A - Core concept", "Option B - Related concept", "Option C - Unrelated topic", "Option D - Partially related"],
      correct: 0, exp: `Option A is directly related to the core concepts of ${chapterName}.`,
    },
    {
      q: `What is the primary focus of ${chapterName}?`,
      opts: ["Understanding fundamentals", "Advanced applications", "Historical background", "Statistical analysis"],
      correct: 0, exp: `The primary focus is on understanding the fundamentals of ${chapterName}.`,
    },
    {
      q: `In the context of ${chapterName}, which statement is correct?`,
      opts: ["Statement 1 is correct", "Statement 2 is correct", "Both are correct", "Neither is correct"],
      correct: 2, exp: `Both statements are correct in the context of ${chapterName}.`,
    },
    {
      q: `Which year is significant in the study of ${chapterName}?`,
      opts: ["1947", "1950", "1991", "2000"],
      correct: 1, exp: `1950 is a significant year in the context of ${chapterName} and Indian governance.`,
    },
    {
      q: `Who is associated with the development of ${chapterName} concepts?`,
      opts: ["Scholar A", "Scholar B", "Scholar C", "Scholar D"],
      correct: 0, exp: `Scholar A made significant contributions to the field of ${chapterName}.`,
    },
    {
      q: `The key principle of ${chapterName} is:`,
      opts: ["Systematic approach", "Random application", "Historical reference only", "None of the above"],
      correct: 0, exp: `A systematic approach is the key principle in ${chapterName}.`,
    },
    {
      q: `Which of these is NOT part of ${chapterName}?`,
      opts: ["Core topic 1", "Core topic 2", "Unrelated topic X", "Core topic 3"],
      correct: 2, exp: `Unrelated topic X does not belong to the syllabus of ${chapterName}.`,
    },
    {
      q: `The exam typically asks how many questions from ${chapterName}?`,
      opts: ["1-2 questions", "3-5 questions", "5-8 questions", "More than 10"],
      correct: 1, exp: `Typically 3-5 questions appear from ${chapterName} in most exams.`,
    },
    {
      q: `What is the best strategy to study ${chapterName}?`,
      opts: ["Read NCERT + practice MCQs", "Only solve previous year papers", "Skip if difficult", "Memorize everything"],
      correct: 0, exp: `Reading NCERT and practicing MCQs is the most effective strategy for ${chapterName}.`,
    },
    {
      q: `In a competitive exam, ${chapterName} falls under which section?`,
      opts: ["General Studies", "Subject Specific", "Language", "Aptitude"],
      correct: 0, exp: `${chapterName} typically falls under General Studies in most competitive exams.`,
    },
  ];

  return templates.map((t, i) => ({
    id: i + 1,
    question: t.q,
    options: t.opts,
    correctIndex: t.correct,
    explanation: t.exp,
  }));
}

// Export a function to get questions for any chapter
export function getChapterQuestions(chapterId: string): ChapterQuestion[] {
  // Find the chapter name from syllabus
  for (const exam of Object.values(EXAM_SYLLABUS)) {
    for (const subject of exam.subjects) {
      for (const chapter of subject.chapters) {
        if (chapter.id === chapterId) {
          return generateChapterQuestions(chapterId, chapter.name);
        }
      }
    }
  }
  return generateChapterQuestions(chapterId, "General Studies");
}

// ── Get saved syllabus progress from localStorage ─────────────────────────────
const SYLLABUS_PROGRESS_KEY = "syllabus_progress";

export interface SavedChapterProgress {
  chapterId: string;
  status: "not_started" | "in_progress" | "done";
  progress: number;
  lastScore?: number;
}

export function getSavedProgress(): Record<string, SavedChapterProgress> {
  try {
    const raw = localStorage.getItem(SYLLABUS_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveChapterProgress(chapterId: string, data: Partial<SavedChapterProgress>) {
  const all = getSavedProgress();
  all[chapterId] = { chapterId, status: "not_started", progress: 0, ...all[chapterId], ...data };
  localStorage.setItem(SYLLABUS_PROGRESS_KEY, JSON.stringify(all));
}

export function getExamSyllabusWithProgress(examId: StudyExamType): ExamSyllabus {
  const syllabus = EXAM_SYLLABUS[examId];
  if (!syllabus) return EXAM_SYLLABUS.WBCS;
  const progress = getSavedProgress();

  return {
    ...syllabus,
    subjects: syllabus.subjects.map((s) => ({
      ...s,
      chapters: s.chapters.map((c) => {
        const saved = progress[c.id];
        return saved ? { ...c, status: saved.status, progress: saved.progress } : c;
      }),
    })),
  };
}

// ── AI Plan persistence ───────────────────────────────────────────────────────
const AI_PLAN_KEY = "ai_study_plan";

export function getSavedAIPlan(): import("@shared/study-types").AIStudyPlan | null {
  try {
    const raw = localStorage.getItem(AI_PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAIPlan(plan: import("@shared/study-types").AIStudyPlan) {
  localStorage.setItem(AI_PLAN_KEY, JSON.stringify(plan));
}

// ── Exam preference persistence ───────────────────────────────────────────────
const STUDY_EXAM_KEY = "study_exam_preference";

export function getStudyExamPreference(): StudyExamType | null {
  try {
    return localStorage.getItem(STUDY_EXAM_KEY) as StudyExamType | null;
  } catch {
    return null;
  }
}

export function saveStudyExamPreference(examId: StudyExamType) {
  localStorage.setItem(STUDY_EXAM_KEY, examId);
}
