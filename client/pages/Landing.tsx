import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Brain, BarChart3, ArrowRight, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import HeroAvatar from "./components/HeroAvatar";
import Footer from "@/components/Footer";


// Sample hero text for TTS demo
const HERO_SAMPLE = "Hello, welcome to Interview AI. I will ask you questions and provide feedback to help you improve.";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/photo_6183770845247900874_y.jpg" alt="InterviewSathi" className="w-10 h-10 rounded-lg object-cover" />
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
      <section className="relative py-12 sm:py-24 overflow-hidden">
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
                  <div className="text-2xl font-bold text-primary">Free</div>
                  <p className="text-sm text-muted-foreground">To Get Started</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">AI</div>
                  <p className="text-sm text-muted-foreground">Powered Feedback</p>
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
