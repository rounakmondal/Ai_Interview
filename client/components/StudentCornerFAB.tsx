/**
 * Floating "Student Corner" button — only visible to logged-in users.
 * Opens a full-screen sheet with the StudentHome dashboard.
 */

import { lazy, Suspense, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isLoggedIn } from "@/lib/auth-api";
import { GraduationCap } from "lucide-react";
import { RouteLoader } from "@/components/RouteLoader";

const StudentHome = lazy(() => import("@/pages/StudentHome"));

export default function StudentCornerFAB() {
  const [open, setOpen] = useState(false);

  if (!isLoggedIn()) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Student Corner"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full
                     bg-gradient-to-r from-violet-600 to-indigo-600 text-white
                     shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
                     hover:scale-105 active:scale-95 transition-all
                     ring-2 ring-white/20 backdrop-blur-sm"
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-sm font-bold hidden sm:inline">Student Corner</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-full p-0 border-0 overflow-y-auto [&>button]:hidden"
      >
        <Suspense fallback={<RouteLoader />}>
          <StudentHome onClose={() => setOpen(false)} />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}
