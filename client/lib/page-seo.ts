/**
 * Centralized per-page SEO metadata + hook.
 * Usage: usePageSEO("/about") at the top of any page component.
 */
import { useEffect } from "react";
import { applyExamSeoPayload } from "./exam-seo";

const B = "MedhaHub";

export interface PageSeoEntry {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
}

/** Every route that should get client-side SEO on mount */
export const PAGE_SEO: Record<string, PageSeoEntry> = {
  /* ─── Public feature pages ─── */
  "/prev-year-questions": {
    title: "Previous Year Question Papers — WBCS, WB Police, WBPSC, TET, SSC | " + B,
    description: "Download and practice previous year question papers for WBCS, WB Police SI/Constable, WBPSC Clerkship, WB TET, SSC MTS, IBPS PO, RRB NTPC. Free online with answers.",
    keywords: "previous year question papers, WBCS previous year paper, WB Police previous year paper, WBPSC Clerkship paper, WB TET paper",
    canonicalPath: "/prev-year-questions",
  },
  "/mock-test": {
    title: "Free Mock Tests — WBCS, WB Police, WBPSC, SSC, Banking, Railway | " + B,
    description: "Take free timed mock tests for WBCS, WB Police, WBPSC Clerkship, SSC CGL/MTS, IBPS PO, RRB NTPC. Real exam pattern with instant scoring and detailed analysis.",
    keywords: "free mock test, WBCS mock test, WB Police mock test, SSC mock test, banking mock test, railway mock test, online mock test",
    canonicalPath: "/mock-test",
  },
  "/daily-quiz": {
    title: "Daily Quiz — WBCS, SSC, Banking, Police Exam Practice | " + B,
    description: "Free daily quiz for government exam aspirants. 10 new questions every day covering GK, Reasoning, Math & English for WBCS, SSC CGL, IBPS PO, WB Police exams.",
    keywords: "daily quiz, daily GK quiz, WBCS daily quiz, SSC daily quiz, banking quiz, exam practice daily",
    canonicalPath: "/daily-quiz",
  },
  "/leaderboard": {
    title: "Leaderboard — Top Exam Performers This Week | " + B,
    description: "See who's leading this week. Compare your mock test scores with other aspirants. Climb the ranks, earn badges, and stay motivated.",
    keywords: "exam leaderboard, mock test rankings, top performers, exam competition",
    canonicalPath: "/leaderboard",
  },
  "/chatbot": {
    title: "AI Study Assistant — Ask Any Exam Question | " + B,
    description: "Ask any question about WBCS, SSC, Banking, Police exams. AI-powered study assistant gives instant answers with explanations. Free unlimited.",
    keywords: "AI study assistant, exam chatbot, WBCS AI assistant, study help, ask exam questions",
    canonicalPath: "/chatbot",
  },
  "/study-with-me": {
    title: "Study With Me — Focus Timer & Pomodoro for Exam Preparation | " + B,
    description: "Study with ambient focus timer. Pomodoro technique with study music, break reminders, and daily study time tracking for exam aspirants.",
    keywords: "study with me, pomodoro timer, focus timer, study timer, exam preparation timer",
    canonicalPath: "/study-with-me",
  },
  "/story-telling": {
    title: "Story Telling Practice — Improve Communication Skills | " + B,
    description: "Practice story telling for interviews and group discussions. AI-powered feedback on communication, vocabulary, and presentation skills.",
    keywords: "story telling practice, communication skills, interview preparation, group discussion, presentation skills",
    canonicalPath: "/story-telling",
  },
  "/photo-solver": {
    title: "Photo Solver — Scan & Solve Exam Questions with AI | " + B,
    description: "Take a photo of any exam question and get instant AI-powered solutions with step-by-step explanations. Works for Math, GK, Reasoning & more.",
    keywords: "photo solver, question solver, AI question solver, scan and solve, exam question solver",
    canonicalPath: "/photo-solver",
  },
  "/resume": {
    title: "Free AI Resume Builder 2026 — ATS-Friendly Templates | " + B,
    description: "Build a professional ATS-friendly resume in minutes. AI-powered suggestions, clean templates, and instant PDF download. Perfect for freshers and experienced.",
    keywords: "resume builder, AI resume builder, ATS resume, free resume builder, resume template 2026",
    canonicalPath: "/resume",
  },
  "/career-mentor": {
    title: "AI Career Mentor — Personalized Career Guidance | " + B,
    description: "Get AI-powered career guidance. Ask questions about govt exams, IT careers, interview tips, salary negotiation & more. Free unlimited mentoring.",
    keywords: "career mentor, AI career guidance, career advice, govt job guidance, IT career guidance",
    canonicalPath: "/career-mentor",
  },
  "/vacancies": {
    title: "Latest Government Job Vacancies 2026 — WB, SSC, Banking, Railway | " + B,
    description: "Latest government job vacancies and notifications for West Bengal, SSC, Banking, Railway. Set alerts for new openings. Updated daily.",
    keywords: "govt job vacancy 2026, latest govt jobs, WB govt jobs, SSC vacancy, banking vacancy, railway jobs 2026",
    canonicalPath: "/vacancies",
  },

  /* ─── Study / Private pages (still need good titles) ─── */
  "/govt-practice": {
    title: "Government Exam Practice — WBCS, SSC, Police, Banking | " + B,
    description: "Practice government exams with AI-powered MCQs. WBCS, SSC, WB Police, Banking, Railway. 1000+ questions with instant feedback.",
    keywords: "government exam practice, WBCS practice, SSC practice, WB Police practice, banking exam preparation",
    canonicalPath: "/govt-practice",
  },
  "/exam-room": {
    title: "Exam Room — Chapter-wise Mock Tests | " + B,
    description: "Practice chapter by chapter across WBCS, SSC CGL, IBPS PO, WB Police SI and Railway. 3 difficulty levels — unlock harder levels by scoring well.",
    keywords: "exam room, chapter wise mock test, WBCS chapter test, progressive difficulty mock test",
    canonicalPath: "/exam-room",
  },
  "/daily-tasks": {
    title: "Daily Tasks — Your Exam Preparation Checklist | " + B,
    description: "Complete daily study tasks to maintain your streak. AI-generated tasks based on your weak areas and syllabus progress.",
    keywords: "daily tasks, study checklist, exam preparation daily, daily study goals",
    canonicalPath: "/daily-tasks",
  },
  "/study-plan": {
    title: "AI Study Plan Generator — Personalized Exam Schedule | " + B,
    description: "Generate a personalized study plan for your target exam. AI creates a daily schedule based on your exam date, weak subjects & available hours.",
    keywords: "study plan, AI study plan, exam preparation schedule, personalized study plan",
    canonicalPath: "/study-plan",
  },
  "/amar-plan": {
    title: "Amar Plan — Your Personalized Daily Study Schedule | " + B,
    description: "Your personalized daily study routine with smart reminders. Track what to study today, complete daily tasks, and build consistency.",
    keywords: "daily study plan, amar plan, study schedule, daily study routine",
    canonicalPath: "/amar-plan",
  },
  "/syllabus": {
    title: "Exam Syllabus Tracker — WBCS, SSC, Banking, Police, TET | " + B,
    description: "Track your syllabus completion for WBCS, SSC CGL, IBPS PO, WB Police, WB TET. Mark topics as done and see progress percentage.",
    keywords: "syllabus tracker, exam syllabus, WBCS syllabus tracker, study progress tracker",
    canonicalPath: "/syllabus",
  },
  "/dashboard": {
    title: "Your Dashboard — Test History & Performance | " + B,
    description: "View your mock test history, scores, and performance trends. Track your exam preparation progress over time.",
    keywords: "exam dashboard, test history, performance tracker, mock test results",
    canonicalPath: "/dashboard",
  },
  "/personal-dashboard": {
    title: "AI Analytics Dashboard — Weak Areas & Performance | " + B,
    description: "AI-powered analytics showing your weak areas, accuracy per subject, and personalized improvement suggestions for exam preparation.",
    keywords: "AI analytics, weak area analysis, exam performance, personalized dashboard",
    canonicalPath: "/personal-dashboard",
  },
  "/profile": {
    title: "Your Profile — " + B,
    description: "Manage your MedhaHub profile, exam targets, study preferences, and view your preparation summary.",
    keywords: "profile, exam preparation profile, study preferences",
    canonicalPath: "/profile",
  },

  /* ─── Legal / Info pages ─── */
  "/about": {
    title: "About MedhaHub — India's Free Exam Preparation Platform",
    description: "MedhaHub is India's free exam preparation platform for WBCS, SSC, WB Police, Banking, Railway & IT interviews. Built by Ranjan Mondal.",
    keywords: "about MedhaHub, MedhaHub founder, exam preparation platform India",
    canonicalPath: "/about",
  },
  "/contact": {
    title: "Contact MedhaHub — Get in Touch",
    description: "Have a question or suggestion? Contact the MedhaHub team. We're always happy to help with your exam preparation journey.",
    keywords: "contact MedhaHub, MedhaHub support, exam help contact",
    canonicalPath: "/contact",
  },
  "/privacy-policy": {
    title: "Privacy Policy — " + B,
    description: "Read MedhaHub's privacy policy. We respect your data and are transparent about how we collect, use, and protect your information.",
    keywords: "MedhaHub privacy policy, data protection, privacy",
    canonicalPath: "/privacy-policy",
  },
  "/terms-of-service": {
    title: "Terms of Service — " + B,
    description: "Read MedhaHub's terms of service. Understand the rules and guidelines for using our exam preparation platform.",
    keywords: "MedhaHub terms of service, terms and conditions, user agreement",
    canonicalPath: "/terms-of-service",
  },
};

/**
 * React hook — call at the top of any page component.
 * Sets document.title, meta description, meta keywords, canonical, OG tags, Twitter cards.
 *
 * @param path - The route path, e.g. "/about"
 * @param overrides - Optional overrides for any field
 */
export function usePageSEO(path: string, overrides?: Partial<PageSeoEntry>) {
  useEffect(() => {
    const entry = PAGE_SEO[path];
    if (!entry) return;
    applyExamSeoPayload({
      title: overrides?.title ?? entry.title,
      description: overrides?.description ?? entry.description,
      keywords: overrides?.keywords ?? entry.keywords,
      canonicalPath: overrides?.canonicalPath ?? entry.canonicalPath,
    });
  }, [path]);
}
