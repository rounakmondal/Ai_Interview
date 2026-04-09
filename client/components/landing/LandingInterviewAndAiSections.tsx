import { useRef, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  Users,
  TrendingUp,
  Play,
  Sparkles,
  Briefcase,
  Brain,
} from "lucide-react";

const FEATURED_COMPANIES = [
  { slug: "tcs", short: "TCS", logo: "🔵", questions: 120, pkg: "₹3.5–7 LPA", tag: "India's #1 IT", rounds: ["Aptitude", "Technical", "HR"], gradient: "from-blue-500 to-blue-700", border: "border-blue-200 dark:border-blue-800" },
  { slug: "infosys", short: "Infosys", logo: "🔷", questions: 110, pkg: "₹3.6–9 LPA", tag: "Global Leader", rounds: ["InfyTQ", "Technical", "HR"], gradient: "from-indigo-500 to-indigo-700", border: "border-indigo-200 dark:border-indigo-800" },
  { slug: "wipro", short: "Wipro", logo: "🌻", questions: 100, pkg: "₹3.5–6.5 LPA", tag: "Fortune 500", rounds: ["Online Test", "Technical", "HR"], gradient: "from-purple-500 to-purple-700", border: "border-purple-200 dark:border-purple-800" },
  { slug: "accenture", short: "Accenture", logo: "▶️", questions: 115, pkg: "₹4.5–8 LPA", tag: "7,40,000+ Employees", rounds: ["Cognitive", "Coding", "HR"], gradient: "from-violet-500 to-violet-700", border: "border-violet-200 dark:border-violet-800" },
  { slug: "capgemini", short: "Capgemini", logo: "🔺", questions: 95, pkg: "₹3.8–7.5 LPA", tag: "Game-based Test", rounds: ["Game Test", "Technical", "HR"], gradient: "from-teal-500 to-teal-700", border: "border-teal-200 dark:border-teal-800" },
  { slug: "hcl", short: "HCL", logo: "🟦", questions: 90, pkg: "₹3.5–7 LPA", tag: "Engineering Giant", rounds: ["Online Test", "Tech Round 1", "HR"], gradient: "from-sky-500 to-sky-700", border: "border-sky-200 dark:border-sky-800" },
  { slug: "cognizant", short: "Cognizant", logo: "🔶", questions: 105, pkg: "₹4–7 LPA", tag: "GenC Program", rounds: ["GenC Test", "Technical", "HR"], gradient: "from-amber-500 to-amber-700", border: "border-amber-200 dark:border-amber-800" },
  { slug: "tech-mahindra", short: "Tech M", logo: "🔴", questions: 85, pkg: "₹3.5–6.5 LPA", tag: "Telecom & IT", rounds: ["Aptitude", "Technical", "HR"], gradient: "from-red-500 to-red-700", border: "border-red-200 dark:border-red-800" },
  { slug: "amazon", short: "Amazon", logo: "📦", questions: 130, pkg: "₹12–45 LPA", tag: "Top Product Co.", rounds: ["OA", "System Design", "Bar Raiser"], gradient: "from-orange-500 to-orange-700", border: "border-orange-200 dark:border-orange-800" },
  { slug: "microsoft", short: "Microsoft", logo: "🪟", questions: 125, pkg: "₹20–60 LPA", tag: "MAANG", rounds: ["OA", "Coding", "Behavioral"], gradient: "from-blue-600 to-cyan-600", border: "border-cyan-200 dark:border-cyan-800" },
  { slug: "deloitte", short: "Deloitte", logo: "⬛", questions: 88, pkg: "₹6–14 LPA", tag: "Big Four", rounds: ["Aptitude", "Case Study", "HR"], gradient: "from-slate-600 to-slate-800", border: "border-slate-200 dark:border-slate-700" },
  { slug: "persistent", short: "Persistent", logo: "🟢", questions: 80, pkg: "₹4.5–9 LPA", tag: "Digital Eng.", rounds: ["Coding Test", "Technical", "HR"], gradient: "from-green-500 to-green-700", border: "border-green-200 dark:border-green-800" },
];

const CompanyCarousel = memo(function CompanyCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-3 w-10 h-10 rounded-full bg-background border border-border/60 shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Scroll left">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 hide-scrollbar px-1">
        {FEATURED_COMPANIES.map((c) => (
          <Link key={c.slug} to={`/interview-questions/${c.slug}`} className="flex-shrink-0 w-72 snap-start group">
            <Card className={`h-full border ${c.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden`}>
              <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{c.logo}</div>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{c.short}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{c.tag}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-full">
                    <BookOpenCheck className="w-3 h-3" />
                    {c.questions}Q
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">Avg: {c.pkg}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.rounds.map((r) => (
                    <span key={r} className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{r}</span>
                  ))}
                </div>
                <div className="pt-1">
                  <div className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r ${c.gradient} text-white text-xs font-bold group-hover:opacity-90 transition-opacity`}>
                    View Questions <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-3 w-10 h-10 rounded-full bg-background border border-border/60 shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all" aria-label="Scroll right">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
});

export default function LandingInterviewAndAiSections() {
  return (
    <>
      <section className="py-16 sm:py-24 border-t border-border/40 bg-gradient-to-b from-blue-50/60 via-transparent to-transparent dark:from-blue-950/20">
        <div className="container space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Interview Mastery
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Practice Real Interview Questions from{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">200+ Top Companies</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get access to authentic interview questions asked by TCS, Infosys, Google, Amazon, and 200+ other companies.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Company-Specific Questions", text: "Real questions from technical, HR, and aptitude rounds.", icon: Briefcase, tint: "blue" },
              { title: "Expert Answers & Tips", text: "Detailed solutions with best practices for smarter prep.", icon: CheckCircle2, tint: "emerald" },
              { title: "Track Your Progress", text: "Identify weak areas and improve your interview success rate.", icon: TrendingUp, tint: "orange" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-6 rounded-xl border border-border/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center pt-4">
            <Link to="/interview-questions">
              <Button size="lg" className="gradient-primary font-bold text-base px-8 gap-2 h-12">
                Start Practicing Interview Questions
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 border-t border-border/40 bg-gradient-to-b from-slate-50/80 via-transparent to-transparent dark:from-slate-900/40">
        <div className="container space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                200+ Companies
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Crack interviews at{" "}
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">top companies</span>
              </h2>
            </div>
            <Link to="/interview-questions" className="flex-shrink-0">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white gap-2 font-semibold">
                View all 200+ companies
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <CompanyCarousel />
        </div>
      </section>

      <section className="py-20 sm:py-32 border-t border-border/40 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5">
        <div className="container space-y-12 sm:space-y-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              AI-Powered Exam Preparation for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Police, WBCS, SSC & More</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-4">
              {[
                "Personalized Study Plans",
                "AI-Recommended Question Papers",
                "Real-time Performance Analytics",
                "Adaptive Learning Technology",
              ].map((title) => (
                <div key={title} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <h4 className="font-semibold text-foreground">{title}</h4>
                </div>
              ))}
            </div>
            <div className="relative h-80 sm:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-card rounded-2xl border border-border/40 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Brain className="w-16 h-16 text-primary mx-auto" />
                  <h4 className="text-xl font-bold">AI-Driven Success</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-6 pt-8">
            <Link to="/govt-practice">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white gap-2">
                Start Your First Virtual Exam
                <Play className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
