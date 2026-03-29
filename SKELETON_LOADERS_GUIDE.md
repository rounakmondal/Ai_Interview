# Skeleton Loaders Implementation Guide

## Overview

Skeleton loaders show placeholder content while fetching dynamic data. This provides better perceived performance and reduces jarring blank screens.

**Files:**
- [client/components/ui/skeleton.tsx](client/components/ui/skeleton.tsx) — Base skeleton components
- [client/components/SkeletonLoaders.tsx](client/components/SkeletonLoaders.tsx) — Pre-built page-level loaders

---

## Skeleton Components

### Base Components

#### `Skeleton` 
Basic pulse-animated rectangle. Use for custom layouts.

```typescript
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-24 rounded" />
```

#### `SkeletonText`
Multi-line text placeholder. Great for titles and descriptions.

```typescript
<SkeletonText lines={3} /> // 3-line text block
```

#### `SkeletonCard`
Card placeholder with image, title, and description.

```typescript
<SkeletonCard />
```

#### `SkeletonQuestion`
Quiz question placeholder with 4 radio button options.

```typescript
<SkeletonQuestion />
```

#### `SkeletonAvatar`
User profile placeholder with avatar + name.

```typescript
<SkeletonAvatar />
```

#### `SkeletonLeaderboardRow`
Leaderboard entry with rank, avatar, name, score, accuracy.

```typescript
<SkeletonLeaderboardRow />
```

#### `SkeletonGroup`
Multiple skeletons in a grid/list. Automatically renders the correct type.

```typescript
<SkeletonGroup count={5} type="question" />
<SkeletonGroup count={8} type="leaderboard" />
<SkeletonGroup count={4} type="card" />
```

---

## Page-Level Loaders

Use these for entire page loading states. All accept optional props.

### `QuizLoadingScreen`
Full quiz page placeholder.

```typescript
import { QuizLoadingScreen } from "@/components/SkeletonLoaders";

// In your component
{isLoading ? (
  <QuizLoadingScreen questionNumber={2} totalQuestions={10} />
) : (
  <div>Quiz content</div>
)}
```

### `LeaderboardLoadingScreen`
Full leaderboard page placeholder.

```typescript
import { LeaderboardLoadingScreen } from "@/components/SkeletonLoaders";

{isLoading ? <LeaderboardLoadingScreen /> : <Leaderboard />}
```

### `DashboardLoadingScreen`
Dashboard with stats cards, charts, and mini leaderboard.

```typescript
import { DashboardLoadingScreen } from "@/components/SkeletonLoaders";

{isLoading ? <DashboardLoadingScreen /> : <Dashboard />}
```

### `MockTestLoadingScreen`
Multiple quiz questions placeholder for mock tests.

```typescript
import { MockTestLoadingScreen } from "@/components/SkeletonLoaders";

{isLoading ? <MockTestLoadingScreen questionCount={5} /> : <MockTest />}
```

### `TestResultsLoadingScreen`
Test results page with score card and answer review.

```typescript
import { TestResultsLoadingScreen } from "@/components/SkeletonLoaders";

{isLoading ? <TestResultsLoadingScreen /> : <Results />}
```

### `GovtQuestionsLoadingScreen`
Government practice questions page.

```typescript
import { GovtQuestionsLoadingScreen } from "@/components/SkeletonLoaders";

{isLoading ? <GovtQuestionsLoadingScreen /> : <Questions />}
```

### Other Loaders

```typescript
<CardGridLoadingScreen columns={3} count={6} />
<ListLoadingScreen count={8} type="avatar" />
<SyllabusLoadingScreen />
```

---

## Common Patterns

### Pattern 1: Query Loading State (React Query)

```typescript
import { useQuery } from "@tanstack/react-query";
import { QuizLoadingScreen } from "@/components/SkeletonLoaders";

export function ChapterTest() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chapter-test", chapterId],
    queryFn: () => fetch(`/api/test/${chapterId}/questions`).then(r => r.json())
  });

  if (isLoading) return <QuizLoadingScreen />;
  if (error) return <div>Error loading test</div>;

  return <div>{/* Render quiz */}</div>;
}
```

### Pattern 2: useState Loading State

```typescript
import { useState, useEffect } from "react";
import { LeaderboardLoadingScreen } from "@/components/SkeletonLoaders";

export function Leaderboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then(data => {
      setData(data);
      setIsLoading(false);
    });
  }, []);

  return isLoading ? <LeaderboardLoadingScreen /> : <div>{/* Content */}</div>;
}
```

### Pattern 3: Partial Loading (Keep Current Data)

```typescript
import { MockTestLoadingScreen } from "@/components/SkeletonLoaders";

export function MockTest() {
  const [questions, setQuestions] = useState([]);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);

  const loadNextQuestion = async () => {
    setIsLoadingNextQuestion(true);
    const next = await fetch(`/api/test/next-question`).then(r => r.json());
    setQuestions([...questions, next]);
    setIsLoadingNextQuestion(false);
  };

  return (
    <div>
      {questions.map(q => <Question key={q.id} question={q} />)}
      {isLoadingNextQuestion && <SkeletonQuestion />}
      <button onClick={loadNextQuestion}>Load Next</button>
    </div>
  );
}
```

---

## 7 Priority Pages to Update

### 1. ChapterTest.tsx
**Current:** Blank loading state  
**Fix:** Show QuizLoadingScreen while fetching questions

```typescript
const { data: questions, isLoading } = useQuery({...});
return isLoading ? <QuizLoadingScreen /> : <div>{questions.map(...)}</div>;
```

### 2. Leaderboard.tsx
**Current:** Silent loading (confusing transitions)  
**Fix:** Show LeaderboardLoadingScreen during fetch

```typescript
const { data, isLoading } = useQuery({...});
return isLoading ? <LeaderboardLoadingScreen /> : <div>{/* content */}</div>;
```

### 3. DailyQuiz.tsx
**Current:** Spinner + text (jarring)  
**Fix:** Use QuizLoadingScreen for consistency

```typescript
return isLoading ? <QuizLoadingScreen questionNumber={1} totalQuestions={10} /> : <Quiz />;
```

### 4. Dashboard.tsx
**Current:** No feedback (confusing)  
**Fix:** Show DashboardLoadingScreen

```typescript
return isLoading ? <DashboardLoadingScreen /> : <Dashboard />;
```

### 5. MockTestPage.tsx
**Current:** Mode defined but not shown  
**Fix:** Show MockTestLoadingScreen

```typescript
return isLoading ? <MockTestLoadingScreen questionCount={60} /> : <MockTest />;
```

### 6. GovtPractice.tsx
**Current:** State exists, no UI  
**Fix:** Show GovtQuestionsLoadingScreen on button click

```typescript
return isGeneratingQuestions ? <GovtQuestionsLoadingScreen /> : <Questions />;
```

### 7. QuestionHub.tsx
**Current:** No loading feedback  
**Fix:** Show appropriate skeleton while loading PDFs

```typescript
return isLoading ? <CardGridLoadingScreen /> : <Questions />;
```

---

## Implementation Steps

### Step 1: Identify Loading States
In each component, find where data is fetched:
```typescript
const [isLoading, setIsLoading] = useState(false);
const { isLoading: queryLoading } = useQuery(...);
```

### Step 2: Import Skeleton Loader
```typescript
import { QuizLoadingScreen } from "@/components/SkeletonLoaders";
```

### Step 3: Conditionally Render
```typescript
return isLoading ? <QuizLoadingScreen /> : <YourComponent />;
```

### Step 4: (Optional) Add Progressive Loading
Show skeleton for data increments:
```typescript
{isLoadingQuestions && <SkeletonQuestion />}
{isLoadingLeaderboard && <SkeletonLeaderboardRow />}
```

---

## Skeleton Component API

### Skeleton
```typescript
<Skeleton className="h-4 w-full rounded" />
```
Properties: standard `div` HTML attributes

### SkeletonText
```typescript
<SkeletonText lines={3} className="mb-4" />
```
Props:
- `lines?: number` — Number of lines (default: 3)
- `className?: string` — Additional classes

### SkeletonCard
```typescript
<SkeletonCard className="mb-4" />
```
Props:
- `className?: string` — Additional classes

### SkeletonQuestion
```typescript
<SkeletonQuestion className="mb-6" />
```
Props:
- `className?: string` — Additional classes

### SkeletonAvatar
```typescript
<SkeletonAvatar className="mb-2" />
```
Props:
- `className?: string` — Additional classes

### SkeletonLeaderboardRow
```typescript
<SkeletonLeaderboardRow />
```
Props:
- `className?: string` — Additional classes

### SkeletonGroup
```typescript
<SkeletonGroup count={10} type="question" className="space-y-4" />
```
Props:
- `count?: number` — Number of items (default: 3)
- `type?: "card" | "question" | "avatar" | "leaderboard"` — Skeleton type
- `className?: string` — Additional classes

---

## Performance Tips

1. **Keep skeleton duration short** (max 3-5 seconds)
   - If loading takes >5s, show progress indicator or timeout message

2. **Match skeleton to actual content**
   - Width/height should match the final component

3. **Use real data dimensions**
   ```typescript
   // Instead of fixed width, use container width
   <div className="w-full"><Skeleton className="w-full h-20" /></div>
   ```

4. **Combine skeletons for complex layouts**
   ```typescript
   <SkeletonText lines={1} />
   <SkeletonGroup count={3} type="card" />
   <SkeletonCard />
   ```

---

## Styling

All skeletons use:
- Base: `animate-pulse rounded-md bg-muted`
- Container: Space with consistent gaps (usually `space-y-2` or `space-y-4`)

### Customize Colors

Edit animation in global.css if needed:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## Testing

When testing loading states:

```typescript
// Mock loading state in Storybook
export const QuizLoading = () => <QuizLoadingScreen />;

// E2E: Wait for skeleton to disappear
cy.contains("Loading").should("not.exist");
cy.get("[data-testid=quiz-content]").should("be.visible");
```

---

## Next Steps

- [ ] Update ChapterTest.tsx with QuizLoadingScreen
- [ ] Update Leaderboard.tsx with LeaderboardLoadingScreen
- [ ] Update Dashboard.tsx with DashboardLoadingScreen
- [ ] Update MockTestPage.tsx with MockTestLoadingScreen
- [ ] Update DailyQuiz.tsx with QuizLoadingScreen
- [ ] Update GovtPractice.tsx with GovtQuestionsLoadingScreen
- [ ] Update remaining 23 data-fetching pages
