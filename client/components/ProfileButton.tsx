import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { isLoggedIn, getSession } from "@/lib/auth-api";

/** Small profile / sign-in button for inner page headers */
export default function ProfileButton() {
  if (isLoggedIn()) {
    const name = getSession()?.user.name ?? "";
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <Link
        to="/profile"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-all"
      >
        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
          {initials || <User className="w-3 h-3" />}
        </div>
        <span className="hidden sm:inline">{name.split(" ")[0]}</span>
      </Link>
    );
  }

  return (
    <Link
      to="/auth"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:border-border text-xs font-medium transition-all"
    >
      <LogIn className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  );
}
