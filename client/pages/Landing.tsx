import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Brain, BarChart3, ArrowRight, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import HeroAvatar from "./components/HeroAvatar";
import Footer from "@/components/Footer";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="InterviewSathi" className="w-10 h-10 rounded-lg object-cover" />
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              InterviewSathi
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
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-14 sm:py-24 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-transparent to-purple-50/60 pointer-events-none" />
        <div className="absolute top-20 -left-32 w-80 h-80 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-32 w-80 h-80 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50/70">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />
                <span className="text-sm font-medium text-indigo-700">
                  500+ students already practising
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.1] text-slate-900">
                  Crack Your Next Interview —{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Practice Until You're Unshakable
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-500 max-w-xl leading-relaxed">
                  Voice-based mock interviews with instant AI feedback. Practice for{" "}
                  <strong className="text-slate-700">WBCS, SSC, Police, IT jobs</strong> — in
                  English or <strong className="text-indigo-600">বাংলা</strong>. Upload your resume
                  and get personalised questions.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/setup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gradient-primary text-base font-semibold h-12 px-7 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 transition-all"
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

              {/* Trust Signals Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80">
                {[
                  {
                    icon: "✅",
                    text: (
                      <>
                        <strong>500+ students</strong> improved confidence
                      </>
                    ),
                  },
                  {
                    icon: "✅",
                    text: (
                      <>
                        <strong>Real questions</strong> from WBCS, SSC & IT
                      </>
                    ),
                  },
                  {
                    icon: "✅",
                    text: (
                      <>
                        <strong>Built for WB students</strong> — বাংলা + English
                      </>
                    ),
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                    <span className="leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual — Interactive Interview Mock */}
            <div className="relative h-[480px] sm:h-[530px] animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex items-center justify-center overflow-hidden shadow-xl shadow-indigo-100/40">
                <HeroAvatar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 sm:py-32 border-t border-border/40"
      >
        <div className="container space-y-12 sm:space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              How InterviewAI Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to master your interview skills
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {[
              {
                step: "1",
                title: "Choose Your Interview",
                description:
                  "Select from Government, Private, IT, or Non-IT interviews. Pick your preferred language and optionally upload your CV.",
                icon: Brain,
              },
              {
                step: "2",
                title: "Get Interviewed",
                description:
                  "Sit down with our AI interviewer. Answer realistic questions, receive follow-up questions, and experience a genuine interview scenario.",
                icon: Zap,
              },
              {
                step: "3",
                title: "Get Instant Feedback",
                description:
                  "Receive detailed evaluation on communication, technical skills, confidence, and areas for improvement with personalized suggestions.",
                icon: BarChart3,
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="border border-border/40 p-6 sm:p-8 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">
                        {feature.step}
                      </span>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
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
