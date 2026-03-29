# Exam Syllabus Data Analysis

## 1. Current Exam Syllabus Data Structure

### Location
- **File**: [client/lib/exam-syllabus-data.ts](client/lib/exam-syllabus-data.ts)
- **Shared Types**: [shared/study-types.ts](shared/study-types.ts)

### Data Architecture

```typescript
// Master exam types supported
type StudyExamType = "WBCS" | "WBPSC" | "Police_SI" | "SSC_CGL" | "Banking"

// Core data structure
interface Chapter {
  id: string              // Format: "ch_1", "ch_2", etc.
  name: string            // English name
  nameBn: string          // Bengali name
  status: ChapterStatus   // "not_started" | "in_progress" | "done"
  progress: number        // 0-100% based on test scores
  questionCount: number   // Available questions for this chapter
}

interface SyllabusSubject {
  id: string              // Format: "wbcs_history", "ssc_math", etc.
  name: string            // English subject name
  nameBn: string          // Bengali name
  icon: string            // Emoji icon
  chapters: Chapter[]     // Array of chapters in subject
}

interface ExamSyllabus {
  examId: StudyExamType
  subjects: SyllabusSubject[]
}

// Master export
export const EXAM_SYLLABUS: Record<StudyExamType, ExamSyllabus>
```

---

## 2. Complete Exam Syllabus by Exam

### WBCS (West Bengal Civil Service)

**Subjects (8)**: History, Geography, Polity, Reasoning, Mathematics, Current Affairs, English, Bengali

```json
{
  "WBCS": {
    "subjects": [
      {
        "id": "wbcs_history",
        "name": "History",
        "nameBn": "ইতিহাস",
        "icon": "📜",
        "chapters": [
          { "name": "Ancient India", "nameBn": "প্রাচীন ভারত", "questionCount": 10 },
          { "name": "Medieval India", "nameBn": "মধ্যযুগীয় ভারত", "questionCount": 10 },
          { "name": "Modern India", "nameBn": "আধুনিক ভারত", "questionCount": 10 },
          { "name": "Indian National Movement", "nameBn": "ভারতীয় জাতীয় আন্দোলন", "questionCount": 10 },
          { "name": "World History", "nameBn": "বিশ্ব ইতিহাস", "questionCount": 10 },
          { "name": "Bengal Renaissance", "nameBn": "বাংলার নবজাগরণ", "questionCount": 10 }
        ]
      },
      {
        "id": "wbcs_geography",
        "name": "Geography",
        "nameBn": "ভূগোল",
        "icon": "🌍",
        "chapters": [
          { "name": "Physical Geography", "nameBn": "ভৌত ভূগোল", "questionCount": 10 },
          { "name": "Indian Geography", "nameBn": "ভারতের ভূগোল", "questionCount": 10 },
          { "name": "West Bengal Geography", "nameBn": "পশ্চিমবঙ্গের ভূগোল", "questionCount": 10 },
          { "name": "World Geography", "nameBn": "বিশ্ব ভূগোল", "questionCount": 10 },
          { "name": "Climatology", "nameBn": "জলবায়ুবিদ্যা", "questionCount": 10 }
        ]
      },
      {
        "id": "wbcs_polity",
        "name": "Polity",
        "nameBn": "রাষ্ট্রবিজ্ঞান",
        "icon": "⚖️",
        "chapters": [
          { "name": "Indian Constitution", "nameBn": "ভারতীয় সংবিধান" },
          { "name": "Fundamental Rights & Duties", "nameBn": "মৌলিক অধিকার ও কর্তব্য" },
          { "name": "Parliament & Legislature", "nameBn": "সংসদ ও আইনসভা" },
          { "name": "Judiciary", "nameBn": "বিচার বিভাগ" },
          { "name": "Panchayati Raj", "nameBn": "পঞ্চায়েতি রাজ" },
          { "name": "Public Administration", "nameBn": "জনপ্রশাসন" }
        ]
      },
      {
        "id": "wbcs_reasoning",
        "name": "Reasoning",
        "nameBn": "রিজনিং",
        "icon": "🧩",
        "chapters": [
          { "name": "Verbal Reasoning", "nameBn": "মৌখিক রিজনিং" },
          { "name": "Non-Verbal Reasoning", "nameBn": "অমৌখিক রিজনিং" },
          { "name": "Logical Reasoning", "nameBn": "যৌক্তিক রিজনিং" },
          { "name": "Data Interpretation", "nameBn": "তথ্য বিশ্লেষণ" }
        ]
      },
      {
        "id": "wbcs_math",
        "name": "Mathematics",
        "nameBn": "গণিত",
        "icon": "📐",
        "chapters": [
          { "name": "Number System", "nameBn": "সংখ্যা পদ্ধতি" },
          { "name": "Arithmetic", "nameBn": "পাটিগণিত" },
          { "name": "Algebra", "nameBn": "বীজগণিত" },
          { "name": "Geometry & Mensuration", "nameBn": "জ্যামিতি ও পরিমিতি" },
          { "name": "Statistics & Probability", "nameBn": "পরিসংখ্যান ও সম্ভাবনা" }
        ]
      },
      {
        "id": "wbcs_ca",
        "name": "Current Affairs",
        "nameBn": "সাম্প্রতিকী",
        "icon": "📰",
        "chapters": [
          { "name": "National Affairs", "nameBn": "জাতীয় বিষয়" },
          { "name": "International Affairs", "nameBn": "আন্তর্জাতিক বিষয়" },
          { "name": "West Bengal Affairs", "nameBn": "পশ্চিমবঙ্গ বিষয়" },
          { "name": "Science & Technology", "nameBn": "বিজ্ঞান ও প্রযুক্তি" },
          { "name": "Economy & Budget", "nameBn": "অর্থনীতি ও বাজেট" }
        ]
      },
      {
        "id": "wbcs_english",
        "name": "English",
        "nameBn": "ইংরেজি",
        "icon": "📝",
        "chapters": [
          { "name": "Grammar", "nameBn": "ব্যাকরণ" },
          { "name": "Vocabulary", "nameBn": "শব্দভাণ্ডার" },
          { "name": "Comprehension", "nameBn": "পাঠবোধ" },
          { "name": "Essay Writing", "nameBn": "প্রবন্ধ" }
        ]
      },
      {
        "id": "wbcs_bengali",
        "name": "Bengali",
        "nameBn": "বাংলা",
        "icon": "🖊️",
        "chapters": [
          { "name": "Bengali Grammar", "nameBn": "বাংলা ব্যাকরণ" },
          { "name": "Bengali Literature", "nameBn": "বাংলা সাহিত্য" },
          { "name": "Comprehension (Bengali)", "nameBn": "পাঠবোধ (বাংলা)" }
        ]
      }
    ]
  }
}
```

### WBPSC (West Bengal Public Service Commission)

**Subjects (6)**: General Knowledge, Reasoning, Arithmetic, English, Bengali, Current Affairs

| Subject | Chapters |
|---------|----------|
| General Knowledge | Indian History, Geography, Indian Polity, Economy, Science, West Bengal Special |
| Reasoning & Mental Ability | Analytical Reasoning, Logical Sequence, Number Series, Coding-Decoding |
| Arithmetic | Number System, Percentage & Ratio, Profit/Loss & Interest, Time/Speed & Work |
| English | Grammar Fundamentals, Vocabulary & Synonyms, Reading Comprehension |
| Bengali | Bengali Grammar, Bengali Literature |
| Current Affairs | National & International, Awards & Sports, West Bengal Current Affairs |

### Police SI (West Bengal Police Sub-Inspector)

**Subjects (5)**: General Knowledge, Reasoning, Mathematics, English, Bengali

| Subject | Chapters |
|---------|----------|
| General Knowledge | Indian History, Geography, Indian Polity, General Science, West Bengal Special |
| Reasoning | Analytical Reasoning, Logical Deduction, Pattern Recognition, Blood Relations & Directions |
| Mathematics | Arithmetic, Algebra Basics, Geometry, Data Interpretation |
| English | Grammar, Vocabulary, Comprehension |
| Bengali | Bengali Grammar, Bengali Literature |

### SSC CGL (Staff Selection Commission Combined Graduate Level)

**Subjects (4)**: General Intelligence & Reasoning, Quantitative Aptitude, English Language, General Awareness

| Subject | Chapters |
|---------|----------|
| General Intelligence & Reasoning (Tier I) | Analogy & Classification, Coding-Decoding, Series & Patterns, Syllogism, Venn Diagrams, Non-Verbal Reasoning |
| Quantitative Aptitude (Tier I) | Number System & Simplification, Percentage/Ratio/Proportion, Profit/Loss/Discount, Time & Work, Speed/Distance/Time, Algebra, Geometry & Trigonometry, Statistics |
| English Language (Tier I) | Spot the Error, Fill in the Blanks, Synonyms & Antonyms, Idioms & Phrases, One Word Substitution, Reading Comprehension |
| General Awareness (Tier II) | Indian History, Geography, Indian Polity, Economy, General Science, Current Affairs |

### Banking (IBPS/SBI)

**Subjects (5)**: Reasoning Ability, Quantitative Aptitude, English Language, General Awareness, Computer Knowledge

| Subject | Chapters |
|---------|----------|
| Reasoning Ability | Seating Arrangement, Puzzles, Syllogism, Inequality, Blood Relations, Direction & Distance, Coding-Decoding |
| Quantitative Aptitude | Number Series, Simplification & Approximation, Data Interpretation, Percentage & Average, Profit/Loss/Interest, Time/Speed/Distance, Quadratic Equations |
| English Language | Reading Comprehension, Cloze Test, Error Detection, Para Jumbles, Vocabulary |
| General Awareness | Banking Awareness, Financial Awareness, Static GK, Current Affairs |
| Computer Knowledge | Computer Fundamentals, Networking & Internet, MS Office, Cyber Security Basics |

---

## 3. Study Plan Templates

### Location
- **File**: [client/lib/exam-syllabus-data.ts](client/lib/exam-syllabus-data.ts) (lines 383-571)
- **Export**: `STUDY_TEMPLATES: Record<StudyExamType, StudyPlanTemplate>`

### Template Structure

```typescript
interface TemplatePhase {
  phase: number
  title: string
  duration: string              // e.g., "Weeks 1-8"
  description: string
  topics: TemplatePhaseTopic[]  // Specific topics to cover
}

interface StudyPlanTemplate {
  examId: StudyExamType
  phases: TemplatePhase[]
}
```

### WBCS Study Plan Template (3 Phases)

**Phase 1: Foundation Building (Weeks 1–8)**
- History: Ancient India, Medieval India, Modern India
- Geography: Physical Geography, Indian Geography
- Polity: Indian Constitution, Fundamental Rights
- Mathematics: Number System, Arithmetic

**Phase 2: Deep Dive & Practice (Weeks 9–16)**
- History: Indian National Movement, Bengal Renaissance, World History
- Geography: West Bengal Geography, Climatology, World Geography
- Polity: Parliament, Judiciary, Panchayati Raj
- Reasoning: Verbal Reasoning, Logical Reasoning, Data Interpretation

**Phase 3: Revision & Mock Tests (Weeks 17–22)**
- Current Affairs: National, International, West Bengal, Science & Tech
- English: Grammar, Vocabulary, Comprehension
- Bengali: Bengali Grammar, Bengali Literature

### WBPSC Study Plan Template (3 Phases)

**Phase 1: Core GK & Reasoning (Weeks 1–6)**
- General Knowledge: Indian History, Geography, Indian Polity
- Reasoning: Analytical Reasoning, Number Series

**Phase 2: Math & Language (Weeks 7–12)**
- Arithmetic: Percentage & Ratio, Profit/Loss/Interest, Time/Speed/Work
- English: Grammar Fundamentals, Vocabulary & Synonyms
- Bengali: Bengali Grammar, Bengali Literature

**Phase 3: Revision & Full Mocks (Weeks 13–16)**
- General Knowledge: Economy, Science, WB Special
- Current Affairs: National & International, WB Current Affairs

*Similar 3-phase structures for Police SI, SSC CGL, and Banking exams*

---

## 4. API Endpoints for Syllabus

### Location
- **Backend**: [server/routes/studyPlan.ts](server/routes/studyPlan.ts)
- **Server Setup**: [server/index.ts](server/index.ts#L116-L120)

### Endpoints Summary

| Method | Endpoint | Request | Response | Purpose |
|--------|----------|---------|----------|---------|
| POST | `/api/studyplan/ai` | `{ examId, examDate, hoursPerDay }` | `AIStudyPlan` | Generate AI-driven study plan |
| GET | `/api/studyplan/template/:examId` | URL param | `{ examId, message }` | Get fixed template (data is client-side) |
| GET | `/api/syllabus/:examId` | URL param | `{ examId, message }` | Validate exam ID (data is client-side) |
| GET | `/api/test/:chapterId/questions` | URL param | `ChapterQuestion[]` | Get 10 MCQ questions for chapter |
| POST | `/api/test/submit` | `{ chapterId, answers[] }` | `ChapterTestResult` | Submit test & get score |
| POST | `/api/ai/chapter-guide` | `{ chapterId, userQuery }` | `AIChapterGuideResponse` | Get AI study guide for chapter |

### Detailed Endpoint Responses

#### 1. POST `/api/studyplan/ai` — Generate AI Study Plan

**Request:**
```json
{
  "examId": "WBCS",
  "examDate": "2026-06-15",
  "hoursPerDay": 3
}
```

**Response:**
```typescript
{
  "examId": "WBCS",
  "examDate": "2026-06-15",
  "hoursPerDay": 3,
  "totalWeeks": 12,  // Calculated from now to examDate
  "createdAt": "2026-03-29T10:30:00Z",
  "weeks": [
    {
      "week": 1,
      "title": "Week 1 — Foundation",
      "subjects": ["History", "Geography"],
      "chapters": ["History chapters", "Geography chapters"],
      "hoursPerDay": 3,
      "tips": "Focus on NCERT and building concepts."
    },
    // ... more weeks
  ]
}
```

#### 2. GET `/api/syllabus/:examId` — Get Exam Syllabus

**Request:**
```
GET /api/syllabus/WBCS
```

**Response (Server):**
```json
{
  "examId": "WBCS",
  "message": "Use client-side EXAM_SYLLABUS for syllabus data."
}
```

**Note:** The server validates the examId but recommends using client-side data. The full `EXAM_SYLLABUS` object is served from `client/lib/exam-syllabus-data.ts`.

#### 3. GET `/api/test/:chapterId/questions` — Get Test Questions

**Request:**
```
GET /api/test/ch_1/questions
```

**Response:**
```json
[
  {
    "id": 1,
    "question": "Question 1 about Chapter 1: Which of the following is correct?",
    "options": [
      "Correct answer for Q1",
      "Distractor A for Q1",
      "Distractor B for Q1",
      "Distractor C for Q1"
    ],
    "correctIndex": 0,
    "explanation": "The correct answer is the first option because..."
  },
  // ... 9 more questions (10 total per chapter)
]
```

#### 4. POST `/api/test/submit` — Submit Test & Get Score

**Request:**
```json
{
  "chapterId": "ch_1",
  "answers": [
    { "questionId": 1, "selected": 0 },
    { "questionId": 2, "selected": 2 },
    { "questionId": 3, "selected": 1 }
  ]
}
```

**Response:**
```json
{
  "chapterId": "ch_1",
  "score": 7,           // Correct answers
  "total": 10,          // Total questions
  "accuracy": 70,       // Percentage
  "passed": true,       // >= 60%
  "answers": [
    {
      "questionId": 1,
      "selected": 0,
      "correct": 0      // Correct answer index
    }
  ]
}
```

#### 5. POST `/api/ai/chapter-guide` — Get AI Study Guide

**Request:**
```json
{
  "chapterId": "ch_1",
  "chapterName": "Ancient India",
  "userQuery": "How do I study this chapter effectively?"
}
```

**Response:**
```json
{
  "answer": "## Study Guide: Ancient India\n\n**Your question:** How do I study this chapter effectively?\n\n### Key Points\n\n1. **Start with basics** — Make sure you understand the fundamental concepts...\n2. **NCERT is your best friend** — For most competitive exams...\n3. **Practice MCQs daily** — Solve at least 20-30 MCQs daily...\n\n### Recommended Resources\n- NCERT textbooks (Class 6-12)\n- Lucent's GK (for quick revision)\n- Previous year papers (last 5 years)\n\n### Exam Tips\n- Time management is crucial...",
  "chapterId": 1
}
```

---

## 5. How Syllabus is Used in the UI

### Pages Using Syllabus Data

#### [client/pages/SyllabusTracker.tsx](client/pages/SyllabusTracker.tsx)
**Purpose:** Display and track study progress for all chapters

**Features:**
- Filters chapters by status: "all", "not_started", "in_progress", "done"
- Shows subject progress bars
- Expandable subject accordions
- Status indicators: "Pending", "In Progress", "Completed"
- Motivational quotes and study tips
- Links to AIStudyGuide for each chapter
- Calculates overall completion %: `Math.round((doneChapters / totalChapters) * 100)`

**Data Flow:**
```
getStudyExamPreference() 
  → getExamSyllabusWithProgress(examId)
    → Merges EXAM_SYLLABUS with localStorage progress
    → Returns: ExamSyllabus with status & progress for each chapter
```

#### [client/pages/ChapterTest.tsx](client/pages/ChapterTest.tsx)
**Purpose:** Conduct chapter-wise test and track performance

**Features:**
- Loads 10 MCQ questions via `/api/test/:chapterId/questions`
- 10-minute timer (DEFAULT_TIME_SECONDS = 600)
- Select/deselect answers
- Auto-submit when timer expires
- Calculates accuracy, grade (S/A/B/C/F)
- Saves progress: `saveChapterProgress(chapterId, { status, progress, lastScore })`
- Passes test (60%) → marks chapter as "done"
- Fails test (< 60%) → marks as "in_progress"

#### [client/pages/Dashboard.tsx](client/pages/Dashboard.tsx)
**Purpose:** Show overview of study progress

**Features:**
- Calculates syllabus completion %
- Shows days until exam
- Displays study progress metrics
- Links to study activities

#### [client/pages/StudyPlan.tsx](client/pages/StudyPlan.tsx)
**Purpose:** Display AI-generated & template study plans

**Features:**
- Two tabs: "AI Plan" (week-by-week) and "Template" (phase-based)
- Fetches AI plan from `/api/studyplan/ai` or generates fallback
- Shows syllabus completion % alongside plan
- Displays study phase breakdowns

#### [client/pages/Profile.tsx](client/pages/Profile.tsx)
**Purpose:** Manage exam preferences

**Features:**
- Select exam for study (saves to localStorage)
- Updates study context across all pages
- Key: `STUDY_EXAM_KEY = "study_exam_preference"`

### Progress Persistence (localStorage)

**Key:** `syllabus_progress`

**Structure:**
```typescript
{
  "ch_1": {
    "chapterId": "ch_1",
    "status": "done" | "in_progress" | "not_started",
    "progress": 75,      // 0-100%
    "lastScore": 75
  },
  "ch_2": { ... }
}
```

**Helper Functions:**
- `getSavedProgress()` — Reads from localStorage
- `saveChapterProgress(chapterId, data)` — Writes to localStorage
- `getExamSyllabusWithProgress(examId)` — Merges syllabus + saved progress

---

## 6. Shared Types

### Location: [shared/study-types.ts](shared/study-types.ts)

```typescript
// ── Exam Types ────────────────────────────────────────────────
export type StudyExamType = "WBCS" | "WBPSC" | "Police_SI" | "SSC_CGL" | "Banking";

export const STUDY_EXAM_LABELS: Record<StudyExamType, string> = {
  WBCS: "WBCS",
  WBPSC: "WBPSC",
  Police_SI: "Police SI",
  SSC_CGL: "SSC CGL",
  Banking: "Banking IBPS/SBI",
};

// ── Chapter / Subject Models ──────────────────────────────────
export type ChapterStatus = "not_started" | "in_progress" | "done";

export interface Chapter {
  id: string;
  name: string;
  nameBn: string;
  status: ChapterStatus;
  progress: number;           // 0-100
  questionCount: number;      // Questions available
}

export interface SyllabusSubject {
  id: string;
  name: string;
  nameBn: string;
  icon: string;               // Emoji
  chapters: Chapter[];
}

export interface ExamSyllabus {
  examId: StudyExamType;
  subjects: SyllabusSubject[];
}

// ── Study Plan Types ──────────────────────────────────────────
export interface WeekPlan {
  week: number;
  title: string;
  subjects: string[];
  chapters: string[];
  hoursPerDay: number;
  tips: string;
}

export interface AIStudyPlan {
  examId: StudyExamType;
  examDate: string;
  hoursPerDay: number;
  totalWeeks: number;
  weeks: WeekPlan[];
  createdAt: string;
}

export interface TemplatePhaseTopic {
  subject: string;
  chapters: string[];
}

export interface TemplatePhase {
  phase: number;
  title: string;
  duration: string;
  description: string;
  topics: TemplatePhaseTopic[];
}

export interface StudyPlanTemplate {
  examId: StudyExamType;
  phases: TemplatePhase[];
}

// ── Test Types ────────────────────────────────────────────────
export interface ChapterQuestion {
  id: number;
  question: string;
  questionBn?: string;
  options: [string, string, string, string];
  optionsBn?: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  explanationBn?: string;
}

export interface ChapterTestResult {
  chapterId: string;
  score: number;
  total: number;
  accuracy: number;
  passed: boolean;
  answers: { questionId: number; selected: number | null; correct: number }[];
}
```

---

## 7. Question Generation System

### Location
- **Client**: [client/lib/exam-syllabus-data.ts](client/lib/exam-syllabus-data.ts#L507)
- **Server**: [server/routes/studyPlan.ts](server/routes/studyPlan.ts#L195)

### General Question Templates

Questions are generated dynamically based on the chapter name using templates:

```
1. Which of the following is most closely related to {ChapterName}?
2. What is the primary focus of {ChapterName}?
3. In the context of {ChapterName}, which statement is correct?
4. Which year is significant in the study of {ChapterName}?
5. Who is associated with the development of {ChapterName} concepts?
6. The key principle of {ChapterName} is...
7. Which of these is NOT part of {ChapterName}?
8. The exam typically asks how many questions from {ChapterName}?
9. What is the best strategy to study {ChapterName}?
10. In a competitive exam, {ChapterName} falls under which section?
```

**Notes:**
- All 10 questions follow a multiple-choice format
- Correct answer is always option 0 (programmatic pattern)
- Explanations reference chapter concepts
- Questions are context-aware based on chapter name

---

## 8. Summary Statistics

### Total Content

| Exam | Subjects | Total Chapters |
|------|----------|----------------|
| WBCS | 8 | 35 |
| WBPSC | 6 | 22 |
| Police SI | 5 | 17 |
| SSC CGL | 4 | 22 |
| Banking | 5 | 25 |
| **TOTAL** | **28** | **121** |

### Questions per Exam
- Each chapter has access to 10 MCQ questions (default)
- Total: **121 × 10 = 1,210 generated questions**

### Study Plan Phases
- Each exam has **3 study phases**
- Each phase covers **3-5 subjects** with specific topics
- Foundation → Practice → Revision structure

### Bilingual Support
- All chapters have English + Bengali names
- Future support for Bengali questions via `questionBn` field
- UI supports language toggle (en/bn)

---

## 9. Data Flow Diagram

```
User selects exam (SyllabusTracker/Profile)
        ↓
localStorage: STUDY_EXAM_KEY = examId
        ↓
getStudyExamPreference() → retrieves examId
        ↓
getExamSyllabusWithProgress(examId)
        ↓
EXAM_SYLLABUS[examId] + getSavedProgress()
        ↓
Merges both → ExamSyllabus with progress
        ↓
UI displays: Subjects → Chapters → Status badges
        ↓
User starts chapter test → ChapterTest page
        ↓
GET /api/test/{chapterId}/questions
        ↓
Server generates 10 contextual MCQs
        ↓
User submits answers
        ↓
POST /api/test/submit
        ↓
Server calculates score & accuracy
        ↓
saveChapterProgress() → localStorage updated
        ↓
UI shows results + updated syllabus completion %
```

---

## 10. Key Implementation Notes

### 1. Client-Side Emphasis
- **SYLLABUS DATA IS CLIENT-SIDE**
- API endpoints validate examId but defer to client data
- This reduces server load and enables offline access
- Progress is persisted in localStorage, not backend

### 2. ID Formats
- **Chapter IDs**: `ch_1`, `ch_2`, ... generated sequentially
- **Subject IDs**: `{exam}_{subject}` (e.g., `wbcs_history`)
- Server normalizes chapter IDs to numeric format: `normalizeChapterId("ch_1")` → `1`

### 3. Progress Tracking
- Minimum passing score: **60%** (PASS_THRESHOLD)
- Progress % = accuracy score from chapter test
- Status implications:
  - **not_started** (default): Never attempted
  - **in_progress**: Attempted but score < 60%
  - **done**: Achieved 60% or higher

### 4. Study Plan Generation
- **Template**: Fixed 3-phase structure per exam (pre-defined)
- **AI Plan**: Dynamically generated based on exam date + hours/day
- Total weeks calculated: `Math.ceil((target - now) / 7 days)`
- Fallback plan uses template data if API fails

### 5. Bilingual Architecture
- All chapter/subject names have `name` (English) + `nameBn` (Bengali)
- Questions have optional `questionBn` and `optionsBn` fields
- Current UI defaults to English; ready for language toggle

