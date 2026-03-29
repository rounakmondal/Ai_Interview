import React from "react";
import { SkeletonGroup, SkeletonQuestion, SkeletonLeaderboardRow, SkeletonCard } from "./ui/skeleton";

/**
 * Pre-built skeleton loader combinations for common page patterns
 * Use these in loading states to show placeholder content while fetching
 */

/**
 * QuizLoadingScreen — Full-page quiz placeholder
 * Shows question + options + submit button
 */
export const QuizLoadingScreen: React.FC<{ questionNumber?: number; totalQuestions?: number }> = ({
  questionNumber = 1,
  totalQuestions = 10
}) => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </div>
      </div>

      {/* Timer skeleton */}
      <div className="flex justify-center">
        <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
      </div>

      {/* Question skeleton */}
      <SkeletonQuestion className="mt-8" />

      {/* Progress bar skeleton */}
      <div className="h-2 w-full rounded-full bg-muted animate-pulse mt-8" />
    </div>
  );
};

/**
 * LeaderboardLoadingScreen — Full-page leaderboard placeholder
 * Shows podium + leaderboard rows
 */
export const LeaderboardLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-60 rounded bg-muted animate-pulse" />
      </div>

      {/* Filter buttons skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 w-24 rounded-md bg-muted animate-pulse" />
        ))}
      </div>

      {/* Leaderboard rows */}
      <SkeletonGroup count={8} type="leaderboard" />
    </div>
  );
};

/**
 * DashboardLoadingScreen — Full-page dashboard placeholder
 * Shows stats cards + charts + mini leaderboard
 */
export const DashboardLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-8 w-16 rounded bg-muted animate-pulse" />
            <div className="h-3 w-32 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        <div className="h-48 w-full rounded bg-muted animate-pulse" />
      </div>

      {/* Mini leaderboard */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        <SkeletonGroup count={5} type="leaderboard" />
      </div>
    </div>
  );
};

/**
 * MockTestLoadingScreen — Full mock test placeholder
 * Shows multiple questions
 */
export const MockTestLoadingScreen: React.FC<{ questionCount?: number }> = ({ questionCount = 5 }) => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header with timer */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-12 rounded bg-muted animate-pulse" />
          <div className="h-8 w-12 rounded bg-muted animate-pulse" />
          <div className="h-8 w-12 rounded bg-muted animate-pulse" />
        </div>
      </div>

      {/* Questions */}
      <SkeletonGroup count={questionCount} type="question" />

      {/* Submit button */}
      <div className="h-10 w-32 rounded bg-muted animate-pulse" />
    </div>
  );
};

/**
 * TestResultsLoadingScreen — Test results page placeholder
 */
export const TestResultsLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Score card */}
      <div className="rounded-lg border bg-card p-8 space-y-4 text-center">
        <div className="h-8 w-40 rounded mx-auto bg-muted animate-pulse" />
        <div className="h-16 w-24 rounded mx-auto bg-muted animate-pulse" />
        <div className="h-4 w-32 rounded mx-auto bg-muted animate-pulse" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3 text-center">
            <div className="h-4 w-20 rounded mx-auto bg-muted animate-pulse" />
            <div className="h-8 w-16 rounded mx-auto bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Answer review section */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        <SkeletonGroup count={5} type="question" />
      </div>
    </div>
  );
};

/**
 * GovtQuestionsLoadingScreen — Government practice questions placeholder
 */
export const GovtQuestionsLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Filter controls */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-md bg-muted animate-pulse" />
        ))}
      </div>

      {/* Questions list */}
      <SkeletonGroup count={6} type="question" />
    </div>
  );
};

/**
 * CardGridLoadingScreen — Grid of cards placeholder
 * For gallery-like layouts
 */
export const CardGridLoadingScreen: React.FC<{ columns?: number; count?: number }> = ({
  columns = 3,
  count = 6
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

/**
 * ListLoadingScreen — List of items placeholder
 * For table-like layouts
 */
export const ListLoadingScreen: React.FC<{ count?: number; type?: "avatar" | "card" }> = ({
  count = 8,
  type = "avatar"
}) => {
  return (
    <div className="space-y-2">
      <SkeletonGroup count={count} type={type} />
    </div>
  );
};

/**
 * SyllabusLoading — Chapter/syllabus placeholder
 */
export const SyllabusLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Subject cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="h-6 w-32 rounded bg-muted animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-4 w-full rounded bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
