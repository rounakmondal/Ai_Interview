import { Link } from "react-router-dom";
import {
  Calculator,
  Calendar,
  IndianRupee,
  GraduationCap,
  Keyboard,
  ArrowRight,
} from "lucide-react";

const ALL_TOOLS = [
  { title: "CGPA Calculator", href: "/cgpa-calculator", icon: Calculator, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Age Calculator", href: "/age-calculator", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Salary Calculator", href: "/salary-calculator", icon: IndianRupee, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Eligibility Checker", href: "/eligibility-checker", icon: GraduationCap, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Typing Speed Test", href: "/typing-test", icon: Keyboard, color: "text-violet-500", bg: "bg-violet-500/10" },
];

export default function RelatedToolsBanner({ currentPath }: { currentPath: string }) {
  const others = ALL_TOOLS.filter(t => t.href !== currentPath);

  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">🔧 More Free Tools</h3>
        <Link to="/tools" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {others.map(tool => (
          <Link
            key={tool.href}
            to={tool.href}
            className="flex items-center gap-2.5 p-3 rounded-xl border bg-white dark:bg-card hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-8 h-8 rounded-lg ${tool.bg} flex items-center justify-center shrink-0`}>
              <tool.icon className={`w-4 h-4 ${tool.color}`} />
            </div>
            <span className="text-xs font-medium group-hover:text-primary transition-colors leading-tight">
              {tool.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
