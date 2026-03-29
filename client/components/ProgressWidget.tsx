import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

const PROGRESS_KEY = "user_progress";

interface ProgressData {
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  lastActive: string;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function loadProgress(): ProgressData {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (raw) return JSON.parse(raw);
  return { streak: 0, totalQuestions: 0, correctAnswers: 0, lastActive: "" };
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export function updateProgress({ correct }: { correct: boolean }) {
  const data = loadProgress();
  const today = getToday();
  if (data.lastActive !== today) {
    // Calculate yesterday's date string
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    data.streak = data.lastActive === yesterday ? data.streak + 1 : 1;
    data.lastActive = today;
  }
  data.totalQuestions++;
  if (correct) data.correctAnswers++;
  saveProgress(data);
}

export const ProgressWidget: React.FC = () => {
  const [progress, setProgress] = useState<ProgressData>(loadProgress());

  useEffect(() => {
    const handler = () => setProgress(loadProgress());
    window.addEventListener("progressUpdate", handler);
    return () => window.removeEventListener("progressUpdate", handler);
  }, []);

  const accuracy = progress.totalQuestions
    ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
    : 0;

  return (
    <Card className="mb-6 p-4 w-full max-w-xs mx-auto bg-white/90 shadow">
      <div className="font-semibold text-lg mb-2">Your Progress</div>
      <div className="flex justify-between text-sm mb-1">
        <span>Streak</span>
        <span>{progress.streak} days</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Questions</span>
        <span>{progress.totalQuestions}</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>Accuracy</span>
        <span>{accuracy}%</span>
      </div>
      <Progress value={accuracy} className="mt-2" />
    </Card>
  );
};
