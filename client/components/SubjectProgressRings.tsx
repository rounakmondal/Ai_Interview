// ─────────────────────────────────────────────────────────────────────────────
// Subject Progress Ring — circular SVG progress ring per subject
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import type { SubjectProgress } from "@/lib/amar-plan";
import type { AmarPlanTask } from "@/lib/amar-plan";

const RING_COLORS = [
  { stroke: "#3b82f6", bg: "bg-blue-500/10" },
  { stroke: "#ef4444", bg: "bg-orange-500/10" },
  { stroke: "#10b981", bg: "bg-green-500/10" },
  { stroke: "#f59e0b", bg: "bg-amber-500/10" },
  { stroke: "#ef4444", bg: "bg-red-500/10" },
  { stroke: "#06b6d4", bg: "bg-cyan-500/10" },
  { stroke: "#ec4899", bg: "bg-pink-500/10" },
  { stroke: "#f97316", bg: "bg-orange-500/10" },
];

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  isWeak?: boolean;
}

function ProgressRing({ percentage, size = 72, strokeWidth = 5, color, isWeak }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted/20"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isWeak && percentage < 70 ? "#ef4444" : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">{percentage}%</span>
      </div>
      {isWeak && percentage < 70 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

interface SubjectProgressRingsProps {
  subjects: SubjectProgress[];
  tasks: AmarPlanTask[];
}

export default function SubjectProgressRings({ subjects, tasks }: SubjectProgressRingsProps) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  if (subjects.length === 0) return null;

  return (
    <Card className="p-5 border-border/40">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
        📊 বিষয় অনুযায়ী Progress
      </h3>

      {/* Rings grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        {subjects.map((subj, i) => {
          const c = RING_COLORS[i % RING_COLORS.length];
          const isExpanded = expandedSubject === subj.subject;
          return (
            <button
              key={subj.subject}
              onClick={() => setExpandedSubject(isExpanded ? null : subj.subject)}
              className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <ProgressRing
                percentage={subj.percentage}
                color={c.stroke}
                isWeak={subj.isWeak}
              />
              <span className="text-xs font-medium text-center leading-tight">
                {subj.subjectBn || subj.subject}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {subj.completed}/{subj.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded subject — pending topics */}
      {expandedSubject && (
        <div className="mt-3 p-4 rounded-xl bg-muted/20 border border-border/30 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              {subjects.find((s) => s.subject === expandedSubject)?.subjectBn || expandedSubject}
              <span className="text-muted-foreground font-normal">— বাকি topics</span>
            </h4>
            <button
              onClick={() => setExpandedSubject(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              বন্ধ করো
            </button>
          </div>
          <div className="space-y-1.5">
            {tasks
              .filter((t) => t.subject === expandedSubject && !t.completed && t.type !== "mock_test")
              .slice(0, 20)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 text-xs p-2 rounded-lg bg-background/60 border border-border/20"
                >
                  <div className={`w-2 h-2 rounded-full ${task.isWeak ? "bg-red-400" : "bg-muted-foreground/40"}`} />
                  <span>{task.topicBn || task.topic}</span>
                  {task.type === "revision" && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-auto">
                      পুনরায়
                    </Badge>
                  )}
                </div>
              ))}
            {tasks.filter((t) => t.subject === expandedSubject && !t.completed && t.type !== "mock_test").length === 0 && (
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                ✅ সব শেষ! এই বিষয়ে তোমার কাজ সম্পূর্ণ।
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
