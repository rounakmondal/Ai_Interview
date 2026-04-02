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
import { GraduationCap, Bell, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { ExamType, EXAM_LABELS } from "@/lib/govt-practice-data";
import { sendPushNotification } from "@/lib/notification-service";

const EXAM_OPTIONS: ExamType[] = ["WBCS", "SSC", "Railway", "Banking", "Police"];

// Weak subject options per exam
const WEAK_SUBJECT_OPTIONS: Record<string, { id: string; label: string }[]> = {
  WBCS: [
    { id: "History", label: "ইতিহাস (History)" },
    { id: "Geography", label: "ভূগোল (Geography)" },
    { id: "Polity", label: "রাষ্ট্রবিজ্ঞান (Polity)" },
    { id: "Reasoning", label: "রিজনিং (Reasoning)" },
    { id: "Mathematics", label: "গণিত (Mathematics)" },
    { id: "English", label: "ইংরেজি (English)" },
  ],
  SSC: [
    { id: "Reasoning", label: "রিজনিং (Reasoning)" },
    { id: "Quantitative Aptitude", label: "গণিত (Quant)" },
    { id: "English", label: "ইংরেজি (English)" },
    { id: "General Awareness", label: "সাধারণ জ্ঞান (GK)" },
  ],
  Railway: [
    { id: "Reasoning", label: "রিজনিং (Reasoning)" },
    { id: "Mathematics", label: "গণিত (Math)" },
    { id: "General Awareness", label: "সাধারণ জ্ঞান (GK)" },
  ],
  Banking: [
    { id: "Reasoning", label: "রিজনিং (Reasoning)" },
    { id: "Quantitative Aptitude", label: "গণিত (Quant)" },
    { id: "English", label: "ইংরেজি (English)" },
    { id: "General Awareness", label: "সাধারণ জ্ঞান (GK)" },
  ],
  Police: [
    { id: "General Knowledge", label: "সাধারণ জ্ঞান (GK)" },
    { id: "Reasoning", label: "রিজনিং (Reasoning)" },
    { id: "Mathematics", label: "গণিত (Math)" },
    { id: "English", label: "ইংরেজি (English)" },
  ],
};

interface ExamOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExamOnboardingModal({ open, onOpenChange }: ExamOnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState<ExamType | "">("");
  const [date, setDate] = useState("");
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [notificationTime, setNotificationTime] = useState("08:00");
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const toggleWeak = (id: string) => {
    setWeakSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleRequestNotifications = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotificationEnabled(perm === "granted");
      if (perm === "granted") {
        await sendPushNotification("🔔 নোটিফিকেশন চালু হয়েছে!", {
          body: "প্রতিদিন তোমাকে পড়ার কথা মনে করিয়ে দেব।",
        });
      }
    }
  };

  const handleSave = () => {
    if (!exam || !date) return;
    localStorage.setItem(
      "upcoming_exam",
      JSON.stringify({ exam, date, weakSubjects, notificationTime, notificationEnabled })
    );
    onOpenChange(false);
  };

  const stepTitles = ["Exam Target", "Weak Subjects", "Notifications"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {step === 1 && "Set Your Exam Target"}
                {step === 2 && "দুর্বল বিষয় চিহ্নিত করো"}
                {step === 3 && "দৈনিক Reminder সেট করো"}
              </DialogTitle>
              <DialogDescription>
                {step === 1 && "Tell us which exam you're preparing for — we'll personalize your daily tasks."}
                {step === 2 && "কোন বিষয়গুলোতে তোমার দুর্বলতা আছে? আমরা সেগুলো বেশি চর্চা করাব।"}
                {step === 3 && "প্রতিদিন তোমাকে পড়ার কথা মনে করিয়ে দেব।"}
              </DialogDescription>
            </div>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? "w-8 bg-primary" : s < step ? "w-6 bg-primary/40" : "w-6 bg-muted"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              Step {step}/3
            </span>
          </div>
        </DialogHeader>

        {/* Step 1: Exam & Date */}
        {step === 1 && (
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
        )}

        {/* Step 2: Weak Subjects */}
        {step === 2 && exam && (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              একাধিক বিষয় নির্বাচন করতে পারো (optional)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(WEAK_SUBJECT_OPTIONS[exam] || []).map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => toggleWeak(subj.id)}
                  className={`p-3 rounded-xl text-left text-sm border transition-all ${
                    weakSubjects.includes(subj.id)
                      ? "border-red-400 bg-red-500/10 text-red-600 dark:text-red-400 font-medium"
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
                  {subj.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Notifications */}
        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Daily Study Reminder</span>
              </div>
              <p className="text-xs text-muted-foreground">
                প্রতিদিন নির্দিষ্ট সময়ে তোমাকে পড়ার কথা মনে করিয়ে দেব — Bengali-তে!
              </p>
              <div className="space-y-2">
                <Label className="text-xs">Reminder Time</Label>
                <Input
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="h-10 w-36"
                />
              </div>
              <Button
                size="sm"
                variant={notificationEnabled ? "outline" : "default"}
                onClick={handleRequestNotifications}
                className="gap-1.5 text-xs"
                disabled={notificationEnabled}
              >
                <Bell className="w-3.5 h-3.5" />
                {notificationEnabled ? "✅ নোটিফিকেশন চালু আছে" : "নোটিফিকেশন চালু করো"}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Button>
          )}
          {step === 1 && (
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Later
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!exam || !date)}
              className="gap-1.5"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!exam || !date} className="gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Set Target & Start
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
