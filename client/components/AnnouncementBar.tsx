import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, ArrowRight } from "lucide-react";

const DISMISSED_KEY = "announcement_bar_dismissed";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = sessionStorage.getItem(DISMISSED_KEY);
      return stored === "1";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch {}
  };

  return (
    <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-center">
        <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-200" />
        <p className="text-xs sm:text-sm font-semibold">
          AI generates a fresh mock test every day for your exact exam — costs less than chai ☕
        </p>
        <Link
          to="/mock-test"
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors whitespace-nowrap"
        >
          Try Now <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
