import "./global.css";

import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/premium/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { isLoggedIn } from "@/lib/auth-api";
import { useAndroidBackButton } from "@/hooks/use-android-back-button";
import { useNotificationCheck } from "@/hooks/use-notification-check";
import ExamOnboardingModal from "@/components/ExamOnboardingModal";
import PostLoginBriefingModal from "@/components/PostLoginBriefingModal";
import LandingPage from "./pages/Landing";
import PremiumLanding from "./pages/PremiumLanding";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewRoom from "./pages/InterviewRoom";
import EvaluationPage from "./pages/Evaluation";
import NotFound from "./pages/NotFound";
import ResumeBuilder from "./pages/ResumeBuilder";
import CareerMentorPage from "./pages/CareerMentor";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Lazy-load govt exam pages to reduce initial bundle size
const GovtPractice = lazy(() => import("./pages/GovtPractice"));
const GovtTest = lazy(() => import("./pages/GovtTest"));
const GovtResult = lazy(() => import("./pages/GovtResult"));
const PrevYearQuestions = lazy(() => import("./pages/PrevYearQuestions"));
const PhotoSolver = lazy(() => import("./pages/PhotoSolver"));
const CurrentAffairs = lazy(() => import("./pages/CurrentAffairs"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const StudyWithMe = lazy(() => import("./pages/StudyWithMe"));
const StoryTelling = lazy(() => import("./pages/StoryTelling"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const DailyTasks = lazy(() => import("./pages/DailyTasks"));
const DailyQuiz = lazy(() => import("./pages/DailyQuiz"));
const StudyPlan = lazy(() => import("./pages/StudyPlan"));
const SyllabusTracker = lazy(() => import("./pages/SyllabusTracker"));
const ChapterTest = lazy(() => import("./pages/ChapterTest"));
const MockTestPage = lazy(() => import("./pages/MockTestPage"));
const QuestionHub = lazy(() => import("./pages/QuestionHub"));
const PDFMockTest = lazy(() => import("./pages/PDFMockTest"));

const queryClient = new QueryClient();

// Inner component to use hooks (must be inside BrowserRouter)
function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize Android back button handler
  useAndroidBackButton();

  // Initialize notification check system
  useNotificationCheck();

  useEffect(() => {
    if (isLoggedIn() && !localStorage.getItem("upcoming_exam")) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <>
      {isLoggedIn() && <PostLoginBriefingModal />}
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<PremiumLanding />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/setup" element={<InterviewSetup />} />
          <Route path="/interview" element={<InterviewRoom />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/career-mentor" element={<CareerMentorPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/govt-practice" element={<GovtPractice />} />
          <Route path="/govt-test" element={<GovtTest />} />
          <Route path="/govt-result" element={<GovtResult />} />
          <Route path="/prev-year-questions" element={<PrevYearQuestions />} />
          <Route path="/photo-solver" element={<PhotoSolver />} />
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/study-with-me" element={<StudyWithMe />} />
          <Route path="/story-telling" element={<StoryTelling />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/daily-tasks" element={<DailyTasks />} />
          <Route path="/daily-quiz" element={<DailyQuiz />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/syllabus" element={<SyllabusTracker />} />
          <Route path="/chapter-test/:chapterId" element={<ChapterTest />} />
          <Route path="/mock-test" element={<MockTestPage />} />
          <Route path="/question-hub" element={<QuestionHub />} />
          {/* SEO landing URLs — same Question Hub UI, focused meta & canonical */}
          <Route path="/wbcs-mock-test" element={<QuestionHub seoProfile="wbcs" />} />
          <Route
            path="/wbp-police-mock-test"
            element={<QuestionHub seoProfile="police" />}
          />
          <Route path="/pdf-mock-test" element={<PDFMockTest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isLoggedIn() && !localStorage.getItem("upcoming_exam")) {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ExamOnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
