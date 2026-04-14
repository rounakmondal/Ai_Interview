#!/usr/bin/env node
/**
 * Post-build: generates per-route index.html with unique <title>, <meta>, OG, canonical.
 * Google reads the static HTML on first crawl — this makes every page indexable.
 *
 * Run: node scripts/prerender-meta.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist", "spa");
const ORIGIN = "https://medhahub.in";

const template = readFileSync(join(DIST, "index.html"), "utf-8");

/* ── helpers ────────────────────────────────────────── */
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

const UPPER = {
  tcs: "TCS", ibm: "IBM", hcl: "HCL", hp: "HP", ge: "GE", ey: "EY", pwc: "PwC",
  sbi: "SBI", ntt: "NTT", amd: "AMD", arm: "ARM", aws: "AWS", gcp: "GCP",
  dxc: "DXC", sap: "SAP", nvidia: "NVIDIA", kpmg: "KPMG", bcg: "BCG", ubs: "UBS",
  hdfc: "HDFC", icici: "ICICI", jpmorgan: "JPMorgan", hsbc: "HSBC", bofa: "BoFA",
  wbcs: "WBCS", wbp: "WBP", wbpsc: "WBPSC", wb: "WB", tet: "TET", si: "SI",
  ssc: "SSC", mts: "MTS", ibps: "IBPS", po: "PO", jtet: "JTET",
  rrb: "RRB", ntpc: "NTPC", cgl: "CGL", cbt: "CBT", ctet: "CTET", nda: "NDA",
  rd: "R&D", bpm: "BPM", ii: "II", iii: "III", ai: "AI",
  google: "Google", amazon: "Amazon", microsoft: "Microsoft", meta: "Meta",
  flipkart: "Flipkart", razorpay: "Razorpay", swiggy: "Swiggy", zomato: "Zomato",
  paytm: "Paytm", oracle: "Oracle", samsung: "Samsung", adobe: "Adobe",
  netflix: "Netflix", uber: "Uber", deloitte: "Deloitte", paypal: "PayPal",
  spotify: "Spotify", airbnb: "Airbnb", shopify: "Shopify", stripe: "Stripe",
};

function slugToName(slug) {
  return slug
    .split("-")
    .map((w) => UPPER[w.toLowerCase()] || w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inject(html, { title, description, path, keywords }) {
  const url = `${ORIGIN}${path}`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*/,
      `$1${esc(description)}`
    )
    .replace(
      /(<meta name="keywords" content=")[^"]*/,
      keywords ? `$1${esc(keywords)}` : `$1`
    )
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(
      /(<meta property="og:description" content=")[^"]*/,
      `$1${esc(description)}`
    )
    .replace(
      /(<meta name="twitter:title" content=")[^"]*/,
      `$1${esc(title)}`
    )
    .replace(
      /(<meta name="twitter:description" content=")[^"]*/,
      `$1${esc(description)}`
    );
}

function write(route) {
  if (route.path === "/") return; // root already has index.html
  const html = inject(template, route);
  const dir = join(DIST, route.path.replace(/^\//, ""));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

/* ── 1. Explicit SEO routes ─────────────────────────── */
const ROUTES = [
  /* ─── Exam landing pages ─── */
  {
    path: "/wbcs-mock-test",
    title: "WBCS Mock Test Free Online | Syllabus & Previous Year Question Papers | MedhaHub",
    description: "Practice WBCS with free online mock tests from official previous-year prelims papers. WBCS syllabus 2026, exam pattern, marks distribution. Timed MCQs, instant scoring — ideal for WBCS and WBPSC exam preparation.",
    keywords: "WBCS mock test, WBCS mock test free, WBCS previous year question paper, WBCS syllabus 2026, WBCS prelims mock test, WBPSC mock test, West Bengal Civil Service",
  },
  {
    path: "/wbp-police-mock-test",
    title: "WBP Police Mock Test | Syllabus & Previous Year Question Papers Online | MedhaHub",
    description: "West Bengal Police (WBP) Constable and Lady Constable previous year papers as free online mock tests. WB Police SI & Constable syllabus 2026, exam pattern, cutoff marks. Timed practice with answers.",
    keywords: "WB Police mock test, WBP constable mock test, WBP SI mock test, WB Police previous year paper, West Bengal Police exam preparation 2026",
  },
  {
    path: "/wbpsc-clerkship-mock-test",
    title: "WBPSC Clerkship Mock Test Free | Previous Year Papers (2019-2024) | MedhaHub",
    description: "Practice WBPSC Clerkship exam with free online mock tests from 2019, 2020, 2024 papers (all shifts). WBPSC Clerkship syllabus 2026, exam pattern, cutoff marks. Timed MCQs with instant scoring.",
    keywords: "WBPSC Clerkship mock test, WBPSC Clerkship previous year paper, WBPSC Clerkship syllabus 2026, WBPSC mock test free",
  },
  {
    path: "/wb-tet-mock-test",
    title: "WB TET Mock Test Free | Primary TET Previous Year Question Papers | MedhaHub",
    description: "Practice WB Primary TET with free online mock tests from 2015-2023 papers. WB TET syllabus 2026, exam pattern, cutoff marks. Bengali, English, Child Development, Math, EVS with answers.",
    keywords: "WB TET mock test, WB Primary TET previous year paper, WB TET syllabus 2026, Primary TET mock test free, TET 2023 question paper",
  },
  {
    path: "/ssc-mts-mock-test",
    title: "SSC MTS Mock Test Free | Previous Year Papers 2019 & 2023 | MedhaHub",
    description: "Practice SSC MTS with free online mock tests from 2019 and 2023 papers (all shifts). SSC MTS syllabus 2026, exam pattern, cutoff marks. GK, Reasoning, English with instant scoring.",
    keywords: "SSC MTS mock test, SSC MTS previous year paper, SSC MTS syllabus 2026, SSC MTS mock test free, SSC Multi Tasking Staff",
  },
  {
    path: "/ibps-po-mock-test",
    title: "IBPS PO Mock Test Free | Previous Year Papers Prelims & Mains | MedhaHub",
    description: "Practice IBPS PO Prelims & Mains with free online mock tests from previous year papers (2021-2025). IBPS PO syllabus 2026, exam pattern, cutoff. Quant, Reasoning, English with instant scoring.",
    keywords: "IBPS PO mock test, IBPS PO previous year paper, IBPS PO syllabus 2026, IBPS PO mock test free, banking exam preparation",
  },
  {
    path: "/jtet-mock-test",
    title: "JTET Mock Test Free | Jharkhand TET Previous Year Question Papers | MedhaHub",
    description: "Practice JTET with free online mock tests from previous year papers. JTET syllabus 2026, exam pattern, cutoff. Paper I & Paper II — Child Development, Language, Math, EVS & Social Science.",
    keywords: "JTET mock test, Jharkhand TET mock test, JTET previous year paper, JTET syllabus 2026, JTET mock test free",
  },
  {
    path: "/rrb-ntpc-mock-test",
    title: "RRB NTPC Mock Test Free | Previous Year Papers CBT 1 & CBT 2 | MedhaHub",
    description: "Practice RRB NTPC with free online mock tests from previous year papers. RRB NTPC syllabus 2026, exam pattern, cutoff. GK, Reasoning, Math with answers and instant scoring.",
    keywords: "RRB NTPC mock test, RRB NTPC previous year paper, RRB NTPC syllabus 2026, Railway NTPC mock test free",
  },

  /* ─── Core pages ─── */
  {
    path: "/govt-practice",
    title: "Government Exam Practice — WBCS, SSC, Police, Banking + Corporate Jobs | MedhaHub",
    description: "Practice government exams (WBCS, SSC, Police, Banking, Railway) + corporate job interviews (TCS, Infosys). Dual track preparation with 1000+ questions, mock tests & instant feedback.",
    keywords: "government exam practice, WBCS practice, SSC practice, WB Police practice, banking exam preparation, govt job preparation West Bengal",
  },
  {
    path: "/question-hub",
    title: "Exam Syllabus 2026 | WBP, WBCS, WBPSC, WB TET, SSC, IBPS PO & JTET Previous Year Papers Free | MedhaHub",
    description: "Know your exam syllabus & pattern 2026 — WBCS, WB Police SI, SSC CGL, IBPS PO, UPSC, Railway, CTET, JTET. Download previous year question papers free. Practice online mock tests.",
    keywords: "exam syllabus 2026, previous year question papers, WBCS mock test, WB Police mock test, SSC CGL mock test",
  },
  {
    path: "/prev-year-questions",
    title: "Previous Year Question Papers — WBCS, WB Police, WBPSC, TET, SSC | MedhaHub",
    description: "Download and practice previous year question papers for WBCS, WB Police SI/Constable, WBPSC Clerkship, WB TET, SSC MTS, IBPS PO, RRB NTPC. Free online with answers.",
    keywords: "previous year question papers, WBCS previous year paper, WB Police previous year paper, WBPSC Clerkship paper, WB TET paper",
  },
  {
    path: "/current-affairs",
    title: "Current Affairs 2026 — Daily GK, Weekly Quiz & Monthly Topics for WBCS, SSC, Banking | MedhaHub",
    description: "Daily current affairs, weekly GK quiz, and monthly important topics for WBCS, SSC CGL, IBPS PO, WB Police & Railway aspirants. Updated daily. Free on MedhaHub.",
    keywords: "current affairs 2026, daily current affairs, GK quiz, WBCS current affairs, SSC current affairs, banking current affairs, monthly current affairs",
  },
  {
    path: "/daily-quiz",
    title: "Daily Quiz — WBCS, SSC, Banking, Police Exam Practice | MedhaHub",
    description: "Free daily quiz for government exam aspirants. 10 new questions every day covering GK, Reasoning, Math & English for WBCS, SSC CGL, IBPS PO, WB Police exams.",
    keywords: "daily quiz, daily GK quiz, WBCS daily quiz, SSC daily quiz, banking quiz, exam practice daily",
  },
  {
    path: "/mock-test",
    title: "Free Mock Tests — WBCS, WB Police, WBPSC, SSC, Banking, Railway | MedhaHub",
    description: "Take free timed mock tests for WBCS, WB Police, WBPSC Clerkship, SSC CGL/MTS, IBPS PO, RRB NTPC. Real exam pattern with instant scoring and detailed analysis.",
    keywords: "free mock test, WBCS mock test, WB Police mock test, SSC mock test, banking mock test, railway mock test, online mock test",
  },
  {
    path: "/exam-calendar",
    title: "Exam Calendar 2026 — WBCS, SSC CGL, IBPS PO, UPSC, Railway, WB Police, TET Dates | MedhaHub",
    description: "Complete exam calendar 2026 with exam dates, application deadlines, admit card dates & result dates for WBCS, WB Police SI, SSC CGL, IBPS PO, UPSC, RRB NTPC, WB TET, JTET & more.",
    keywords: "exam calendar 2026, exam dates 2026, WBCS exam date, SSC CGL exam date, IBPS PO exam date, UPSC exam date, WB Police exam date",
  },
  {
    path: "/exam-syllabus",
    title: "Exam Syllabus 2026 — WBCS, SSC CGL, IBPS PO, UPSC, Railway, TET Pattern & Topics | MedhaHub",
    description: "Search any exam syllabus 2026 — WBCS, WB Police SI, SSC CGL, IBPS PO, UPSC, RRB NTPC, WB TET, JTET. Complete exam pattern with topics, marks, eligibility & preparation tips.",
    keywords: "exam syllabus 2026, WBCS syllabus, SSC CGL syllabus, IBPS PO syllabus, UPSC syllabus, WB Police syllabus, WB TET syllabus",
  },
  {
    path: "/interview-questions",
    title: "280+ Company Interview Questions 2026 | TCS, Google, Amazon, HDFC & More | MedhaHub",
    description: "Prepare for interviews at 280+ companies — TCS, Google, Amazon, Microsoft, HDFC Bank, Flipkart, Razorpay & more. Free interview questions with expert answers for 2026.",
    keywords: "company interview questions, TCS interview questions, Google interview questions, Amazon interview questions, interview preparation 2026",
  },

  /* ─── Blog ─── */
  {
    path: "/blog",
    title: "Exam Preparation Blog — WBCS, WBPSC, WB Police, TET Tips & Strategy | MedhaHub",
    description: "Expert articles on WBCS preparation strategy, previous year paper analysis, WB Police SI mock tests, TET syllabus & more. Updated for 2026 exams.",
    keywords: "exam preparation blog, WBCS preparation, WBPSC tips, WB Police preparation, TET preparation, exam strategy 2026",
  },
  {
    path: "/blog/wbcs-preparation-strategy-2026",
    title: "WBCS 2026 Preparation Strategy (Beginner to Advanced) | MedhaHub",
    description: "Complete roadmap to crack WBCS 2026. From zero to interview — subject-wise plan, book list, monthly schedule, and free mock tests.",
    keywords: "WBCS 2026 preparation strategy, WBCS study plan, WBCS preparation tips, how to prepare for WBCS",
  },
  {
    path: "/blog/wbcs-prelims-2023-question-paper-analysis",
    title: "WBCS Prelims 2023 Question Paper with Answer & Analysis | MedhaHub",
    description: "Detailed analysis of WBCS Prelims 2023 — topic-wise breakup, difficulty level, answer key, and key takeaways for 2026 aspirants.",
    keywords: "WBCS Prelims 2023 paper, WBCS 2023 analysis, WBCS answer key 2023, WBCS question paper",
  },
  {
    path: "/blog/wbpsc-clerkship-previous-year-papers",
    title: "WBPSC Clerkship Previous Year Question Papers PDF (Download) | MedhaHub",
    description: "Download WBPSC Clerkship 2019–2024 question papers with solutions. Practice shift-wise papers and understand the exam pattern.",
    keywords: "WBPSC Clerkship previous year paper, WBPSC Clerkship question paper PDF, WBPSC Clerkship 2024 paper",
  },
  {
    path: "/blog/wb-police-si-mock-test-free",
    title: "WB Police SI Mock Test Free — Practice Set with Answers | MedhaHub",
    description: "Free WB Police SI mock tests with detailed answers. Practice 2018 & 2019 papers in exam-like environment with timer & scoring.",
    keywords: "WB Police SI mock test, WB Police SI practice set, WBP SI mock test free, WB Police SI previous year paper",
  },
  {
    path: "/blog/wb-tet-2026-syllabus-exam-pattern",
    title: "WB TET 2026 Syllabus & Exam Pattern (Latest Update) | MedhaHub",
    description: "Complete WB Primary TET 2026 syllabus, exam pattern, marking scheme, and subject-wise weightage. Updated as per latest notification.",
    keywords: "WB TET 2026 syllabus, WB TET exam pattern, Primary TET syllabus, WB TET marking scheme",
  },
  {
    path: "/blog/top-50-gk-questions-wbcs-prelims-2026",
    title: "Top 50 GK Questions for WBCS Prelims 2026 | MedhaHub",
    description: "50 most important General Knowledge questions for WBCS Prelims 2026. Covers history, geography, polity, science & current affairs.",
    keywords: "WBCS GK questions, top 50 GK WBCS, WBCS Prelims GK, general knowledge WBCS 2026",
  },
  {
    path: "/blog/wbpsc-preparation-in-bengali",
    title: "WBPSC Preparation in Bengali — Complete Guide | MedhaHub",
    description: "বাংলায় WBPSC প্রস্তুতির সম্পূর্ণ গাইড। বিষয়ভিত্তিক পরিকল্পনা, বই তালিকা, এবং বিনামূল্যে মক টেস্ট অনুশীলনের টিপস।",
    keywords: "WBPSC preparation Bengali, WBPSC বাংলায় প্রস্তুতি, সরকারি পরীক্ষার প্রস্তুতি বাংলায়",
  },
  {
    path: "/blog/wb-police-constable-previous-year-paper",
    title: "WB Police Constable Previous Year Question Paper with Solution | MedhaHub",
    description: "Download WB Police Constable 2013–2021 question papers with solutions. Practice papers online or download for offline preparation.",
    keywords: "WB Police Constable previous year paper, WBP Constable question paper, WB Police Constable mock test",
  },
  {
    path: "/blog/how-to-crack-wbcs-first-attempt",
    title: "How to Crack WBCS in First Attempt (Study Plan + Tips) | MedhaHub",
    description: "Proven strategies from WBCS toppers. 6-month study plan, daily routine, revision technique, and mistakes to avoid for first-attempt success.",
    keywords: "how to crack WBCS, WBCS first attempt, WBCS topper strategy, WBCS study plan",
  },
  {
    path: "/blog/best-books-wbcs-wbpsc-wb-police-2026",
    title: "Best Books for WBCS, WBPSC & WB Police Preparation (2026) | MedhaHub",
    description: "Subject-wise best books for WBCS, WBPSC Clerkship, and WB Police exams. Recommended by toppers and exam experts.",
    keywords: "best books WBCS, WBPSC books, WB Police books, WBCS preparation books 2026",
  },
  {
    path: "/blog/rrb-ntpc-previous-year-question-papers",
    title: "RRB NTPC Previous Year Question Papers PDF (2015–2026) — Free Practice | MedhaHub",
    description: "Download and practice 19 RRB NTPC previous year question papers (2015–2026) — CBT 1 & CBT 2, all shifts. Includes March 2026 paper. Free timed mock tests.",
    keywords: "RRB NTPC previous year paper, RRB NTPC question paper PDF, RRB NTPC CBT 1 paper, RRB NTPC 2026 paper",
  },
  {
    path: "/blog/rrb-ntpc-2026-syllabus-exam-pattern",
    title: "RRB NTPC 2026 Syllabus, Exam Pattern & Vacancy Details (Official) | MedhaHub",
    description: "Complete RRB NTPC 2026 syllabus for CBT 1 and CBT 2 — topic-wise, question count, difficulty. 11,558 vacancies.",
    keywords: "RRB NTPC syllabus 2026, RRB NTPC exam pattern, RRB NTPC vacancy, Railway NTPC syllabus",
  },
  {
    path: "/blog/ibps-po-previous-year-question-papers",
    title: "IBPS PO Previous Year Question Papers PDF (2021–2025) — Free Mock Test | MedhaHub",
    description: "Practice IBPS PO Prelims & Mains previous year papers (2021–2025) free online. Topic-wise breakup, cutoff analysis, and preparation plan.",
    keywords: "IBPS PO previous year paper, IBPS PO question paper PDF, IBPS PO prelims paper, IBPS PO mains paper",
  },
  {
    path: "/blog/ssc-mts-previous-year-question-papers",
    title: "SSC MTS Previous Year Question Papers PDF (2019 & 2023) — Free | MedhaHub",
    description: "Practice SSC MTS 2019 & September 2023 question papers (all shifts) free online. New exam pattern, cutoff trend, and preparation strategy.",
    keywords: "SSC MTS previous year paper, SSC MTS question paper PDF, SSC MTS 2023 paper, SSC MTS mock test",
  },
  {
    path: "/blog/wbpsc-clerkship-2024-question-paper-analysis",
    title: "WBPSC Clerkship 2024 Question Paper All Shifts — Analysis & Free Practice | MedhaHub",
    description: "Detailed analysis of all 4 shifts of WBPSC Clerkship 2024 exam. Topic-wise breakup, difficulty comparison, WB GK guide, and preparation plan.",
    keywords: "WBPSC Clerkship 2024 paper, WBPSC Clerkship 2024 analysis, WBPSC Clerkship question paper 2024",
  },

  /* ─── Tools ─── */
  {
    path: "/tools",
    title: "Free Online Tools for Students 2026 — CGPA Calculator, Age Calculator & More | MedhaHub",
    description: "Free online tools for students and govt job aspirants. CGPA to percentage calculator, age calculator, salary calculator, eligibility checker, typing speed test & more.",
    keywords: "CGPA calculator, age calculator, salary calculator, typing test, student tools, exam eligibility checker",
  },
  {
    path: "/cgpa-calculator",
    title: "CGPA to Percentage Calculator 2026 — CGPA ↔ Percentage ↔ SGPA Converter | MedhaHub",
    description: "Free CGPA to Percentage calculator. Convert CGPA to percentage, percentage to CGPA, and SGPA to CGPA instantly. Works for all universities.",
    keywords: "CGPA to percentage, CGPA calculator, percentage to CGPA, SGPA to CGPA, CGPA converter",
  },
  {
    path: "/age-calculator",
    title: "Age Calculator for Government Jobs 2026 — Check Eligibility | MedhaHub",
    description: "Free age calculator for government job eligibility. Calculate your exact age on any exam cut-off date. WBCS, SSC CGL, IBPS PO, UPSC, WB Police, Railway, TET.",
    keywords: "age calculator, age calculator for govt jobs, age eligibility, WBCS age limit, SSC age limit, IBPS age limit",
  },
  {
    path: "/salary-calculator",
    title: "Government Job Salary Calculator 2026 — 7th Pay Commission | MedhaHub",
    description: "Calculate government job salary after 7th Pay Commission. In-hand salary for SSC CGL, WBCS, IBPS PO, Railway, UPSC. Basic pay, DA, HRA, TA, NPS.",
    keywords: "govt salary calculator, 7th pay commission salary, SSC CGL salary, WBCS salary, IBPS PO salary, govt job salary 2026",
  },
  {
    path: "/eligibility-checker",
    title: "Exam Eligibility Checker 2026 — Which Govt Exams Can You Apply For? | MedhaHub",
    description: "Check your eligibility for all major government exams. Enter your age, education & category to see which exams you qualify for — WBCS, SSC CGL, IBPS PO, UPSC.",
    keywords: "exam eligibility checker, govt exam eligibility, WBCS eligibility, SSC eligibility, IBPS eligibility",
  },
  {
    path: "/typing-test",
    title: "Typing Speed Test 2026 — SSC CHSL / NTPC / Railway Typing Practice | MedhaHub",
    description: "Free online typing speed test for SSC CHSL, NTPC, Railway & govt job exams. English & Hindi typing at 35 WPM standards. Track WPM, accuracy & errors.",
    keywords: "typing speed test, typing test online, SSC CHSL typing test, NTPC typing test, typing practice, WPM test",
  },

  /* ─── Other pages ─── */
  {
    path: "/skill-matrix",
    title: "Tech Skill Matrix 2026 — Skills Required for Top IT Companies | MedhaHub",
    description: "Explore skills required at 280+ companies — TCS, Google, Amazon, Microsoft. Compare tech stacks, salaries, and interview difficulty for informed career choices.",
    keywords: "tech skill matrix, skills for IT companies, TCS skills, Google skills, company skill comparison, IT career skills 2026",
  },
  {
    path: "/resume",
    title: "Free AI Resume Builder 2026 — ATS-Friendly Templates | MedhaHub",
    description: "Build a professional ATS-friendly resume in minutes. AI-powered suggestions, clean templates, and instant PDF download. Perfect for freshers and experienced.",
    keywords: "resume builder, AI resume builder, ATS resume, free resume builder, resume template 2026",
  },
  {
    path: "/career-mentor",
    title: "AI Career Mentor — Personalized Career Guidance | MedhaHub",
    description: "Get AI-powered career guidance. Ask questions about govt exams, IT careers, interview tips, salary negotiation & more. Free unlimited mentoring.",
    keywords: "career mentor, AI career guidance, career advice, govt job guidance, IT career guidance",
  },
  {
    path: "/vacancies",
    title: "Latest Government Job Vacancies 2026 — WB, SSC, Banking, Railway | MedhaHub",
    description: "Latest government job vacancies and notifications for West Bengal, SSC, Banking, Railway. Set alerts for new openings. Updated daily.",
    keywords: "govt job vacancy 2026, latest govt jobs, WB govt jobs, SSC vacancy, banking vacancy, railway jobs 2026",
  },
  {
    path: "/syllabus",
    title: "Exam Syllabus Tracker — WBCS, SSC, Banking, Police, TET | MedhaHub",
    description: "Track your syllabus completion for WBCS, SSC CGL, IBPS PO, WB Police, WB TET. Mark topics as done, see progress percentage, and stay on track.",
    keywords: "syllabus tracker, exam syllabus, WBCS syllabus tracker, study progress tracker",
  },
  {
    path: "/study-plan",
    title: "AI Study Plan Generator — Personalized Exam Preparation Schedule | MedhaHub",
    description: "Generate a personalized study plan for your target exam. AI creates a daily schedule based on your exam date, weak subjects & available hours.",
    keywords: "study plan, AI study plan, exam preparation schedule, personalized study plan, WBCS study plan",
  },
  {
    path: "/amar-plan",
    title: "Amar Plan — Your Personalized Daily Study Schedule | MedhaHub",
    description: "Your personalized daily study routine with smart reminders. Track what to study today, complete daily tasks, and build consistency for exam success.",
    keywords: "daily study plan, amar plan, study schedule, daily study routine, exam preparation daily plan",
  },
  {
    path: "/chatbot",
    title: "AI Study Assistant — Ask Any Exam Question | MedhaHub",
    description: "Ask any question about WBCS, SSC, Banking, Police exams. AI-powered study assistant gives instant answers with explanations. Free unlimited.",
    keywords: "AI study assistant, exam chatbot, WBCS AI assistant, study help, ask exam questions",
  },
  {
    path: "/photo-solver",
    title: "Photo Solver — Scan & Solve Exam Questions with AI | MedhaHub",
    description: "Take a photo of any exam question and get instant AI-powered solutions with step-by-step explanations. Works for Math, GK, Reasoning & more.",
    keywords: "photo solver, question solver, AI question solver, scan and solve, exam question solver",
  },
  {
    path: "/study-with-me",
    title: "Study With Me — Focus Timer & Pomodoro for Exam Preparation | MedhaHub",
    description: "Study with ambient focus timer. Pomodoro technique with study music, break reminders, and daily study time tracking for exam aspirants.",
    keywords: "study with me, pomodoro timer, focus timer, study timer, exam preparation timer",
  },
  {
    path: "/leaderboard",
    title: "Leaderboard — Top Exam Performers This Week | MedhaHub",
    description: "See who's leading this week. Compare your mock test scores with other aspirants. Climb the ranks, earn badges, and stay motivated.",
    keywords: "exam leaderboard, mock test rankings, top performers, exam competition",
  },
  {
    path: "/about",
    title: "About MedhaHub — India's Exam Preparation Platform",
    description: "MedhaHub is India's free exam preparation platform for WBCS, SSC, WB Police, Banking, Railway & IT interviews. Built by Ranjan Mondal.",
    keywords: "about MedhaHub, MedhaHub founder, exam preparation platform India",
  },
  {
    path: "/contact",
    title: "Contact MedhaHub — Get in Touch",
    description: "Have a question or suggestion? Contact the MedhaHub team. We're always happy to help with your exam preparation journey.",
    keywords: "contact MedhaHub, MedhaHub support, exam help contact",
  },
  {
    path: "/story-telling",
    title: "Story Telling Practice — Improve Communication Skills | MedhaHub",
    description: "Practice story telling for interviews and group discussions. AI-powered feedback on communication, vocabulary, and presentation skills.",
    keywords: "story telling practice, communication skills, interview preparation, group discussion, presentation skills",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy — MedhaHub",
    description: "Read MedhaHub's privacy policy. We respect your data and are transparent about how we collect, use, and protect your information.",
    keywords: "MedhaHub privacy policy, data protection, privacy",
  },
  {
    path: "/terms-of-service",
    title: "Terms of Service — MedhaHub",
    description: "Read MedhaHub's terms of service. Understand the rules and guidelines for using our exam preparation platform.",
    keywords: "MedhaHub terms of service, terms and conditions, user agreement",
  },
  {
    path: "/setup",
    title: "AI Mock Interview Setup — Practice for TCS, Google, Amazon & More | MedhaHub",
    description: "Start a free AI mock interview. Choose your target company, role, and difficulty. Practice for TCS, Google, Amazon, Infosys & 200+ companies.",
    keywords: "AI mock interview, mock interview setup, TCS interview practice, Google interview practice, company interview preparation",
  },
];

/* ── 2. Generate company interview pages ──────────── */
const TOP_COMPANIES = [
  "tcs","infosys","wipro","capgemini","accenture","hcl","cognizant","tech-mahindra","ibm",
  "google","amazon","microsoft","meta","oracle","samsung","adobe","apple","netflix","salesforce",
  "flipkart","swiggy","zomato","razorpay","meesho","phonepe","cred","ola","paytm","myntra",
  "juspay","uber","dream11","groww","zerodha","byju","unacademy","nykaa","freshworks",
  "deloitte","goldman-sachs","jpmorgan","paypal","hsbc","barclays","morgan-stanley",
  "hdfc-bank","icici-bank","axis-bank","sbi-tech",
  "ey","kpmg","pwc","mckinsey","bcg",
  "reliance-jio","bharti-airtel","ericsson","nokia",
  "spotify","airbnb","stripe","shopify","databricks","nvidia",
  "linkedin","twitter","aws","gcp","cisco",
  "zoho","atlassian","github","gitlab","postman","browserstack",
  "blinkit","zepto","swiggy","policybazaar","cars24",
  "tata-elxsi","nagarro","publicis-sapient","epam","thoughtworks",
  "dell","hp","bosch","siemens",
  "bajaj-finserv","mastercard","visa","american-express",
  "openai","anthropic","mongodb","vercel","cloudflare",
];

for (const slug of TOP_COMPANIES) {
  const name = slugToName(slug);
  ROUTES.push({
    path: `/interview-questions/${slug}`,
    title: `${name} Interview Questions 2026 — Top Questions & Answers | MedhaHub`,
    description: `Prepare for ${name} interviews with frequently asked questions and expert answers. Technical, HR & aptitude questions for freshers and experienced. Updated for 2026.`,
    keywords: `${name} interview questions, ${name} interview preparation, ${name} interview 2026, ${slug} interview questions and answers`,
  });
}

/* ── 3. Generate PYQ pages from sitemap ─────────────── */
const sitemap = readFileSync(join(__dirname, "..", "public", "sitemap.xml"), "utf-8");
const pyqSlugs = [
  ...sitemap.matchAll(/<loc>https:\/\/medhahub\.in\/previous-year\/([^<]+)<\/loc>/g),
].map((m) => m[1]);

for (const slug of pyqSlugs) {
  const name = slugToName(slug);
  ROUTES.push({
    path: `/previous-year/${slug}`,
    title: `${name} Question Paper with Answers — Free Online Practice | MedhaHub`,
    description: `Practice ${name} previous year question paper online with answers and detailed explanations. Timed mock test with instant scoring. Free on MedhaHub.`,
    keywords: `${name} question paper, ${name} previous year paper, ${name} mock test, ${slug} paper with answers`,
  });
}

/* ── 4. Write all files ───────────────────────────────── */
let count = 0;
for (const route of ROUTES) {
  write(route);
  count++;
}

console.log(`✓ Pre-rendered ${count} route(s) with unique meta tags → dist/spa/`);
