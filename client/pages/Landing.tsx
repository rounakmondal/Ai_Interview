import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight, CheckCircle2, Mail, Phone, MapPin, ChevronLeft, ChevronRight, BookOpenCheck, Users, TrendingUp } from "lucide-react";
import HeroAvatar from "./components/HeroAvatar";
import Footer from "@/components/Footer";

const FEATURED_COMPANIES = [
  { slug: "tcs", name: "Tata Consultancy Services", short: "TCS", logo: "🔵", questions: 120, pkg: "₹3.5–7 LPA", tag: "India's #1 IT", rounds: ["Aptitude", "Technical", "HR"], gradient: "from-blue-500 to-blue-700", border: "border-blue-200 dark:border-blue-800" },
  { slug: "infosys", name: "Infosys Limited", short: "Infosys", logo: "🔷", questions: 110, pkg: "₹3.6–9 LPA", tag: "Global Leader", rounds: ["InfyTQ", "Technical", "HR"], gradient: "from-indigo-500 to-indigo-700", border: "border-indigo-200 dark:border-indigo-800" },
  { slug: "wipro", name: "Wipro Limited", short: "Wipro", logo: "🌻", questions: 100, pkg: "₹3.5–6.5 LPA", tag: "Fortune 500", rounds: ["Online Test", "Technical", "HR"], gradient: "from-purple-500 to-purple-700", border: "border-purple-200 dark:border-purple-800" },
  { slug: "accenture", name: "Accenture", short: "Accenture", logo: "▶️", questions: 115, pkg: "₹4.5–8 LPA", tag: "7,40,000+ Employees", rounds: ["Cognitive", "Coding", "HR"], gradient: "from-violet-500 to-violet-700", border: "border-violet-200 dark:border-violet-800" },
  { slug: "capgemini", name: "Capgemini", short: "Capgemini", logo: "🔺", questions: 95, pkg: "₹3.8–7.5 LPA", tag: "Game-based Test", rounds: ["Game Test", "Technical", "HR"], gradient: "from-teal-500 to-teal-700", border: "border-teal-200 dark:border-teal-800" },
  { slug: "hcl", name: "HCLTech", short: "HCL", logo: "🟦", questions: 90, pkg: "₹3.5–7 LPA", tag: "Engineering Giant", rounds: ["Online Test", "Tech Round 1", "HR"], gradient: "from-sky-500 to-sky-700", border: "border-sky-200 dark:border-sky-800" },
  { slug: "cognizant", name: "Cognizant", short: "Cognizant", logo: "🔶", questions: 105, pkg: "₹4–7 LPA", tag: "GenC Program", rounds: ["GenC Test", "Technical", "HR"], gradient: "from-amber-500 to-amber-700", border: "border-amber-200 dark:border-amber-800" },
  { slug: "tech-mahindra", name: "Tech Mahindra", short: "Tech M", logo: "🔴", questions: 85, pkg: "₹3.5–6.5 LPA", tag: "Telecom & IT", rounds: ["Aptitude", "Technical", "HR"], gradient: "from-red-500 to-red-700", border: "border-red-200 dark:border-red-800" },
  { slug: "amazon", name: "Amazon", short: "Amazon", logo: "📦", questions: 130, pkg: "₹12–45 LPA", tag: "Top Product Co.", rounds: ["OA", "System Design", "Bar Raiser"], gradient: "from-orange-500 to-orange-700", border: "border-orange-200 dark:border-orange-800" },
  { slug: "microsoft", name: "Microsoft", short: "Microsoft", logo: "🪟", questions: 125, pkg: "₹20–60 LPA", tag: "MAANG", rounds: ["OA", "Coding", "Behavioral"], gradient: "from-blue-600 to-cyan-600", border: "border-cyan-200 dark:border-cyan-800" },
  { slug: "deloitte", name: "Deloitte", short: "Deloitte", logo: "⬛", questions: 88, pkg: "₹6–14 LPA", tag: "Big Four", rounds: ["Aptitude", "Case Study", "HR"], gradient: "from-slate-600 to-slate-800", border: "border-slate-200 dark:border-slate-700" },
  { slug: "wipro", name: "Persistent Systems", short: "Persistent", logo: "🟢", questions: 80, pkg: "₹4.5–9 LPA", tag: "Digital Eng.", rounds: ["Coding Test", "Technical", "HR"], gradient: "from-green-500 to-green-700", border: "border-green-200 dark:border-green-800" },
];

function CompanyCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };
  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-3 w-10 h-10 rounded-full bg-background border border-border/60 shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 hide-scrollbar px-1"
      >
        {FEATURED_COMPANIES.map((c, i) => (
          <Link
            key={i}
            to={`/interview-questions/${c.slug}`}
            className="flex-shrink-0 w-72 snap-start group"
          >
            <Card className={`h-full border ${c.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden`}>
              {/* Gradient top bar */}
              <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />
              <div className="p-5 space-y-4">
                {/* Header row */}
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

                {/* Package */}
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">Avg: {c.pkg}</span>
                </div>

                {/* Rounds */}
                <div className="flex flex-wrap gap-1.5">
                  {c.rounds.map((r, ri) => (
                    <span key={ri} className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>

                {/* CTA */}
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

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-3 w-10 h-10 rounded-full bg-background border border-border/60 shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0" style={{ background: "linear-gradient(135deg, #1e1b4b, #3730a3)" }}>
              <svg viewBox="0 0 36 36" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 28 L4 8 L18 20 L32 8 L32 28 L28 28 L28 12 L18 22 L8 12 L8 28 Z" fill="white"/>
                <circle cx="18" cy="6" r="3.5" fill="#fb923c"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              MedhaHub
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <Link to="/setup">
             <Button variant="default" size="sm"> Get Started </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-14 sm:py-24 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-transparent to-red-50/60 pointer-events-none" />
        <div className="absolute top-20 -left-32 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-80 h-80 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-200 bg-orange-50/70">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />
                <span className="text-sm font-medium text-orange-700">
                  500+ students already practising
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.1] text-foreground">
                 Ace Your Next Interview —{" "}
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
                   Practice Until You Succeed
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Voice-based mock interviews with instant AI feedback. Practice for{" "}
                  <strong className="text-foreground">WBCS, SSC, Police, IT jobs</strong> — in
                  English or <strong className="text-primary">বাংলা</strong>. Upload your resume
                  and get personalised questions.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/setup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gradient-primary text-base font-semibold h-12 px-7 shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Start Free Mock Interview
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/setup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-slate-300 text-slate-600 hover:bg-slate-50 text-base h-12 px-6"
                  >
                    Try 1 Question — No Login
                  </Button>
                </Link>
              </div>

              {/* Job Categories Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {[
                  { label: "WBCS", key: "WBCS", icon: "🏛️", color: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-700 dark:text-amber-400", type: "govt" },
                  { label: "SSC", key: "SSC", icon: "🏢", color: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-700 dark:text-blue-400", type: "govt" },
                  { label: "Police", key: "Police", icon: "👮", color: "bg-red-500/10", border: "border-red-500/20", text: "text-red-700 dark:text-red-400", type: "govt" },
                  { label: "IT Jobs", key: "it", icon: "💻", color: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-700 dark:text-orange-400", type: "interview" }
                ].map((cat, i) => (
                  <Link
                    key={i}
                    to={cat.type === "govt" ? "/govt-practice" : "/setup"}
                    state={cat.type === "govt" ? { exam: cat.key } : undefined}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${cat.border} ${cat.color} backdrop-blur-md transition-all hover:translate-y-[-4px] hover:shadow-lg cursor-pointer group`}
                  >
                    <span className="text-3xl mb-2 transition-transform group-hover:scale-110">{cat.icon}</span>
                    <span className={`text-[12px] font-bold ${cat.text}`}>{cat.label}</span>
                    <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">Start Now</span>
                  </Link>
                ))}
              </div>

              {/* Trust Signals Strip */}
              <div className="mt-6 p-1 rounded-[2rem] bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 shadow-inner">
                <div className="bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[1.8rem] p-5 sm:p-6 shadow-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                    {[
                      {
                        icon: "✨",
                        title: "Confidence",
                        desc: "500+ students improved in 2 weeks"
                      },
                      {
                        icon: "📚",
                        title: "Coverage",
                        desc: "Real WBCS, SSC & Police questions"
                      },
                      {
                        icon: "🤝",
                        title: "Bilingual",
                        desc: "Support for বাংলা + English speech"
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 sm:justify-center first:pt-0 pt-4 sm:pt-0 first:border-0 border-0 pl-0 sm:first:pl-0 sm:pl-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shadow-sm rotate-3 group-hover:rotate-0 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-1 underline decoration-secondary/30 underline-offset-4">{item.title}</span>
                          <span className="text-[13px] font-extrabold text-foreground leading-tight tracking-tight">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual — Interactive Interview Mock */}
            <div className="relative h-[480px] sm:h-[550px] lg:h-[600px] animate-fade-in group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative h-full bg-white/40 dark:bg-black/20 backdrop-blur-2xl rounded-[2rem] border border-white/40 dark:border-white/10 p-4 sm:p-7 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-2">
                <HeroAvatar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 200+ Company Interview Questions Carousel ─── */}
      <section className="py-16 sm:py-24 border-t border-border/40 bg-gradient-to-b from-slate-50/80 via-transparent to-transparent dark:from-slate-900/40">
        <div className="container space-y-10">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                200+ Companies
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Crack interviews at{" "}
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
                  top companies
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Real questions asked in actual interviews — curated & updated for 2026
              </p>
            </div>
            <Link to="/interview-questions" className="flex-shrink-0">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white gap-2 font-semibold">
                View all 200+ companies
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Carousel */}
          <CompanyCarousel />

          {/* Bottom CTA */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Showing 12 of <strong className="text-foreground">200+</strong> companies — explore them all
            </p>
            <Link to="/interview-questions">
              <Button size="lg" className="gradient-primary font-bold text-base px-8 shadow-lg shadow-orange-200/40 hover:shadow-xl hover:shadow-orange-300/50 transition-all gap-2">
                🏢 Go to All 200+ Company Questions
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* AI-Powered Exam Preparation Section */}
      <section className="py-20 sm:py-32 border-t border-border/40 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5">
        <div className="container space-y-12 sm:space-y-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              AI-Powered Exam Preparation for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Police, WBCS, SSC & More
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Revolutionize your exam preparation with cutting-edge AI technology designed specifically for competitive exams. From police constable exams to WBCS and SSC, our AI-driven platform helps students crack their dream jobs through intelligent study recommendations, personalized mock tests, and comprehensive skill development.
            </p>
          </div>

          {/* How AI Helps Students Crack Exams */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold">
                How AI Helps Students Crack Exams
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Personalized Study Plans</h4>
                    <p className="text-muted-foreground">AI analyzes your performance and creates customized study schedules tailored to your strengths and weaknesses for police, WBCS, and SSC exams.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">AI-Recommended Question Papers</h4>
                    <p className="text-muted-foreground">Get intelligent recommendations for previous year papers, mock tests, and practice questions based on exam patterns and your preparation level.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Real-time Performance Analytics</h4>
                    <p className="text-muted-foreground">Track your progress with detailed analytics, identify weak areas, and receive AI-powered insights to improve your scores in competitive exams.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Adaptive Learning Technology</h4>
                    <p className="text-muted-foreground">Our AI adapts to your learning style, providing challenging questions when you're ready and remedial content when you need reinforcement.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-80 sm:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-card rounded-2xl border border-border/40 p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Brain className="w-16 h-16 text-primary mx-auto" />
                  <h4 className="text-xl font-bold">AI-Driven Success</h4>
                  <p className="text-muted-foreground">
                    Advanced algorithms analyze thousands of exam patterns to provide you with the most effective preparation strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Uses of AI for Cracking Jobs */}
          <div className="space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-center">
              Uses of AI for Cracking Jobs
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Resume Optimization",
                  description: "AI-powered resume builder that analyzes job descriptions and optimizes your CV for ATS systems and recruiters.",
                  icon: "📄",
                },
                {
                  title: "Interview Practice",
                  description: "Practice with AI interviewers that simulate real job interviews for police, government, and corporate positions.",
                  icon: "🎤",
                },
                {
                  title: "Skill Gap Analysis",
                  description: "Identify missing skills and get personalized learning recommendations to bridge gaps for your target job role.",
                  icon: "📊",
                },
                {
                  title: "Mock Test Generation",
                  description: "AI creates custom mock tests based on specific job requirements and exam patterns for WBCS, SSC, and police exams.",
                  icon: "📝",
                },
                {
                  title: "Career Guidance",
                  description: "Get AI-powered career advice, job market insights, and personalized roadmaps for government and private sector jobs.",
                  icon: "🎯",
                },
                {
                  title: "Performance Tracking",
                  description: "Monitor your preparation progress with detailed analytics and AI-generated improvement suggestions.",
                  icon: "📈",
                },
              ].map((use, idx) => (
                <Card key={idx} className="p-6 border border-border/40 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="space-y-4">
                    <div className="text-3xl">{use.icon}</div>
                    <h4 className="font-bold text-lg">{use.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {use.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA for Exam Preparation */}
          <div className="text-center space-y-6 pt-8">
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready to Crack Your Exam with AI?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who are using AI to prepare for police, WBCS, SSC, and other competitive exams. Start your AI-powered preparation journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/study-plan">
                <Button size="lg" className="gradient-primary text-base font-semibold">
                  Create Study Plan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/question-hub">
                <Button variant="outline" size="lg" className="border-primary/20 text-base">
                  Practice Mock Tests
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground flex flex-wrap justify-center gap-x-3 gap-y-1">
              <Link to="/wbcs-mock-test" className="text-primary hover:underline font-medium">
                WBCS mock test (previous year papers)
              </Link>
              <span className="text-border">|</span>
              <Link to="/wbp-police-mock-test" className="text-primary hover:underline font-medium">
                WBP police mock test (Constable / Lady Constable)
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-32 border-t border-border/40 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Get In Touch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have questions or feedback? We'd love to hear from you. Reach out to our team and we'll respond as soon as possible.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 gap-6 h-fit">
                {[
                  { icon: Mail, label: 'Email', value: 'support@interviewai.example' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: MapPin, label: 'Address', value: '123 AI Street, Tech City' }
                ].map((contact, idx) => {
                  const Icon = contact.icon;
                  return (
                    <Card key={idx} className="p-5 border-border/40 hover:border-primary/50 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{contact.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">{contact.value}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Contact Form */}
              <Card className="p-8 border-border/40">
                <form id="contactForm" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const fd = new FormData(form);
                  const body = Object.fromEntries(fd.entries());
                  try {
                    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) });
                    alert('Message submitted — thank you!');
                    form.reset();
                  } catch (err) {
                    console.warn('Contact submit failed', err);
                    alert('Message saved locally.');
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Name *</label>
                      <input name="name" placeholder="Your full name" required className="w-full mt-2 p-3 rounded-lg border border-border/40 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email *</label>
                      <input name="email" type="email" placeholder="you@example.com" required className="w-full mt-2 p-3 rounded-lg border border-border/40 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Message *</label>
                      <textarea name="message" placeholder="Your message here..." rows={4} required className="w-full mt-2 p-3 rounded-lg border border-border/40 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                    </div>
                    <Button type="submit" className="w-full gradient-primary text-base font-semibold py-2.5">Send Message</Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
    <section className="py-24 sm:py-36 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-t border-border/40">
  <div className="container px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
      
      {/* Left features list */}
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Premium Features
          </h2>
          <p className="text-muted-foreground max-w-md">
            Everything you need to simulate a real-world interview and get
            actionable feedback.
          </p>
        </div>

        <div className="space-y-5">
          {[
            "Professional female AI interviewer avatar",
            "Real-time voice and text interactions",
            "Multiple interview types and languages",
            "Detailed evaluation metrics and scores",
            "Follow-up and cross-questioning",
            "Personalized improvement suggestions",
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-primary/5 transition"
            >
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-base text-foreground/90">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right visual card */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px]">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/20 rounded-3xl blur-3xl opacity-60" />

        {/* Card */}
        <div className="relative h-full bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-10 flex items-center justify-center shadow-xl">
          <div className="space-y-6 w-full text-center">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Evaluation Metrics
            </p>

            <div className="space-y-5 text-left">
              {[
                { label: "Communication", value: 85, color: "bg-primary" },
                { label: "Technical", value: 78, color: "bg-secondary" },
                { label: "Confidence", value: 92, color: "bg-accent" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-semibold">
                      {(item.value / 10).toFixed(1)}/10
                    </span>
                  </div>

                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 text-xs text-muted-foreground">
              AI-generated score based on interview performance
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-20 sm:py-32 border-t border-border/40">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to Master Your Interview?
              </h2>
              <p className="text-lg text-muted-foreground">
                Start practicing with our AI interviewer today. No signup
                required for the MVP.
              </p>
            </div>
            <Link to="/setup">
              <Button
                size="lg"
                className="gradient-primary text-base font-semibold px-8"
              >
                Start Your Mock Interview Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
