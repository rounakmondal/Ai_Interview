# Study Plan & Syllabus API — Complete Documentation

All study plans and syllabuses now come from **server API endpoints**. This document provides request/response examples for all endpoints.

---

## 1. GET `/api/syllabus/:examId` — Get Exam Syllabus with All Chapters

**Purpose:** Fetch complete syllabus structure with all subjects and chapters for an exam.

### Request
```bash
GET /api/syllabus/WBCS
Content-Type: application/json
```

### Response: `SyllabusResponse`
```json
{
  "examId": "WBCS",
  "totalChapters": 35,
  "estimatedHoursPerChapter": 2,
  "subjects": [
    {
      "id": "wbcs_history",
      "name": "History",
      "nameBn": "ইতিহাস",
      "icon": "📜",
      "chapters": [
        {
          "id": "ch_1",
          "name": "Ancient India",
          "nameBn": "প্রাচীন ভারত",
          "status": "not_started",
          "progress": 0,
          "questionCount": 10
        },
        {
          "id": "ch_2",
          "name": "Medieval India",
          "nameBn": "মধ্যযুগীয় ভারত",
          "status": "not_started",
          "progress": 0,
          "questionCount": 10
        },
        {
          "id": "ch_3",
          "name": "Modern India",
          "nameBn": "আধুনিক ভারত",
          "status": "not_started",
          "progress": 0,
          "questionCount": 10
        },
        {
          "id": "ch_4",
          "name": "Indian National Movement",
          "nameBn": "ভারতীয় জাতীয় আন্দোলন",
          "status": "not_started",
          "progress": 0,
          "questionCount": 10
        },
        {
          "id": "ch_5",
          "name": "World History",
          "nameBn": "বিশ্ব ইতিহাস",
          "status": "not_started",
          "progress": 0,
          "questionCount": 10
        },
        {
          "id": "ch_6",
          "name": "Bengal Renaissance",
          "nameBn": "বাংলার নবজাগরণ",
          "status": "not_started",
          "progress": 0,
          "questionCount": 10
        }
      ]
    }
  ]
}
```

### Supported Exam IDs
- `WBCS` — West Bengal Civil Service
- `WBPSC` — West Bengal Public Service Commission
- `Police_SI` — Police Sub-Inspector
- `SSC_CGL` — Staff Selection Commission Combined Graduate Level
- `Banking` — Banking IBPS/SBI

---

## 2. GET `/api/studyplan/template/:examId` — Get Study Plan Template

**Purpose:** Fetch 3-phase study template (Foundation → Practice → Revision).

### Request
```bash
GET /api/studyplan/template/WBCS
Content-Type: application/json
```

### Response: `StudyTemplateResponse`
```json
{
  "examId": "WBCS",
  "totalHours": 12,
  "phases": [
    {
      "phase": 1,
      "title": "Foundation — Core Concepts (4-6 weeks)",
      "duration": "4-6 weeks",
      "description": "Build strong foundational knowledge. Study NCERT and basic concepts.",
      "topics": [
        {
          "subject": "History",
          "chapters": [
            "Ancient India",
            "Medieval India"
          ]
        },
        {
          "subject": "Geography",
          "chapters": [
            "Physical Geography",
            "Indian Geography"
          ]
        },
        {
          "subject": "Polity",
          "chapters": [
            "Indian Constitution",
            "Fundamental Rights"
          ]
        }
      ]
    },
    {
      "phase": 2,
      "title": "Practice — Problem Solving (6-8 weeks)",
      "duration": "6-8 weeks",
      "description": "Solve previous year papers and take chapter-wise tests. Focus on speed and accuracy.",
      "topics": [
        {
          "subject": "Reasoning",
          "chapters": [
            "Verbal Reasoning",
            "Logical Reasoning"
          ]
        },
        {
          "subject": "Mathematics",
          "chapters": [
            "Arithmetic",
            "Algebra"
          ]
        }
      ]
    },
    {
      "phase": 3,
      "title": "Revision — Full-Length Mocks (2-3 weeks)",
      "duration": "2-3 weeks",
      "description": "Take full-length mock tests daily. Review weak areas. Build confidence.",
      "topics": [
        {
          "subject": "Current Affairs",
          "chapters": [
            "National Affairs",
            "International Affairs"
          ]
        }
      ]
    }
  ]
}
```

---

## 3. POST `/api/studyplan/ai` — Generate AI Study Plan

**Purpose:** Create a personalized AI-generated study plan based on exam date and available hours.

### Request
```bash
POST /api/studyplan/ai
Content-Type: application/json

{
  "examId": "WBCS",
  "examDate": "2026-06-15",
  "hoursPerDay": 3
}
```

### Response: `AIStudyPlan`
```json
{
  "examId": "WBCS",
  "examDate": "2026-06-15",
  "hoursPerDay": 3,
  "totalWeeks": 11,
  "createdAt": "2026-03-29T00:00:00.000Z",
  "weeks": [
    {
      "week": 1,
      "title": "Week 1 — Foundation",
      "subjects": ["History", "Geography"],
      "chapters": ["History chapters", "Geography chapters"],
      "hoursPerDay": 3,
      "tips": "Focus on NCERT and building concepts."
    },
    {
      "week": 2,
      "title": "Week 2 — Foundation",
      "subjects": ["Polity", "Reasoning"],
      "chapters": ["Polity chapters", "Reasoning chapters"],
      "hoursPerDay": 3,
      "tips": "Focus on NCERT and building concepts."
    },
    {
      "week": 3,
      "title": "Week 3 — Foundation",
      "subjects": ["Math", "Current Affairs"],
      "chapters": ["Math chapters", "Current Affairs chapters"],
      "hoursPerDay": 3,
      "tips": "Focus on NCERT and building concepts."
    },
    {
      "week": 4,
      "title": "Week 4 — Foundation",
      "subjects": ["English", "Bengali"],
      "chapters": ["English chapters", "Bengali chapters"],
      "hoursPerDay": 3,
      "tips": "Focus on NCERT and building concepts."
    },
    {
      "week": 5,
      "title": "Week 5 — Practice",
      "subjects": ["History", "Geography"],
      "chapters": ["History chapters", "Geography chapters"],
      "hoursPerDay": 3,
      "tips": "Solve previous year papers and take topic tests."
    },
    {
      "week": 6,
      "title": "Week 6 — Revision",
      "subjects": ["All Subjects"],
      "chapters": ["All chapters"],
      "hoursPerDay": 3,
      "tips": "Full-length mocks daily. Revise weak areas only."
    }
  ]
}
```

---

## 4. GET `/api/syllabus/:examId/progress` — Get Syllabus Progress

**Purpose:** Fetch user's progress across the entire exam syllabus (overall and subject-wise).

### Request
```bash
GET /api/syllabus/WBCS/progress
Content-Type: application/json
```

### Response: `SyllabusProgressResponse`
```json
{
  "examId": "WBCS",
  "completionPercentage": 35,
  "chaptersCompleted": 12,
  "totalChapters": 35,
  "lastUpdated": "2026-03-29T15:30:00.000Z",
  "subjectProgress": [
    {
      "subjectId": "wbcs_history",
      "subjectName": "History",
      "completionPercentage": 50,
      "chaptersCompleted": 3,
      "totalChapters": 6
    },
    {
      "subjectId": "wbcs_geography",
      "subjectName": "Geography",
      "completionPercentage": 40,
      "chaptersCompleted": 2,
      "totalChapters": 5
    },
    {
      "subjectId": "wbcs_polity",
      "subjectName": "Polity",
      "completionPercentage": 33,
      "chaptersCompleted": 2,
      "totalChapters": 6
    },
    {
      "subjectId": "wbcs_reasoning",
      "subjectName": "Reasoning",
      "completionPercentage": 25,
      "chaptersCompleted": 1,
      "totalChapters": 4
    },
    {
      "subjectId": "wbcs_math",
      "subjectName": "Mathematics",
      "completionPercentage": 20,
      "chaptersCompleted": 1,
      "totalChapters": 5
    }
  ]
}
```

---

## 5. GET `/api/test/:chapterId/questions` — Get Chapter Test Questions

**Purpose:** Fetch 10 MCQ questions for a specific chapter.

### Request
```bash
GET /api/test/ch_1/questions
Content-Type: application/json
```

### Response
```json
[
  {
    "id": 1,
    "question": "Question 1 about Chapter 1: Which of the following is correct?",
    "questionBn": "প্রশ্ন 1: নিম্নলিখিত কোনটি সঠিক?",
    "options": [
      "Correct answer for Q1",
      "Distractor A for Q1",
      "Distractor B for Q1",
      "Distractor C for Q1"
    ],
    "optionsBn": [
      "সঠিক উত্তর Q1",
      "ভুল উত্তর A",
      "ভুল উত্তর B",
      "ভুল উত্তর C"
    ],
    "correctIndex": 0,
    "explanation": "The correct answer is the first option because it accurately represents the concept from Chapter 1.",
    "explanationBn": "প্রথম বিকল্পটি সঠিক কারণ এটি অধ্যায় 1 এর ধারণা সঠিকভাবে প্রতিনিধিত্ব করে।"
  },
  {
    "id": 2,
    "question": "Question 2 about Chapter 1: Which of the following is correct?",
    "options": [
      "Correct answer for Q2",
      "Distractor A for Q2",
      "Distractor B for Q2",
      "Distractor C for Q2"
    ],
    "correctIndex": 0,
    "explanation": "The correct answer is the first option because it accurately represents the concept from Chapter 1."
  }
  // ... 8 more questions
]
```

---

## 6. POST `/api/test/submit` — Submit Chapter Test

**Purpose:** Submit test answers and get score, accuracy, and performance metrics.

### Request
```bash
POST /api/test/submit
Content-Type: application/json

{
  "chapterId": "ch_1",
  "answers": [
    { "questionId": 1, "selected": 0 },
    { "questionId": 2, "selected": 1 },
    { "questionId": 3, "selected": 0 },
    { "questionId": 4, "selected": 2 },
    { "questionId": 5, "selected": 0 },
    { "questionId": 6, "selected": 1 },
    { "questionId": 7, "selected": 0 },
    { "questionId": 8, "selected": 3 },
    { "questionId": 9, "selected": 0 },
    { "questionId": 10, "selected": 1 }
  ]
}
```

### Response: `ChapterTestResult`
```json
{
  "chapterId": "ch_1",
  "score": 7,
  "total": 10,
  "accuracy": 70,
  "passed": true,
  "answers": [
    { "questionId": 1, "selected": 0, "correct": 0 },
    { "questionId": 2, "selected": 1, "correct": 0 },
    { "questionId": 3, "selected": 0, "correct": 0 },
    { "questionId": 4, "selected": 2, "correct": 0 },
    { "questionId": 5, "selected": 0, "correct": 0 },
    { "questionId": 6, "selected": 1, "correct": 0 },
    { "questionId": 7, "selected": 0, "correct": 0 },
    { "questionId": 8, "selected": 3, "correct": 0 },
    { "questionId": 9, "selected": 0, "correct": 0 },
    { "questionId": 10, "selected": 1, "correct": 0 }
  ]
}
```

**Status Codes:**
- `200 OK` — Test submitted successfully
- `400 Bad Request` — Missing or invalid chapterId/answers
- `201 Created` — Progress record created (if tracking DB updates)

### Passing Criteria
- **Minimum accuracy to pass:** 60%
- **Questions to attempt:** All 10 questions

---

## 7. POST `/api/ai/chapter-guide` — Get AI Study Guide

**Purpose:** Get AI-generated study guide and explanations for a chapter.

### Request
```bash
POST /api/ai/chapter-guide
Content-Type: application/json

{
  "chapterId": "1",
  "chapterName": "Ancient India",
  "userQuery": "What are the main dynasties in Ancient India?"
}
```

### Response: `AIChapterGuideResponse`
```json
{
  "chapterId": 1,
  "answer": "## Study Guide: Ancient India\n\n**Your question:** What are the main dynasties in Ancient India?\n\n### Key Points\n\n1. **Start with basics** — Make sure you understand the fundamental concepts before moving to advanced topics.\n\n2. **NCERT is your best friend** — For most competitive exams, NCERT textbooks cover 70-80% of the syllabus.\n\n3. **Practice MCQs daily** — Solve at least 20-30 MCQs daily from this chapter to build speed and accuracy.\n\n4. **Previous Year Questions** — Always study PYQs from the last 5 years. They show the exam pattern clearly.\n\n5. **Make short notes** — Write key facts, dates, and formulas on flashcards for quick revision.\n\n### Recommended Resources\n- NCERT textbooks (Class 6-12)\n- Lucent's GK (for quick revision)\n- Previous year papers (last 5 years)\n- Daily current affairs for context\n\n### Exam Tips\n- Time management is crucial. Don't spend more than 1 minute per MCQ.\n- Eliminate obviously wrong options first.\n- If unsure, mark the most logical answer — don't leave blank unless there's negative marking.\n\n> 💡 **Pro Tip:** Create a revision schedule where you revisit this chapter every 7 days using spaced repetition."
}
```

---

## Data Flow & Tracking

### Chapter ID Format
Supports both formats (normalized internally):
- `ch_1` (format: ch_{number})
- `1` (numeric string)
- `1` (number)

### Progress Tracking
- Each chapter submission updates user progress
- Progress persists in database (with device ID for anonymous users)
- Resets on new exam selection

### Syllabus Completion Calculation
```
Overall Completion % = (Chapters Completed / Total Chapters) × 100
Subject Completion % = (Subject Chapters Completed / Subject Total) × 100
```

---

## Integration Example (Client Code)

```typescript
// 1. Fetch syllabus
const syllabusRes = await fetch("/api/syllabus/WBCS");
const syllabus = await syllabusRes.json(); // SyllabusResponse

// 2. Fetch template
const templateRes = await fetch("/api/studyplan/template/WBCS");
const template = await templateRes.json(); // StudyTemplateResponse

// 3. Generate or get AI plan
const planRes = await fetch("/api/studyplan/ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    examId: "WBCS",
    examDate: "2026-06-15",
    hoursPerDay: 3
  })
});
const plan = await planRes.json(); // AIStudyPlan

// 4. Check progress
const progressRes = await fetch("/api/syllabus/WBCS/progress");
const progress = await progressRes.json(); // SyllabusProgressResponse

// 5. Get chapter questions
const questionsRes = await fetch("/api/test/ch_1/questions");
const questions = await questionsRes.json(); // ChapterQuestion[]

// 6. Submit test answers
const submitRes = await fetch("/api/test/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chapterId: "ch_1",
    answers: [
      { questionId: 1, selected: 0 },
      // ... more answers
    ]
  })
});
const result = await submitRes.json(); // ChapterTestResult
```

---

## Error Handling

### Common Errors
| Status | Error | Solution |
|--------|-------|----------|
| `400` | Invalid examId | Use one of: WBCS, WBPSC, Police_SI, SSC_CGL, Banking |
| `400` | chapterId is required | Include valid chapterId (ch_1 or numeric) |
| `400` | answers[] required | Include array of { questionId, selected } |
| `500` | Server error | Retry or contact support |

---

## Type Definitions

All types are defined in `shared/study-types.ts`:
- `SyllabusResponse`
- `StudyTemplateResponse`
- `AIStudyPlan`
- `SyllabusProgressResponse`
- `ChapterQuestion`
- `ChapterTestResult`
- `AIChapterGuideResponse`
