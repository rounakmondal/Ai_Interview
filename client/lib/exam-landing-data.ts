/**
 * Exam-specific landing page configuration data.
 * Each entry drives an SEO-optimised, exam-specific landing page.
 */

export interface ExamFeature {
  icon: string;          // Lucide icon name key
  title: string;
  description: string;
}

export interface ExamSubject {
  name: string;
  questions: string;     // e.g. "25–30"
  priority: "high" | "medium" | "low";
}

export interface ExamFAQ {
  question: string;
  answer: string;
}

export interface ExamLandingConfig {
  slug: string;          // URL path segment: /exam/wbcs
  name: string;          // Display name
  fullName: string;      // Full official name
  tagline: string;       // Hero subtitle
  heroDescription: string;
  gradient: string;      // Tailwind gradient classes
  accentColor: string;   // Tailwind color key (e.g. "violet")
  mockTestLink: string;  // Link to existing mock test page
  syllabusLink?: string;
  blogLinks: { label: string; href: string }[];
  examPattern: {
    stage: string;
    type: string;
    marks: string;
    duration: string;
  }[];
  subjects: ExamSubject[];
  features: ExamFeature[];
  faqs: ExamFAQ[];
  stats: { label: string; value: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export const EXAM_CONFIGS: ExamLandingConfig[] = [
  {
    slug: "wbcs",
    name: "WBCS",
    fullName: "West Bengal Civil Service",
    tagline: "Crack WBCS 2026 with AI-Powered Preparation",
    heroDescription: "Free mock tests, previous year papers, AI-scored practice & complete syllabus coverage for WBCS Prelims & Mains — in English and Bengali.",
    gradient: "from-violet-600 to-indigo-600",
    accentColor: "violet",
    mockTestLink: "/wbcs-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [
      { label: "WBCS Preparation Strategy 2026", href: "/blog/wbcs-preparation-strategy-2026" },
      { label: "How to Crack WBCS in First Attempt", href: "/blog/how-to-crack-wbcs-first-attempt" },
      { label: "Top 50 GK Questions for WBCS", href: "/blog/top-50-gk-questions-wbcs-prelims-2026" },
    ],
    examPattern: [
      { stage: "Prelims", type: "200 MCQs (English + Bengali + GS)", marks: "200", duration: "2.5 hours" },
      { stage: "Mains", type: "Descriptive (6 papers)", marks: "1200", duration: "3 hours each" },
      { stage: "Interview", type: "Personality Test", marks: "200", duration: "—" },
    ],
    subjects: [
      { name: "History", questions: "25–30", priority: "high" },
      { name: "Geography", questions: "20–25", priority: "high" },
      { name: "Polity", questions: "15–20", priority: "high" },
      { name: "Science", questions: "20–25", priority: "medium" },
      { name: "Economy", questions: "10–15", priority: "medium" },
      { name: "Current Affairs", questions: "15–20", priority: "high" },
    ],
    features: [
      { icon: "FileText", title: "Full Mock Tests", description: "200-question full-length papers simulating real exam conditions" },
      { icon: "Clock", title: "Timed Practice", description: "2.5-hour countdown timer with auto-submit" },
      { icon: "BarChart3", title: "AI Analytics", description: "Subject-wise accuracy breakdown & AI-generated weak area tips" },
      { icon: "History", title: "Previous Year Papers", description: "All WBCS Prelims papers from 2015–2024 with solutions" },
      { icon: "BookOpen", title: "Bengali Support", description: "Full question bank available in Bengali & English" },
      { icon: "Trophy", title: "Leaderboard", description: "Compare your score with thousands of aspirants across West Bengal" },
    ],
    faqs: [
      { question: "Is WBCS mock test free on MedhaHub?", answer: "Yes! You can take unlimited free mock tests with detailed analytics. No signup required for your first test." },
      { question: "Are questions available in Bengali?", answer: "Yes, all WBCS questions are available in both English and Bengali — just like the real exam." },
      { question: "How similar are these to the real exam?", answer: "Our questions are curated from previous year papers and expert-created questions following the exact WBPSC pattern." },
      { question: "Can I track my progress over time?", answer: "Yes. Your dashboard shows score trends, subject-wise improvement, and personalized study recommendations." },
    ],
    stats: [
      { label: "Mock Tests", value: "50+" },
      { label: "Questions", value: "10,000+" },
      { label: "Active Students", value: "5,000+" },
      { label: "Languages", value: "EN + BN" },
    ],
    seo: {
      title: "WBCS Mock Test 2026 Free — Previous Year Papers & AI Practice | MedhaHub",
      description: "Free WBCS mock test 2026 with previous year question papers, AI scoring & Bengali support. Practice WBCS Prelims & Mains online. Start free now!",
      keywords: "WBCS mock test 2026, WBCS previous year question paper, WBCS prelims practice, WBPSC exam preparation, ডব্লিউবিসিএস মক টেস্ট, WBCS Bengali mock test, West Bengal Civil Service online test, WBCS free mock test",
    },
  },
  {
    slug: "wbpsc-clerkship",
    name: "WBPSC Clerkship",
    fullName: "West Bengal Public Service Commission Clerkship",
    tagline: "WBPSC Clerkship 2026 — Complete Preparation Platform",
    heroDescription: "Practice with real shift-wise question papers from 2024, AI-scored mock tests, and detailed analytics for WBPSC Clerkship exam.",
    gradient: "from-emerald-600 to-teal-600",
    accentColor: "emerald",
    mockTestLink: "/wbpsc-clerkship-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [
      { label: "WBPSC Clerkship Previous Year Papers", href: "/blog/wbpsc-clerkship-previous-year-papers" },
      { label: "WBPSC Preparation in Bengali", href: "/blog/wbpsc-preparation-in-bengali" },
      { label: "WBPSC Clerkship 2024 Paper Analysis", href: "/blog/wbpsc-clerkship-2024-question-paper-analysis" },
    ],
    examPattern: [
      { stage: "Written Test", type: "100 MCQs (GK + Math + English + Bengali)", marks: "100", duration: "1.5 hours" },
      { stage: "Interview", type: "Personality Test", marks: "—", duration: "—" },
    ],
    subjects: [
      { name: "General Knowledge", questions: "30–35", priority: "high" },
      { name: "Mathematics", questions: "20–25", priority: "high" },
      { name: "English", questions: "20–25", priority: "medium" },
      { name: "Bengali", questions: "15–20", priority: "medium" },
    ],
    features: [
      { icon: "FileText", title: "Shift-wise 2024 Papers", description: "All shift papers from WBPSC Clerkship 2024 with solutions" },
      { icon: "Clock", title: "Timed Mock Tests", description: "1.5-hour exam simulation with real question distribution" },
      { icon: "BarChart3", title: "Performance Analytics", description: "Subject-wise and difficulty-wise score breakdown" },
      { icon: "BookOpen", title: "Bengali + English", description: "Complete bilingual question bank" },
      { icon: "Brain", title: "AI Recommendations", description: "Personalized study tips based on your weak areas" },
      { icon: "Trophy", title: "Score Comparison", description: "See where you stand among all aspirants" },
    ],
    faqs: [
      { question: "Is WBPSC Clerkship mock test free?", answer: "Yes! Take unlimited free mock tests with instant results and detailed analysis." },
      { question: "Do you have 2024 Clerkship question papers?", answer: "Yes, we have all shift-wise papers from the 2024 WBPSC Clerkship exam with detailed solutions." },
      { question: "What subjects are covered?", answer: "General Knowledge, Mathematics, English, and Bengali — exactly matching the WBPSC Clerkship syllabus." },
    ],
    stats: [
      { label: "Mock Tests", value: "30+" },
      { label: "Questions", value: "5,000+" },
      { label: "Active Students", value: "3,000+" },
      { label: "Languages", value: "EN + BN" },
    ],
    seo: {
      title: "WBPSC Clerkship Mock Test 2026 Free — Previous Year Papers | MedhaHub",
      description: "Free WBPSC Clerkship mock test with 2024 shift-wise question papers, AI scoring & Bengali support. Practice online now!",
      keywords: "WBPSC Clerkship mock test, WBPSC Clerkship 2024 question paper, WBPSC Clerkship previous year paper, ক্লার্কশিপ মক টেস্ট, WBPSC preparation online, WBPSC Clerkship free mock test",
    },
  },
  {
    slug: "wb-police",
    name: "WB Police",
    fullName: "West Bengal Police SI & Constable",
    tagline: "WB Police Recruitment 2026 — Mock Tests & PYQs",
    heroDescription: "Prepare for WB Police SI & Constable exams with free mock tests, previous year question papers, and AI-powered analytics.",
    gradient: "from-blue-600 to-cyan-600",
    accentColor: "blue",
    mockTestLink: "/wbp-police-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [
      { label: "WB Police SI Mock Test Free", href: "/blog/wb-police-si-mock-test-free" },
      { label: "WB Police Constable Previous Year Paper", href: "/blog/wb-police-constable-previous-year-paper" },
    ],
    examPattern: [
      { stage: "Prelims", type: "MCQs (GK + Math + Reasoning + English)", marks: "100", duration: "1 hour" },
      { stage: "Physical Test", type: "Physical Measurement & Efficiency", marks: "Qualifying", duration: "—" },
      { stage: "Interview", type: "Personality Test", marks: "—", duration: "—" },
    ],
    subjects: [
      { name: "General Knowledge", questions: "25–30", priority: "high" },
      { name: "Mathematics", questions: "20–25", priority: "high" },
      { name: "Reasoning", questions: "20–25", priority: "high" },
      { name: "English/Bengali", questions: "15–20", priority: "medium" },
    ],
    features: [
      { icon: "Shield", title: "SI & Constable Papers", description: "Separate mock tests for Sub-Inspector and Constable exams" },
      { icon: "FileText", title: "Previous Year Papers", description: "WBP SI & Constable papers from 2018–2024" },
      { icon: "Clock", title: "Timed Practice", description: "Exam-condition timed tests with auto-submit" },
      { icon: "BarChart3", title: "Score Analytics", description: "Detailed performance breakdown by subject" },
      { icon: "BookOpen", title: "Bengali Support", description: "Questions in English and Bengali" },
      { icon: "Trophy", title: "Rank Predictor", description: "See your expected rank based on mock scores" },
    ],
    faqs: [
      { question: "Are WB Police mock tests free?", answer: "Yes! Both SI and Constable mock tests are free with instant results." },
      { question: "Is there separate content for SI and Constable?", answer: "Yes. We have dedicated question sets for both WBP SI and WBP Constable recruitment exams." },
      { question: "Can I practice in Bengali?", answer: "Yes, all questions are available in both English and Bengali." },
    ],
    stats: [
      { label: "Mock Tests", value: "40+" },
      { label: "Questions", value: "8,000+" },
      { label: "Active Students", value: "4,000+" },
      { label: "Languages", value: "EN + BN" },
    ],
    seo: {
      title: "WB Police Mock Test 2026 Free — SI & Constable Practice Papers | MedhaHub",
      description: "Free WB Police SI & Constable mock tests with previous year papers, AI scoring & Bengali support. Prepare for WBP recruitment 2026!",
      keywords: "WB Police mock test, WBP SI mock test 2026, WBP Constable mock test, West Bengal Police previous year paper, পশ্চিমবঙ্গ পুলিশ মক টেস্ট, WB Police recruitment preparation",
    },
  },
  {
    slug: "ssc-mts",
    name: "SSC MTS",
    fullName: "Staff Selection Commission Multi-Tasking Staff",
    tagline: "SSC MTS 2026 — Free Mock Tests & AI Practice",
    heroDescription: "Practice SSC MTS with real shift-wise papers from 2019–2023, AI-powered scoring, and comprehensive performance analytics.",
    gradient: "from-amber-600 to-orange-600",
    accentColor: "amber",
    mockTestLink: "/ssc-mts-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [
      { label: "SSC MTS Previous Year Question Papers", href: "/blog/ssc-mts-previous-year-question-papers" },
    ],
    examPattern: [
      { stage: "Paper I", type: "MCQs (GK + Math + Reasoning + English)", marks: "100", duration: "1.5 hours" },
      { stage: "Paper II", type: "Descriptive (Short Essay/Letter)", marks: "50", duration: "30 min" },
    ],
    subjects: [
      { name: "General Awareness", questions: "25", priority: "high" },
      { name: "Quantitative Aptitude", questions: "25", priority: "high" },
      { name: "Reasoning", questions: "25", priority: "high" },
      { name: "English", questions: "25", priority: "medium" },
    ],
    features: [
      { icon: "FileText", title: "Shift-wise Papers", description: "SSC MTS 2019 & 2023 all-shift question papers with answers" },
      { icon: "Clock", title: "Timed Mock Tests", description: "1.5-hour exam simulation with real difficulty" },
      { icon: "BarChart3", title: "Section Analysis", description: "See accuracy for each section — GK, Math, Reasoning, English" },
      { icon: "Brain", title: "AI-Generated Questions", description: "Fresh AI-generated questions in SSC MTS pattern" },
      { icon: "BookOpen", title: "Solution Explanations", description: "Detailed explanations for every question" },
      { icon: "Trophy", title: "All-India Rank", description: "Compare your preparation with aspirants across India" },
    ],
    faqs: [
      { question: "Is SSC MTS mock test free?", answer: "Yes! Unlimited free mock tests with detailed solutions and AI analytics." },
      { question: "Do you have shift-wise papers?", answer: "Yes. We have morning, afternoon, and evening shift papers from SSC MTS 2019 and 2023." },
      { question: "Are questions AI-generated?", answer: "We offer both real PYQ papers and AI-generated fresh questions following the exact SSC MTS pattern." },
    ],
    stats: [
      { label: "Mock Tests", value: "35+" },
      { label: "Questions", value: "7,000+" },
      { label: "Active Students", value: "6,000+" },
      { label: "Shift Papers", value: "15+" },
    ],
    seo: {
      title: "SSC MTS Mock Test 2026 Free — Previous Year Papers & AI Practice | MedhaHub",
      description: "Free SSC MTS mock test with 2019 & 2023 shift-wise question papers, AI scoring & detailed analytics. Practice online now!",
      keywords: "SSC MTS mock test 2026, SSC MTS previous year paper, SSC MTS 2023 question paper, SSC MTS online practice free, SSC MTS preparation, SSC MTS GK questions",
    },
  },
  {
    slug: "ssc-cgl",
    name: "SSC CGL",
    fullName: "Staff Selection Commission Combined Graduate Level",
    tagline: "SSC CGL 2026 — Complete Exam Preparation",
    heroDescription: "Prepare for SSC CGL Tier I & II with AI-powered mock tests, section-wise practice, and detailed performance analytics.",
    gradient: "from-rose-600 to-pink-600",
    accentColor: "rose",
    mockTestLink: "/ssc-cgl-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [],
    examPattern: [
      { stage: "Tier I", type: "MCQs (GK + Math + Reasoning + English)", marks: "200", duration: "1 hour" },
      { stage: "Tier II", type: "MCQs (Quant + English + Stats + GK)", marks: "800", duration: "Varies" },
    ],
    subjects: [
      { name: "Quantitative Aptitude", questions: "25", priority: "high" },
      { name: "General Intelligence", questions: "25", priority: "high" },
      { name: "English Language", questions: "25", priority: "medium" },
      { name: "General Awareness", questions: "25", priority: "high" },
    ],
    features: [
      { icon: "FileText", title: "Tier I & II Papers", description: "Full-length mock tests for both Tier I and Tier II" },
      { icon: "Clock", title: "60-Minute Tests", description: "Real exam timing with section-wise breakdown" },
      { icon: "BarChart3", title: "Response Analysis", description: "See time spent per question and accuracy trends" },
      { icon: "Brain", title: "Difficulty Grading", description: "Questions tagged by difficulty — Easy, Medium, Hard" },
      { icon: "BookOpen", title: "Detailed Solutions", description: "Step-by-step solutions for every question" },
      { icon: "Trophy", title: "Cutoff Predictor", description: "Compare your score against expected cutoffs" },
    ],
    faqs: [
      { question: "Does MedhaHub cover SSC CGL Tier II?", answer: "Yes! We have mock tests for both Tier I and Tier II with full syllabus coverage." },
      { question: "Is there negative marking in mock tests?", answer: "Yes, our mock tests follow the exact SSC CGL marking scheme including negative marking." },
    ],
    stats: [
      { label: "Mock Tests", value: "25+" },
      { label: "Questions", value: "6,000+" },
      { label: "Active Students", value: "4,500+" },
      { label: "Tiers Covered", value: "I & II" },
    ],
    seo: {
      title: "SSC CGL Mock Test 2026 Free — Tier I & II Practice Papers | MedhaHub",
      description: "Free SSC CGL mock test 2026 for Tier I & II. AI-powered scoring, section-wise analytics & detailed solutions. Start practicing now!",
      keywords: "SSC CGL mock test 2026, SSC CGL Tier 1 practice, SSC CGL previous year paper, SSC CGL online test free, SSC CGL preparation",
    },
  },
  {
    slug: "ibps-po",
    name: "IBPS PO",
    fullName: "Institute of Banking Personnel Selection — Probationary Officer",
    tagline: "IBPS PO 2026 — AI-Powered Banking Exam Prep",
    heroDescription: "Crack IBPS PO Prelims & Mains with free mock tests, previous year papers, and AI analytics for Reasoning, Quantitative Aptitude & English.",
    gradient: "from-sky-600 to-blue-600",
    accentColor: "sky",
    mockTestLink: "/ibps-po-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [
      { label: "IBPS PO Previous Year Question Papers", href: "/blog/ibps-po-previous-year-question-papers" },
    ],
    examPattern: [
      { stage: "Prelims", type: "MCQs (Reasoning + Quant + English)", marks: "100", duration: "1 hour" },
      { stage: "Mains", type: "MCQs (Reasoning + Quant + English + GK + Computer)", marks: "200", duration: "3 hours" },
      { stage: "Interview", type: "Personal Interview", marks: "100", duration: "—" },
    ],
    subjects: [
      { name: "Reasoning Ability", questions: "35", priority: "high" },
      { name: "Quantitative Aptitude", questions: "35", priority: "high" },
      { name: "English Language", questions: "30", priority: "high" },
      { name: "General Awareness", questions: "40", priority: "medium" },
      { name: "Computer Knowledge", questions: "20", priority: "medium" },
    ],
    features: [
      { icon: "FileText", title: "Prelims & Mains Papers", description: "Separate mock tests for Prelims and Mains pattern" },
      { icon: "Clock", title: "Sectional Timing", description: "Section-wise time limits matching real IBPS PO exam" },
      { icon: "BarChart3", title: "Banking Analytics", description: "Section-wise accuracy and time management insights" },
      { icon: "History", title: "Previous Year Papers", description: "IBPS PO papers from 2018–2025 with solutions" },
      { icon: "Brain", title: "AI Score Prediction", description: "Predict your expected score based on mock performance" },
      { icon: "Trophy", title: "Rank Estimator", description: "Estimated all-India rank based on your score" },
    ],
    faqs: [
      { question: "Is IBPS PO mock test free?", answer: "Yes! Take free mock tests with instant scoring, section-wise analytics, and detailed solutions." },
      { question: "Does it cover both Prelims and Mains?", answer: "Yes, we have separate papers for IBPS PO Prelims (1 hour) and Mains (3 hours) formats." },
      { question: "Are there sectional tests too?", answer: "Yes. You can practice Reasoning, Quant, and English sections individually." },
    ],
    stats: [
      { label: "Mock Tests", value: "30+" },
      { label: "Questions", value: "8,000+" },
      { label: "Active Students", value: "5,500+" },
      { label: "Banking Exams", value: "IBPS + SBI" },
    ],
    seo: {
      title: "IBPS PO Mock Test Free | Previous Year Papers & AI Practice | MedhaHub",
      description: "Free IBPS PO mock test 2026 with previous year papers, AI scoring & section-wise analytics. Practice Prelims & Mains online!",
      keywords: "IBPS PO mock test 2026, IBPS PO previous year paper, IBPS PO prelims practice, banking exam mock test free, IBPS PO online test",
    },
  },
  {
    slug: "rrb-ntpc",
    name: "RRB NTPC",
    fullName: "Railway Recruitment Board — Non-Technical Popular Categories",
    tagline: "RRB NTPC 2026 — Railway Exam Preparation",
    heroDescription: "Prepare for RRB NTPC CBT 1 & 2 with free mock tests, previous year papers, and AI-powered analytics.",
    gradient: "from-red-600 to-rose-600",
    accentColor: "red",
    mockTestLink: "/rrb-ntpc-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [
      { label: "RRB NTPC Previous Year Papers", href: "/blog/rrb-ntpc-previous-year-question-papers" },
      { label: "RRB NTPC 2026 Syllabus & Pattern", href: "/blog/rrb-ntpc-2026-syllabus-exam-pattern" },
    ],
    examPattern: [
      { stage: "CBT 1", type: "MCQs (Math + GI + GK)", marks: "100", duration: "1.5 hours" },
      { stage: "CBT 2", type: "MCQs (Math + GI + GK — Advanced)", marks: "120", duration: "1.5 hours" },
    ],
    subjects: [
      { name: "Mathematics", questions: "30", priority: "high" },
      { name: "General Intelligence", questions: "30", priority: "high" },
      { name: "General Awareness", questions: "40", priority: "high" },
    ],
    features: [
      { icon: "FileText", title: "CBT 1 & 2 Papers", description: "Mock tests for both stages of RRB NTPC exam" },
      { icon: "Clock", title: "90-Minute Tests", description: "Real exam timing with auto-submit" },
      { icon: "BarChart3", title: "Score Analytics", description: "Subject-wise and difficulty-wise breakdown" },
      { icon: "History", title: "PYQ Bank", description: "Previous year papers from all RRB zones" },
      { icon: "Brain", title: "AI Tips", description: "Personalized study recommendations in English, Hindi & Bengali" },
      { icon: "Trophy", title: "Railway Rank", description: "Compare your score with other railway aspirants" },
    ],
    faqs: [
      { question: "Is RRB NTPC mock test free?", answer: "Yes! All CBT 1 and CBT 2 mock tests are free with instant analysis." },
      { question: "Are questions from real exam papers?", answer: "We offer both genuine PYQ papers and AI-generated questions following the exact RRB NTPC pattern." },
    ],
    stats: [
      { label: "Mock Tests", value: "25+" },
      { label: "Questions", value: "5,000+" },
      { label: "Active Students", value: "3,500+" },
      { label: "CBT Stages", value: "1 & 2" },
    ],
    seo: {
      title: "RRB NTPC Mock Test 2026 Free — CBT 1 & 2 Practice Papers | MedhaHub",
      description: "Free RRB NTPC mock test 2026 with previous year papers, AI scoring & performance analytics. Practice CBT 1 & 2 online!",
      keywords: "RRB NTPC mock test 2026, RRB NTPC previous year paper, Railway NTPC online practice, RRB NTPC CBT 1 question paper, আরআরবি এনটিপিসি মক টেস্ট",
    },
  },
  {
    slug: "wb-tet",
    name: "WB TET",
    fullName: "West Bengal Teacher Eligibility Test",
    tagline: "WB Primary TET 2026 — Exam Preparation",
    heroDescription: "Practice WB Primary TET with previous year papers from 2015–2023, AI-scored mock tests, and child development pedagogy questions.",
    gradient: "from-teal-600 to-emerald-600",
    accentColor: "teal",
    mockTestLink: "/wb-tet-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [
      { label: "WB TET 2026 Syllabus & Exam Pattern", href: "/blog/wb-tet-2026-syllabus-exam-pattern" },
    ],
    examPattern: [
      { stage: "Paper I", type: "150 MCQs (Child Dev + Lang I + Lang II + Math + EVS)", marks: "150", duration: "2.5 hours" },
    ],
    subjects: [
      { name: "Child Development", questions: "30", priority: "high" },
      { name: "Language I (Bengali)", questions: "30", priority: "high" },
      { name: "Language II (English)", questions: "30", priority: "medium" },
      { name: "Mathematics", questions: "30", priority: "high" },
      { name: "Environmental Studies", questions: "30", priority: "medium" },
    ],
    features: [
      { icon: "FileText", title: "Full-Length Papers", description: "150-question papers matching real WB TET format" },
      { icon: "Clock", title: "2.5-Hour Timer", description: "Real exam conditions with countdown" },
      { icon: "BarChart3", title: "Subject Analysis", description: "See your strongest and weakest subjects" },
      { icon: "History", title: "PYQ 2015–2023", description: "Complete previous year papers with solutions" },
      { icon: "BookOpen", title: "Bengali + English", description: "Bilingual question bank" },
      { icon: "Brain", title: "Pedagogy Focus", description: "Dedicated child development & pedagogy practice" },
    ],
    faqs: [
      { question: "Is WB TET mock test free?", answer: "Yes! All mock tests are free with instant scoring and detailed analysis." },
      { question: "Do you cover Child Development & Pedagogy?", answer: "Yes, we have a dedicated section for CDP questions with detailed explanations." },
    ],
    stats: [
      { label: "Mock Tests", value: "20+" },
      { label: "Questions", value: "4,000+" },
      { label: "Active Students", value: "2,500+" },
      { label: "Languages", value: "EN + BN" },
    ],
    seo: {
      title: "WB TET Mock Test 2026 Free — Primary TET Practice Papers | MedhaHub",
      description: "Free WB Primary TET mock test with previous year papers (2015–2023), AI scoring & Bengali support. Practice online now!",
      keywords: "WB TET mock test 2026, WB Primary TET previous year paper, প্রাইমারি টেট মক টেস্ট, WB TET 2023 question paper, WB TET preparation online",
    },
  },
  {
    slug: "jtet",
    name: "JTET",
    fullName: "Jharkhand Teacher Eligibility Test",
    tagline: "JTET 2026 — Complete Mock Tests & PYQs",
    heroDescription: "Prepare for JTET Paper 1 & 2 with free mock tests, previous year papers, and AI-powered performance analytics.",
    gradient: "from-orange-600 to-amber-600",
    accentColor: "orange",
    mockTestLink: "/jtet-mock-test",
    syllabusLink: "/exam-syllabus",
    blogLinks: [],
    examPattern: [
      { stage: "Paper I", type: "150 MCQs (Child Dev + Languages + Math + EVS)", marks: "150", duration: "2.5 hours" },
      { stage: "Paper II", type: "150 MCQs (Child Dev + Languages + Math/Science OR Social Studies)", marks: "150", duration: "2.5 hours" },
    ],
    subjects: [
      { name: "Child Development", questions: "30", priority: "high" },
      { name: "Language I", questions: "30", priority: "medium" },
      { name: "Language II", questions: "30", priority: "medium" },
      { name: "Mathematics", questions: "30", priority: "high" },
      { name: "EVS / Science / Social Studies", questions: "30", priority: "high" },
    ],
    features: [
      { icon: "FileText", title: "Paper I & II", description: "Separate mock tests for both JTET papers" },
      { icon: "Clock", title: "Timed Practice", description: "2.5-hour exam simulation" },
      { icon: "BarChart3", title: "Analytics", description: "Subject and difficulty breakdown" },
      { icon: "History", title: "Previous Papers", description: "JTET 2012–2023 question papers" },
      { icon: "Brain", title: "AI Recommendations", description: "Personalized study tips" },
      { icon: "Trophy", title: "Score Tracking", description: "Track improvement over time" },
    ],
    faqs: [
      { question: "Is JTET mock test free?", answer: "Yes! Free mock tests with detailed analysis for both Paper I and II." },
      { question: "Do you have JTET 2012 papers?", answer: "Yes, we have JTET papers from 2012 onwards with complete solutions." },
    ],
    stats: [
      { label: "Mock Tests", value: "15+" },
      { label: "Questions", value: "3,000+" },
      { label: "Papers", value: "I & II" },
      { label: "PYQ Years", value: "2012–23" },
    ],
    seo: {
      title: "JTET Mock Test 2026 Free — Paper 1 & 2 Practice | MedhaHub",
      description: "Free JTET mock test with previous year papers (2012–2023), AI scoring & detailed analytics. Practice Paper 1 & 2 online!",
      keywords: "JTET mock test 2026, JTET previous year paper, Jharkhand TET question paper, JTET Paper 1 practice, JTET online test free",
    },
  },
];

export function getExamConfig(slug: string): ExamLandingConfig | undefined {
  return EXAM_CONFIGS.find((e) => e.slug === slug);
}
