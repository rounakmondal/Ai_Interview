// ─────────────────────────────────────────────────────────────────────────────
// Amar Plan API — server routes for personalized study plan
// Features: plan generation, auto-adjust, reschedule, task completion,
//           subject progress, stats, share card data
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestHandler } from "express";
import type {
  StudyExamType,
  AmarPlanTask,
  AmarPlanData,
  AmarMockScore,
  AmarAutoAdjustResult,
  AmarSubjectProgress,
  AmarPlanStats,
  CreateAmarPlanRequest,
  CreateAmarPlanResponse,
  AutoAdjustRequest,
  AutoAdjustResponse,
  RescheduleRequest,
  RescheduleResponse,
  CompleteTaskRequest,
  CompleteTaskResponse,
  SubjectProgressResponse,
  PlanStatsResponse,
  ShareCardDataResponse,
} from "@shared/study-types";

// ── Valid exam IDs ────────────────────────────────────────────────────────────
const VALID_EXAMS: StudyExamType[] = ["WBCS", "WBPSC", "Police_SI", "SSC_CGL", "Banking"];

const EXAM_LABELS: Record<StudyExamType, string> = {
  WBCS: "WBCS",
  WBPSC: "WBPSC",
  Police_SI: "Police SI",
  SSC_CGL: "SSC CGL",
  Banking: "Banking IBPS/SBI",
};

const MOTIVATIONAL_TEXTS = [
  "একটু একটু করে এগিয়ে যাও — সাফল্য আসবেই! 💪",
  "ধৈর্য ধরো, তোমার পরিশ্রম বৃথা যাবে না।",
  "প্রতিদিনের অভ্যাস তোমাকে লক্ষ্যে পৌঁছে দেবে।",
  "তুমি পারবে — বিশ্বাস রাখো নিজের উপর! 🌟",
  "আজকের পড়া কালকের সাফল্যের ভিত্তি।",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86400000
  );
}

// ── Syllabus data for plan generation ─────────────────────────────────────────

interface SyllabusChapter {
  name: string;
  nameBn: string;
}

interface SyllabusSubjectData {
  id: string;
  name: string;
  nameBn: string;
  chapters: SyllabusChapter[];
}

function getExamSubjects(examId: StudyExamType): SyllabusSubjectData[] {
  const map: Record<StudyExamType, SyllabusSubjectData[]> = {
    WBCS: [
      { id: "wbcs_history", name: "History", nameBn: "ইতিহাস", chapters: [
        { name: "Ancient India", nameBn: "প্রাচীন ভারত" },
        { name: "Medieval India", nameBn: "মধ্যযুগীয় ভারত" },
        { name: "Modern India", nameBn: "আধুনিক ভারত" },
        { name: "Indian National Movement", nameBn: "ভারতীয় জাতীয় আন্দোলন" },
        { name: "World History", nameBn: "বিশ্ব ইতিহাস" },
        { name: "Bengal Renaissance", nameBn: "বাংলার নবজাগরণ" },
      ]},
      { id: "wbcs_geography", name: "Geography", nameBn: "ভূগোল", chapters: [
        { name: "Physical Geography", nameBn: "ভৌত ভূগোল" },
        { name: "Indian Geography", nameBn: "ভারতের ভূগোল" },
        { name: "West Bengal Geography", nameBn: "পশ্চিমবঙ্গের ভূগোল" },
        { name: "World Geography", nameBn: "বিশ্ব ভূগোল" },
        { name: "Climatology", nameBn: "জলবায়ুবিদ্যা" },
      ]},
      { id: "wbcs_polity", name: "Polity", nameBn: "রাষ্ট্রবিজ্ঞান", chapters: [
        { name: "Indian Constitution", nameBn: "ভারতীয় সংবিধান" },
        { name: "Fundamental Rights & Duties", nameBn: "মৌলিক অধিকার ও কর্তব্য" },
        { name: "Parliament & Legislature", nameBn: "সংসদ ও আইনসভা" },
        { name: "Judiciary", nameBn: "বিচার বিভাগ" },
        { name: "Panchayati Raj", nameBn: "পঞ্চায়েতি রাজ" },
        { name: "Public Administration", nameBn: "জনপ্রশাসন" },
      ]},
      { id: "wbcs_reasoning", name: "Reasoning", nameBn: "রিজনিং", chapters: [
        { name: "Verbal Reasoning", nameBn: "মৌখিক রিজনিং" },
        { name: "Non-Verbal Reasoning", nameBn: "অমৌখিক রিজনিং" },
        { name: "Logical Reasoning", nameBn: "যৌক্তিক রিজনিং" },
        { name: "Data Interpretation", nameBn: "তথ্য বিশ্লেষণ" },
      ]},
      { id: "wbcs_math", name: "Mathematics", nameBn: "গণিত", chapters: [
        { name: "Number System", nameBn: "সংখ্যা পদ্ধতি" },
        { name: "Arithmetic", nameBn: "পাটিগণিত" },
        { name: "Algebra", nameBn: "বীজগণিত" },
        { name: "Geometry & Mensuration", nameBn: "জ্যামিতি ও পরিমিতি" },
        { name: "Statistics & Probability", nameBn: "পরিসংখ্যান ও সম্ভাবনা" },
      ]},
      { id: "wbcs_ca", name: "Current Affairs", nameBn: "সাম্প্রতিকী", chapters: [
        { name: "National Affairs", nameBn: "জাতীয় বিষয়" },
        { name: "International Affairs", nameBn: "আন্তর্জাতিক বিষয়" },
        { name: "West Bengal Affairs", nameBn: "পশ্চিমবঙ্গ বিষয়" },
        { name: "Science & Technology", nameBn: "বিজ্ঞান ও প্রযুক্তি" },
        { name: "Economy & Budget", nameBn: "অর্থনীতি ও বাজেট" },
      ]},
      { id: "wbcs_english", name: "English", nameBn: "ইংরেজি", chapters: [
        { name: "Grammar", nameBn: "ব্যাকরণ" },
        { name: "Vocabulary", nameBn: "শব্দভাণ্ডার" },
        { name: "Comprehension", nameBn: "পাঠবোধ" },
        { name: "Essay Writing", nameBn: "প্রবন্ধ" },
      ]},
      { id: "wbcs_bengali", name: "Bengali", nameBn: "বাংলা", chapters: [
        { name: "Bengali Grammar", nameBn: "বাংলা ব্যাকরণ" },
        { name: "Bengali Literature", nameBn: "বাংলা সাহিত্য" },
        { name: "Comprehension (Bengali)", nameBn: "পাঠবোধ (বাংলা)" },
      ]},
    ],
    WBPSC: [
      { id: "wbpsc_gk", name: "General Knowledge", nameBn: "সাধারণ জ্ঞান", chapters: [
        { name: "Indian History", nameBn: "ভারতের ইতিহাস" },
        { name: "Geography", nameBn: "ভূগোল" },
        { name: "Indian Polity", nameBn: "ভারতীয় রাষ্ট্রনীতি" },
        { name: "Economy", nameBn: "অর্থনীতি" },
        { name: "Science", nameBn: "বিজ্ঞান" },
      ]},
      { id: "wbpsc_reasoning", name: "Reasoning", nameBn: "রিজনিং", chapters: [
        { name: "Analytical Reasoning", nameBn: "বিশ্লেষণাত্মক রিজনিং" },
        { name: "Logical Sequence", nameBn: "যৌক্তিক ক্রম" },
        { name: "Number Series", nameBn: "সংখ্যা সিরিজ" },
      ]},
      { id: "wbpsc_math", name: "Arithmetic", nameBn: "পাটিগণিত", chapters: [
        { name: "Number System", nameBn: "সংখ্যা পদ্ধতি" },
        { name: "Percentage & Ratio", nameBn: "শতকরা ও অনুপাত" },
        { name: "Profit, Loss & Interest", nameBn: "লাভ, ক্ষতি ও সুদ" },
      ]},
      { id: "wbpsc_english", name: "English", nameBn: "ইংরেজি", chapters: [
        { name: "Grammar Fundamentals", nameBn: "ব্যাকরণ মৌলিক" },
        { name: "Vocabulary", nameBn: "শব্দভাণ্ডার" },
        { name: "Reading Comprehension", nameBn: "পাঠবোধ" },
      ]},
    ],
    Police_SI: [
      { id: "psi_gk", name: "General Knowledge", nameBn: "সাধারণ জ্ঞান", chapters: [
        { name: "Indian History", nameBn: "ভারতের ইতিহাস" },
        { name: "Geography", nameBn: "ভূগোল" },
        { name: "Indian Polity", nameBn: "ভারতীয় রাষ্ট্রনীতি" },
        { name: "General Science", nameBn: "সাধারণ বিজ্ঞান" },
      ]},
      { id: "psi_reasoning", name: "Reasoning", nameBn: "রিজনিং", chapters: [
        { name: "Analytical Reasoning", nameBn: "বিশ্লেষণাত্মক রিজনিং" },
        { name: "Logical Deduction", nameBn: "যৌক্তিক অনুমান" },
        { name: "Pattern Recognition", nameBn: "প্যাটার্ন চিনতে পারা" },
      ]},
      { id: "psi_math", name: "Mathematics", nameBn: "গণিত", chapters: [
        { name: "Arithmetic", nameBn: "পাটিগণিত" },
        { name: "Algebra Basics", nameBn: "বীজগণিত মৌলিক" },
        { name: "Geometry", nameBn: "জ্যামিতি" },
      ]},
      { id: "psi_english", name: "English", nameBn: "ইংরেজি", chapters: [
        { name: "Grammar", nameBn: "ব্যাকরণ" },
        { name: "Vocabulary", nameBn: "শব্দভাণ্ডার" },
        { name: "Comprehension", nameBn: "পাঠবোধ" },
      ]},
    ],
    SSC_CGL: [
      { id: "ssc_reasoning", name: "Reasoning", nameBn: "রিজনিং", chapters: [
        { name: "Analogy & Classification", nameBn: "সাদৃশ্য ও শ্রেণীবিভাগ" },
        { name: "Coding-Decoding", nameBn: "কোডিং-ডিকোডিং" },
        { name: "Series & Patterns", nameBn: "সিরিজ ও প্যাটার্ন" },
        { name: "Syllogism", nameBn: "ন্যায়বিচার" },
      ]},
      { id: "ssc_math", name: "Quantitative Aptitude", nameBn: "পরিমাণগত দক্ষতা", chapters: [
        { name: "Number System", nameBn: "সংখ্যা পদ্ধতি" },
        { name: "Percentage & Ratio", nameBn: "শতকরা ও অনুপাত" },
        { name: "Profit, Loss & Discount", nameBn: "লাভ, ক্ষতি ও ছাড়" },
        { name: "Algebra", nameBn: "বীজগণিত" },
        { name: "Geometry & Trigonometry", nameBn: "জ্যামিতি ও ত্রিকোণমিতি" },
      ]},
      { id: "ssc_english", name: "English", nameBn: "ইংরেজি", chapters: [
        { name: "Spot the Error", nameBn: "ভুল চিহ্নিতকরণ" },
        { name: "Synonyms & Antonyms", nameBn: "সমার্থক ও বিপরীত শব্দ" },
        { name: "Reading Comprehension", nameBn: "পাঠবোধ" },
      ]},
      { id: "ssc_gk", name: "General Awareness", nameBn: "সাধারণ সচেতনতা", chapters: [
        { name: "Indian History", nameBn: "ভারতের ইতিহাস" },
        { name: "Geography", nameBn: "ভূগোল" },
        { name: "Indian Polity", nameBn: "ভারতীয় রাষ্ট্রনীতি" },
        { name: "Economy", nameBn: "অর্থনীতি" },
        { name: "General Science", nameBn: "সাধারণ বিজ্ঞান" },
      ]},
    ],
    Banking: [
      { id: "bank_reasoning", name: "Reasoning", nameBn: "রিজনিং", chapters: [
        { name: "Seating Arrangement", nameBn: "আসন বিন্যাস" },
        { name: "Puzzles", nameBn: "ধাঁধা" },
        { name: "Syllogism", nameBn: "ন্যায়বিচার" },
        { name: "Inequality", nameBn: "অসমতা" },
        { name: "Blood Relations", nameBn: "রক্তসম্পর্ক" },
      ]},
      { id: "bank_quant", name: "Quantitative Aptitude", nameBn: "পরিমাণগত দক্ষতা", chapters: [
        { name: "Number Series", nameBn: "সংখ্যা সিরিজ" },
        { name: "Data Interpretation", nameBn: "তথ্য বিশ্লেষণ" },
        { name: "Percentage & Average", nameBn: "শতকরা ও গড়" },
        { name: "Profit, Loss & Interest", nameBn: "লাভ, ক্ষতি ও সুদ" },
      ]},
      { id: "bank_english", name: "English", nameBn: "ইংরেজি", chapters: [
        { name: "Reading Comprehension", nameBn: "পাঠবোধ" },
        { name: "Cloze Test", nameBn: "ক্লোজ টেস্ট" },
        { name: "Error Detection", nameBn: "ভুল সনাক্তকরণ" },
      ]},
      { id: "bank_ga", name: "General Awareness", nameBn: "সাধারণ সচেতনতা", chapters: [
        { name: "Banking Awareness", nameBn: "ব্যাংকিং সচেতনতা" },
        { name: "Financial Awareness", nameBn: "আর্থিক সচেতনতা" },
        { name: "Current Affairs", nameBn: "সাম্প্রতিকী" },
      ]},
    ],
  };
  return map[examId] ?? map.WBCS;
}

// ══════════════════════════════════════════════════════════════════════════════
// ENDPOINT HANDLERS
// ══════════════════════════════════════════════════════════════════════════════

// ── POST /api/amar-plan/create — Generate a new Amar Plan ────────────────────
export const handleCreateAmarPlan: RequestHandler = (req, res) => {
  const body = req.body as Partial<CreateAmarPlanRequest>;

  if (!body.examId || !VALID_EXAMS.includes(body.examId)) {
    res.status(400).json({ error: "Invalid or missing examId" });
    return;
  }
  if (!body.examDate) {
    res.status(400).json({ error: "examDate is required (YYYY-MM-DD)" });
    return;
  }

  const examId = body.examId;
  const examDate = body.examDate;
  const hoursPerDay = body.hoursPerDay ?? 3;
  const weakSubjects = body.weakSubjects ?? [];
  const notificationTime = body.notificationTime;

  const today = todayStr();
  const totalDays = Math.max(7, daysBetween(today, examDate));
  const subjects = getExamSubjects(examId);

  // Collect all topics
  const allTopics: {
    subject: string; subjectBn: string;
    topic: string; topicBn: string; isWeak: boolean;
  }[] = [];

  for (const subj of subjects) {
    const isWeak = weakSubjects.includes(subj.id) || weakSubjects.includes(subj.name);
    for (const ch of subj.chapters) {
      allTopics.push({
        subject: subj.name, subjectBn: subj.nameBn,
        topic: ch.name, topicBn: ch.nameBn, isWeak,
      });
    }
  }

  // Insert mock test days every 7 days
  const mockTestDays = new Set<number>();
  for (let d = 7; d <= totalDays; d += 7) mockTestDays.add(d);

  const tasks: AmarPlanTask[] = [];
  let topicIdx = 0;

  for (let d = 1; d <= totalDays; d++) {
    const date = addDays(today, d - 1);

    if (mockTestDays.has(d)) {
      tasks.push({
        id: `amar_${d}_mock`,
        day: d, date,
        subject: "Mock Test", subjectBn: "মক টেস্ট",
        topic: `Mock Test Day ${Math.ceil(d / 7)}`,
        topicBn: `মক টেস্ট দিন ${Math.ceil(d / 7)}`,
        type: "mock_test", completed: false,
      });
    } else if (topicIdx < allTopics.length) {
      const t = allTopics[topicIdx % allTopics.length];
      const isRevisionDay = d > totalDays * 0.75;
      tasks.push({
        id: `amar_${d}_${topicIdx}`,
        day: d, date,
        subject: t.subject, subjectBn: t.subjectBn,
        topic: t.topic, topicBn: t.topicBn,
        type: isRevisionDay ? "revision" : "study",
        completed: false, isWeak: t.isWeak,
      });
      topicIdx++;
    } else {
      // All topics done — revision (prioritize weak subjects)
      const weakTopics = allTopics.filter((t) => t.isWeak);
      const pool = weakTopics.length > 0 ? weakTopics : allTopics;
      const revIdx = (d - topicIdx) % pool.length;
      const t = pool[Math.abs(revIdx) % pool.length];
      tasks.push({
        id: `amar_${d}_rev_${revIdx}`,
        day: d, date,
        subject: t.subject, subjectBn: t.subjectBn,
        topic: `${t.topic} (Revision)`, topicBn: `${t.topicBn} (পুনরায়)`,
        type: "revision", completed: false, isWeak: t.isWeak,
      });
    }
  }

  const plan: AmarPlanData = {
    examId, examDate,
    createdAt: new Date().toISOString(),
    lastAccessDate: today,
    hoursPerDay, notificationTime, weakSubjects,
    tasks, streak: 0, mockScores: [], autoAdjustLog: [],
  };

  const response: CreateAmarPlanResponse = { success: true, plan };
  res.json(response);
};

// ── POST /api/amar-plan/auto-adjust — Check & auto-adjust missed days ────────
export const handleAutoAdjust: RequestHandler = (req, res) => {
  const body = req.body as Partial<AutoAdjustRequest>;
  if (!body.plan) {
    res.status(400).json({ error: "plan data is required" });
    return;
  }

  const plan = { ...body.plan };
  const today = todayStr();
  const lastAccess = plan.lastAccessDate;

  // Nothing to adjust if accessed today
  if (lastAccess === today) {
    const result: AmarAutoAdjustResult = {
      adjusted: false, missedDays: 0, tasksRescheduled: 0,
      needsFullReschedule: false, plan,
    };
    res.json({ success: true, result } as AutoAdjustResponse);
    return;
  }

  const missed = daysBetween(lastAccess, today) - 1;
  if (missed <= 0) {
    plan.lastAccessDate = today;
    const result: AmarAutoAdjustResult = {
      adjusted: false, missedDays: 0, tasksRescheduled: 0,
      needsFullReschedule: false, plan,
    };
    res.json({ success: true, result } as AutoAdjustResponse);
    return;
  }

  // Too many days missed → suggest full reschedule
  if (missed > 7) {
    plan.lastAccessDate = today;
    const result: AmarAutoAdjustResult = {
      adjusted: false, missedDays: missed, tasksRescheduled: 0,
      needsFullReschedule: true, plan,
    };
    res.json({ success: true, result } as AutoAdjustResponse);
    return;
  }

  // Get missed incomplete tasks
  const missedTasks = plan.tasks.filter((t) =>
    !t.completed && t.date > lastAccess && t.date < today
  );

  if (missedTasks.length === 0) {
    plan.lastAccessDate = today;
    const result: AmarAutoAdjustResult = {
      adjusted: false, missedDays: missed, tasksRescheduled: 0,
      needsFullReschedule: false, plan,
    };
    res.json({ success: true, result } as AutoAdjustResponse);
    return;
  }

  // Push missed tasks forward
  const futurePendingTasks = plan.tasks
    .filter((t) => !t.completed && t.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  let rescheduled = 0;
  const startDate = plan.tasks[0]?.date || today;

  // Move missed tasks to today onwards
  for (let i = 0; i < missedTasks.length; i++) {
    const newDate = addDays(today, i);
    missedTasks[i].date = newDate;
    missedTasks[i].day = daysBetween(startDate, newDate) + 1;
    rescheduled++;
  }

  // Shift existing future tasks after the rescheduled ones
  const occupiedDates = new Set(missedTasks.map((t) => t.date));
  for (const ft of futurePendingTasks) {
    if (missedTasks.includes(ft)) continue;
    let newDate = ft.date;
    while (occupiedDates.has(newDate)) {
      newDate = addDays(newDate, 1);
    }
    if (newDate !== ft.date) {
      ft.date = newDate;
      ft.day = daysBetween(startDate, newDate) + 1;
      rescheduled++;
    }
    occupiedDates.add(newDate);
  }

  plan.tasks.sort((a, b) => a.date.localeCompare(b.date));
  plan.autoAdjustLog.push({ date: today, missedDays: missed, tasksRescheduled: rescheduled });
  plan.lastAccessDate = today;
  updateStreak(plan);

  const result: AmarAutoAdjustResult = {
    adjusted: true, missedDays: missed, tasksRescheduled: rescheduled,
    needsFullReschedule: false, plan,
  };
  res.json({ success: true, result } as AutoAdjustResponse);
};

// ── POST /api/amar-plan/reschedule — Full reschedule from today ──────────────
export const handleReschedule: RequestHandler = (req, res) => {
  const body = req.body as Partial<RescheduleRequest>;
  if (!body.plan) {
    res.status(400).json({ error: "plan data is required" });
    return;
  }

  const plan = { ...body.plan };
  const today = todayStr();
  const daysToExam = Math.max(1, daysBetween(today, plan.examDate));

  const completedTasks = plan.tasks.filter((t) => t.completed);
  const pendingTasks = plan.tasks.filter((t) => !t.completed);

  const mockTestInterval = 7;
  const newTasks: AmarPlanTask[] = [...completedTasks];
  const mockDays = new Set<number>();
  for (let d = mockTestInterval; d <= daysToExam; d += mockTestInterval) mockDays.add(d);

  let pendingIdx = 0;
  for (let d = 1; d <= daysToExam; d++) {
    const date = addDays(today, d - 1);
    if (completedTasks.some((t) => t.date === date)) continue;

    if (mockDays.has(d)) {
      const mockPending = pendingTasks.find((t) => t.type === "mock_test" && !t.completed);
      if (mockPending) {
        mockPending.date = date;
        mockPending.day = d;
        newTasks.push(mockPending);
        pendingTasks.splice(pendingTasks.indexOf(mockPending), 1);
      } else {
        newTasks.push({
          id: `amar_resched_${d}_mock`, day: d, date,
          subject: "Mock Test", subjectBn: "মক টেস্ট",
          topic: "Mock Test", topicBn: "মক টেস্ট",
          type: "mock_test", completed: false,
        });
      }
    } else if (pendingIdx < pendingTasks.length) {
      const pt = pendingTasks[pendingIdx];
      if (pt.type !== "mock_test") {
        pt.date = date;
        pt.day = d;
        newTasks.push(pt);
        pendingIdx++;
      } else {
        pendingIdx++;
        d--;
      }
    }
  }

  newTasks.sort((a, b) => a.date.localeCompare(b.date));
  plan.tasks = newTasks;
  plan.lastAccessDate = today;
  plan.autoAdjustLog.push({ date: today, missedDays: 0, tasksRescheduled: pendingTasks.length });
  updateStreak(plan);

  const response: RescheduleResponse = { success: true, plan };
  res.json(response);
};

// ── POST /api/amar-plan/complete-task — Mark a task as completed ─────────────
export const handleCompleteTask: RequestHandler = (req, res) => {
  const body = req.body as Partial<CompleteTaskRequest>;
  if (!body.plan || !body.taskId) {
    res.status(400).json({ error: "plan and taskId are required" });
    return;
  }

  const plan = { ...body.plan };
  const task = plan.tasks.find((t) => t.id === body.taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  if (task.completed) {
    res.json({ success: true, plan } as CompleteTaskResponse);
    return;
  }

  task.completed = true;
  task.completedAt = new Date().toISOString();

  if (task.type === "mock_test" && body.mockScore !== undefined) {
    task.mockScore = body.mockScore;
    plan.mockScores.push({
      date: todayStr(), taskId: body.taskId!,
      score: body.mockScore, exam: plan.examId,
    });
  }

  updateStreak(plan);

  const response: CompleteTaskResponse = { success: true, plan };
  res.json(response);
};

// ── POST /api/amar-plan/subject-progress — Get per-subject progress ──────────
export const handleSubjectProgress: RequestHandler = (req, res) => {
  const body = req.body as { plan?: AmarPlanData };
  if (!body.plan) {
    res.status(400).json({ error: "plan data is required" });
    return;
  }

  const subjects = computeSubjectProgress(body.plan);
  const response: SubjectProgressResponse = { subjects };
  res.json(response);
};

// ── POST /api/amar-plan/stats — Get plan statistics ──────────────────────────
export const handlePlanStats: RequestHandler = (req, res) => {
  const body = req.body as { plan?: AmarPlanData };
  if (!body.plan) {
    res.status(400).json({ error: "plan data is required" });
    return;
  }

  const stats = computePlanStats(body.plan);
  const response: PlanStatsResponse = { stats };
  res.json(response);
};

// ── POST /api/amar-plan/share-card — Get data for share card ─────────────────
export const handleShareCardData: RequestHandler = (req, res) => {
  const body = req.body as { plan?: AmarPlanData };
  if (!body.plan) {
    res.status(400).json({ error: "plan data is required" });
    return;
  }

  const stats = computePlanStats(body.plan);
  const idx = Math.floor(Math.random() * MOTIVATIONAL_TEXTS.length);

  const response: ShareCardDataResponse = {
    examLabel: EXAM_LABELS[body.plan.examId] ?? body.plan.examId,
    daysRemaining: stats.daysRemaining,
    streak: stats.streak,
    percentage: stats.percentage,
    examPassed: stats.examPassed,
    motivationalText: MOTIVATIONAL_TEXTS[idx],
  };
  res.json(response);
};

// ── POST /api/amar-plan/today-tasks — Get today's pending topic for notification ─
export const handleTodayTasks: RequestHandler = (req, res) => {
  const body = req.body as { plan?: AmarPlanData };
  if (!body.plan) {
    res.status(400).json({ error: "plan data is required" });
    return;
  }

  const today = todayStr();
  const todayTasks = body.plan.tasks.filter((t) => t.date === today);
  const pendingTopic = todayTasks.find((t) => !t.completed);

  res.json({
    date: today,
    tasks: todayTasks,
    pendingTopicBn: pendingTopic?.topicBn ?? null,
    pendingTopicEn: pendingTopic?.topic ?? null,
    allCompleted: todayTasks.every((t) => t.completed),
  });
};

// ══════════════════════════════════════════════════════════════════════════════
// INTERNAL HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function updateStreak(plan: AmarPlanData): void {
  const today = todayStr();
  const completedDates = new Set(
    plan.tasks
      .filter((t) => t.completed && t.completedAt)
      .map((t) => t.completedAt!.split("T")[0])
  );

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const checkDate = addDays(today, -i);
    if (completedDates.has(checkDate)) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }
  plan.streak = streak;
}

function computeSubjectProgress(plan: AmarPlanData): AmarSubjectProgress[] {
  const subjectMap = new Map<string, {
    bn: string; total: number; completed: number; isWeak: boolean;
  }>();

  for (const task of plan.tasks) {
    if (task.type === "mock_test") continue;
    const key = task.subject;
    const existing = subjectMap.get(key) || {
      bn: task.subjectBn, total: 0, completed: 0, isWeak: task.isWeak || false,
    };
    existing.total++;
    if (task.completed) existing.completed++;
    if (task.isWeak) existing.isWeak = true;
    subjectMap.set(key, existing);
  }

  return Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    subjectBn: data.bn,
    total: data.total,
    completed: data.completed,
    percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    isWeak: data.isWeak,
  }));
}

function computePlanStats(plan: AmarPlanData): AmarPlanStats {
  const today = todayStr();
  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter((t) => t.completed).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const daysRemaining = Math.max(0, daysBetween(today, plan.examDate));
  const examPassed = daysRemaining === 0 && today > plan.examDate;

  return {
    totalTasks, completedTasks, percentage,
    daysRemaining, examPassed,
    streak: plan.streak,
    examId: plan.examId, examDate: plan.examDate,
    mockScores: plan.mockScores,
  };
}
