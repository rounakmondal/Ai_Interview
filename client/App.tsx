import "./global.css";

import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/premium/ThemeProvider";
import { LanguageProvider } from "@/components/premium/LanguageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { isLoggedIn } from "@/lib/auth-api";
import { useAndroidBackButton } from "@/hooks/use-android-back-button";
import { useNotificationCheck } from "@/hooks/use-notification-check";
import { scheduleAmarPlanReminder } from "@/lib/notification-service";
import ExamOnboardingModal from "@/components/ExamOnboardingModal";
import PostLoginBriefingModal from "@/components/PostLoginBriefingModal";
import { RouteLoader } from "@/components/RouteLoader";
import LandingPage from "./pages/Landing";
import PremiumLanding from "./pages/PremiumLanding";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewRoom from "./pages/InterviewRoom";
import EvaluationPage from "./pages/Evaluation";
import NotFound from "./pages/NotFound";

// Lazy-load secondary pages to reduce initial bundle size (~-60KB)
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const CareerMentorPage = lazy(() => import("./pages/CareerMentor"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

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
const AmarPlan = lazy(() => import("./pages/AmarPlan"));
const SyllabusTracker = lazy(() => import("./pages/SyllabusTracker"));
const ChapterTest = lazy(() => import("./pages/ChapterTest"));
const MockTestPage = lazy(() => import("./pages/MockTestPage"));
const QuestionHub = lazy(() => import("./pages/QuestionHub"));
const PDFMockTest = lazy(() => import("./pages/PDFMockTest"));
const PreviousYearPage = lazy(() => import("./pages/PreviousYearPage"));

const VacancyAlertCenter = lazy(() => import("./pages/VacancyAlertCenter"));

// Company interview pages
const CompanyInterviewHub = lazy(() => import("./pages/CompanyInterviewHub"));
const CompanyInterviewQuestions = lazy(() => import("./pages/CompanyInterviewQuestions"));
const TechSkillMatrix = lazy(() => import("./pages/TechSkillMatrix"));
const ExamSyllabusExplorer = lazy(() => import("./pages/ExamSyllabusExplorer"));
const ExamCalendar = lazy(() => import("./pages/ExamCalendar"));

// SEO tool pages
const CGPACalculator = lazy(() => import("./pages/CGPACalculator"));
const AgeCalculator = lazy(() => import("./pages/AgeCalculator"));
const SalaryCalculator = lazy(() => import("./pages/SalaryCalculator"));
const ExamEligibilityChecker = lazy(() => import("./pages/ExamEligibilityChecker"));
const TypingSpeedTest = lazy(() => import("./pages/TypingSpeedTest"));
const ToolsHub = lazy(() => import("./pages/ToolsHub"));

// Blog pages
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogWBCSStrategy = lazy(() => import("./pages/blog/WBCSPreparationStrategy2026"));
const BlogWBCSPrelims2023 = lazy(() => import("./pages/blog/WBCSPrelims2023Analysis"));
const BlogWBPSCClerkship = lazy(() => import("./pages/blog/WBPSCClerkshipPYP"));
const BlogWBPoliceSI = lazy(() => import("./pages/blog/WBPoliceSIMockTest"));
const BlogWBTETSyllabus = lazy(() => import("./pages/blog/WBTET2026Syllabus"));
const BlogTop50GK = lazy(() => import("./pages/blog/Top50GKQuestionsWBCS"));
const BlogWBPSCBengali = lazy(() => import("./pages/blog/WBPSCPreparationBengali"));
const BlogWBPoliceConstable = lazy(() => import("./pages/blog/WBPoliceConstablePYP"));
const BlogCrackWBCS = lazy(() => import("./pages/blog/HowToCrackWBCS"));
const BlogBestBooks = lazy(() => import("./pages/blog/BestBooksWBExams2026"));
const BlogRRBNTPCPapers = lazy(() => import("./pages/blog/RRBNTPCPreviousYearPapers"));
const BlogRRBNTPCSyllabus = lazy(() => import("./pages/blog/RRBNTPCSyllabus2026"));
const BlogIBPSPOPapers = lazy(() => import("./pages/blog/IBPSPOPreviousYearPapers"));
const BlogSSCMTSPapers = lazy(() => import("./pages/blog/SSCMTSPreviousYearPapers"));
const BlogWBPSCClerkship2024 = lazy(() => import("./pages/blog/WBPSCClerkship2024Paper"));

const queryClient = new QueryClient();

// Inner component to use hooks (must be inside BrowserRouter)
function AppContent() {
  // Initialize Android back button handler
  useAndroidBackButton();

  // Initialize notification check system
  useNotificationCheck();

  // Initialize Amar Plan daily reminder scheduler
  useEffect(() => {
    scheduleAmarPlanReminder();
  }, []);

  return (
    <>
      {isLoggedIn() && <PostLoginBriefingModal />}
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<PremiumLanding />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/setup" element={<InterviewSetup />} />
          <Route path="/interview" element={<InterviewRoom />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/career-mentor" element={<CareerMentorPage />} />
          <Route path="/vacancies" element={<VacancyAlertCenter />} />
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
          <Route path="/amar-plan" element={<AmarPlan />} />
          <Route path="/syllabus" element={<SyllabusTracker />} />
          <Route path="/chapter-test/:chapterId" element={<ChapterTest />} />
          <Route path="/mock-test" element={<MockTestPage />} />
          <Route path="/question-hub" element={<QuestionHub />} />
          {/* All Question Papers tab — clean exam URLs */}
          <Route path="/wbp-si-mock-test" element={<QuestionHub seoProfile="police-si" defaultAllExam="WBP SI" />} />
          {/* SEO landing URLs — same Question Hub UI, focused meta & canonical */}
          <Route path="/wbcs-mock-test" element={<QuestionHub seoProfile="wbcs" />} />
          <Route path="/wbp-constable-mock-test" element={<QuestionHub seoProfile="police-constable" defaultAllExam="WBP Constable" />} />
          <Route path="/wbp-constable-mock" element={<Navigate to="/wbp-constable-mock-test" replace />} />
          <Route
            path="/wbp-police-mock-test"
            element={<QuestionHub seoProfile="police" />}
          />
          <Route
            path="/wbp-mock-test"
            element={<QuestionHub seoProfile="police" />}
          />
          <Route
            path="/wbpsc-clerkship-mock-test"
            element={<QuestionHub seoProfile="wbpsc-clerkship" />}
          />
          <Route
            path="/wb-tet-mock-test"
            element={<QuestionHub seoProfile="wb-tet" />}
          />
          <Route
            path="/ssc-mts-mock-test"
            element={<QuestionHub seoProfile="ssc-mts" />}
          />
          <Route
            path="/ibps-po-mock-test"
            element={<QuestionHub seoProfile="ibps-po" />}
          />
          <Route
            path="/jtet-mock-test"
            element={<QuestionHub seoProfile="jtet" />}
          />
          <Route
            path="/rrb-ntpc-mock-test"
            element={<QuestionHub seoProfile="rrb-ntpc" />}
          />
          <Route path="/pdf-mock-test" element={<PDFMockTest />} />
          {/* SEO Previous Year Question Paper pages */}
          <Route path="/previous-year/:slug" element={<PreviousYearPage />} />
          {/* Company Interview Questions */}
          <Route path="/interview-questions" element={<CompanyInterviewHub />} />
          <Route path="/interview-questions/:slug" element={<CompanyInterviewQuestions />} />
          <Route path="/skill-matrix" element={<TechSkillMatrix />} />
          <Route path="/exam-syllabus" element={<ExamSyllabusExplorer />} />
          <Route path="/exam-calendar" element={<ExamCalendar />} />
          {/* Blog */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/wbcs-preparation-strategy-2026" element={<BlogWBCSStrategy />} />
          <Route path="/blog/wbcs-prelims-2023-question-paper-analysis" element={<BlogWBCSPrelims2023 />} />
          <Route path="/blog/wbpsc-clerkship-previous-year-papers" element={<BlogWBPSCClerkship />} />
          <Route path="/blog/wb-police-si-mock-test-free" element={<BlogWBPoliceSI />} />
          <Route path="/blog/wb-tet-2026-syllabus-exam-pattern" element={<BlogWBTETSyllabus />} />
          <Route path="/blog/top-50-gk-questions-wbcs-prelims-2026" element={<BlogTop50GK />} />
          <Route path="/blog/wbpsc-preparation-in-bengali" element={<BlogWBPSCBengali />} />
          <Route path="/blog/wb-police-constable-previous-year-paper" element={<BlogWBPoliceConstable />} />
          <Route path="/blog/how-to-crack-wbcs-first-attempt" element={<BlogCrackWBCS />} />
          <Route path="/blog/best-books-wbcs-wbpsc-wb-police-2026" element={<BlogBestBooks />} />
          <Route path="/blog/rrb-ntpc-previous-year-question-papers" element={<BlogRRBNTPCPapers />} />
          <Route path="/blog/rrb-ntpc-2026-syllabus-exam-pattern" element={<BlogRRBNTPCSyllabus />} />
          <Route path="/blog/ibps-po-previous-year-question-papers" element={<BlogIBPSPOPapers />} />
          <Route path="/blog/ssc-mts-previous-year-question-papers" element={<BlogSSCMTSPapers />} />
          <Route path="/blog/wbpsc-clerkship-2024-question-paper-analysis" element={<BlogWBPSCClerkship2024 />} />
          {/* SEO Tool Pages */}
          <Route path="/cgpa-calculator" element={<CGPACalculator />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/salary-calculator" element={<SalaryCalculator />} />
          <Route path="/eligibility-checker" element={<ExamEligibilityChecker />} />
          <Route path="/typing-test" element={<TypingSpeedTest />} />
          <Route path="/tools" element={<ToolsHub />} />
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
    const checkExam = () => {
      if (isLoggedIn() && !localStorage.getItem("upcoming_exam")) {
        setShowOnboarding(true);
      } else if (localStorage.getItem("upcoming_exam")) {
        setShowOnboarding(false);
      }
    };

    // Check on mount
    checkExam();

    // Re-check when window gains focus (exam might be saved in another tab or profile)
    window.addEventListener("focus", checkExam);
    return () => window.removeEventListener("focus", checkExam);
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
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
      </LanguageProvider>
    </ErrorBoundary>
  );
}
