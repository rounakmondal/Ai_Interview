/**
 * Translations — Bengali (colloquial) + English
 * Use local/casual Bengali for natural, friendly feel
 */

export type Language = "en" | "bn";

export interface Translations {
  // Navigation
  home: string;
  dailyTasks: string;
  govtPractice: string;
  questionBank: string;
  aiChat: string;
  study: string;
  about: string;
  contact: string;
  dashboard: string;
  profile: string;
  leaderboard: string;

  // Auth
  signIn: string;
  signUp: string;
  logout: string;
  getStarted: string;

  // Buttons
  next: string;
  previous: string;
  skip: string;
  cancel: string;
  save: string;
  submit: string;
  complete: string;
  back: string;
  start: string;
  tryNow: string;

  // Loading & Status
  loading: string;
  loadingPage: string;
  startPracticeTest: string;
  viewLeaderboard: string;
  prepareNow: string;
  noLoginRequired: string;
  startMockInterview: string;
  tryQuestions: string;

  // Onboarding
  pickYourExam: string;
  takeMockTest: string;
  seeYourResult: string;

  // Dashboard
  myDashboard: string;
  yourProgress: string;
  streak: string;
  questionsAttempted: string;
  accuracy: string;
  days: string;

  // Daily Tasks
  myTasks: string;
  taskCompleted: string;
  taskPending: string;

  // Settings
  settings: string;
  language: string;
  theme: string;
  darkMode: string;
  lightMode: string;

  // Common
  yes: string;
  no: string;
  search: string;
  filter: string;
  sort: string;
  delete: string;
  edit: string;
  add: string;
  close: string;
  error: string;
  success: string;
  warning: string;
  info: string;

  // Landing Page
  features: string;
  studentsMonths: string;
  aceYourInterview: string;
  practiceUntilSucceed: string;
  voiceMockInterviewDesc: string;
  startFreeInterview: string;
  tryOneQuestionNoLogin: string;

  // Police Exams
  siSubInspector: string;
  constable: string;
  ladyConstable: string;
  download: string;
  mockTest: string;
}

const EN: Translations = {
  home: "Home",
  dailyTasks: "Daily Tasks",
  govtPractice: "Govt Practice",
  questionBank: "Question Bank",
  aiChat: "AI Chat",
  study: "Study",
  about: "About",
  contact: "Contact",
  dashboard: "Dashboard",
  profile: "Profile",
  leaderboard: "Leaderboard",

  signIn: "Sign In",
  signUp: "Sign Up",
  logout: "Logout",
  getStarted: "Get Started",

  next: "Next",
  previous: "Previous",
  skip: "Skip",
  cancel: "Cancel",
  save: "Save",
  submit: "Submit",
  complete: "Complete",
  back: "Back",
  start: "Start",
  tryNow: "Try Now",

  loading: "Loading",
  loadingPage: "Loading page...",
  startPracticeTest: "Start Practice Test",
  viewLeaderboard: "View Leaderboard",
  prepareNow: "Prepare Now",
  noLoginRequired: "No Login Required",
  startMockInterview: "Start Free Mock Interview",
  tryQuestions: "Try 1 Question",

  pickYourExam: "Pick your exam",
  takeMockTest: "Take a mock test",
  seeYourResult: "See your result",

  myDashboard: "My Dashboard",
  yourProgress: "Your Progress",
  streak: "Streak",
  questionsAttempted: "Questions",
  accuracy: "Accuracy",
  days: "days",

  myTasks: "My Tasks",
  taskCompleted: "Completed",
  taskPending: "Pending",

  settings: "Settings",
  language: "Language",
  theme: "Theme",
  darkMode: "Dark Mode",
  lightMode: "Light Mode",

  yes: "Yes",
  no: "No",
  search: "Search",
  filter: "Filter",
  sort: "Sort",
  delete: "Delete",
  edit: "Edit",
  add: "Add",
  close: "Close",
  error: "Error",
  success: "Success",
  warning: "Warning",
  info: "Info",

  // Landing Page
  features: "Features",
  studentsMonths: "500+ students already practising",
  aceYourInterview: "Ace Your Next Interview",
  practiceUntilSucceed: "Practice Until You Succeed",
  voiceMockInterviewDesc: "Voice-based mock interviews with instant AI feedback. Practice for WBCS, SSC, Police, IT jobs — in English or বাংলা. Upload your resume and get personalised questions.",
  startFreeInterview: "Start Free Mock Interview",
  tryOneQuestionNoLogin: "Try 1 Question — No Login",

  // Police Exams
  siSubInspector: "Sub-Inspector (SI)",
  constable: "Constable",
  ladyConstable: "Lady Constable",
  download: "Download",
  mockTest: "Mock Test",
};

const BN: Translations = {
  // Navigation (কোলকিয়াল বাংলা)
  home: "হোম",
  dailyTasks: "দৈনিক কাজ",
  govtPractice: "সরকারি পরীক্ষা",
  questionBank: "প্রশ্ন ব্যাংক",
  aiChat: "এআই চ্যাট",
  study: "পড়াশোনা",
  about: "আমাদের সম্পর্কে",
  contact: "যোগাযোগ",
  dashboard: "ড্যাশবোর্ড",
  profile: "প্রোফাইল",
  leaderboard: "লিডারবোর্ড",

  // Auth
  signIn: "লগ ইন",
  signUp: "সাইন আপ",
  logout: "লগ আউট",
  getStarted: "শুরু করুন",

  // Buttons
  next: "পরের",
  previous: "আগের",
  skip: "এড়িয়ে যান",
  cancel: "বাতিল",
  save: "সংরক্ষণ করুন",
  submit: "জমা দিন",
  complete: "সম্পূর্ণ করুন",
  back: "পিছনে",
  start: "শুরু করুন",
  tryNow: "এখনই চেষ্টা করুন",

  // Loading & Status
  loading: "লোড হচ্ছে",
  loadingPage: "পৃষ্ঠা লোড হচ্ছে...",
  startPracticeTest: "প্র্যাকটিস পরীক্ষা শুরু করুন",
  viewLeaderboard: "লিডারবোর্ড দেখুন",
  prepareNow: "এখনই প্রস্তুত হন",
  noLoginRequired: "লগইন প্রয়োজন নেই",
  startMockInterview: "ফ্রি মক ইন্টারভিউ শুরু করুন",
  tryQuestions: "১টি প্রশ্ন চেষ্টা করুন",

  // Onboarding
  pickYourExam: "আপনার পরীক্ষা বেছে নিন",
  takeMockTest: "মক টেস্ট দিন",
  seeYourResult: "আপনার ফলাফল দেখুন",

  // Dashboard
  myDashboard: "আমার ড্যাশবোর্ড",
  yourProgress: "আপনার অগ্রগতি",
  streak: "স্ট্রিক",
  questionsAttempted: "প্রশ্ন",
  accuracy: "নির্ভুলতা",
  days: "দিন",

  // Daily Tasks
  myTasks: "আমার কাজ",
  taskCompleted: "সম্পন্ন",
  taskPending: "অপেক্ষমান",

  // Settings
  settings: "সেটিংস",
  language: "ভাষা",
  theme: "থিম",
  darkMode: "ডার্ক মোড",
  lightMode: "লাইট মোড",

  // Common
  yes: "হ্যাঁ",
  no: "না",
  search: "খুঁজুন",
  filter: "ফিল্টার",
  sort: "সাজান",
  delete: "মুছে ফেলুন",
  edit: "সম্পাদনা করুন",
  add: "যোগ করুন",
  close: "বন্ধ করুন",
  error: "ত্রুটি",
  success: "সফল",
  warning: "সতর্কতা",
  info: "তথ্য",

  // Landing Page
  features: "বৈশিষ্ট্য",
  studentsMonths: "৫০০+ শিক্ষার্থী ইতিমধ্যে অনুশীলন করছেন",
  aceYourInterview: "আপনার পরবর্তী ইন্টারভিউতে সফল হন",
  practiceUntilSucceed: "যতক্ষণ না আপনি সফল হন অভ্যাস করুন",
  voiceMockInterviewDesc: "তাৎক্ষণিক এআই প্রতিক্রিয়া সহ ভয়েস-ভিত্তিক মক ইন্টারভিউ। WBCS, SSC, পুলিশ, আইটি চাকরির জন্য অনুশীলন করুন — ইংরেজি বা বাংলায়। আপনার রিজিউমে আপলোড করুন এবং ব্যক্তিগতকৃত প্রশ্ন পান।",
  startFreeInterview: "বিনামূল্যে মক ইন্টারভিউ শুরু করুন",
  tryOneQuestionNoLogin: "১টি প্রশ্ন চেষ্টা করুন — লগইন প্রয়োজন নেই",

  // Police Exams
  siSubInspector: "সাব-ইন্সপেক্টর (এসআই)",
  constable: "কনস্টেবল",
  ladyConstable: "মহিলা কনস্টেবল",
  download: "ডাউনলোড",
  mockTest: "মক পরীক্ষা",
};

export const translations: Record<Language, Translations> = {
  en: EN,
  bn: BN,
};

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language][key] || EN[key];
}
