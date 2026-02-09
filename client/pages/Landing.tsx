import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Brain, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
              AI
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              InterviewAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
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
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-slide-up">
              <div className="space-y-2">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
                  <Zap className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Powered by AI
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Master Your Interview with{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    AI-Powered Practice
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-lg">
                  Practice realistic mock interviews with our professional
                  female AI interviewer. Get instant feedback and improve your
                  interview skills in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/setup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gradient-primary text-base font-semibold"
                  >
                    Start Mock Interview
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-primary/20 text-base"
                  asChild
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/40">
                <div>
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">95%</div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">24/7</div>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 sm:h-[500px] animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/40 p-8 flex items-center justify-center overflow-hidden">
                <div className="space-y-4 w-full">
                  {/* Animated avatar placeholder */}
                  <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-primary animate-pulse-subtle flex items-center justify-center text-white">
                      <svg
                        className="w-20 h-20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>

                  {/* Sample question */}
                  <div className="space-y-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      AI Interviewer is speaking...
                    </p>
                    <p className="text-base font-medium text-foreground">
                      Tell me about your experience with...
                    </p>
                  </div>

                  {/* Visual indicators */}
                  <div className="flex justify-center gap-2 py-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-100" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-200" />
                  </div>
                </div>
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

      {/* Features Highlights */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent border-t border-border/40">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left features list */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Premium Features
              </h2>
              <div className="space-y-4">
                {[
                  "Professional female AI interviewer avatar",
                  "Real-time voice and text interactions",
                  "Multiple interview types and languages",
                  "Detailed evaluation metrics and scores",
                  "Follow-up and cross-questioning",
                  "Personalized improvement suggestions",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-base text-foreground/80">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image placeholder */}
            <div className="relative h-96 sm:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-3xl" />
              <div className="relative h-full bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/40 p-8 flex items-center justify-center">
                <div className="space-y-4 w-full text-center">
                  <p className="text-sm text-muted-foreground">
                    Evaluation Metrics
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication</span>
                        <span className="font-semibold">8.5/10</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-primary rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Technical</span>
                        <span className="font-semibold">7.8/10</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[78%] bg-secondary rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confidence</span>
                        <span className="font-semibold">9.2/10</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-accent rounded-full" />
                      </div>
                    </div>
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
      <footer className="border-t border-border/40 py-12">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                AI
              </div>
              <span className="font-semibold">InterviewAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 InterviewAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
