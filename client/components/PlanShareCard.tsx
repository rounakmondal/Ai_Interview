// ─────────────────────────────────────────────────────────────────────────────
// Plan Share Card — generates a shareable image card using html2canvas
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Loader2 } from "lucide-react";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType } from "@shared/study-types";

interface PlanShareCardProps {
  examId: StudyExamType;
  daysRemaining: number;
  streak: number;
  percentage: number;
  examPassed?: boolean;
}

const MOTIVATIONAL_TEXTS = [
  "একটু একটু করে এগিয়ে যাও — সাফল্য আসবেই! 💪",
  "ধৈর্য ধরো, তোমার পরিশ্রম বৃথা যাবে না।",
  "প্রতিদিনের অভ্যাস তোমাকে লক্ষ্যে পৌঁছে দেবে।",
  "তুমি পারবে — বিশ্বাস রাখো নিজের উপর! 🌟",
  "আজকের পড়া কালকের সাফল্যের ভিত্তি।",
];

export default function PlanShareCard({
  examId,
  daysRemaining,
  streak,
  percentage,
  examPassed,
}: PlanShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [motivationalIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_TEXTS.length));

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        useCORS: true,
      });
      return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    } catch (err) {
      console.error("html2canvas error:", err);
      return null;
    }
  }, []);

  const handleShare = async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

      const file = new File([blob], "amar-plan.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "আমার পরিকল্পনা — MedhaHub",
          text: `আমি ${STUDY_EXAM_LABELS[examId]} পরীক্ষার জন্য প্রস্তুতি নিচ্ছি! ${percentage}% সম্পূর্ণ 🔥`,
          files: [file],
        });
      } else {
        // Fallback: download
        downloadBlob(blob);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (blob) downloadBlob(blob);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* The visual card (rendered to canvas) */}
      <div
        ref={cardRef}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)",
          padding: "24px",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          maxWidth: "400px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            📚
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>আমার পরিকল্পনা</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>MedhaHub — Amar Plan</div>
          </div>
        </div>

        {/* Exam name */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "16px",
            background: "linear-gradient(90deg, #818cf8, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {STUDY_EXAM_LABELS[examId]} পরীক্ষা
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#60a5fa" }}>
              {examPassed ? "—" : daysRemaining}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6 }}>দিন বাকি</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>
              {streak}🔥
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6 }}>দিনের ধারা</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#34d399" }}>
              {percentage}%
            </div>
            <div style={{ fontSize: "11px", opacity: 0.6 }}>সম্পূর্ণ</div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
            height: "8px",
            marginBottom: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
              height: "100%",
              width: `${percentage}%`,
              borderRadius: "8px",
              transition: "width 0.5s",
            }}
          />
        </div>

        {/* Motivational text */}
        <div
          style={{
            fontSize: "13px",
            textAlign: "center",
            opacity: 0.8,
            fontStyle: "italic",
            padding: "8px 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {MOTIVATIONAL_TEXTS[motivationalIdx]}
        </div>
      </div>

      {/* Share / Download buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleShare}
          disabled={generating}
          className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          আমার পরিকল্পনা শেয়ার করো
        </Button>
        <Button
          onClick={handleDownload}
          disabled={generating}
          variant="outline"
          size="icon"
          title="Download Image"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "amar-plan.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
