# Skeleton Loader Analysis & Implementation Guide

**Date**: March 29, 2026  
**Status**: Comprehensive analysis of current skeleton component and loading patterns across 30+ pages

---

## 1. CURRENT SKELETON COMPONENT

### Location
[client/components/ui/skeleton.tsx](client/components/ui/skeleton.tsx)

### Current Implementation
```typescript
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
```

### Current Capabilities
✅ Basic pulse animation (`animate-pulse`)  
✅ Customizable via className prop  
✅ Merges custom classes with cn() utility  
✅ Generic HTML attributes support  

### Current Usage
- **Only used in**: [client/components/ui/sidebar.tsx](client/components/ui/sidebar.tsx) (1 location)
- **SidebarMenuSkeleton**: Custom skeleton for sidebar menu items (1 component)

### What's Missing
❌ No specialized skeleton variants (card, text, circle, rectangle)  
❌ Not integrated into content-heavy pages  
❌ No skeleton group patterns for multiple items  
❌ Limited use across application  

---

## 2. PAGES NEEDING SKELETON LOADERS

### Primary Target Pages (User-Specified)

#### 1. **ChapterTest.tsx** (Quiz Questions)
- **Current Loading UI**: Shows spinner until data loads
- **Data Fetched**: `fetch(/api/test/{chapterId}/questions)`
- **Loading State**: `const [loading, setLoading] = useState(true)`
- **Content to Skeleton**: Questions with options, progress bar, timer
- **Load Pattern**: 
  ```typescript
  useEffect(() => {
    if (!chapterId) { navigate("/syllabus", { replace: true }); return; }
    (async () => {
      try {
        const res = await fetch(`/api/test/${encodeURIComponent(chapterId)}/questions`);
        if (res.ok) {
          const data: ChapterQuestion[] = await res.json();
          setQuestions(data);
          setLoading(false);
        }
      } catch { /* fallback */ }
      const local = getChapterQuestions(chapterId);
      setQuestions(local);
      setLoading(false);
    })();
  }, [chapterId, navigate]);
  ```
- **Skeleton Needs**: Question card skeleton, multiple choice options skeleton, progress bar skeleton

#### 2. **Leaderboard.tsx** (Leaderboard Data)
- **Current Loading UI**: State `loadingLB` but shows nothing while loading (blank page)
- **Data Fetched**: `fetchLeaderboard(filter)` with weekly/monthly filter
- **Loading State**: `const [loadingLB, setLoadingLB] = useState(true)`
- **Content to Skeleton**: Top 3 podium cards, leaderboard entry list
- **Load Pattern**:
  ```typescript
  useEffect(() => {
    setLoadingLB(true);
    fetchLeaderboard(filter).then((data) => { setSorted(data); setLoadingLB(false); });
  }, [filter]);
  ```
- **Skeleton Needs**: User card skeleton (with avatar, rank, score), leaderboard row skeleton

#### 3. **DailyQuiz.tsx** (Daily Quiz)
- **Current Loading UI**: Shows spinner with text "Loading quiz…"
- **Data Fetched**: `fetchQuestions()` for 10 daily questions
- **Loading State**: `const [loading, setLoading] = useState(true)`
- **Content to Skeleton**: Quiz questions, timer, progress indicator
- **Load Pattern**:
  ```typescript
  useEffect(() => {
    if (!state?.exam || !state?.subject) {
      navigate("/daily-tasks", { replace: true });
      return;
    }
    fetchQuestions({
      exam: state.exam,
      subject: state.subject,
      difficulty: "Medium",
      count: 10,
    }).then((qs) => {
      setQuestions(qs);
      setSelected(new Array(qs.length).fill(null));
      setLoading(false);
    });
  }, [state, navigate]);
  ```
- **Skeleton Needs**: Question skeleton with options, timer skeleton

#### 4. **MockTestPage.tsx** (Mock Test Questions)
- **Current Loading UI**: Mode system includes "loading" state but no visual implementation
- **Data Fetched**: `fetchMockTestPaper()` from Python backend API
- **Loading Mode**: `type Mode = "choice" | "loading" | "viewing" | "attempting" | "submitted"`
- **Content to Skeleton**: Full test paper with 60+ questions, subject cards, difficulty badges
- **Load Pattern**:
  ```typescript
  useEffect(() => {
    setMode("loading");
    fetchMockTestPaper(examType).then((paper) => {
      setMockPaper(paper);
      setMode("choice");
    });
  }, [examType]);
  ```
- **Skeleton Needs**: Question skeleton x60, subject palette skeleton, difficulty badge skeleton

#### 5. **Dashboard.tsx** (Dashboard Data)
- **Current Loading UI**: Shows data immediately from mock, no loading indicator
- **Data Fetched**: `fetchDashboard()` async - but UI renders before data loads
- **Loading State**: Not tracked separate from data
- **Content to Skeleton**: Stats cards, subject progress, leaderboard mini, syllabus completion
- **Load Pattern**:
  ```typescript
  useEffect(() => {
    fetchDashboard().then((data) => setStats(data));
  }, []);
  ```
- **Skeleton Needs**: Stats card skeleton, progress bar skeleton, mini leaderboard skeleton

#### 6. **GovtPractice.tsx** (Govt Exam Practice)
- **Current Loading UI**: Has `loading` state but shows option selector (no dynamic loading show)
- **Data Fetched**: Questions fetched on button click via `fetchQuestions()`
- **Loading State**: `const [loading, setLoading] = useState(false)`
- **Content to Skeleton**: Exam selection is static, but questions list needs skeleton
- **Load Pattern**:
  ```typescript
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const config: TestConfig = { exam, subject, difficulty, count, language };
      const questions = await fetchQuestions(config);
      navigate("/govt-test", { state: { config, questions, language, dailyTaskId: incoming?.dailyTaskId } });
    } catch {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  ```
- **Skeleton Needs**: Questions list skeleton during fetch progress

#### 7. **GovtTest.tsx** (Govt Test)
- **Current Loading UI**: No loading (questions passed via location state from GovtPractice)
- **Data Transfer**: Questions come pre-loaded from GovtPractice navigation
- **Content**: Question display, options, flagging, timer
- **Skeleton Needs**: Minimal - data pre-loaded. But could benefit for initial question display

---

## 3. ADDITIONAL PAGES WITH DYNAMIC DATA

### 30+ Total Pages Fetching Data

**Government Exam Testing/Practice** (7 pages):
1. [ChapterTest.tsx](client/pages/ChapterTest.tsx) - ✅ PRIORITY 1
2. [Leaderboard.tsx](client/pages/Leaderboard.tsx) - ✅ PRIORITY 1
3. [DailyQuiz.tsx](client/pages/DailyQuiz.tsx) - ✅ PRIORITY 1
4. [MockTestPage.tsx](client/pages/MockTestPage.tsx) - ✅ PRIORITY 1
5. [GovtPractice.tsx](client/pages/GovtPractice.tsx) - ✅ PRIORITY 1
6. [GovtTest.tsx](client/pages/GovtTest.tsx) - ✅ PRIORITY 1
7. [GovtResult.tsx](client/pages/GovtResult.tsx) - ⚠️ PRIORITY 2 (results display)

**Dashboard/Analytics** (3 pages):
8. [Dashboard.tsx](client/pages/Dashboard.tsx) - ✅ PRIORITY 1
9. [DailyTasks.tsx](client/pages/DailyTasks.tsx) - ⚠️ PRIORITY 2 (task list)
10. [Evaluation.tsx](client/pages/Evaluation.tsx) - ⚠️ PRIORITY 2 (evaluation results)

**Study & Learning** (6 pages):
11. [CurrentAffairs.tsx](client/pages/CurrentAffairs.tsx) - ⚠️ PRIORITY 2
    - Fetches: `fetchCurrentAffairs()` for news, weekly quiz, monthly topics
    - Loading state: `const [loading, setLoading] = useState(true)`
    
12. [QuestionHub.tsx](client/pages/QuestionHub.tsx) - ⚠️ PRIORITY 2
    - Fetches: `fetch(/api/questions/{selectedFolder})`
    - Loading state: Not explicitly tracked
    
13. [SyllabusTracker.tsx](client/pages/SyllabusTracker.tsx) - ⚠️ PRIORITY 2
    - Fetches: Local storage + computed syllabus data
    
14. [StudyPlan.tsx](client/pages/StudyPlan.tsx) - ⚠️ PRIORITY 2
    - Fetches: `fetch(/api/studyplan/ai)` for AI-generated study plan
    - Loading state: `const [loading, setLoading] = useState(true)`
    
15. [PrevYearQuestions.tsx](client/pages/PrevYearQuestions.tsx) - ⚠️ PRIORITY 2
    - Fetches: PDF questions extraction
    
16. [PDFMockTest.tsx](client/pages/PDFMockTest.tsx) - ⚠️ PRIORITY 2
    - Fetches: PDF documents from public folder

**Interview Preparation** (5 pages):
17. [InterviewRoom.tsx](client/pages/InterviewRoom.tsx) - ⚠️ PRIORITY 2
    - Has `camera.isLoading` state (uses custom hook)
    
18. [InterviewSetup.tsx](client/pages/InterviewSetup.tsx) - ⚠️ PRIORITY 3
    - Camera/audio setup
    
19. [Chatbot.tsx](client/pages/Chatbot.tsx) - ⚠️ PRIORITY 2
    - Fetches: `fetch(/api/study/chat)` for chat responses
    
20. [CareerMentor.tsx](client/pages/CareerMentor.tsx) - ⚠️ PRIORITY 2
    - Fetches: `fetch({API_BASE}/career-mentor)`
    
21. [StoryTelling.tsx](client/pages/StoryTelling.tsx) - ⚠️ PRIORITY 3
    - Fetches: `fetch(/api/tts)` and `fetch(/api/story)`

**Content/Information Pages** (4 pages):
22. [Profile.tsx](client/pages/Profile.tsx) - ⚠️ PRIORITY 3 (profile data load)
23. [Auth.tsx](client/pages/Auth.tsx) - ⚠️ PRIORITY 3
24. [Index.tsx](client/pages/Index.tsx) - ⚠️ PRIORITY 3
    - Demo fetch: `fetch(/api/demo)`
    
25. [Contact.tsx](client/pages/Contact.tsx) - ⚠️ PRIORITY 3 (form submit)

**Interactive Features** (3+ pages):
26. [StudyWithMe.tsx](client/pages/StudyWithMe.tsx) - ⚠️ PRIORITY 2
27. [PhotoSolver.tsx](client/pages/PhotoSolver.tsx) - ⚠️ PRIORITY 2
28. [ResumeBuilder.tsx](client/pages/ResumeBuilder.tsx) - ⚠️ PRIORITY 3

---

## 4. CURRENT LOADING UI PATTERNS

### Pattern A: Centered Spinner with Text (Best)
**Used in**: DailyQuiz.tsx

```typescript
if (loading) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-muted-foreground">Loading quiz…</p>
      </div>
    </div>
  );
}
```

**Pros**: Clear, blocks interaction, shows progress  
**Cons**: No content preview, jarring delay, poor perceived performance

---

### Pattern B: Silent Loading (Current in most pages)
**Used in**: Dashboard.tsx, Leaderboard.tsx, CurrentAffairs.tsx

```typescript
const [stats, setStats] = useState<DashboardStats>(MOCK_DASHBOARD);
// No loading state tracked, renders immediately with mock data
useEffect(() => {
  fetchDashboard().then((data) => setStats(data));
}, []);
```

**Pros**: Content appears immediately, smooth transition  
**Cons**: Shows stale/mock data, confusing if real data is different, no feedback

---

### Pattern C: Mode-Based System (Architectural)
**Used in**: MockTestPage.tsx

```typescript
type Mode = "choice" | "loading" | "viewing" | "attempting" | "submitted";
// But "loading" mode is defined but never rendered as UI
```

**Pros**: Structured state management  
**Cons**: Mode-specific UI not implemented, inconsistent rendering

---

### Pattern D: No Loading Indicator (Common Gap)
**Used in**: GovtTest.tsx, GovtResult.tsx, many others

```typescript
// Data comes from navigation state, no loading shown
// Questions already fetched/available
```

**Issue**: No feedback during data transfer/preparation

---

## 5. DATA FETCHING HOOKS & PATTERNS

### Fetch Functions Used

| Function | Location | Pages Using | Purpose |
|----------|----------|-------------|---------|
| `fetchLeaderboard(filter)` | [client/lib/govt-practice-data.ts](client/lib/govt-practice-data.ts) | Leaderboard.tsx | Leaderboard with weekly/monthly filter |
| `fetchQuestions(config)` | [client/lib/govt-practice-data.ts](client/lib/govt-practice-data.ts) | DailyQuiz, GovtPractice, QuestionHub | Questions with difficulty/exam/subject |
| `fetchDashboard()` | [client/lib/govt-practice-data.ts](client/lib/govt-practice-data.ts) | Dashboard.tsx | Dashboard statistics |
| `fetchCurrentAffairs()` | [client/lib/govt-practice-data.ts](client/lib/govt-practice-data.ts) | CurrentAffairs.tsx | News + weekly quiz + monthly topics |
| `getChapterQuestions(id)` | [client/lib/exam-syllabus-data.ts](client/lib/exam-syllabus-data.ts) | ChapterTest.tsx | Questions from syllabus (local/API) |
| `fetchMockTestPaper(exam)` | [client/lib/mock-test-paper.ts](client/lib/mock-test-paper.ts) | MockTestPage.tsx | Full mock test paper (Python backend) |
| API `fetch()` calls | Various | Chatbot, CareerMentor, StudyPlan | Direct fetch() to /api/* endpoints |

### Common Loading State Pattern

```typescript
// State
const [data, setData] = useState<DataType>(DEFAULT_OR_MOCK);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Effect
useEffect(() => {
  fetchData().then(
    (data) => { setData(data); setLoading(false); },
    (err) => { setError(err.message); setLoading(false); }
  );
}, [dependencies]);

// Render
if (loading) return <LoadingUI />;
if (error) return <ErrorUI />;
return <ContentUI data={data} />;
```

---

## 6. RECOMMENDED SKELETON COMPONENT EXTENSIONS

### Variant 1: Simple Bar Skeleton (for text, titles)
```typescript
export function SkeletonText({ className = "h-4 w-3/4" }: { className?: string }) {
  return <Skeleton className={cn("rounded-md", className)} />;
}
```

### Variant 2: Card Skeleton (for dashboard cards, leaderboard rows)
```typescript
export function SkeletonCard() {
  return (
    <Card className="p-4 space-y-3">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );
}
```

### Variant 3: Avatar Skeleton (for user/profile display)
```typescript
export function SkeletonAvatar({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" }[size];
  return <Skeleton className={cn("rounded-full", sizeClass)} />;
}
```

### Variant 4: Question Skeleton (for quiz/test pages)
```typescript
export function SkeletonQuestion() {
  return (
    <Card className="p-6 space-y-4">
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </Card>
  );
}
```

### Variant 5: Group Skeleton (for lists of items)
```typescript
export function SkeletonGroup({ count = 3, variant = "card" }: { count?: number; variant?: string }) {
  const Item = variant === "card" ? SkeletonCard : variant === "avatar" ? SkeletonAvatar : Skeleton;
  return <div className="space-y-3">{Array(count).fill(0).map((_, i) => <Item key={i} />)}</div>;
}
```

---

## 7. IMPLEMENTATION PRIORITY & ROADMAP

### Phase 1: Core Extensions (Week 1)
- ✅ Create `SkeletonText` variant for titles/descriptions
- ✅ Create `SkeletonCard` for dashboard/list items
- ✅ Create `SkeletonGroup` for multiple item lists
- ✅ Create `SkeletonQuestion` for quiz/test questions
- ✅ Add to [client/components/ui/skeleton.tsx](client/components/ui/skeleton.tsx)

### Phase 2: Priority Pages Integration (Week 2)
1. **Dashboard.tsx** - Dashboard stats skeleton
2. **Leaderboard.tsx** - Leaderboard entry skeleton + podium skeleton
3. **ChapterTest.tsx** - Question skeleton + options skeleton

### Phase 3: Secondary Pages Integration (Week 3)
1. **DailyQuiz.tsx** - Replace spinner with skeleton
2. **GovtPractice.tsx** - Show skeleton while fetching questions
3. **MockTestPage.tsx** - Use "loading" mode with skeleton UI

### Phase 4: Remaining Pages (Week 4+)
- CurrentAffairs, StudyPlan, Chatbot, CareerMentor, etc.

---

## 8. SUMMARY DATA TABLE

| Aspect | Current State | Gap | Impact |
|--------|---------------|-----|--------|
| **Skeleton Component** | Basic pulse div | No variants | Poor UX on slow networks |
| **Usage** | Only in sidebar | 30+ pages need it | Content flashing, blank states |
| **Loading UI** | Spinner or silent | Inconsistent patterns | Confusing user experience |
| **Data Fetching** | Functional but slow feedback | No skeleton feedback | Perceived slowness |
| **Error Handling** | Some pages handle | Incomplete coverage | Silent failures in many pages |

---

## 9. PAIN POINTS IDENTIFIED

1. **No Perceived Performance for Slow Networks**
   - Users see blank/spinner → stale data → updated data
   - Jarring transitions, feels slow

2. **Inconsistent Loading Experience**
   - Some pages show spinner, some show nothing, some show stale data
   - Confusing navigation and expectations

3. **Quiz/Test Pages Most Critical**
   - ChapterTest, DailyQuiz, GovtTest show nothing during question load
   - Questions are structured, ideally suited for skeletons

4. **Leaderboard & Dashboard Data**
   - Hit network on every load
   - Currently shows mock data or blank space

---

## KEY FILES FOR IMPLEMENTATION

1. **Extend Component**: [client/components/ui/skeleton.tsx](client/components/ui/skeleton.tsx)
2. **Integrate into**:
   - [client/pages/Dashboard.tsx](client/pages/Dashboard.tsx)
   - [client/pages/Leaderboard.tsx](client/pages/Leaderboard.tsx)
   - [client/pages/ChapterTest.tsx](client/pages/ChapterTest.tsx)
   - [client/pages/DailyQuiz.tsx](client/pages/DailyQuiz.tsx)
   - [client/pages/MockTestPage.tsx](client/pages/MockTestPage.tsx)

---

**Next Steps**: Review analysis → Plan Phase 1 implementation → Create skeleton variants → Integrate into priority pages
