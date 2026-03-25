// ─────────────────────────────────────────────────────────────────────────────
// Study Plan & Syllabus API — server routes
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestHandler } from "express";
import type {
  StudyExamType,
  AIStudyPlan,
  WeekPlan,
  ChapterQuestion,
  ChapterTestResult,
  AIChapterGuideResponse,
} from "@shared/study-types";

// ── Valid exam IDs ────────────────────────────────────────────────────────────
const VALID_EXAMS: StudyExamType[] = ["WBCS", "WBPSC", "Police_SI", "SSC_CGL", "Banking"];

// ── POST /api/studyplan/ai — Generate AI study plan ──────────────────────────
export const handleGenerateAIPlan: RequestHandler = (req, res) => {
  const { examId, examDate, hoursPerDay } = req.body as {
    examId?: string;
    examDate?: string;
    hoursPerDay?: number;
  };

  if (!examId || !VALID_EXAMS.includes(examId as StudyExamType)) {
    res.status(400).json({ error: "Invalid examId" });
    return;
  }
  if (!examDate) {
    res.status(400).json({ error: "examDate is required" });
    return;
  }
  const hours = hoursPerDay ?? 3;

  // Calculate weeks until exam
  const now = new Date();
  const target = new Date(examDate);
  const diffMs = target.getTime() - now.getTime();
  const totalWeeks = Math.max(4, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)));

  // Generate week-by-week plan (mock AI generation)
  const subjectPool = getSubjectsForExam(examId as StudyExamType);
  const weeks: WeekPlan[] = [];

  for (let w = 1; w <= totalWeeks; w++) {
    const phase = w <= totalWeeks * 0.4 ? "Foundation" : w <= totalWeeks * 0.75 ? "Practice" : "Revision";
    const subjectsThisWeek = subjectPool.slice(
      ((w - 1) * 2) % subjectPool.length,
      ((w - 1) * 2) % subjectPool.length + 2
    );
    if (subjectsThisWeek.length === 0) subjectsThisWeek.push(subjectPool[0]);

    weeks.push({
      week: w,
      title: `Week ${w} — ${phase}`,
      subjects: subjectsThisWeek,
      chapters: subjectsThisWeek.map((s) => `${s} chapters`),
      hoursPerDay: hours,
      tips: phase === "Foundation"
        ? "Focus on NCERT and building concepts."
        : phase === "Practice"
          ? "Solve previous year papers and take topic tests."
          : "Full-length mocks daily. Revise weak areas only.",
    });
  }

  const plan: AIStudyPlan = {
    examId: examId as StudyExamType,
    examDate,
    hoursPerDay: hours,
    totalWeeks,
    weeks,
    createdAt: new Date().toISOString(),
  };

  res.json(plan);
};

// ── GET /api/studyplan/template/:examId — Get fixed template ─────────────────
export const handleGetStudyTemplate: RequestHandler = (req, res) => {
  const { examId } = req.params;
  if (!examId || !VALID_EXAMS.includes(examId as StudyExamType)) {
    res.status(400).json({ error: "Invalid examId" });
    return;
  }
  // Template data is served from the client-side data file, but we mirror it here
  res.json({ examId, message: "Use client-side STUDY_TEMPLATES for template data." });
};

// ── GET /api/syllabus/:examId — Get exam syllabus ────────────────────────────
export const handleGetSyllabus: RequestHandler = (req, res) => {
  const { examId } = req.params;
  if (!examId || !VALID_EXAMS.includes(examId as StudyExamType)) {
    res.status(400).json({ error: "Invalid examId" });
    return;
  }
  // Syllabus is served from client data; this endpoint validates exam
  res.json({ examId, message: "Use client-side EXAM_SYLLABUS for syllabus data." });
};

// ── GET /api/test/:chapterId/questions — Get chapter test questions ──────────
export const handleGetChapterQuestions: RequestHandler = (req, res) => {
  const { chapterId } = req.params;
  if (!chapterId) {
    res.status(400).json({ error: "chapterId is required" });
    return;
  }

  // Generate 10 contextual questions
  const questions: ChapterQuestion[] = generateServerQuestions(chapterId);
  res.json(questions);
};

// ── POST /api/test/submit — Submit chapter test answers ──────────────────────
export const handleSubmitChapterTest: RequestHandler = (req, res) => {
  const { chapterId, answers } = req.body as {
    chapterId?: string;
    answers?: { questionId: number; selected: number }[];
  };

  if (!chapterId || !answers || !Array.isArray(answers)) {
    res.status(400).json({ error: "chapterId and answers[] are required" });
    return;
  }

  // Score the answers
  const questions = generateServerQuestions(chapterId);
  let correct = 0;
  const detailed = answers.map((a) => {
    const q = questions.find((qq) => qq.id === a.questionId);
    const isCorrect = q ? a.selected === q.correctIndex : false;
    if (isCorrect) correct++;
    return { questionId: a.questionId, selected: a.selected, correct: q?.correctIndex ?? 0 };
  });

  const total = questions.length;
  const accuracy = Math.round((correct / total) * 100);

  const result: ChapterTestResult = {
    chapterId,
    score: correct,
    total,
    accuracy,
    passed: accuracy >= 60,
    answers: detailed,
  };

  res.json(result);
};

// ── POST /api/ai/chapter-guide — AI guide for a chapter ──────────────────────
export const handleAIChapterGuide: RequestHandler = (req, res) => {
  const { chapterId, chapterName, userQuery } = req.body as {
    chapterId?: string | number;
    chapterName?: string;
    userQuery?: string;
  };

  if (!chapterId || !userQuery) {
    res.status(400).json({ error: "chapterId and userQuery are required" });
    return;
  }

  // Only allow chapterId as a number or numeric string (not ch_1 etc)
  if (
    typeof chapterId === "string" && !/^\d+$/.test(chapterId)
    || typeof chapterId === "number" && !Number.isInteger(chapterId)
  ) {
    res.status(400).json({ error: "chapterId must be a number or numeric string (e.g. '1', 2)" });
    return;
  }

  // Always use chapterId as number for downstream logic
  const numericChapterId = typeof chapterId === "number" ? chapterId : parseInt(chapterId, 10);
  const displayName = chapterName || numericChapterId;

  // Mock AI response (in production, call Gemini/OpenAI using chapterName + userQuery)
  const response: AIChapterGuideResponse = {
    answer: `## Study Guide: ${displayName}\n\n**Your question:** ${userQuery}\n\n### Key Points\n\n1. **Start with basics** — Make sure you understand the fundamental concepts before moving to advanced topics.\n\n2. **NCERT is your best friend** — For most competitive exams, NCERT textbooks cover 70-80% of the syllabus.\n\n3. **Practice MCQs daily** — Solve at least 20-30 MCQs daily from this chapter to build speed and accuracy.\n\n4. **Previous Year Questions** — Always study PYQs from the last 5 years. They show the exam pattern clearly.\n\n5. **Make short notes** — Write key facts, dates, and formulas on flashcards for quick revision.\n\n### Recommended Resources\n- NCERT textbooks (Class 6-12)\n- Lucent's GK (for quick revision)\n- Previous year papers (last 5 years)\n- Daily current affairs for context\n\n### Exam Tips\n- Time management is crucial. Don't spend more than 1 minute per MCQ.\n- Eliminate obviously wrong options first.\n- If unsure, mark the most logical answer — don't leave blank unless there's negative marking.\n\n> 💡 **Pro Tip:** Create a revision schedule where you revisit this chapter every 7 days using spaced repetition.`,
    chapterId: numericChapterId,
  };

  res.json(response);
};

// ── Helper: get subjects for an exam ──────────────────────────────────────────
function getSubjectsForExam(exam: StudyExamType): string[] {
  const map: Record<StudyExamType, string[]> = {
    WBCS: ["History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs", "English", "Bengali"],
    WBPSC: ["General Knowledge", "Reasoning", "Arithmetic", "English", "Bengali", "Current Affairs"],
    Police_SI: ["General Knowledge", "Reasoning", "Mathematics", "English", "Bengali"],
    SSC_CGL: ["Reasoning", "Quantitative Aptitude", "English", "General Awareness"],
    Banking: ["Reasoning", "Quantitative Aptitude", "English", "General Awareness", "Computer Knowledge"],
  };
  return map[exam] ?? map.WBCS;
}

// ── Helper: generate questions on server ──────────────────────────────────────
function generateServerQuestions(chapterId: string): ChapterQuestion[] {
  const name = chapterId.replace(/^ch_\d+$/, "Chapter");
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `Question ${i + 1} about ${name}: Which of the following is correct?`,
    options: [
      `Correct answer for Q${i + 1}`,
      `Distractor A for Q${i + 1}`,
      `Distractor B for Q${i + 1}`,
      `Distractor C for Q${i + 1}`,
    ] as [string, string, string, string],
    correctIndex: 0,
    explanation: `The correct answer is the first option because it accurately represents the concept from ${name}.`,
  }));
}
