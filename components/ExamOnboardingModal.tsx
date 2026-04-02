import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { ExamType, EXAM_LABELS } from "@/lib/govt-practice-data";

const EXAM_OPTIONS: ExamType[] = ["WBCS", "SSC", "Railway", "Banking", "Police"];

interface ExamOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExamOnboardingModal({ open, onOpenChange }: ExamOnboardingModalProps) {
  const [exam, setExam] = useState<ExamType | "">("");
  const [date, setDate] = useState("");

  const handleSave = () => {
    if (!exam || !date) return;
    localStorage.setItem("upcoming_exam", JSON.stringify({ exam, date }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Set Your Exam Target</DialogTitle>
              <DialogDescription>
                Tell us which exam you're preparing for — we'll personalize your daily tasks.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Exam Type</Label>
            <select
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={exam}
              onChange={(e) => setExam(e.target.value as ExamType)}
            >
              <option value="">Select your exam</option>
              {EXAM_OPTIONS.map((ex) => (
                <option key={ex} value={ex}>{EXAM_LABELS[ex]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Expected Exam Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Later
          </Button>
          <Button onClick={handleSave} disabled={!exam || !date} className="gap-1.5">
            <GraduationCap className="w-4 h-4" />
            Set Target & Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
