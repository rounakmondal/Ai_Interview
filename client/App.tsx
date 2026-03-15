import "./global.css";

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/premium/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
