# Skeleton Loaders — Quick Reference

## 🚀 Quick Start

### For a Quiz Page
```typescript
import { QuizLoadingScreen } from "@/components/SkeletonLoaders";
import { useQuery } from "@tanstack/react-query";

export function ChapterTest() {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: () => fetch("/api/test/ch_1/questions").then(r => r.json())
  });

  return isLoading ? <QuizLoadingScreen /> : <Quiz questions={questions} />;
}
```

### For a Dashboard
```typescript
import { DashboardLoadingScreen } from "@/components/SkeletonLoaders";

export function Dashboard() {
  const { data, isLoading } = useQuery({...});
  return isLoading ? <DashboardLoadingScreen /> : <Dashboard data={data} />;
}
```

### For a Leaderboard
```typescript
import { LeaderboardLoadingScreen } from "@/components/SkeletonLoaders";

export function Leaderboard() {
  const { data, isLoading } = useQuery({...});
  return isLoading ? <LeaderboardLoadingScreen /> : <LeaderboardContent data={data} />;
}
```

---

## 🎨 Skeleton Components

| Component | Use For | Example |
|-----------|---------|---------|
| `Skeleton` | Custom layouts | `<Skeleton className="h-20 w-full" />` |
| `SkeletonText` | Titles, descriptions | `<SkeletonText lines={3} />` |
| `SkeletonCard` | Individual cards | `<SkeletonCard />` |
| `SkeletonQuestion` | Quiz questions | `<SkeletonQuestion />` |
| `SkeletonAvatar` | User profiles | `<SkeletonAvatar />` |
| `SkeletonLeaderboardRow` | Leaderboard entries | `<SkeletonLeaderboardRow />` |
| `SkeletonGroup` | Multiple items | `<SkeletonGroup count={5} type="question" />` |

---

## 📄 Full-Page Loaders

| Loader | Use For |
|--------|---------|
| `QuizLoadingScreen` | Chapter tests, daily quiz, any quiz page |
| `MockTestLoadingScreen` | Mock exams with multiple questions |
| `LeaderboardLoadingScreen` | Leaderboard page |
| `DashboardLoadingScreen` | Dashboard with stats/charts |
| `TestResultsLoadingScreen` | Results page with answer review |
| `GovtQuestionsLoadingScreen` | Government practice questions |
| `CardGridLoadingScreen` | Gallery/grid layouts |
| `ListLoadingScreen` | Table-like layouts |
| `SyllabusLoadingScreen` | Chapter/syllabus pages |

---

## 🔧 Props Reference

### SkeletonGroup
```typescript
<SkeletonGroup 
  count={10}              // How many items to show
  type="question"         // 'card' | 'question' | 'avatar' | 'leaderboard'
  className="space-y-4"   // Optional CSS classes
/>
```

### QuizLoadingScreen
```typescript
<QuizLoadingScreen
  questionNumber={2}      // Current question number
  totalQuestions={10}     // Total questions
/>
```

### MockTestLoadingScreen
```typescript
<MockTestLoadingScreen questionCount={60} />  // For 60-question test
```

### CardGridLoadingScreen
```typescript
<CardGridLoadingScreen columns={3} count={6} />  // 3 columns, 6 cards
```

---

## 📝 Implementation Checklist

**Priority 1 (Highest Impact):**
- [ ] ChapterTest.tsx — QuizLoadingScreen
- [ ] Leaderboard.tsx — LeaderboardLoadingScreen  
- [ ] Dashboard.tsx — DashboardLoadingScreen
- [ ] MockTestPage.tsx — MockTestLoadingScreen

**Priority 2:**
- [ ] DailyQuiz.tsx — QuizLoadingScreen
- [ ] GovtPractice.tsx — GovtQuestionsLoadingScreen
- [ ] QuestionHub.tsx — CardGridLoadingScreen

**Priority 3 (Nice to have):**
- [ ] All other data-fetching pages (~20+ more)

---

## 💡 Pro Tips

1. **Always show skeleton while fetching**
   ```typescript
   {isLoading ? <Skeleton /> : <Content />}
   ```

2. **Match skeleton to final content**
   - Dimensions should be realistic
   - Layout should match

3. **Progressive loading**
   ```typescript
   {data.slice(0, 5).map(item => <Item key={item.id} {...item} />)}
   {isLoadingMore && <SkeletonGroup count={5} type="card" />}
   ```

4. **Combination approach**
   ```typescript
   return (
     <div>
       {data.map(item => <Card item={item} />)}
       {/* Show skeleton while loading more */}
       {isLoading && <SkeletonGroup count={3} type="card" />}
     </div>
   );
   ```

---

## 🎯 7 Priority Pages

1. **ChapterTest.tsx** — Blank loading
2. **Leaderboard.tsx** — Silent loading (confusing)
3. **DailyQuiz.tsx** — Spinner (jarring)
4. **Dashboard.tsx** — No feedback
5. **MockTestPage.tsx** — Mode defined, no visual
6. **GovtPractice.tsx** — State exists, no UI
7. **QuestionHub.tsx** — No loading state

---

## 📂 Files

- [client/components/ui/skeleton.tsx](../client/components/ui/skeleton.tsx) — Base components
- [client/components/SkeletonLoaders.tsx](../client/components/SkeletonLoaders.tsx) — Page-level loaders
- [SKELETON_LOADERS_GUIDE.md](./SKELETON_LOADERS_GUIDE.md) — Full documentation

---

## ❓ FAQ

**Q: Can I customize skeleton colors?**  
A: Yes, edit `bg-muted` class or modify animation in `global.css`

**Q: How long should skeleton show?**  
A: 300-500ms on 4G. If >3s, show progress indicator.

**Q: Should I show skeleton for every type of loading?**  
A: Yes! Even button clicks, filter changes, pagination.

**Q: Can I combine multiple skeleton types?**  
A: Absolutely!
```typescript
<>
  <SkeletonText lines={2} />
  <SkeletonGroup count={3} type="question" />
</>
```
