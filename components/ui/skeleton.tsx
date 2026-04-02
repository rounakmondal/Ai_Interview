import { cn } from "@/lib/utils";

/**
 * Base Skeleton component with pulse animation
 */
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

/**
 * SkeletonText — Multi-line text placeholder (titles, descriptions)
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded",
            i === lines - 1 ? "w-3/4" : "w-full" // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard — Card placeholder with title, image, and description
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-4", className)}>
      <Skeleton className="h-48 w-full rounded-md" /> {/* Image */}
      <Skeleton className="h-5 w-3/4 rounded" /> {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}

/**
 * SkeletonQuestion — Quiz question placeholder with 4 options
 */
export function SkeletonQuestion({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 rounded-lg border bg-card p-6", className)}>
      {/* Question text */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
      </div>
      
      {/* Option divider */}
      <div className="my-2 border-t" />

      {/* Answer options (4 options) */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" /> {/* Radio button */}
            <Skeleton className="h-4 flex-1 rounded" /> {/* Option text */}
          </div>
        ))}
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 w-24 rounded" />
    </div>
  );
}

/**
 * SkeletonAvatar — User avatar + name placeholder
 */
export function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg bg-card p-3", className)}>
      <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24 rounded" /> {/* Name */}
        <Skeleton className="h-3 w-16 rounded" /> {/* Subtitle */}
      </div>
    </div>
  );
}

/**
 * SkeletonLeaderboardRow — Leaderboard entry placeholder
 */
export function SkeletonLeaderboardRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-between rounded-lg bg-card p-4", className)}>
      {/* Rank + Avatar + Name */}
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="h-6 w-6 rounded" /> {/* Rank */}
        <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
        <Skeleton className="h-4 w-32 rounded" /> {/* Name */}
      </div>

      {/* Score + Accuracy */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-16 rounded" /> {/* Score */}
        <Skeleton className="h-4 w-16 rounded" /> {/* Accuracy */}
      </div>
    </div>
  );
}

/**
 * SkeletonGroup — Multiple skeleton placeholders in a grid/list
 */
export function SkeletonGroup({
  count = 3,
  type = "card", // 'card' | 'question' | 'avatar' | 'leaderboard'
  className
}: {
  count?: number;
  type?: "card" | "question" | "avatar" | "leaderboard";
  className?: string;
}) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return <SkeletonCard />;
      case "question":
        return <SkeletonQuestion />;
      case "avatar":
        return <SkeletonAvatar />;
      case "leaderboard":
        return <SkeletonLeaderboardRow />;
      default:
        return <Skeleton className="h-20 w-full rounded" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

export { Skeleton };
