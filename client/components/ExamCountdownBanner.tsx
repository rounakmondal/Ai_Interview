// ─────────────────────────────────────────────────────────────────────────────
// Exam Countdown Banner — sticky banner with color-coded urgency
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Calendar, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType } from "@shared/study-types";

interface ExamCountdownBannerProps {
  examId: StudyExamType;
  examDate: string;
  onUpdateDate?: () => void;
}

export default function ExamCountdownBanner({ examId, examDate, onUpdateDate }: ExamCountdownBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  const daysRemaining = Math.ceil((exam.getTime() - today.getTime()) / 86400000);
  const examPassed = daysRemaining < 0;

  // Color scheme based on urgency
  let colorClasses: string;
  let textColor: string;
  if (examPassed) {
    colorClasses = "bg-gray-600/90";
    textColor = "text-white";
  } else if (daysRemaining < 30) {
    colorClasses = "bg-red-600/90";
    textColor = "text-white";
  } else if (daysRemaining < 60) {
    colorClasses = "bg-amber-500/90";
    textColor = "text-white";
  } else {
    colorClasses = "bg-green-600/90";
    textColor = "text-white";
  }

  return (
    <div className={`sticky top-14 z-40 ${colorClasses} backdrop-blur-sm shadow-sm`}>
      <div className="container px-4 py-2 flex items-center justify-center gap-3 flex-wrap">
        <Calendar className={`w-4 h-4 ${textColor} flex-shrink-0`} />
        {examPassed ? (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className={`text-sm font-medium ${textColor}`}>
              নতুন পরীক্ষার তারিখ আপডেট করো
            </span>
            {onUpdateDate && (
              <Button
                size="sm"
                variant="secondary"
                onClick={onUpdateDate}
                className="text-xs h-7 px-3"
              >
                আপডেট করো
              </Button>
            )}
          </div>
        ) : (
          <span className={`text-sm font-medium ${textColor}`}>
            {STUDY_EXAM_LABELS[examId]} — আর মাত্র{" "}
            <span className="font-bold">{daysRemaining}</span> দিন বাকি
          </span>
        )}
        {!examPassed && daysRemaining < 30 && (
          <AlertTriangle className={`w-3.5 h-3.5 ${textColor} animate-pulse`} />
        )}
        <button
          onClick={() => setDismissed(true)}
          className={`ml-2 ${textColor} opacity-60 hover:opacity-100 transition-opacity`}
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
