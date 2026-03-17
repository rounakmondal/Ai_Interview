import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight, Clock } from "lucide-react";
import { getDailyTasks, type DailyTasksState } from "@/lib/daily-tasks";

const DISMISS_KEY = "daily_task_reminder_dismissed";

/** Returns true if the reminder was already dismissed this session */
function wasDismissedToday(): boolean {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const { date } = JSON.parse(raw);
    return date === new Date().toISOString().split("T")[0];
  } catch {
    return false;
  }
}

function dismissForToday() {
  sessionStorage.setItem(
    DISMISS_KEY,
    JSON.stringify({ date: new Date().toISOString().split("T")[0] })
  );
}

export default function DailyTaskReminderModal() {
  const [open, setOpen] = useState(false);
  const [taskState, setTaskState] = useState<DailyTasksState | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Small delay so the page renders first
    const timer = setTimeout(() => {
      if (wasDismissedToday()) return;

      const state = getDailyTasks();
      if (!state) return;

      const allDone = state.tasks.every((t) => t.completed);
      if (allDone) return; // Nothing to remind

      setTaskState(state);
      setOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    dismissForToday();
    setOpen(false);
  };

  const handleGoToTasks = () => {
    dismissForToday();
    setOpen(false);
    navigate("/daily-tasks");
  };

  if (!taskState) return null;

  const completed = taskState.tasks.filter((t) => t.completed).length;
  const total = taskState.tasks.length;
  const pending = total - completed;
  const progressPct = Math.round((completed / total) * 100);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <DialogTitle className="text-lg">Complete Your Daily Tasks!</DialogTitle>
              <DialogDescription>
                You still have pending tasks — finishing them daily boosts your selection chances.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Progress overview */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Today's progress</span>
              <span className="font-semibold">
                {completed}/{total} tasks done
              </span>
            </div>
            <Progress value={progressPct} className="h-2.5" />
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {pending} task{pending !== 1 ? "s" : ""} remaining — earn up to{" "}
              <span className="font-semibold text-primary">
                {taskState.tasks
                  .filter((t) => !t.completed)
                  .reduce((s, t) => s + t.points, 0)}{" "}
                XP
              </span>
            </p>
          </div>

          {/* Pending tasks list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {taskState.tasks
              .filter((t) => !t.completed)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">
                      {task.type === "daily_mock_test" ? "📝" : "📚"}
                    </span>
                    <span className="text-sm font-medium truncate">{task.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-primary whitespace-nowrap ml-2">
                    +{task.points} XP
                  </span>
                </div>
              ))}
          </div>

          {/* Motivational note */}
          <p className="text-center text-sm text-muted-foreground italic">
            "Consistency is the key to cracking any competitive exam. Don't break your streak!"
          </p>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={handleDismiss}>
            Remind Me Later
          </Button>
          <Button onClick={handleGoToTasks} className="gap-1.5">
            Go to Daily Tasks
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
