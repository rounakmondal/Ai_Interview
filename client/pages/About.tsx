import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Target, Users, Lightbulb, Shield, Award, Heart } from "lucide-react";
import { usePageSEO } from "@/lib/page-seo";

export default function About() {
  usePageSEO("/about");
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Info className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">About Us</h1>
        </div>

        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          We're on a mission to democratize interview preparation and empower job seekers worldwide with AI-powered practice tools.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <CardTitle>Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                In today's competitive job market, interview skills can make or break career opportunities. We believe everyone deserves access to high-quality interview preparation, regardless of their background or resources.
              </p>
              <p className="mt-4">
                Our AI Interview Practice Platform leverages cutting-edge artificial intelligence to provide realistic interview simulations, personalized feedback, and comprehensive career development tools—all accessible from anywhere, anytime.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-primary" />
                <CardTitle>What We Do</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                We provide a comprehensive suite of AI-powered tools designed to help you succeed in your job search:
              </p>
              <ul>
                <li>
                  <strong>AI Interview Practice:</strong> Realistic interview simulations with industry-specific questions tailored to your role and experience level
                </li>
                <li>
                  <strong>Real-Time Feedback:</strong> Instant analysis of your responses, communication style, and areas for improvement
                </li>
                <li>
                  <strong>Performance Analytics:</strong> Track your progress over time with detailed metrics and insights
                </li>
                <li>
                  <strong>Resume Builder:</strong> Create professional, ATS-friendly resumes optimized for your target roles
                </li>
                <li>
                  <strong>Career Mentoring:</strong> Get personalized career guidance and job search strategies from our AI career advisor
                </li>
                <li>
                  <strong>Speech & Communication Analysis:</strong> Improve your verbal communication, pacing, and clarity
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <CardTitle>Who We Serve</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>Our platform is designed for:</p>
              <ul>
                <li><strong>Job Seekers:</strong> Recent graduates and experienced professionals preparing for interviews</li>
                <li><strong>Career Changers:</strong> Individuals transitioning to new roles or industries</li>
                <li><strong>Students:</strong> College students preparing for internships and entry-level positions</li>
                <li><strong>International Candidates:</strong> Non-native speakers looking to improve their English interview skills</li>
                <li><strong>Remote Workers:</strong> Anyone seeking flexible, on-demand interview practice</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <CardTitle>Our Commitment to Privacy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your privacy and data security are our top priorities. We employ industry-standard encryption and security measures to protect your personal information, interview recordings, and career data. We never sell your data to third parties.
                </p>
                <Link to="/privacy-policy" className="text-primary hover:underline mt-4 inline-block">
                  Read our Privacy Policy →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-primary" />
                  <CardTitle>Our Technology</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We leverage state-of-the-art AI technologies including natural language processing, speech recognition, and machine learning models to provide accurate, helpful feedback. Our platform continuously learns and improves to deliver the most effective interview preparation experience.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-primary" />
                <CardTitle>Our Values</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground">Accessibility</h4>
                  <p className="text-muted-foreground mt-2">
                    Making professional interview preparation available to everyone, regardless of location or financial resources.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Innovation</h4>
                  <p className="text-muted-foreground mt-2">
                    Continuously improving our AI technology to provide the most realistic and helpful interview practice experience.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Transparency</h4>
                  <p className="text-muted-foreground mt-2">
                    Being clear about how our AI works, what data we collect, and how we use it to improve your experience.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Empowerment</h4>
                  <p className="text-muted-foreground mt-2">
                    Giving you the tools, insights, and confidence to succeed in your job search and career development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="grid gap-6 mt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Set Up Your Profile</h4>
                    <p className="text-muted-foreground mt-1">
                      Upload your resume and specify your target role, industry, and experience level.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Practice Interviews</h4>
                    <p className="text-muted-foreground mt-1">
                      Engage in AI-powered interview simulations with questions tailored to your profile. Practice with voice input for the most realistic experience.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Get Instant Feedback</h4>
                    <p className="text-muted-foreground mt-1">
                      Receive detailed analysis of your responses, including content quality, communication style, and areas for improvement.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Track Progress & Improve</h4>
                    <p className="text-muted-foreground mt-1">
                      Monitor your performance over time, identify patterns, and watch your confidence grow with each practice session.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Our Commitment to Ethical AI</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                We are committed to using AI responsibly and ethically. Our platform is designed to:
              </p>
              <ul>
                <li>Provide fair, unbiased feedback regardless of accent, gender, or background</li>
                <li>Be transparent about how AI evaluations are generated</li>
                <li>Protect user privacy and data security at all times</li>
                <li>Serve as a practice tool, not a replacement for human judgment in hiring</li>
                <li>Continuously monitor and improve our AI models to reduce bias</li>
              </ul>
              <p className="mt-4">
                We believe AI should augment human capabilities, not replace human connection. Our goal is to prepare you for real human interactions in your job search journey.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We'd love to hear from you! Whether you have questions, feedback, or just want to share your success story, please don't hesitate to reach out.
              </p>
              <Link to="/contact" className="inline-block">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Get in Touch
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Ready to ace your next interview?
          </p>
          <Link to="/setup" className="inline-block mt-4">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold">
              Start Practicing Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
