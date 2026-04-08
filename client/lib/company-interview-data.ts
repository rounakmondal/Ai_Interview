// ─────────────────────────────────────────────────────────────────────────────
// Company Interview Questions — data, types, and API helpers
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CompanyQuestion {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
}

export interface CompanyQuestionsResponse {
  success: boolean;
  company: string;
  totalQuestions: number;
  categories: string[];
  questions: CompanyQuestion[];
}

export type CompanySlug = string;

export interface CompanyInfo {
  slug: CompanySlug;
  name: string;
  shortName: string;
  logo: string; // emoji fallback
  color: string; // tailwind gradient
  accent: string; // tailwind text/border color
  bgAccent: string;
  founded: string;
  headquarters: string;
  employees: string;
  description: string;
  interviewRounds: string[];
  avgPackage: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

// ── Company Data ─────────────────────────────────────────────────────────────

export const COMPANIES: CompanyInfo[] = [
  // ── Top 6 (User requested) ──
  {
    slug: "tcs",
    name: "Tata Consultancy Services",
    shortName: "TCS",
    logo: "🔵",
    color: "from-blue-600 to-blue-800",
    accent: "text-blue-600",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "1968",
    headquarters: "Mumbai, India",
    employees: "6,00,000+",
    description: "TCS is India's largest IT services company and a global leader in consulting, technology services, and digital transformation.",
    interviewRounds: ["Aptitude Test", "Technical Interview", "Managerial Interview", "HR Interview"],
    avgPackage: "₹3.5 – ₹7 LPA (Fresher)",
    seo: {
      title: "TCS Interview Questions & Answers 2026 | Top 100+ Questions | MedhaHub",
      description: "Prepare for TCS interview with 100+ frequently asked questions and expert answers. Covers aptitude, technical, HR rounds for TCS NQT, Digital, Ninja & Prime roles.",
      keywords: "TCS interview questions, TCS NQT questions, TCS technical interview, TCS HR interview questions 2026, TCS placement preparation",
    },
  },
  {
    slug: "infosys",
    name: "Infosys Limited",
    shortName: "Infosys",
    logo: "🔷",
    color: "from-indigo-600 to-indigo-800",
    accent: "text-indigo-600",
    bgAccent: "bg-indigo-50 dark:bg-indigo-950/30",
    founded: "1981",
    headquarters: "Bengaluru, India",
    employees: "3,50,000+",
    description: "Infosys is a global leader in next-generation digital services and consulting, empowering enterprises with AI and cloud solutions.",
    interviewRounds: ["InfyTQ / Online Test", "Technical Interview", "HR Interview"],
    avgPackage: "₹3.6 – ₹9 LPA (Fresher)",
    seo: {
      title: "Infosys Interview Questions & Answers 2026 | 100+ Questions | MedhaHub",
      description: "Top Infosys interview questions with detailed answers. Prepare for InfyTQ, Power Programmer, Specialist Programmer roles. Technical, coding & HR questions.",
      keywords: "Infosys interview questions, InfyTQ questions, Infosys technical interview 2026, Infosys coding questions, Infosys placement",
    },
  },
  {
    slug: "wipro",
    name: "Wipro Limited",
    shortName: "Wipro",
    logo: "🌻",
    color: "from-purple-600 to-purple-800",
    accent: "text-purple-600",
    bgAccent: "bg-purple-50 dark:bg-purple-950/30",
    founded: "1945",
    headquarters: "Bengaluru, India",
    employees: "2,50,000+",
    description: "Wipro is a leading global IT, consulting, and business process services company transforming clients through cognitive computing and digital technologies.",
    interviewRounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    avgPackage: "₹3.5 – ₹6.5 LPA (Fresher)",
    seo: {
      title: "Wipro Interview Questions & Answers 2026 | Complete Guide | MedhaHub",
      description: "Wipro interview questions for freshers & experienced. Complete preparation guide for Wipro Elite NTH, WILP, Turbo roles with answers.",
      keywords: "Wipro interview questions, Wipro Elite NTH questions, Wipro technical interview 2026, Wipro coding questions, Wipro WILP",
    },
  },
  {
    slug: "capgemini",
    name: "Capgemini",
    shortName: "Capgemini",
    logo: "🔺",
    color: "from-teal-600 to-teal-800",
    accent: "text-teal-600",
    bgAccent: "bg-teal-50 dark:bg-teal-950/30",
    founded: "1967",
    headquarters: "Paris, France",
    employees: "3,60,000+",
    description: "Capgemini is a global leader in consulting, digital transformation, technology, and engineering services with a strong presence in India.",
    interviewRounds: ["Online Test (Game-based)", "Technical Interview", "HR Interview"],
    avgPackage: "₹3.8 – ₹7.5 LPA (Fresher)",
    seo: {
      title: "Capgemini Interview Questions & Answers 2026 | Top Questions | MedhaHub",
      description: "Prepare for Capgemini interview with top questions and expert answers. Covers game-based aptitude, technical, and HR round preparation.",
      keywords: "Capgemini interview questions, Capgemini technical interview, Capgemini placement 2026, Capgemini game-based assessment",
    },
  },
  {
    slug: "accenture",
    name: "Accenture",
    shortName: "Accenture",
    logo: "▶️",
    color: "from-violet-600 to-violet-800",
    accent: "text-violet-600",
    bgAccent: "bg-violet-50 dark:bg-violet-950/30",
    founded: "1989",
    headquarters: "Dublin, Ireland",
    employees: "7,40,000+",
    description: "Accenture is a Fortune 500 global professional services company specializing in IT services, consulting, strategy, and operations.",
    interviewRounds: ["Cognitive & Technical Assessment", "Coding Round", "Technical Interview", "HR Interview"],
    avgPackage: "₹4.5 – ₹8 LPA (Fresher)",
    seo: {
      title: "Accenture Interview Questions & Answers 2026 | Complete Prep | MedhaHub",
      description: "Accenture interview questions for ASE, Analyst, and consulting roles. Practice aptitude, coding, and communication assessment questions.",
      keywords: "Accenture interview questions, Accenture ASE interview, Accenture coding questions 2026, Accenture placement preparation",
    },
  },
  {
    slug: "hcl",
    name: "HCLTech",
    shortName: "HCL",
    logo: "🟦",
    color: "from-sky-600 to-sky-800",
    accent: "text-sky-600",
    bgAccent: "bg-sky-50 dark:bg-sky-950/30",
    founded: "1976",
    headquarters: "Noida, India",
    employees: "2,25,000+",
    description: "HCLTech is a global technology company delivering industry-leading capabilities in digital, engineering, cloud, and AI services.",
    interviewRounds: ["Online Test", "Technical Interview Round 1", "Technical Interview Round 2", "HR Interview"],
    avgPackage: "₹3.5 – ₹7 LPA (Fresher)",
    seo: {
      title: "HCL Interview Questions & Answers 2026 | Top 100+ Questions | MedhaHub",
      description: "HCLTech interview preparation guide with 100+ questions. Covers technical, coding, and HR interview rounds for freshers & experienced.",
      keywords: "HCL interview questions, HCLTech interview 2026, HCL technical interview questions, HCL placement preparation",
    },
  },
  // ── More Top IT / Product Companies ──
  {
    slug: "cognizant",
    name: "Cognizant Technology Solutions",
    shortName: "Cognizant",
    logo: "🔶",
    color: "from-amber-600 to-amber-800",
    accent: "text-amber-600",
    bgAccent: "bg-amber-50 dark:bg-amber-950/30",
    founded: "1994",
    headquarters: "Teaneck, USA",
    employees: "3,50,000+",
    description: "Cognizant is one of the world's leading professional services companies, engineering modern businesses for a digital-first world.",
    interviewRounds: ["GenC Online Test", "Technical Interview", "HR Interview"],
    avgPackage: "₹4 – ₹7 LPA (Fresher)",
    seo: {
      title: "Cognizant Interview Questions 2026 | GenC, GenC Next, GenC Elevate | MedhaHub",
      description: "Cognizant interview questions with answers for GenC, GenC Next, and GenC Elevate roles. Complete preparation guide.",
      keywords: "Cognizant interview questions, Cognizant GenC questions, Cognizant technical interview 2026",
    },
  },
  {
    slug: "tech-mahindra",
    name: "Tech Mahindra",
    shortName: "Tech Mahindra",
    logo: "🔴",
    color: "from-red-600 to-red-800",
    accent: "text-red-600",
    bgAccent: "bg-red-50 dark:bg-red-950/30",
    founded: "1986",
    headquarters: "Pune, India",
    employees: "1,50,000+",
    description: "Tech Mahindra offers innovative and customer-centric digital experiences, enabling enterprises to rise for a more equal world.",
    interviewRounds: ["Online Test", "Technical Interview", "HR Interview"],
    avgPackage: "₹3.25 – ₹6.5 LPA (Fresher)",
    seo: {
      title: "Tech Mahindra Interview Questions 2026 | Prep Guide | MedhaHub",
      description: "Tech Mahindra interview questions with answers. Prepare for online test, technical, and HR interview rounds.",
      keywords: "Tech Mahindra interview questions, Tech Mahindra placement 2026, Tech Mahindra technical interview",
    },
  },
  {
    slug: "google",
    name: "Google",
    shortName: "Google",
    logo: "🟡",
    color: "from-green-500 to-blue-600",
    accent: "text-green-600",
    bgAccent: "bg-green-50 dark:bg-green-950/30",
    founded: "1998",
    headquarters: "Mountain View, USA",
    employees: "1,80,000+",
    description: "Google is a global technology leader specializing in internet services, AI, cloud computing, software, and hardware.",
    interviewRounds: ["Online Coding Test", "Phone Screen", "Onsite (4-5 rounds)", "Hiring Committee"],
    avgPackage: "₹30 – ₹60 LPA",
    seo: {
      title: "Google Interview Questions 2026 | DSA, System Design & Behavioral | MedhaHub",
      description: "Google interview questions for SDE roles. Practice DSA, system design, and behavioral questions asked at Google India.",
      keywords: "Google interview questions, Google SDE interview, Google coding questions 2026, Google India placement",
    },
  },
  {
    slug: "amazon",
    name: "Amazon",
    shortName: "Amazon",
    logo: "📦",
    color: "from-orange-500 to-orange-700",
    accent: "text-orange-600",
    bgAccent: "bg-orange-50 dark:bg-orange-950/30",
    founded: "1994",
    headquarters: "Seattle, USA",
    employees: "15,00,000+",
    description: "Amazon is the world's largest e-commerce and cloud computing company, with a strong engineering culture built on leadership principles.",
    interviewRounds: ["Online Assessment", "Phone Screen", "Onsite Loop (4-5 rounds)", "Bar Raiser"],
    avgPackage: "₹25 – ₹50 LPA",
    seo: {
      title: "Amazon Interview Questions 2026 | SDE-1, SDE-2 | Leadership Principles | MedhaHub",
      description: "Amazon interview questions for SDE roles. DSA, system design, and leadership principle questions with detailed answers.",
      keywords: "Amazon interview questions, Amazon SDE interview, Amazon leadership principles, Amazon coding questions 2026",
    },
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    shortName: "Microsoft",
    logo: "🪟",
    color: "from-blue-500 to-cyan-600",
    accent: "text-blue-500",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "1975",
    headquarters: "Redmond, USA",
    employees: "2,20,000+",
    description: "Microsoft is a global technology corporation producing software, hardware, and cloud services including Azure, Office 365, and Windows.",
    interviewRounds: ["Online Coding Test", "Phone Interview", "Onsite (3-4 rounds)", "As-Appropriate Round"],
    avgPackage: "₹25 – ₹55 LPA",
    seo: {
      title: "Microsoft Interview Questions 2026 | SDE, PM Roles | MedhaHub",
      description: "Microsoft interview questions for SDE and PM roles. Practice coding, system design, and behavioral questions.",
      keywords: "Microsoft interview questions, Microsoft SDE interview 2026, Microsoft coding questions, Microsoft India placement",
    },
  },
  {
    slug: "meta",
    name: "Meta (Facebook)",
    shortName: "Meta",
    logo: "♾️",
    color: "from-blue-600 to-indigo-700",
    accent: "text-blue-600",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "2004",
    headquarters: "Menlo Park, USA",
    employees: "70,000+",
    description: "Meta builds technologies to connect people, including Facebook, Instagram, WhatsApp, and cutting-edge AR/VR experiences.",
    interviewRounds: ["Coding Screen", "System Design", "Behavioral (Jedi)", "Onsite Loop"],
    avgPackage: "₹40 – ₹80 LPA",
    seo: {
      title: "Meta (Facebook) Interview Questions 2026 | SDE Prep | MedhaHub",
      description: "Meta/Facebook interview questions. Practice coding, system design, and behavioral questions for E3-E5 roles.",
      keywords: "Meta interview questions, Facebook interview questions 2026, Meta SDE interview, Meta coding questions",
    },
  },
  {
    slug: "deloitte",
    name: "Deloitte",
    shortName: "Deloitte",
    logo: "🟢",
    color: "from-green-600 to-green-800",
    accent: "text-green-600",
    bgAccent: "bg-green-50 dark:bg-green-950/30",
    founded: "1845",
    headquarters: "London, UK",
    employees: "4,15,000+",
    description: "Deloitte is one of the Big Four professional services networks, offering audit, consulting, tax, and advisory services worldwide.",
    interviewRounds: ["Aptitude Test", "Group Discussion", "Technical Interview", "HR Interview"],
    avgPackage: "₹6 – ₹12 LPA (Fresher)",
    seo: {
      title: "Deloitte Interview Questions 2026 | Consulting & Tech | MedhaHub",
      description: "Deloitte interview questions for USI, consulting, and technology roles. Aptitude, case study, and HR round preparation.",
      keywords: "Deloitte interview questions 2026, Deloitte USI interview, Deloitte placement preparation",
    },
  },
  {
    slug: "ibm",
    name: "IBM",
    shortName: "IBM",
    logo: "💎",
    color: "from-blue-700 to-blue-900",
    accent: "text-blue-700",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "1911",
    headquarters: "Armonk, USA",
    employees: "2,80,000+",
    description: "IBM is a pioneering technology and consulting company focused on hybrid cloud, AI, and quantum computing solutions.",
    interviewRounds: ["Online Assessment", "Technical Interview", "Managerial Interview", "HR Interview"],
    avgPackage: "₹4.5 – ₹12 LPA (Fresher)",
    seo: {
      title: "IBM Interview Questions 2026 | Associate, Band 6 Roles | MedhaHub",
      description: "IBM interview questions and answers for freshers & experienced. Practice technical, coding, and HR questions.",
      keywords: "IBM interview questions, IBM technical interview 2026, IBM placement questions, IBM India hiring",
    },
  },
  {
    slug: "oracle",
    name: "Oracle",
    shortName: "Oracle",
    logo: "🔴",
    color: "from-red-600 to-red-800",
    accent: "text-red-600",
    bgAccent: "bg-red-50 dark:bg-red-950/30",
    founded: "1977",
    headquarters: "Austin, USA",
    employees: "1,60,000+",
    description: "Oracle is a global cloud and enterprise software company known for its database technologies, ERP, and cloud infrastructure.",
    interviewRounds: ["Online Test", "Technical Interview (2 rounds)", "HR Interview"],
    avgPackage: "₹12 – ₹25 LPA",
    seo: {
      title: "Oracle Interview Questions 2026 | SDE, Database & Cloud | MedhaHub",
      description: "Oracle interview questions for SDE and application developer roles. SQL, Java, and system design questions.",
      keywords: "Oracle interview questions, Oracle SDE interview 2026, Oracle technical questions, Oracle placement",
    },
  },
  {
    slug: "samsung",
    name: "Samsung R&D",
    shortName: "Samsung",
    logo: "📱",
    color: "from-blue-500 to-indigo-700",
    accent: "text-blue-500",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "1938",
    headquarters: "Seoul, South Korea",
    employees: "2,70,000+",
    description: "Samsung R&D Institute India is the largest R&D center outside Korea, focusing on mobile, AI, and semiconductor technologies.",
    interviewRounds: ["Samsung Coding Test (3 hours)", "Technical Interview (2 rounds)", "HR Interview"],
    avgPackage: "₹14 – ₹25 LPA",
    seo: {
      title: "Samsung R&D Interview Questions 2026 | Coding Test & Technical | MedhaHub",
      description: "Samsung R&D interview questions. Practice coding test problems and technical interview questions for SRI roles.",
      keywords: "Samsung interview questions, Samsung R&D coding test, Samsung SRI interview 2026, Samsung placement",
    },
  },
  {
    slug: "flipkart",
    name: "Flipkart",
    shortName: "Flipkart",
    logo: "🛒",
    color: "from-yellow-500 to-blue-600",
    accent: "text-yellow-600",
    bgAccent: "bg-yellow-50 dark:bg-yellow-950/30",
    founded: "2007",
    headquarters: "Bengaluru, India",
    employees: "50,000+",
    description: "Flipkart is India's leading e-commerce marketplace, owned by Walmart, with massive scale in technology and logistics.",
    interviewRounds: ["Online Coding Test", "Machine Coding", "DSA Round", "System Design", "Hiring Manager"],
    avgPackage: "₹20 – ₹45 LPA",
    seo: {
      title: "Flipkart Interview Questions 2026 | SDE-1, SDE-2 | MedhaHub",
      description: "Flipkart interview questions for SDE roles. DSA, machine coding, and system design preparation guide.",
      keywords: "Flipkart interview questions, Flipkart SDE interview 2026, Flipkart coding questions",
    },
  },
  {
    slug: "zoho",
    name: "Zoho Corporation",
    shortName: "Zoho",
    logo: "🟠",
    color: "from-orange-500 to-red-600",
    accent: "text-orange-500",
    bgAccent: "bg-orange-50 dark:bg-orange-950/30",
    founded: "1996",
    headquarters: "Chennai, India",
    employees: "15,000+",
    description: "Zoho is a leading SaaS company offering 55+ business applications. Known for its unique off-campus hiring process.",
    interviewRounds: ["Aptitude Test", "Programming Round (C)", "Advanced Programming", "Technical Interview", "HR Interview"],
    avgPackage: "₹5 – ₹12 LPA",
    seo: {
      title: "Zoho Interview Questions 2026 | Programming & Aptitude | MedhaHub",
      description: "Zoho interview questions with answers. C programming, aptitude, and advanced coding round preparation.",
      keywords: "Zoho interview questions, Zoho programming round, Zoho off-campus 2026, Zoho placement preparation",
    },
  },
  {
    slug: "dxc-technology",
    name: "DXC Technology",
    shortName: "DXC",
    logo: "🟣",
    color: "from-purple-500 to-purple-700",
    accent: "text-purple-500",
    bgAccent: "bg-purple-50 dark:bg-purple-950/30",
    founded: "2017",
    headquarters: "Ashburn, USA",
    employees: "1,30,000+",
    description: "DXC Technology helps global companies run their mission-critical systems and operations while modernizing IT.",
    interviewRounds: ["Online Test", "Technical Interview", "HR Interview"],
    avgPackage: "₹3.5 – ₹6 LPA (Fresher)",
    seo: {
      title: "DXC Technology Interview Questions 2026 | Prep Guide | MedhaHub",
      description: "DXC Technology interview questions for freshers. Aptitude, technical, and HR round questions with answers.",
      keywords: "DXC Technology interview questions, DXC placement 2026, DXC technical interview",
    },
  },
  {
    slug: "lti-mindtree",
    name: "LTIMindtree",
    shortName: "LTIMindtree",
    logo: "🌿",
    color: "from-emerald-600 to-emerald-800",
    accent: "text-emerald-600",
    bgAccent: "bg-emerald-50 dark:bg-emerald-950/30",
    founded: "2022",
    headquarters: "Mumbai, India",
    employees: "84,000+",
    description: "LTIMindtree is a global technology consulting and digital solutions company born from the merger of LTI and Mindtree.",
    interviewRounds: ["Online Test", "Technical Interview", "HR Interview"],
    avgPackage: "₹4 – ₹7 LPA (Fresher)",
    seo: {
      title: "LTIMindtree Interview Questions 2026 | Complete Guide | MedhaHub",
      description: "LTIMindtree interview questions with answers. Technical, coding, and HR round preparation for freshers.",
      keywords: "LTIMindtree interview questions, LTI Mindtree placement 2026, LTIMindtree technical interview",
    },
  },
  {
    slug: "mphasis",
    name: "Mphasis",
    shortName: "Mphasis",
    logo: "⬛",
    color: "from-gray-700 to-gray-900",
    accent: "text-gray-700",
    bgAccent: "bg-gray-50 dark:bg-gray-800/30",
    founded: "2000",
    headquarters: "Bengaluru, India",
    employees: "35,000+",
    description: "Mphasis applies next-generation design, architecture, and engineering services to deliver scalable solutions for global enterprises.",
    interviewRounds: ["Aptitude Test", "Technical Interview", "HR Interview"],
    avgPackage: "₹3.5 – ₹6 LPA (Fresher)",
    seo: {
      title: "Mphasis Interview Questions 2026 | Technical & HR | MedhaHub",
      description: "Mphasis interview questions with answers covering aptitude, technical, and HR rounds for freshers.",
      keywords: "Mphasis interview questions, Mphasis placement 2026, Mphasis technical interview",
    },
  },
  {
    slug: "infosys-bpm",
    name: "Infosys BPM",
    shortName: "Infosys BPM",
    logo: "🔷",
    color: "from-cyan-600 to-cyan-800",
    accent: "text-cyan-600",
    bgAccent: "bg-cyan-50 dark:bg-cyan-950/30",
    founded: "2002",
    headquarters: "Bengaluru, India",
    employees: "60,000+",
    description: "Infosys BPM delivers transformative outsourcing services, helping businesses optimize and transform with digital capabilities.",
    interviewRounds: ["Versant Test", "Domain Assessment", "Operations Interview", "HR Interview"],
    avgPackage: "₹2.5 – ₹5 LPA (Fresher)",
    seo: {
      title: "Infosys BPM Interview Questions 2026 | Versant & Process | MedhaHub",
      description: "Infosys BPM interview questions including Versant test prep, domain assessment, and HR questions.",
      keywords: "Infosys BPM interview questions, Infosys BPO interview, Versant test preparation 2026",
    },
  },
  {
    slug: "paypal",
    name: "PayPal",
    shortName: "PayPal",
    logo: "💳",
    color: "from-blue-500 to-indigo-600",
    accent: "text-blue-500",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "1998",
    headquarters: "San Jose, USA",
    employees: "30,000+",
    description: "PayPal is a global fintech leader making digital payments accessible and secure for millions worldwide.",
    interviewRounds: ["Online Coding Test", "Technical Phone Screen", "Onsite (3-4 rounds)", "HR Round"],
    avgPackage: "₹18 – ₹40 LPA",
    seo: {
      title: "PayPal Interview Questions 2026 | SDE & Fintech | MedhaHub",
      description: "PayPal interview questions for SDE roles. Coding, system design, and fintech-specific questions with answers.",
      keywords: "PayPal interview questions, PayPal SDE interview 2026, PayPal coding questions, PayPal India hiring",
    },
  },
  {
    slug: "uber",
    name: "Uber",
    shortName: "Uber",
    logo: "🚗",
    color: "from-gray-800 to-black",
    accent: "text-gray-800",
    bgAccent: "bg-gray-50 dark:bg-gray-800/30",
    founded: "2009",
    headquarters: "San Francisco, USA",
    employees: "30,000+",
    description: "Uber is a global mobility and delivery platform known for solving complex engineering challenges at massive scale.",
    interviewRounds: ["Phone Screen", "Coding Round (2)", "System Design", "Behavioral"],
    avgPackage: "₹30 – ₹60 LPA",
    seo: {
      title: "Uber Interview Questions 2026 | SDE & System Design | MedhaHub",
      description: "Uber interview questions for SDE roles. DSA, system design, and behavioral round preparation guide.",
      keywords: "Uber interview questions, Uber SDE interview 2026, Uber system design questions",
    },
  },
  {
    slug: "adobe",
    name: "Adobe",
    shortName: "Adobe",
    logo: "🎨",
    color: "from-red-500 to-red-700",
    accent: "text-red-500",
    bgAccent: "bg-red-50 dark:bg-red-950/30",
    founded: "1982",
    headquarters: "San Jose, USA",
    employees: "30,000+",
    description: "Adobe is a global leader in digital media and marketing solutions, known for Creative Cloud, Document Cloud, and Experience Cloud.",
    interviewRounds: ["Online Coding Test", "Technical Interviews (3 rounds)", "Hiring Manager"],
    avgPackage: "₹20 – ₹45 LPA",
    seo: {
      title: "Adobe Interview Questions 2026 | MTS & SDE Roles | MedhaHub",
      description: "Adobe interview questions for MTS and SDE roles. Coding, system design, and problem-solving questions.",
      keywords: "Adobe interview questions, Adobe MTS interview 2026, Adobe coding questions, Adobe India hiring",
    },
  },
  {
    slug: "atlassian",
    name: "Atlassian",
    shortName: "Atlassian",
    logo: "🔵",
    color: "from-blue-600 to-blue-800",
    accent: "text-blue-600",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "2002",
    headquarters: "Sydney, Australia",
    employees: "12,000+",
    description: "Atlassian builds collaboration tools like Jira, Confluence, and Trello that power modern software teams.",
    interviewRounds: ["Karat Coding Screen", "Values Interview", "Technical Interviews (2)", "Hiring Manager"],
    avgPackage: "₹35 – ₹65 LPA",
    seo: {
      title: "Atlassian Interview Questions 2026 | Values & DSA | MedhaHub",
      description: "Atlassian interview questions including values interview, coding, and system design round preparation.",
      keywords: "Atlassian interview questions, Atlassian values interview 2026, Atlassian coding questions",
    },
  },
  {
    slug: "goldman-sachs",
    name: "Goldman Sachs",
    shortName: "Goldman Sachs",
    logo: "🏦",
    color: "from-blue-800 to-gray-900",
    accent: "text-blue-800",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "1869",
    headquarters: "New York, USA",
    employees: "45,000+",
    description: "Goldman Sachs is a leading global investment banking and financial services firm with a major engineering division in India.",
    interviewRounds: ["HackerRank Coding Test", "Coderpad Interview", "Technical Interviews (2-3)", "Hiring Manager"],
    avgPackage: "₹18 – ₹40 LPA",
    seo: {
      title: "Goldman Sachs Interview Questions 2026 | Engineering & Analyst | MedhaHub",
      description: "Goldman Sachs interview questions for engineering and analyst roles. DSA, system design & problem-solving prep.",
      keywords: "Goldman Sachs interview questions, Goldman Sachs engineering interview 2026, GS coding test",
    },
  },
  {
    slug: "jpmorgan",
    name: "JPMorgan Chase",
    shortName: "JPMorgan",
    logo: "🏛️",
    color: "from-blue-700 to-blue-900",
    accent: "text-blue-700",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "2000",
    headquarters: "New York, USA",
    employees: "3,00,000+",
    description: "JPMorgan Chase is the largest bank in the US with a massive technology division and strong campus hiring in India.",
    interviewRounds: ["Code for Good Hackathon / Online Test", "Technical Interviews (2)", "HR Interview"],
    avgPackage: "₹12 – ₹25 LPA",
    seo: {
      title: "JPMorgan Interview Questions 2026 | SDE & Code for Good | MedhaHub",
      description: "JPMorgan Chase interview questions. Code for Good hackathon, technical interview, and HR round preparation.",
      keywords: "JPMorgan interview questions, JPMorgan Code for Good, JPMC SDE interview 2026",
    },
  },
  {
    slug: "swiggy",
    name: "Swiggy",
    shortName: "Swiggy",
    logo: "🍔",
    color: "from-orange-500 to-orange-700",
    accent: "text-orange-500",
    bgAccent: "bg-orange-50 dark:bg-orange-950/30",
    founded: "2014",
    headquarters: "Bengaluru, India",
    employees: "10,000+",
    description: "Swiggy is India's largest food delivery platform, solving complex logistics and recommendation problems at scale.",
    interviewRounds: ["Online Coding Test", "Machine Coding", "DSA + System Design", "Hiring Manager"],
    avgPackage: "₹20 – ₹40 LPA",
    seo: {
      title: "Swiggy Interview Questions 2026 | SDE & Backend | MedhaHub",
      description: "Swiggy interview questions for SDE roles. Machine coding, system design, and DSA preparation.",
      keywords: "Swiggy interview questions, Swiggy SDE interview 2026, Swiggy coding questions",
    },
  },
  {
    slug: "zomato",
    name: "Zomato",
    shortName: "Zomato",
    logo: "🍕",
    color: "from-red-500 to-red-700",
    accent: "text-red-500",
    bgAccent: "bg-red-50 dark:bg-red-950/30",
    founded: "2008",
    headquarters: "Gurugram, India",
    employees: "5,000+",
    description: "Zomato is a leading food-tech platform in India, tackling challenges in search, discovery, logistics, and hyperlocal commerce.",
    interviewRounds: ["Coding Test", "Machine Coding Round", "System Design", "Cultural Fit"],
    avgPackage: "₹18 – ₹35 LPA",
    seo: {
      title: "Zomato Interview Questions 2026 | SDE Preparation | MedhaHub",
      description: "Zomato interview questions for SDE roles. Practice coding, machine coding, and system design questions.",
      keywords: "Zomato interview questions, Zomato SDE interview 2026, Zomato coding questions",
    },
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    shortName: "Razorpay",
    logo: "💰",
    color: "from-blue-600 to-indigo-700",
    accent: "text-blue-600",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "2014",
    headquarters: "Bengaluru, India",
    employees: "3,000+",
    description: "Razorpay is India's leading fintech unicorn providing payment solutions for businesses of all sizes.",
    interviewRounds: ["Coding Test", "DSA Round", "System Design", "Culture Round"],
    avgPackage: "₹20 – ₹45 LPA",
    seo: {
      title: "Razorpay Interview Questions 2026 | Fintech SDE | MedhaHub",
      description: "Razorpay interview questions for SDE roles. Coding, system design, and fintech domain questions.",
      keywords: "Razorpay interview questions, Razorpay SDE interview 2026, Razorpay coding questions",
    },
  },
  {
    slug: "meesho",
    name: "Meesho",
    shortName: "Meesho",
    logo: "🛍️",
    color: "from-pink-500 to-pink-700",
    accent: "text-pink-500",
    bgAccent: "bg-pink-50 dark:bg-pink-950/30",
    founded: "2015",
    headquarters: "Bengaluru, India",
    employees: "2,000+",
    description: "Meesho is India's fastest-growing e-commerce platform focused on democratizing internet commerce for everyone.",
    interviewRounds: ["Coding Assessment", "Machine Coding", "System Design", "Hiring Manager"],
    avgPackage: "₹22 – ₹50 LPA",
    seo: {
      title: "Meesho Interview Questions 2026 | SDE Prep | MedhaHub",
      description: "Meesho interview questions for SDE roles. Machine coding, DSA, and system design preparation.",
      keywords: "Meesho interview questions, Meesho SDE interview 2026, Meesho coding questions",
    },
  },
  {
    slug: "phonepe",
    name: "PhonePe",
    shortName: "PhonePe",
    logo: "📲",
    color: "from-purple-600 to-indigo-700",
    accent: "text-purple-600",
    bgAccent: "bg-purple-50 dark:bg-purple-950/30",
    founded: "2015",
    headquarters: "Bengaluru, India",
    employees: "5,000+",
    description: "PhonePe is India's leading digital payments platform processing billions of UPI transactions monthly.",
    interviewRounds: ["Online Coding Test", "DSA Rounds (2)", "System Design", "Hiring Manager"],
    avgPackage: "₹22 – ₹45 LPA",
    seo: {
      title: "PhonePe Interview Questions 2026 | SDE & Backend | MedhaHub",
      description: "PhonePe interview questions. DSA, system design, and backend engineering preparation for SDE roles.",
      keywords: "PhonePe interview questions, PhonePe SDE interview 2026, PhonePe coding questions",
    },
  },
  {
    slug: "cred",
    name: "CRED",
    shortName: "CRED",
    logo: "💎",
    color: "from-gray-800 to-black",
    accent: "text-gray-800",
    bgAccent: "bg-gray-50 dark:bg-gray-800/30",
    founded: "2018",
    headquarters: "Bengaluru, India",
    employees: "1,000+",
    description: "CRED is a fintech platform for creditworthy individuals, known for its premium engineering culture and high hiring bar.",
    interviewRounds: ["Coding Test", "Machine Coding", "System Design", "Culture Fit", "Founder Round"],
    avgPackage: "₹30 – ₹60 LPA",
    seo: {
      title: "CRED Interview Questions 2026 | SDE Preparation | MedhaHub",
      description: "CRED interview questions for SDE roles. Machine coding, system design, and culture fit round preparation.",
      keywords: "CRED interview questions, CRED SDE interview 2026, CRED coding questions",
    },
  },
  {
    slug: "ola",
    name: "Ola (ANI Technologies)",
    shortName: "Ola",
    logo: "🚕",
    color: "from-green-600 to-green-800",
    accent: "text-green-600",
    bgAccent: "bg-green-50 dark:bg-green-950/30",
    founded: "2010",
    headquarters: "Bengaluru, India",
    employees: "8,000+",
    description: "Ola is India's largest mobility platform, building technology for ride-hailing, electric vehicles, and fintech.",
    interviewRounds: ["Online Coding Test", "DSA Round", "System Design", "Hiring Manager"],
    avgPackage: "₹15 – ₹35 LPA",
    seo: {
      title: "Ola Interview Questions 2026 | SDE & Backend | MedhaHub",
      description: "Ola interview questions for SDE roles. DSA, system design, and backend engineering preparation.",
      keywords: "Ola interview questions, Ola SDE interview 2026, Ola coding questions",
    },
  },
  {
    slug: "paytm",
    name: "Paytm (One97 Communications)",
    shortName: "Paytm",
    logo: "💙",
    color: "from-blue-500 to-blue-700",
    accent: "text-blue-500",
    bgAccent: "bg-blue-50 dark:bg-blue-950/30",
    founded: "2010",
    headquarters: "Noida, India",
    employees: "9,000+",
    description: "Paytm is India's leading digital ecosystem for consumers and merchants, offering payments, commerce, and financial services.",
    interviewRounds: ["Online Test", "Technical Rounds (2)", "Hiring Manager", "HR Round"],
    avgPackage: "₹12 – ₹30 LPA",
    seo: {
      title: "Paytm Interview Questions 2026 | SDE & Fintech | MedhaHub",
      description: "Paytm interview questions for SDE and fintech roles. Coding, system design, and HR round preparation.",
      keywords: "Paytm interview questions, Paytm SDE interview 2026, Paytm coding questions",
    },
  },
  {
    slug: "myntra",
    name: "Myntra",
    shortName: "Myntra",
    logo: "👗",
    color: "from-pink-500 to-rose-600",
    accent: "text-pink-500",
    bgAccent: "bg-pink-50 dark:bg-pink-950/30",
    founded: "2007",
    headquarters: "Bengaluru, India",
    employees: "5,000+",
    description: "Myntra is India's largest fashion e-commerce platform, a subsidiary of Flipkart Group focused on style tech.",
    interviewRounds: ["Coding Assessment", "Machine Coding", "System Design", "Hiring Manager"],
    avgPackage: "₹18 – ₹40 LPA",
    seo: {
      title: "Myntra Interview Questions 2026 | SDE Prep | MedhaHub",
      description: "Myntra interview questions for SDE roles. Machine coding, DSA, and system design preparation.",
      keywords: "Myntra interview questions, Myntra SDE interview 2026, Myntra coding questions",
    },
  },
  {
    slug: "juspay",
    name: "Juspay",
    shortName: "Juspay",
    logo: "🔐",
    color: "from-indigo-600 to-indigo-800",
    accent: "text-indigo-600",
    bgAccent: "bg-indigo-50 dark:bg-indigo-950/30",
    founded: "2012",
    headquarters: "Bengaluru, India",
    employees: "1,500+",
    description: "Juspay powers payment experiences for major apps in India including Amazon, Flipkart, and Swiggy.",
    interviewRounds: ["Coding Test", "Functional Programming Round", "System Design", "HR Round"],
    avgPackage: "₹15 – ₹35 LPA",
    seo: {
      title: "Juspay Interview Questions 2026 | SDE & Payments | MedhaHub",
      description: "Juspay interview questions for SDE roles. Functional programming, DSA, and system design preparation.",
      keywords: "Juspay interview questions, Juspay SDE interview 2026, Juspay coding questions",
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BATCH 2 — 162 additional actively-hiring companies (total → 200)
  // ══════════════════════════════════════════════════════════════════════════

  // ── IT Services & Consulting ──────────────────────────────────────────────
  ...([
    { slug: "ey", name: "Ernst & Young", shortName: "EY", logo: "🟡", color: "from-yellow-600 to-yellow-800", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "1989", headquarters: "London, UK", employees: "3,95,000+", description: "EY is a global leader in assurance, tax, transaction, and advisory services.", interviewRounds: ["Aptitude Test", "Group Discussion", "Technical Interview", "HR Interview"], avgPackage: "₹6 – ₹12 LPA", seo: { title: "EY Interview Questions 2026 | Consulting & Tech | MedhaHub", description: "EY interview questions for consulting, technology, and advisory roles with expert answers.", keywords: "EY interview questions 2026, Ernst Young interview preparation" } },
    { slug: "kpmg", name: "KPMG", shortName: "KPMG", logo: "🔷", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1987", headquarters: "Amstelveen, Netherlands", employees: "2,65,000+", description: "KPMG provides audit, tax, and advisory services to organizations globally.", interviewRounds: ["Online Assessment", "Case Study", "Technical Interview", "Partner Interview"], avgPackage: "₹6 – ₹14 LPA", seo: { title: "KPMG Interview Questions 2026 | Audit & Advisory | MedhaHub", description: "KPMG interview questions for audit, tax, and consulting roles.", keywords: "KPMG interview questions 2026, KPMG consulting interview" } },
    { slug: "pwc", name: "PricewaterhouseCoopers", shortName: "PwC", logo: "🟠", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "1998", headquarters: "London, UK", employees: "3,28,000+", description: "PwC is one of the Big Four accounting firms offering audit, assurance, and consulting services.", interviewRounds: ["Online Test", "Group Discussion", "Case Interview", "HR Interview"], avgPackage: "₹6 – ₹13 LPA", seo: { title: "PwC Interview Questions 2026 | Consulting & Audit | MedhaHub", description: "PwC interview questions for consulting, audit, and technology roles.", keywords: "PwC interview questions 2026, PricewaterhouseCoopers interview" } },
    { slug: "mckinsey", name: "McKinsey & Company", shortName: "McKinsey", logo: "🔵", color: "from-blue-800 to-slate-900", accent: "text-blue-800", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1926", headquarters: "New York, USA", employees: "45,000+", description: "McKinsey is the world's most prestigious management consulting firm.", interviewRounds: ["Problem Solving Test", "Case Interview (2-3 rounds)", "Experience Interview", "Partner Interview"], avgPackage: "₹25 – ₹50 LPA", seo: { title: "McKinsey Interview Questions 2026 | Case & Problem Solving | MedhaHub", description: "McKinsey interview questions with case study frameworks and problem-solving strategies.", keywords: "McKinsey interview questions 2026, McKinsey case interview" } },
    { slug: "bcg", name: "Boston Consulting Group", shortName: "BCG", logo: "🟢", color: "from-green-700 to-green-900", accent: "text-green-700", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1963", headquarters: "Boston, USA", employees: "32,000+", description: "BCG is a global management consulting firm and one of the Big Three.", interviewRounds: ["Online Case", "Case Interview (2-3 rounds)", "Behavioral Interview"], avgPackage: "₹22 – ₹45 LPA", seo: { title: "BCG Interview Questions 2026 | Consulting Case Studies | MedhaHub", description: "BCG interview questions with case frameworks for consulting roles.", keywords: "BCG interview questions 2026, Boston Consulting Group interview" } },
    { slug: "bain", name: "Bain & Company", shortName: "Bain", logo: "🔴", color: "from-red-700 to-red-900", accent: "text-red-700", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1973", headquarters: "Boston, USA", employees: "18,000+", description: "Bain & Company is a top-3 global management consulting firm known for results delivery.", interviewRounds: ["Written Case", "Case Interview", "Experience Interview", "Partner Round"], avgPackage: "₹22 – ₹40 LPA", seo: { title: "Bain Interview Questions 2026 | MBB Consulting | MedhaHub", description: "Bain & Company interview questions for management consulting roles.", keywords: "Bain interview questions 2026, Bain consulting interview" } },
    { slug: "atos", name: "Atos", shortName: "Atos", logo: "🔵", color: "from-blue-600 to-cyan-700", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1997", headquarters: "Bezons, France", employees: "1,10,000+", description: "Atos is a global IT services company specializing in digital transformation and cybersecurity.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹3.5 – ₹8 LPA", seo: { title: "Atos Interview Questions 2026 | IT Services | MedhaHub", description: "Atos interview questions for IT services and digital transformation roles.", keywords: "Atos interview questions 2026, Atos technical interview" } },
    { slug: "ntt-data", name: "NTT DATA", shortName: "NTT DATA", logo: "🔷", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1988", headquarters: "Tokyo, Japan", employees: "1,95,000+", description: "NTT DATA is a global IT services provider offering consulting, digital, and cloud solutions.", interviewRounds: ["Aptitude Test", "Technical Interview", "Managerial Round", "HR Interview"], avgPackage: "₹4 – ₹10 LPA", seo: { title: "NTT DATA Interview Questions 2026 | IT Consulting | MedhaHub", description: "NTT DATA interview questions for IT consulting and technology roles.", keywords: "NTT DATA interview questions 2026, NTT DATA technical interview" } },
    { slug: "hexaware", name: "Hexaware Technologies", shortName: "Hexaware", logo: "🟣", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "1990", headquarters: "Mumbai, India", employees: "30,000+", description: "Hexaware is an IT services company focused on automation and cloud services.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹3.5 – ₹7 LPA", seo: { title: "Hexaware Interview Questions 2026 | IT & Cloud | MedhaHub", description: "Hexaware interview questions for IT services and cloud roles.", keywords: "Hexaware interview questions 2026, Hexaware technical interview" } },
    { slug: "persistent", name: "Persistent Systems", shortName: "Persistent", logo: "🟢", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1990", headquarters: "Pune, India", employees: "23,000+", description: "Persistent Systems delivers digital engineering and enterprise modernization solutions.", interviewRounds: ["Coding Test", "Technical Interview", "HR Interview"], avgPackage: "₹4.5 – ₹9 LPA", seo: { title: "Persistent Systems Interview Questions 2026 | MedhaHub", description: "Persistent Systems interview questions for software engineering roles.", keywords: "Persistent Systems interview questions 2026, Persistent technical interview" } },
    { slug: "larsen-toubro-infotech", name: "L&T Technology Services", shortName: "LTTS", logo: "🔵", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2012", headquarters: "Mumbai, India", employees: "23,600+", description: "LTTS is a global leader in engineering R&D services across multiple industries.", interviewRounds: ["Aptitude Test", "Technical Interview", "HR Interview"], avgPackage: "₹4 – ₹8 LPA", seo: { title: "LTTS Interview Questions 2026 | Engineering & Tech | MedhaHub", description: "L&T Technology Services interview questions for engineering and tech roles.", keywords: "LTTS interview questions 2026, L&T Technology Services interview" } },
    { slug: "birlasoft", name: "Birlasoft", shortName: "Birlasoft", logo: "🟡", color: "from-amber-600 to-amber-800", accent: "text-amber-600", bgAccent: "bg-amber-50 dark:bg-amber-950/30", founded: "1990", headquarters: "Noida, India", employees: "13,500+", description: "Birlasoft provides enterprise digital and IT services with a focus on industry-specific solutions.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹3.5 – ₹7 LPA", seo: { title: "Birlasoft Interview Questions 2026 | IT Services | MedhaHub", description: "Birlasoft interview questions for IT services roles.", keywords: "Birlasoft interview questions 2026" } },
    { slug: "coforge", name: "Coforge", shortName: "Coforge", logo: "🟠", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "1992", headquarters: "Noida, India", employees: "26,000+", description: "Coforge (formerly NIIT Technologies) is a global IT solutions company specializing in travel, insurance, and banking.", interviewRounds: ["Aptitude Test", "Technical Interview", "HR Interview"], avgPackage: "₹4 – ₹9 LPA", seo: { title: "Coforge Interview Questions 2026 | IT Solutions | MedhaHub", description: "Coforge interview questions for IT solutions and consulting roles.", keywords: "Coforge interview questions 2026, NIIT Technologies interview" } },
    { slug: "zensar", name: "Zensar Technologies", shortName: "Zensar", logo: "🔴", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1991", headquarters: "Pune, India", employees: "11,500+", description: "Zensar Technologies delivers digital solutions and technology services to global enterprises.", interviewRounds: ["Online Test", "Technical Round", "HR Round"], avgPackage: "₹3.5 – ₹7 LPA", seo: { title: "Zensar Interview Questions 2026 | Digital Solutions | MedhaHub", description: "Zensar Technologies interview questions for IT roles.", keywords: "Zensar interview questions 2026" } },
    { slug: "cyient", name: "Cyient", shortName: "Cyient", logo: "🟢", color: "from-teal-600 to-teal-800", accent: "text-teal-600", bgAccent: "bg-teal-50 dark:bg-teal-950/30", founded: "1991", headquarters: "Hyderabad, India", employees: "15,000+", description: "Cyient is an engineering, manufacturing, and technology solutions company.", interviewRounds: ["Aptitude Test", "Technical Interview", "HR Interview"], avgPackage: "₹3.5 – ₹7 LPA", seo: { title: "Cyient Interview Questions 2026 | Engineering & Tech | MedhaHub", description: "Cyient interview questions for engineering and technology roles.", keywords: "Cyient interview questions 2026" } },
    { slug: "mindtree", name: "Mindtree", shortName: "Mindtree", logo: "🌿", color: "from-green-500 to-emerald-700", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1999", headquarters: "Bengaluru, India", employees: "38,000+", description: "Mindtree (now part of LTIMindtree) delivers technology services and digital transformation.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹4 – ₹8 LPA", seo: { title: "Mindtree Interview Questions 2026 | IT Services | MedhaHub", description: "Mindtree interview questions for IT and digital transformation roles.", keywords: "Mindtree interview questions 2026, LTIMindtree interview" } },
    { slug: "sonata-software", name: "Sonata Software", shortName: "Sonata", logo: "🎵", color: "from-sky-600 to-sky-800", accent: "text-sky-600", bgAccent: "bg-sky-50 dark:bg-sky-950/30", founded: "1994", headquarters: "Bengaluru, India", employees: "6,500+", description: "Sonata Software is a global IT services company specializing in platform-based digital transformation.", interviewRounds: ["Technical Interview", "Managerial Round", "HR Interview"], avgPackage: "₹4 – ₹8 LPA", seo: { title: "Sonata Software Interview Questions 2026 | MedhaHub", description: "Sonata Software interview questions for IT roles.", keywords: "Sonata Software interview questions 2026" } },
    { slug: "sopra-steria", name: "Sopra Steria", shortName: "Sopra Steria", logo: "🔴", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2014", headquarters: "Paris, France", employees: "56,000+", description: "Sopra Steria is a European leader in digital transformation consulting and services.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹3.5 – ₹7 LPA", seo: { title: "Sopra Steria Interview Questions 2026 | MedhaHub", description: "Sopra Steria interview questions for IT consulting roles.", keywords: "Sopra Steria interview questions 2026" } },
    { slug: "virtusa", name: "Virtusa", shortName: "Virtusa", logo: "🔵", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1996", headquarters: "Hyderabad, India", employees: "30,000+", description: "Virtusa provides digital engineering and IT outsourcing services globally.", interviewRounds: ["Coding Test", "Technical Interview", "HR Interview"], avgPackage: "₹4 – ₹9 LPA", seo: { title: "Virtusa Interview Questions 2026 | Digital Engineering | MedhaHub", description: "Virtusa interview questions for software and digital engineering roles.", keywords: "Virtusa interview questions 2026" } },
    { slug: "tata-elxsi", name: "Tata Elxsi", shortName: "Tata Elxsi", logo: "🔵", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1989", headquarters: "Bengaluru, India", employees: "12,000+", description: "Tata Elxsi is a design and technology company focused on automotive, media, and healthcare.", interviewRounds: ["Aptitude Test", "Technical Interview", "HR Interview"], avgPackage: "₹5 – ₹10 LPA", seo: { title: "Tata Elxsi Interview Questions 2026 | Design & Tech | MedhaHub", description: "Tata Elxsi interview questions for design and technology roles.", keywords: "Tata Elxsi interview questions 2026" } },
    { slug: "musigma", name: "Mu Sigma", shortName: "Mu Sigma", logo: "📊", color: "from-cyan-600 to-cyan-800", accent: "text-cyan-600", bgAccent: "bg-cyan-50 dark:bg-cyan-950/30", founded: "2004", headquarters: "Bengaluru, India", employees: "4,000+", description: "Mu Sigma is a decision sciences and analytics company.", interviewRounds: ["Aptitude Test", "Case Study", "Group Discussion", "HR Interview"], avgPackage: "₹4.5 – ₹6 LPA", seo: { title: "Mu Sigma Interview Questions 2026 | Analytics | MedhaHub", description: "Mu Sigma interview questions for analytics and decision science roles.", keywords: "Mu Sigma interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Product / FAANG / Big Tech ─────────────────────────────────────────────
  ...([
    { slug: "apple", name: "Apple Inc.", shortName: "Apple", logo: "🍎", color: "from-gray-700 to-gray-900", accent: "text-gray-700", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "1976", headquarters: "Cupertino, USA", employees: "1,64,000+", description: "Apple designs and manufactures consumer electronics, software, and online services.", interviewRounds: ["Phone Screen", "Technical Interview (2-3)", "System Design", "Behavioral Interview"], avgPackage: "₹25 – ₹60 LPA", seo: { title: "Apple Interview Questions 2026 | Software & Hardware | MedhaHub", description: "Apple interview questions for software engineering, hardware, and design roles.", keywords: "Apple interview questions 2026, Apple SDE interview" } },
    { slug: "netflix", name: "Netflix", shortName: "Netflix", logo: "🎬", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1997", headquarters: "Los Gatos, USA", employees: "13,000+", description: "Netflix is the world's leading streaming entertainment service.", interviewRounds: ["Phone Screen", "Coding Interview", "System Design", "Culture Fit"], avgPackage: "₹40 – ₹80 LPA", seo: { title: "Netflix Interview Questions 2026 | Software Engineering | MedhaHub", description: "Netflix interview questions for engineering and product roles.", keywords: "Netflix interview questions 2026, Netflix SDE interview" } },
    { slug: "salesforce", name: "Salesforce", shortName: "Salesforce", logo: "☁️", color: "from-sky-500 to-blue-700", accent: "text-sky-600", bgAccent: "bg-sky-50 dark:bg-sky-950/30", founded: "1999", headquarters: "San Francisco, USA", employees: "79,000+", description: "Salesforce is the world's #1 CRM platform.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral Round"], avgPackage: "₹18 – ₹45 LPA", seo: { title: "Salesforce Interview Questions 2026 | CRM & Cloud | MedhaHub", description: "Salesforce interview questions for engineering and admin roles.", keywords: "Salesforce interview questions 2026, Salesforce developer interview" } },
    { slug: "linkedin", name: "LinkedIn", shortName: "LinkedIn", logo: "💼", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2002", headquarters: "Sunnyvale, USA", employees: "21,000+", description: "LinkedIn is the world's largest professional network owned by Microsoft.", interviewRounds: ["Online Assessment", "Phone Screen", "On-site (3-4 rounds)", "System Design"], avgPackage: "₹25 – ₹55 LPA", seo: { title: "LinkedIn Interview Questions 2026 | SDE | MedhaHub", description: "LinkedIn interview questions for software engineering roles.", keywords: "LinkedIn interview questions 2026, LinkedIn SDE interview" } },
    { slug: "twitter", name: "X (Twitter)", shortName: "X", logo: "✖️", color: "from-gray-800 to-gray-950", accent: "text-gray-800", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2006", headquarters: "San Francisco, USA", employees: "2,000+", description: "X (formerly Twitter) is a social media platform for real-time communication.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹25 – ₹50 LPA", seo: { title: "X (Twitter) Interview Questions 2026 | MedhaHub", description: "X/Twitter interview questions for engineering roles.", keywords: "Twitter interview questions 2026, X interview questions" } },
    { slug: "spotify", name: "Spotify", shortName: "Spotify", logo: "🎵", color: "from-green-500 to-green-700", accent: "text-green-500", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2006", headquarters: "Stockholm, Sweden", employees: "10,000+", description: "Spotify is the world's most popular audio streaming platform.", interviewRounds: ["Phone Screen", "Technical Interview", "System Design", "Values Interview"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Spotify Interview Questions 2026 | Engineering | MedhaHub", description: "Spotify interview questions for engineering and product roles.", keywords: "Spotify interview questions 2026" } },
    { slug: "airbnb", name: "Airbnb", shortName: "Airbnb", logo: "🏠", color: "from-rose-500 to-rose-700", accent: "text-rose-500", bgAccent: "bg-rose-50 dark:bg-rose-950/30", founded: "2008", headquarters: "San Francisco, USA", employees: "6,900+", description: "Airbnb is a global marketplace for lodging and travel experiences.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Cross-functional"], avgPackage: "₹25 – ₹55 LPA", seo: { title: "Airbnb Interview Questions 2026 | Engineering | MedhaHub", description: "Airbnb interview questions for software engineering and product roles.", keywords: "Airbnb interview questions 2026" } },
    { slug: "snap", name: "Snap Inc.", shortName: "Snap", logo: "👻", color: "from-yellow-400 to-yellow-600", accent: "text-yellow-500", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2011", headquarters: "Santa Monica, USA", employees: "5,300+", description: "Snap is the parent company of Snapchat, the visual messaging app.", interviewRounds: ["Online Assessment", "Phone Screen", "On-site (3-4 rounds)"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "Snap Interview Questions 2026 | MedhaHub", description: "Snap Inc interview questions for engineering roles.", keywords: "Snap interview questions 2026, Snapchat interview" } },
    { slug: "stripe", name: "Stripe", shortName: "Stripe", logo: "💳", color: "from-indigo-500 to-purple-700", accent: "text-indigo-600", bgAccent: "bg-indigo-50 dark:bg-indigo-950/30", founded: "2010", headquarters: "San Francisco, USA", employees: "8,000+", description: "Stripe builds economic infrastructure for the internet — payments APIs used by millions of companies.", interviewRounds: ["Phone Screen", "Coding (Bug Squash)", "System Design", "Collaboration"], avgPackage: "₹30 – ₹60 LPA", seo: { title: "Stripe Interview Questions 2026 | Payments | MedhaHub", description: "Stripe interview questions for engineering and payments roles.", keywords: "Stripe interview questions 2026, Stripe SDE interview" } },
    { slug: "shopify", name: "Shopify", shortName: "Shopify", logo: "🛍️", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2006", headquarters: "Ottawa, Canada", employees: "11,600+", description: "Shopify is a leading e-commerce platform powering millions of online stores.", interviewRounds: ["Phone Screen", "Coding Challenge", "Technical Interview", "Life Story Interview"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Shopify Interview Questions 2026 | E-commerce | MedhaHub", description: "Shopify interview questions for engineering and product roles.", keywords: "Shopify interview questions 2026" } },
    { slug: "databricks", name: "Databricks", shortName: "Databricks", logo: "🧱", color: "from-red-500 to-orange-600", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2013", headquarters: "San Francisco, USA", employees: "7,000+", description: "Databricks provides a unified analytics platform for data engineering and AI.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹30 – ₹60 LPA", seo: { title: "Databricks Interview Questions 2026 | Data & AI | MedhaHub", description: "Databricks interview questions for data engineering and AI roles.", keywords: "Databricks interview questions 2026" } },
    { slug: "snowflake", name: "Snowflake", shortName: "Snowflake", logo: "❄️", color: "from-cyan-500 to-blue-600", accent: "text-cyan-500", bgAccent: "bg-cyan-50 dark:bg-cyan-950/30", founded: "2012", headquarters: "Bozeman, USA", employees: "7,000+", description: "Snowflake provides a cloud-based data warehousing platform.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹25 – ₹55 LPA", seo: { title: "Snowflake Interview Questions 2026 | Data Cloud | MedhaHub", description: "Snowflake interview questions for engineering and data roles.", keywords: "Snowflake interview questions 2026" } },
    { slug: "palantir", name: "Palantir Technologies", shortName: "Palantir", logo: "👁️", color: "from-slate-700 to-slate-900", accent: "text-slate-700", bgAccent: "bg-slate-50 dark:bg-slate-950/30", founded: "2003", headquarters: "Denver, USA", employees: "3,800+", description: "Palantir builds software platforms for data-driven operations and intelligence.", interviewRounds: ["Online Assessment", "Phone Screen", "On-site (Decomposition)", "Behavioral"], avgPackage: "₹25 – ₹50 LPA", seo: { title: "Palantir Interview Questions 2026 | MedhaHub", description: "Palantir interview questions for forward deployed and SDE roles.", keywords: "Palantir interview questions 2026" } },
    { slug: "vmware", name: "VMware (Broadcom)", shortName: "VMware", logo: "☁️", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1998", headquarters: "Palo Alto, USA", employees: "38,000+", description: "VMware is a global leader in cloud infrastructure and virtualization technology.", interviewRounds: ["Online Test", "Technical Interview (2 rounds)", "System Design", "HR Interview"], avgPackage: "₹12 – ₹30 LPA", seo: { title: "VMware Interview Questions 2026 | Cloud & Infra | MedhaHub", description: "VMware interview questions for cloud and infrastructure roles.", keywords: "VMware interview questions 2026, Broadcom VMware interview" } },
    { slug: "nvidia", name: "NVIDIA", shortName: "NVIDIA", logo: "🟢", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1993", headquarters: "Santa Clara, USA", employees: "29,600+", description: "NVIDIA designs GPUs and AI computing platforms powering gaming, data centers, and autonomous vehicles.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Domain Interview"], avgPackage: "₹20 – ₹50 LPA", seo: { title: "NVIDIA Interview Questions 2026 | GPU & AI | MedhaHub", description: "NVIDIA interview questions for GPU engineering and AI roles.", keywords: "NVIDIA interview questions 2026, NVIDIA SDE interview" } },
    { slug: "intel", name: "Intel Corporation", shortName: "Intel", logo: "🔵", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1968", headquarters: "Santa Clara, USA", employees: "1,24,800+", description: "Intel is the world's largest semiconductor chip manufacturer.", interviewRounds: ["Online Test", "Technical Interview", "Design Interview", "HR Interview"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Intel Interview Questions 2026 | Semiconductor | MedhaHub", description: "Intel interview questions for hardware and software engineering roles.", keywords: "Intel interview questions 2026" } },
    { slug: "qualcomm", name: "Qualcomm", shortName: "Qualcomm", logo: "📱", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1985", headquarters: "San Diego, USA", employees: "51,000+", description: "Qualcomm develops semiconductor and wireless technology for mobile devices.", interviewRounds: ["Online Test", "Technical Interview (2 rounds)", "HR Interview"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Qualcomm Interview Questions 2026 | Mobile & Chip | MedhaHub", description: "Qualcomm interview questions for chip design and mobile tech roles.", keywords: "Qualcomm interview questions 2026" } },
    { slug: "servicenow", name: "ServiceNow", shortName: "ServiceNow", logo: "⚙️", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2004", headquarters: "Santa Clara, USA", employees: "22,000+", description: "ServiceNow is a cloud computing company specializing in IT service management.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "ServiceNow Interview Questions 2026 | SaaS | MedhaHub", description: "ServiceNow interview questions for engineering and platform roles.", keywords: "ServiceNow interview questions 2026" } },
    { slug: "sap", name: "SAP SE", shortName: "SAP", logo: "💎", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1972", headquarters: "Walldorf, Germany", employees: "1,07,000+", description: "SAP is the world's leading enterprise application and ERP software company.", interviewRounds: ["Online Assessment", "Technical Interview", "Managerial Round", "HR Interview"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "SAP Interview Questions 2026 | ERP & Enterprise | MedhaHub", description: "SAP interview questions for enterprise software and consulting roles.", keywords: "SAP interview questions 2026" } },
    { slug: "uber-india", name: "Uber India", shortName: "Uber India", logo: "🚗", color: "from-gray-800 to-gray-950", accent: "text-gray-800", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2013", headquarters: "Bengaluru, India", employees: "5,000+", description: "Uber India engineering hub works on ride-hailing technology and logistics.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹50 LPA", seo: { title: "Uber India Interview Questions 2026 | MedhaHub", description: "Uber India interview questions for SDE and platform roles.", keywords: "Uber India interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Indian Startups & Unicorns ─────────────────────────────────────────────
  ...([
    { slug: "dream11", name: "Dream11", shortName: "Dream11", logo: "🏏", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2008", headquarters: "Mumbai, India", employees: "1,500+", description: "Dream11 is India's largest fantasy sports platform with 200M+ users.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Dream11 Interview Questions 2026 | Fantasy Sports | MedhaHub", description: "Dream11 interview questions for engineering roles.", keywords: "Dream11 interview questions 2026" } },
    { slug: "groww", name: "Groww", shortName: "Groww", logo: "📈", color: "from-green-500 to-green-700", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2016", headquarters: "Bengaluru, India", employees: "3,000+", description: "Groww is India's leading investment platform for stocks, mutual funds, and digital gold.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Groww Interview Questions 2026 | Fintech | MedhaHub", description: "Groww interview questions for engineering and fintech roles.", keywords: "Groww interview questions 2026" } },
    { slug: "zerodha", name: "Zerodha", shortName: "Zerodha", logo: "📊", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2010", headquarters: "Bengaluru, India", employees: "1,800+", description: "Zerodha is India's largest stock broker by active clients.", interviewRounds: ["Technical Interview", "System Design", "Culture Fit"], avgPackage: "₹12 – ₹30 LPA", seo: { title: "Zerodha Interview Questions 2026 | Trading & Fintech | MedhaHub", description: "Zerodha interview questions for engineering and trading platform roles.", keywords: "Zerodha interview questions 2026" } },
    { slug: "byju", name: "BYJU'S", shortName: "BYJU'S", logo: "📚", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2011", headquarters: "Bengaluru, India", employees: "10,000+", description: "BYJU'S is India's largest edtech company offering learning programs.", interviewRounds: ["Online Test", "Technical Interview", "Design Round", "HR Interview"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "BYJU'S Interview Questions 2026 | EdTech | MedhaHub", description: "BYJU'S interview questions for engineering and product roles.", keywords: "BYJU'S interview questions 2026, BYJU'S SDE interview" } },
    { slug: "unacademy", name: "Unacademy", shortName: "Unacademy", logo: "🎓", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "5,000+", description: "Unacademy is a leading online learning platform for competitive exams.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Unacademy Interview Questions 2026 | EdTech | MedhaHub", description: "Unacademy interview questions for engineering roles.", keywords: "Unacademy interview questions 2026" } },
    { slug: "nykaa", name: "Nykaa", shortName: "Nykaa", logo: "💄", color: "from-pink-500 to-pink-700", accent: "text-pink-500", bgAccent: "bg-pink-50 dark:bg-pink-950/30", founded: "2012", headquarters: "Mumbai, India", employees: "3,500+", description: "Nykaa is India's leading beauty and fashion e-commerce platform.", interviewRounds: ["Online Test", "Technical Interview", "Product Discussion", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Nykaa Interview Questions 2026 | E-commerce | MedhaHub", description: "Nykaa interview questions for tech and product roles.", keywords: "Nykaa interview questions 2026" } },
    { slug: "lenskart", name: "Lenskart", shortName: "Lenskart", logo: "👓", color: "from-sky-500 to-sky-700", accent: "text-sky-500", bgAccent: "bg-sky-50 dark:bg-sky-950/30", founded: "2010", headquarters: "New Delhi, India", employees: "10,000+", description: "Lenskart is India's largest eyewear retailer and D2C brand.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Lenskart Interview Questions 2026 | D2C & Tech | MedhaHub", description: "Lenskart interview questions for engineering and product roles.", keywords: "Lenskart interview questions 2026" } },
    { slug: "freshworks", name: "Freshworks", shortName: "Freshworks", logo: "🍊", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2010", headquarters: "Chennai, India", employees: "6,500+", description: "Freshworks provides SaaS products for customer service, IT, and CRM.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "HR Interview"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Freshworks Interview Questions 2026 | SaaS | MedhaHub", description: "Freshworks interview questions for SDE and product roles.", keywords: "Freshworks interview questions 2026" } },
    { slug: "ola-electric", name: "Ola Electric", shortName: "Ola Electric", logo: "⚡", color: "from-green-500 to-emerald-700", accent: "text-green-500", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2017", headquarters: "Bengaluru, India", employees: "5,000+", description: "Ola Electric is an EV manufacturer building India's electric mobility future.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹30 LPA", seo: { title: "Ola Electric Interview Questions 2026 | EV & Tech | MedhaHub", description: "Ola Electric interview questions for engineering roles.", keywords: "Ola Electric interview questions 2026" } },
    { slug: "sharechat", name: "ShareChat", shortName: "ShareChat", logo: "💬", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "2,500+", description: "ShareChat is India's largest social media platform for regional languages.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "ShareChat Interview Questions 2026 | Social Media | MedhaHub", description: "ShareChat interview questions for engineering roles.", keywords: "ShareChat interview questions 2026" } },
    { slug: "bigbasket", name: "BigBasket", shortName: "BigBasket", logo: "🛒", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2011", headquarters: "Bengaluru, India", employees: "40,000+", description: "BigBasket is India's largest online grocery delivery platform.", interviewRounds: ["Online Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "BigBasket Interview Questions 2026 | E-commerce | MedhaHub", description: "BigBasket interview questions for engineering and operations roles.", keywords: "BigBasket interview questions 2026" } },
    { slug: "dunzo", name: "Dunzo", shortName: "Dunzo", logo: "📦", color: "from-green-500 to-green-700", accent: "text-green-500", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2014", headquarters: "Bengaluru, India", employees: "2,000+", description: "Dunzo is a quick commerce and delivery platform backed by Reliance.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Dunzo Interview Questions 2026 | Quick Commerce | MedhaHub", description: "Dunzo interview questions for engineering roles.", keywords: "Dunzo interview questions 2026" } },
    { slug: "cure-fit", name: "Cult.fit", shortName: "Cult.fit", logo: "🏋️", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2016", headquarters: "Bengaluru, India", employees: "5,000+", description: "Cult.fit is a health and fitness company offering gym, yoga, and nutrition.", interviewRounds: ["Coding Test", "Technical Interview", "Product Discussion", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Cult.fit Interview Questions 2026 | Health Tech | MedhaHub", description: "Cult.fit interview questions for engineering roles.", keywords: "Cult.fit interview questions 2026, Curefit interview" } },
    { slug: "upstox", name: "Upstox", shortName: "Upstox", logo: "📈", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2009", headquarters: "Mumbai, India", employees: "2,000+", description: "Upstox is a discount stockbroking platform backed by Ratan Tata and Tiger Global.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Upstox Interview Questions 2026 | Fintech | MedhaHub", description: "Upstox interview questions for engineering and trading platform roles.", keywords: "Upstox interview questions 2026" } },
    { slug: "urban-company", name: "Urban Company", shortName: "Urban Co.", logo: "🏠", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2014", headquarters: "Gurugram, India", employees: "3,000+", description: "Urban Company is India's largest home services marketplace.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Urban Company Interview Questions 2026 | MedhaHub", description: "Urban Company interview questions for engineering roles.", keywords: "Urban Company interview questions 2026" } },
    { slug: "rapido", name: "Rapido", shortName: "Rapido", logo: "🏍️", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "1,500+", description: "Rapido is India's largest bike taxi platform.", interviewRounds: ["Coding Test", "Technical Interview", "HR Interview"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Rapido Interview Questions 2026 | Mobility | MedhaHub", description: "Rapido interview questions for engineering roles.", keywords: "Rapido interview questions 2026" } },
    { slug: "delhivery", name: "Delhivery", shortName: "Delhivery", logo: "🚚", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2011", headquarters: "Gurugram, India", employees: "25,000+", description: "Delhivery is India's largest independent logistics company.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Delhivery Interview Questions 2026 | Logistics | MedhaHub", description: "Delhivery interview questions for engineering and logistics roles.", keywords: "Delhivery interview questions 2026" } },
    { slug: "policybazaar", name: "PolicyBazaar", shortName: "PolicyBazaar", logo: "🛡️", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2008", headquarters: "Gurugram, India", employees: "8,000+", description: "PolicyBazaar is India's largest insurance comparison and buying platform.", interviewRounds: ["Online Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "PolicyBazaar Interview Questions 2026 | InsurTech | MedhaHub", description: "PolicyBazaar interview questions for engineering roles.", keywords: "PolicyBazaar interview questions 2026" } },
    { slug: "cars24", name: "Cars24", shortName: "Cars24", logo: "🚗", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2015", headquarters: "Gurugram, India", employees: "8,000+", description: "Cars24 is an online used car buying and selling platform.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Cars24 Interview Questions 2026 | Auto Tech | MedhaHub", description: "Cars24 interview questions for engineering roles.", keywords: "Cars24 interview questions 2026" } },
    { slug: "spinny", name: "Spinny", shortName: "Spinny", logo: "🚘", color: "from-purple-500 to-purple-700", accent: "text-purple-500", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2015", headquarters: "Gurugram, India", employees: "3,000+", description: "Spinny is a full-stack used car buying platform with trust guarantee.", interviewRounds: ["Coding Test", "Technical Interview", "HR Interview"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Spinny Interview Questions 2026 | Auto Tech | MedhaHub", description: "Spinny interview questions for engineering roles.", keywords: "Spinny interview questions 2026" } },
    { slug: "jupiter", name: "Jupiter (Money)", shortName: "Jupiter", logo: "💰", color: "from-purple-500 to-purple-700", accent: "text-purple-500", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2019", headquarters: "Bengaluru, India", employees: "900+", description: "Jupiter is a neobanking app offering savings, payments, and investments.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Jupiter Interview Questions 2026 | NeoBank | MedhaHub", description: "Jupiter neobank interview questions for engineering roles.", keywords: "Jupiter Money interview questions 2026" } },
    { slug: "slice", name: "Slice", shortName: "Slice", logo: "💳", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2016", headquarters: "Bengaluru, India", employees: "1,500+", description: "Slice is a fintech company offering credit cards and UPI payments for millennials.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Slice Interview Questions 2026 | Fintech | MedhaHub", description: "Slice fintech interview questions for engineering roles.", keywords: "Slice interview questions 2026" } },
    { slug: "mmt", name: "MakeMyTrip", shortName: "MakeMyTrip", logo: "✈️", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2000", headquarters: "Gurugram, India", employees: "4,000+", description: "MakeMyTrip is India's leading online travel company.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "HR"], avgPackage: "₹12 – ₹30 LPA", seo: { title: "MakeMyTrip Interview Questions 2026 | Travel Tech | MedhaHub", description: "MakeMyTrip interview questions for engineering and product roles.", keywords: "MakeMyTrip interview questions 2026, MMT interview" } },
    { slug: "oyo", name: "OYO Rooms", shortName: "OYO", logo: "🏨", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2013", headquarters: "Gurugram, India", employees: "10,000+", description: "OYO is the world's largest hospitality technology company.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "OYO Interview Questions 2026 | Hospitality Tech | MedhaHub", description: "OYO interview questions for engineering and product roles.", keywords: "OYO interview questions 2026" } },
    { slug: "blinkit", name: "Blinkit", shortName: "Blinkit", logo: "⚡", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2013", headquarters: "Gurugram, India", employees: "5,000+", description: "Blinkit (by Zomato) is India's leading quick commerce platform delivering in 10 minutes.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Blinkit Interview Questions 2026 | Quick Commerce | MedhaHub", description: "Blinkit interview questions for engineering roles.", keywords: "Blinkit interview questions 2026" } },
    { slug: "zepto", name: "Zepto", shortName: "Zepto", logo: "🛒", color: "from-purple-500 to-purple-700", accent: "text-purple-500", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2021", headquarters: "Mumbai, India", employees: "3,500+", description: "Zepto is a quick-commerce startup delivering groceries in 10 minutes.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Zepto Interview Questions 2026 | Quick Commerce | MedhaHub", description: "Zepto interview questions for engineering roles.", keywords: "Zepto interview questions 2026" } },
    { slug: "inmobi", name: "InMobi", shortName: "InMobi", logo: "📱", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2007", headquarters: "Bengaluru, India", employees: "1,800+", description: "InMobi is a global mobile advertising and technology company.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "InMobi Interview Questions 2026 | AdTech | MedhaHub", description: "InMobi interview questions for engineering and ML roles.", keywords: "InMobi interview questions 2026" } },
    { slug: "practo", name: "Practo", shortName: "Practo", logo: "🏥", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2008", headquarters: "Bengaluru, India", employees: "1,200+", description: "Practo is India's leading healthcare platform connecting doctors and patients.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Practo Interview Questions 2026 | HealthTech | MedhaHub", description: "Practo interview questions for engineering roles.", keywords: "Practo interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Banking, Finance & Insurance ───────────────────────────────────────────
  ...([
    { slug: "hsbc", name: "HSBC Technology", shortName: "HSBC", logo: "🏦", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1865", headquarters: "London, UK", employees: "2,20,000+", description: "HSBC is a global banking and financial services company with major tech hubs in India.", interviewRounds: ["Online Test", "Technical Interview", "Managerial Round", "HR Interview"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "HSBC Interview Questions 2026 | Banking Tech | MedhaHub", description: "HSBC technology interview questions for software engineering roles.", keywords: "HSBC interview questions 2026, HSBC technology interview" } },
    { slug: "barclays", name: "Barclays", shortName: "Barclays", logo: "🏦", color: "from-cyan-600 to-cyan-800", accent: "text-cyan-600", bgAccent: "bg-cyan-50 dark:bg-cyan-950/30", founded: "1690", headquarters: "London, UK", employees: "85,000+", description: "Barclays is a British multinational investment bank with a large tech center in India.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "Barclays Interview Questions 2026 | Banking | MedhaHub", description: "Barclays interview questions for technology and finance roles.", keywords: "Barclays interview questions 2026" } },
    { slug: "morgan-stanley", name: "Morgan Stanley", shortName: "Morgan Stanley", logo: "🏦", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1935", headquarters: "New York, USA", employees: "82,000+", description: "Morgan Stanley is a leading global financial services firm with major tech operations in India.", interviewRounds: ["Online Assessment", "Coding Round", "Technical Interview", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Morgan Stanley Interview Questions 2026 | Finance Tech | MedhaHub", description: "Morgan Stanley interview questions for technology roles.", keywords: "Morgan Stanley interview questions 2026" } },
    { slug: "deutsche-bank", name: "Deutsche Bank", shortName: "Deutsche Bank", logo: "🏦", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1870", headquarters: "Frankfurt, Germany", employees: "87,000+", description: "Deutsche Bank is a leading global banking institution with major engineering hubs.", interviewRounds: ["Online Test", "Technical Interview (2 rounds)", "HR Interview"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Deutsche Bank Interview Questions 2026 | Finance | MedhaHub", description: "Deutsche Bank interview questions for technology roles.", keywords: "Deutsche Bank interview questions 2026" } },
    { slug: "citi", name: "Citibank", shortName: "Citi", logo: "🏦", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1812", headquarters: "New York, USA", employees: "2,40,000+", description: "Citi is a major global bank with significant technology operations in India.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "Citibank Interview Questions 2026 | Banking Tech | MedhaHub", description: "Citibank interview questions for technology roles.", keywords: "Citibank interview questions 2026, Citi interview" } },
    { slug: "ubs", name: "UBS", shortName: "UBS", logo: "🏦", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1862", headquarters: "Zurich, Switzerland", employees: "74,000+", description: "UBS is a Swiss multinational investment bank with large tech teams in India.", interviewRounds: ["Online Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "UBS Interview Questions 2026 | Finance Tech | MedhaHub", description: "UBS interview questions for technology roles.", keywords: "UBS interview questions 2026" } },
    { slug: "mastercard", name: "Mastercard", shortName: "Mastercard", logo: "💳", color: "from-red-500 to-orange-600", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1966", headquarters: "Purchase, USA", employees: "33,000+", description: "Mastercard is a global leader in payment technology with R&D centers in India.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Mastercard Interview Questions 2026 | Payments | MedhaHub", description: "Mastercard interview questions for engineering roles.", keywords: "Mastercard interview questions 2026" } },
    { slug: "visa", name: "Visa Inc.", shortName: "Visa", logo: "💳", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1958", headquarters: "San Francisco, USA", employees: "26,500+", description: "Visa is the world's leader in digital payments with a large India tech center.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Visa Interview Questions 2026 | Payments Tech | MedhaHub", description: "Visa interview questions for engineering roles.", keywords: "Visa interview questions 2026" } },
    { slug: "american-express", name: "American Express", shortName: "AmEx", logo: "💳", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1850", headquarters: "New York, USA", employees: "77,300+", description: "American Express is a global financial services company with major tech hubs in India.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "American Express Interview Questions 2026 | MedhaHub", description: "American Express interview questions for engineering roles.", keywords: "AmEx interview questions 2026, American Express interview" } },
    { slug: "bajaj-finserv", name: "Bajaj Finserv", shortName: "Bajaj Finserv", logo: "🏛️", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2007", headquarters: "Pune, India", employees: "45,000+", description: "Bajaj Finserv is one of India's largest financial services conglomerates.", interviewRounds: ["Online Test", "Technical Interview", "Managerial Round", "HR"], avgPackage: "₹6 – ₹15 LPA", seo: { title: "Bajaj Finserv Interview Questions 2026 | Finance | MedhaHub", description: "Bajaj Finserv interview questions for tech and finance roles.", keywords: "Bajaj Finserv interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Telecom, Media & E-commerce ────────────────────────────────────────────
  ...([
    { slug: "reliance-jio", name: "Reliance Jio", shortName: "Jio", logo: "📶", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2007", headquarters: "Mumbai, India", employees: "50,000+", description: "Reliance Jio is India's largest telecom operator and digital services platform.", interviewRounds: ["Online Test", "Technical Interview", "Managerial Round", "HR"], avgPackage: "₹6 – ₹18 LPA", seo: { title: "Jio Interview Questions 2026 | Telecom & Tech | MedhaHub", description: "Reliance Jio interview questions for engineering and tech roles.", keywords: "Jio interview questions 2026, Reliance Jio interview" } },
    { slug: "bharti-airtel", name: "Bharti Airtel", shortName: "Airtel", logo: "📱", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1995", headquarters: "New Delhi, India", employees: "30,000+", description: "Airtel is India's second-largest telecom company with digital and payments services.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹5 – ₹15 LPA", seo: { title: "Airtel Interview Questions 2026 | Telecom | MedhaHub", description: "Airtel interview questions for tech and engineering roles.", keywords: "Airtel interview questions 2026" } },
    { slug: "hotstar", name: "Disney+ Hotstar", shortName: "Hotstar", logo: "🎬", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2015", headquarters: "Mumbai, India", employees: "2,500+", description: "Disney+ Hotstar is India's largest premium streaming platform.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Hotstar Interview Questions 2026 | Streaming | MedhaHub", description: "Disney+ Hotstar interview questions for engineering roles.", keywords: "Hotstar interview questions 2026" } },
    { slug: "media-net", name: "Media.net", shortName: "Media.net", logo: "📰", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2010", headquarters: "Mumbai, India", employees: "1,500+", description: "Media.net is a leading global advertising technology company.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Media.net Interview Questions 2026 | AdTech | MedhaHub", description: "Media.net interview questions for engineering roles.", keywords: "Media.net interview questions 2026" } },
    { slug: "ajio", name: "AJIO (Reliance)", shortName: "AJIO", logo: "👗", color: "from-pink-500 to-pink-700", accent: "text-pink-500", bgAccent: "bg-pink-50 dark:bg-pink-950/30", founded: "2016", headquarters: "Mumbai, India", employees: "3,000+", description: "AJIO is Reliance Retail's fashion e-commerce platform.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "AJIO Interview Questions 2026 | Fashion Tech | MedhaHub", description: "AJIO interview questions for engineering and product roles.", keywords: "AJIO interview questions 2026" } },
    { slug: "tatacliq", name: "Tata CLiQ", shortName: "Tata CLiQ", logo: "🛍️", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2016", headquarters: "Mumbai, India", employees: "1,500+", description: "Tata CLiQ is Tata Group's multi-brand digital marketplace.", interviewRounds: ["Coding Test", "Technical Interview", "HR Interview"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "Tata CLiQ Interview Questions 2026 | E-commerce | MedhaHub", description: "Tata CLiQ interview questions for engineering roles.", keywords: "Tata CLiQ interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Semiconductor, Hardware & Cloud ─────────────────────────────────────────
  ...([
    { slug: "amd", name: "AMD", shortName: "AMD", logo: "🔲", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1969", headquarters: "Santa Clara, USA", employees: "26,000+", description: "AMD designs high-performance CPUs, GPUs, and adaptive computing products.", interviewRounds: ["Online Test", "Technical Interview (2 rounds)", "HR Interview"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "AMD Interview Questions 2026 | Semiconductor | MedhaHub", description: "AMD interview questions for SDE and hardware engineering roles.", keywords: "AMD interview questions 2026" } },
    { slug: "texas-instruments", name: "Texas Instruments", shortName: "TI", logo: "📟", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1951", headquarters: "Dallas, USA", employees: "34,000+", description: "Texas Instruments designs and manufactures semiconductors and embedded processors.", interviewRounds: ["Online Test", "Technical Interview", "Design Round", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Texas Instruments Interview Questions 2026 | MedhaHub", description: "TI interview questions for engineering roles.", keywords: "Texas Instruments interview questions 2026, TI interview" } },
    { slug: "cisco", name: "Cisco Systems", shortName: "Cisco", logo: "🌐", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1984", headquarters: "San Jose, USA", employees: "84,000+", description: "Cisco is the worldwide leader in networking, security, and cloud solutions.", interviewRounds: ["Online Assessment", "Technical Interview (2 rounds)", "HR Interview"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Cisco Interview Questions 2026 | Networking | MedhaHub", description: "Cisco interview questions for networking and software engineering roles.", keywords: "Cisco interview questions 2026" } },
    { slug: "juniper", name: "Juniper Networks", shortName: "Juniper", logo: "🌳", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1996", headquarters: "Sunnyvale, USA", employees: "11,000+", description: "Juniper Networks provides AI-driven networking and cybersecurity solutions.", interviewRounds: ["Online Test", "Technical Interview", "Design Round", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Juniper Networks Interview Questions 2026 | MedhaHub", description: "Juniper interview questions for networking and engineering roles.", keywords: "Juniper Networks interview questions 2026" } },
    { slug: "aws", name: "Amazon Web Services", shortName: "AWS", logo: "☁️", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2006", headquarters: "Seattle, USA", employees: "1,00,000+", description: "AWS is the world's leading cloud computing platform.", interviewRounds: ["Online Assessment", "Phone Screen", "On-site (4-5 rounds)", "Bar Raiser"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "AWS Interview Questions 2026 | Cloud Computing | MedhaHub", description: "AWS interview questions for SDE and cloud engineering roles.", keywords: "AWS interview questions 2026, Amazon Web Services interview" } },
    { slug: "gcp", name: "Google Cloud", shortName: "Google Cloud", logo: "☁️", color: "from-blue-500 to-red-500", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2008", headquarters: "Sunnyvale, USA", employees: "50,000+", description: "Google Cloud provides cloud computing, data analytics, and AI/ML services.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Googleyness"], avgPackage: "₹25 – ₹55 LPA", seo: { title: "Google Cloud Interview Questions 2026 | MedhaHub", description: "Google Cloud interview questions for cloud engineering roles.", keywords: "Google Cloud interview questions 2026, GCP interview" } },
    { slug: "dell", name: "Dell Technologies", shortName: "Dell", logo: "💻", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1984", headquarters: "Round Rock, USA", employees: "1,33,000+", description: "Dell Technologies is a leading provider of PCs, servers, storage, and IT solutions.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹6 – ₹15 LPA", seo: { title: "Dell Interview Questions 2026 | IT Solutions | MedhaHub", description: "Dell Technologies interview questions for engineering roles.", keywords: "Dell interview questions 2026" } },
    { slug: "hp", name: "HP Inc.", shortName: "HP", logo: "🖥️", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1939", headquarters: "Palo Alto, USA", employees: "58,000+", description: "HP designs and manufactures PCs, printers, and 3D printing solutions.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹6 – ₹15 LPA", seo: { title: "HP Interview Questions 2026 | MedhaHub", description: "HP interview questions for engineering roles.", keywords: "HP interview questions 2026, HP Inc interview" } },
    { slug: "micron", name: "Micron Technology", shortName: "Micron", logo: "🔬", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1978", headquarters: "Boise, USA", employees: "48,000+", description: "Micron is a world leader in memory and storage solutions (DRAM, NAND, NOR).", interviewRounds: ["Online Test", "Technical Interview (2 rounds)", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Micron Interview Questions 2026 | Memory & Storage | MedhaHub", description: "Micron interview questions for engineering roles.", keywords: "Micron interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Automotive, Manufacturing & Energy ──────────────────────────────────────
  ...([
    { slug: "bosch", name: "Robert Bosch", shortName: "Bosch", logo: "🔧", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1886", headquarters: "Stuttgart, Germany", employees: "4,21,000+", description: "Bosch is a global engineering and technology company with a large India R&D center.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹5 – ₹12 LPA", seo: { title: "Bosch Interview Questions 2026 | Engineering | MedhaHub", description: "Bosch interview questions for engineering and tech roles.", keywords: "Bosch interview questions 2026" } },
    { slug: "siemens", name: "Siemens Technology", shortName: "Siemens", logo: "⚡", color: "from-teal-600 to-teal-800", accent: "text-teal-600", bgAccent: "bg-teal-50 dark:bg-teal-950/30", founded: "1847", headquarters: "Munich, Germany", employees: "3,20,000+", description: "Siemens is a global technology company focused on industry, infrastructure, and healthcare.", interviewRounds: ["Online Test", "Technical Interview", "Managerial Round", "HR"], avgPackage: "₹6 – ₹15 LPA", seo: { title: "Siemens Interview Questions 2026 | MedhaHub", description: "Siemens interview questions for engineering and technology roles.", keywords: "Siemens interview questions 2026" } },
    { slug: "continental", name: "Continental", shortName: "Continental", logo: "🚗", color: "from-yellow-600 to-yellow-800", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "1871", headquarters: "Hannover, Germany", employees: "1,99,000+", description: "Continental is a leading automotive technology company.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹5 – ₹12 LPA", seo: { title: "Continental Interview Questions 2026 | Automotive | MedhaHub", description: "Continental interview questions for automotive tech roles.", keywords: "Continental interview questions 2026" } },
    { slug: "mahindra", name: "Tech Mahindra", shortName: "Tech M", logo: "🔴", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1986", headquarters: "Pune, India", employees: "1,55,000+", description: "Tech Mahindra is a leading provider of IT services with a focus on telecom.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹3.5 – ₹7 LPA", seo: { title: "Tech Mahindra Interview Questions 2026 | MedhaHub", description: "Tech Mahindra interview questions for IT services roles.", keywords: "Tech Mahindra interview questions 2026" } },
    { slug: "schneider-electric", name: "Schneider Electric", shortName: "Schneider", logo: "⚡", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1836", headquarters: "Rueil-Malmaison, France", employees: "1,50,000+", description: "Schneider Electric is a global leader in energy management and automation.", interviewRounds: ["Online Test", "Technical Interview", "HR Interview"], avgPackage: "₹5 – ₹12 LPA", seo: { title: "Schneider Electric Interview Questions 2026 | MedhaHub", description: "Schneider Electric interview questions for engineering roles.", keywords: "Schneider Electric interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Healthcare & Pharma Tech ───────────────────────────────────────────────
  ...([
    { slug: "philips", name: "Philips", shortName: "Philips", logo: "💡", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1891", headquarters: "Amsterdam, Netherlands", employees: "77,000+", description: "Philips is a global health technology company focused on diagnostics and connected care.", interviewRounds: ["Online Test", "Technical Interview", "Design Round", "HR"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "Philips Interview Questions 2026 | HealthTech | MedhaHub", description: "Philips interview questions for health technology roles.", keywords: "Philips interview questions 2026" } },
    { slug: "ge-healthcare", name: "GE Healthcare", shortName: "GE Healthcare", logo: "🏥", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1994", headquarters: "Chicago, USA", employees: "51,000+", description: "GE Healthcare provides medical imaging, diagnostics, and digital solutions.", interviewRounds: ["Online Test", "Technical Interview", "Domain Interview", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "GE Healthcare Interview Questions 2026 | MedhaHub", description: "GE Healthcare interview questions for technology and medical device roles.", keywords: "GE Healthcare interview questions 2026" } },
    { slug: "medtronic", name: "Medtronic", shortName: "Medtronic", logo: "❤️", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1949", headquarters: "Dublin, Ireland", employees: "95,000+", description: "Medtronic is the world's largest medical device company.", interviewRounds: ["Online Test", "Technical Interview", "Domain Knowledge", "HR"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "Medtronic Interview Questions 2026 | MedTech | MedhaHub", description: "Medtronic interview questions for engineering and medical device roles.", keywords: "Medtronic interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── More Global Tech & SaaS ────────────────────────────────────────────────
  ...([
    { slug: "twilio", name: "Twilio", shortName: "Twilio", logo: "📞", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2008", headquarters: "San Francisco, USA", employees: "7,900+", description: "Twilio is a cloud communications platform enabling voice, SMS, and video APIs.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Twilio Interview Questions 2026 | CPaaS | MedhaHub", description: "Twilio interview questions for engineering roles.", keywords: "Twilio interview questions 2026" } },
    { slug: "okta", name: "Okta", shortName: "Okta", logo: "🔐", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2009", headquarters: "San Francisco, USA", employees: "6,000+", description: "Okta is the leading identity and access management (IAM) platform.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹38 LPA", seo: { title: "Okta Interview Questions 2026 | Identity | MedhaHub", description: "Okta interview questions for engineering and security roles.", keywords: "Okta interview questions 2026" } },
    { slug: "palo-alto-networks", name: "Palo Alto Networks", shortName: "Palo Alto", logo: "🔒", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2005", headquarters: "Santa Clara, USA", employees: "15,000+", description: "Palo Alto Networks is the global leader in cybersecurity.", interviewRounds: ["Online Assessment", "Technical Interview (2 rounds)", "System Design", "HR"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Palo Alto Networks Interview Questions 2026 | Cybersecurity | MedhaHub", description: "Palo Alto Networks interview questions for security engineering roles.", keywords: "Palo Alto Networks interview questions 2026" } },
    { slug: "crowdstrike", name: "CrowdStrike", shortName: "CrowdStrike", logo: "🦅", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2011", headquarters: "Austin, USA", employees: "8,500+", description: "CrowdStrike provides cloud-native endpoint security and threat intelligence.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "CrowdStrike Interview Questions 2026 | Cybersecurity | MedhaHub", description: "CrowdStrike interview questions for security engineering roles.", keywords: "CrowdStrike interview questions 2026" } },
    { slug: "mongodb", name: "MongoDB", shortName: "MongoDB", logo: "🍃", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2007", headquarters: "New York, USA", employees: "5,300+", description: "MongoDB is the most popular NoSQL database platform.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "MongoDB Interview Questions 2026 | Database | MedhaHub", description: "MongoDB interview questions for engineering roles.", keywords: "MongoDB interview questions 2026" } },
    { slug: "elastic", name: "Elastic", shortName: "Elastic", logo: "🔍", color: "from-yellow-500 to-amber-600", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2012", headquarters: "San Francisco, USA", employees: "3,200+", description: "Elastic is the company behind Elasticsearch, Kibana, and the ELK Stack.", interviewRounds: ["Phone Screen", "Technical Interview", "System Design", "Values"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Elastic Interview Questions 2026 | Search & Analytics | MedhaHub", description: "Elastic interview questions for engineering roles.", keywords: "Elastic interview questions 2026, Elasticsearch interview" } },
    { slug: "confluent", name: "Confluent", shortName: "Confluent", logo: "🌊", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2014", headquarters: "Mountain View, USA", employees: "3,500+", description: "Confluent is the data streaming platform company behind Apache Kafka.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Confluent Interview Questions 2026 | Data Streaming | MedhaHub", description: "Confluent interview questions for engineering roles.", keywords: "Confluent interview questions 2026, Kafka interview" } },
    { slug: "hashicorp", name: "HashiCorp", shortName: "HashiCorp", logo: "⬡", color: "from-gray-700 to-gray-900", accent: "text-gray-700", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2012", headquarters: "San Francisco, USA", employees: "2,100+", description: "HashiCorp provides infrastructure automation tools — Terraform, Vault, Consul.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "HashiCorp Interview Questions 2026 | DevOps | MedhaHub", description: "HashiCorp interview questions for infrastructure and DevOps roles.", keywords: "HashiCorp interview questions 2026, Terraform interview" } },
    { slug: "cloudflare", name: "Cloudflare", shortName: "Cloudflare", logo: "🌩️", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2009", headquarters: "San Francisco, USA", employees: "3,700+", description: "Cloudflare provides CDN, cybersecurity, and serverless computing services.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Cloudflare Interview Questions 2026 | MedhaHub", description: "Cloudflare interview questions for engineering roles.", keywords: "Cloudflare interview questions 2026" } },
    { slug: "github", name: "GitHub", shortName: "GitHub", logo: "🐙", color: "from-gray-800 to-gray-950", accent: "text-gray-800", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2008", headquarters: "San Francisco, USA", employees: "3,000+", description: "GitHub is the world's leading software development platform.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Collaboration"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "GitHub Interview Questions 2026 | DevTools | MedhaHub", description: "GitHub interview questions for engineering roles.", keywords: "GitHub interview questions 2026" } },
    { slug: "gitlab", name: "GitLab", shortName: "GitLab", logo: "🦊", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2011", headquarters: "San Francisco, USA", employees: "2,100+", description: "GitLab is an all-remote DevSecOps platform company.", interviewRounds: ["Screen", "Technical Interview", "Peer Interview", "Manager Interview"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "GitLab Interview Questions 2026 | DevOps | MedhaHub", description: "GitLab interview questions for engineering roles.", keywords: "GitLab interview questions 2026" } },
    { slug: "figma", name: "Figma", shortName: "Figma", logo: "🎨", color: "from-purple-500 to-pink-600", accent: "text-purple-500", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2012", headquarters: "San Francisco, USA", employees: "1,500+", description: "Figma is the leading collaborative interface design tool.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Cross-functional"], avgPackage: "₹25 – ₹55 LPA", seo: { title: "Figma Interview Questions 2026 | Design Tools | MedhaHub", description: "Figma interview questions for engineering roles.", keywords: "Figma interview questions 2026" } },
    { slug: "canva", name: "Canva", shortName: "Canva", logo: "🎨", color: "from-purple-500 to-blue-600", accent: "text-purple-500", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2012", headquarters: "Sydney, Australia", employees: "4,000+", description: "Canva is a visual communications platform used by 170M+ people worldwide.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Values"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Canva Interview Questions 2026 | Design Platform | MedhaHub", description: "Canva interview questions for engineering roles.", keywords: "Canva interview questions 2026" } },
    { slug: "notion", name: "Notion", shortName: "Notion", logo: "📝", color: "from-gray-800 to-gray-950", accent: "text-gray-800", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2013", headquarters: "San Francisco, USA", employees: "600+", description: "Notion is an all-in-one workspace for notes, docs, wikis, and project management.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Values"], avgPackage: "₹25 – ₹55 LPA", seo: { title: "Notion Interview Questions 2026 | Productivity | MedhaHub", description: "Notion interview questions for engineering roles.", keywords: "Notion interview questions 2026" } },
    { slug: "datadog", name: "Datadog", shortName: "Datadog", logo: "🐕", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2010", headquarters: "New York, USA", employees: "6,300+", description: "Datadog provides monitoring and analytics platform for cloud-scale applications.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹22 – ₹48 LPA", seo: { title: "Datadog Interview Questions 2026 | Observability | MedhaHub", description: "Datadog interview questions for engineering roles.", keywords: "Datadog interview questions 2026" } },
    { slug: "splunk", name: "Splunk (Cisco)", shortName: "Splunk", logo: "📊", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2003", headquarters: "San Francisco, USA", employees: "8,400+", description: "Splunk is a leader in data analytics and security information management.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹38 LPA", seo: { title: "Splunk Interview Questions 2026 | Data Analytics | MedhaHub", description: "Splunk interview questions for engineering roles.", keywords: "Splunk interview questions 2026" } },
    { slug: "workday", name: "Workday", shortName: "Workday", logo: "☀️", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2005", headquarters: "Pleasanton, USA", employees: "18,800+", description: "Workday provides enterprise cloud applications for HR and finance.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Workday Interview Questions 2026 | HCM & Finance | MedhaHub", description: "Workday interview questions for engineering roles.", keywords: "Workday interview questions 2026" } },
    { slug: "openai", name: "OpenAI", shortName: "OpenAI", logo: "🤖", color: "from-gray-800 to-gray-950", accent: "text-gray-800", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2015", headquarters: "San Francisco, USA", employees: "2,000+", description: "OpenAI is the AI research lab behind ChatGPT and GPT models.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "ML/AI Deep Dive", "Values"], avgPackage: "₹40 – ₹100 LPA", seo: { title: "OpenAI Interview Questions 2026 | AI Research | MedhaHub", description: "OpenAI interview questions for AI research and engineering roles.", keywords: "OpenAI interview questions 2026, ChatGPT interview" } },
    { slug: "anthropic", name: "Anthropic", shortName: "Anthropic", logo: "🧠", color: "from-amber-600 to-amber-800", accent: "text-amber-600", bgAccent: "bg-amber-50 dark:bg-amber-950/30", founded: "2021", headquarters: "San Francisco, USA", employees: "1,000+", description: "Anthropic is an AI safety company building reliable AI systems (Claude).", interviewRounds: ["Phone Screen", "Coding Round", "ML Interview", "Research Discussion"], avgPackage: "₹40 – ₹90 LPA", seo: { title: "Anthropic Interview Questions 2026 | AI Safety | MedhaHub", description: "Anthropic interview questions for AI and engineering roles.", keywords: "Anthropic interview questions 2026, Claude AI interview" } },
  ] as CompanyInfo[]),

  // ── More Indian IT & Product Companies ──────────────────────────────────────
  ...([
    { slug: "search-india", name: "Google India", shortName: "Google India", logo: "🔍", color: "from-blue-500 to-green-500", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2004", headquarters: "Hyderabad, India", employees: "10,000+", description: "Google India is one of Google's largest engineering hubs outside the US.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Googleyness"], avgPackage: "₹25 – ₹55 LPA", seo: { title: "Google India Interview Questions 2026 | MedhaHub", description: "Google India interview questions for SDE and ML roles.", keywords: "Google India interview questions 2026" } },
    { slug: "microsoft-india", name: "Microsoft India", shortName: "MS India", logo: "🪟", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1990", headquarters: "Hyderabad, India", employees: "20,000+", description: "Microsoft India Development Center is the company's largest R&D hub outside Redmond.", interviewRounds: ["Online Assessment", "Phone Screen", "On-site (3-4 rounds)", "Behavioral"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "Microsoft India Interview Questions 2026 | MedhaHub", description: "Microsoft IDC interview questions for SDE roles.", keywords: "Microsoft India interview questions 2026, MSIDC interview" } },
    { slug: "thoughtworks", name: "ThoughtWorks", shortName: "TW", logo: "💭", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "1993", headquarters: "Chicago, USA", employees: "12,500+", description: "ThoughtWorks is a global technology consultancy focused on agile and XP.", interviewRounds: ["Coding Challenge", "Pair Programming", "Technical Discussion", "Culture Interview"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "ThoughtWorks Interview Questions 2026 | MedhaHub", description: "ThoughtWorks interview questions for consulting and engineering roles.", keywords: "ThoughtWorks interview questions 2026" } },
    { slug: "hashedin", name: "HashedIn (Deloitte)", shortName: "HashedIn", logo: "🔷", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2011", headquarters: "Bengaluru, India", employees: "2,500+", description: "HashedIn by Deloitte specializes in cloud-native product engineering.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "HashedIn Interview Questions 2026 | Cloud | MedhaHub", description: "HashedIn interview questions for cloud engineering roles.", keywords: "HashedIn interview questions 2026" } },
    { slug: "nagarro", name: "Nagarro", shortName: "Nagarro", logo: "🟢", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1996", headquarters: "Munich, Germany", employees: "18,000+", description: "Nagarro is a global digital engineering company.", interviewRounds: ["Coding Test", "Technical Interview", "HR Interview"], avgPackage: "₹5 – ₹12 LPA", seo: { title: "Nagarro Interview Questions 2026 | Digital Engineering | MedhaHub", description: "Nagarro interview questions for engineering roles.", keywords: "Nagarro interview questions 2026" } },
    { slug: "publicis-sapient", name: "Publicis Sapient", shortName: "Publicis Sapient", logo: "🟣", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "1990", headquarters: "Boston, USA", employees: "20,000+", description: "Publicis Sapient is a digital transformation partner for global enterprises.", interviewRounds: ["Online Test", "Technical Interview", "Case Study", "HR"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "Publicis Sapient Interview Questions 2026 | MedhaHub", description: "Publicis Sapient interview questions for tech and consulting roles.", keywords: "Publicis Sapient interview questions 2026" } },
    { slug: "epam", name: "EPAM Systems", shortName: "EPAM", logo: "🔵", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1993", headquarters: "Newtown, USA", employees: "55,000+", description: "EPAM is a global product development and digital platform engineering company.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "EPAM Interview Questions 2026 | Platform Engineering | MedhaHub", description: "EPAM interview questions for engineering roles.", keywords: "EPAM interview questions 2026" } },
    { slug: "thoughtspot", name: "ThoughtSpot", shortName: "ThoughtSpot", logo: "💡", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2012", headquarters: "Sunnyvale, USA", employees: "1,500+", description: "ThoughtSpot provides AI-powered analytics and business intelligence.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Culture Fit"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "ThoughtSpot Interview Questions 2026 | Analytics | MedhaHub", description: "ThoughtSpot interview questions for engineering roles.", keywords: "ThoughtSpot interview questions 2026" } },
    { slug: "commvault", name: "Commvault", shortName: "Commvault", logo: "💾", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1996", headquarters: "Tinton Falls, USA", employees: "3,200+", description: "Commvault provides data protection and information management solutions.", interviewRounds: ["Online Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Commvault Interview Questions 2026 | Data Protection | MedhaHub", description: "Commvault interview questions for engineering roles.", keywords: "Commvault interview questions 2026" } },
    { slug: "sprinklr", name: "Sprinklr", shortName: "Sprinklr", logo: "🌊", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2009", headquarters: "New York, USA", employees: "4,000+", description: "Sprinklr provides a unified customer experience management platform.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Sprinklr Interview Questions 2026 | CXM | MedhaHub", description: "Sprinklr interview questions for engineering roles.", keywords: "Sprinklr interview questions 2026" } },
    { slug: "postman", name: "Postman", shortName: "Postman", logo: "📮", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2014", headquarters: "San Francisco, USA", employees: "800+", description: "Postman is the world's leading API development and testing platform.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Culture Fit"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Postman Interview Questions 2026 | API Tools | MedhaHub", description: "Postman interview questions for engineering roles.", keywords: "Postman interview questions 2026" } },
    { slug: "browserstack", name: "BrowserStack", shortName: "BrowserStack", logo: "🧪", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2011", headquarters: "Mumbai, India", employees: "1,000+", description: "BrowserStack is a cloud testing platform used by millions of developers.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "BrowserStack Interview Questions 2026 | Testing | MedhaHub", description: "BrowserStack interview questions for engineering roles.", keywords: "BrowserStack interview questions 2026" } },
    { slug: "druva", name: "Druva", shortName: "Druva", logo: "☁️", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2008", headquarters: "Sunnyvale, USA", employees: "1,200+", description: "Druva provides cloud data protection and management solutions.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Druva Interview Questions 2026 | Cloud Data | MedhaHub", description: "Druva interview questions for engineering roles.", keywords: "Druva interview questions 2026" } },
    { slug: "harness", name: "Harness", shortName: "Harness", logo: "🚀", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2016", headquarters: "San Francisco, USA", employees: "1,200+", description: "Harness provides a modern software delivery platform for CI/CD.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Culture Fit"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Harness Interview Questions 2026 | CI/CD | MedhaHub", description: "Harness interview questions for engineering roles.", keywords: "Harness interview questions 2026" } },
    { slug: "chargebee", name: "Chargebee", shortName: "Chargebee", logo: "💰", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2011", headquarters: "Chennai, India", employees: "1,100+", description: "Chargebee is a subscription billing and revenue management platform.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Chargebee Interview Questions 2026 | SaaS Billing | MedhaHub", description: "Chargebee interview questions for engineering roles.", keywords: "Chargebee interview questions 2026" } },
    { slug: "clevertap", name: "CleverTap", shortName: "CleverTap", logo: "📊", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2013", headquarters: "Mumbai, India", employees: "800+", description: "CleverTap is a customer engagement and retention platform.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "CleverTap Interview Questions 2026 | MarTech | MedhaHub", description: "CleverTap interview questions for engineering roles.", keywords: "CleverTap interview questions 2026" } },
    { slug: "moengage", name: "MoEngage", shortName: "MoEngage", logo: "📣", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2014", headquarters: "San Francisco, USA", employees: "800+", description: "MoEngage is an insights-driven customer engagement platform.", interviewRounds: ["Coding Test", "Technical Interview", "HR Interview"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "MoEngage Interview Questions 2026 | MarTech | MedhaHub", description: "MoEngage interview questions for engineering roles.", keywords: "MoEngage interview questions 2026" } },
    { slug: "yellow-ai", name: "Yellow.ai", shortName: "Yellow.ai", logo: "🤖", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-500", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2016", headquarters: "San Mateo, USA", employees: "1,000+", description: "Yellow.ai is an enterprise conversational AI platform.", interviewRounds: ["Coding Test", "Technical Interview", "ML Interview", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Yellow.ai Interview Questions 2026 | Conversational AI | MedhaHub", description: "Yellow.ai interview questions for AI and engineering roles.", keywords: "Yellow.ai interview questions 2026" } },
    { slug: "darwinbox", name: "Darwinbox", shortName: "Darwinbox", logo: "📦", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2015", headquarters: "Hyderabad, India", employees: "1,200+", description: "Darwinbox is an HR technology platform for enterprise workforce management.", interviewRounds: ["Coding Test", "Technical Interview", "Product Discussion", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Darwinbox Interview Questions 2026 | HR Tech | MedhaHub", description: "Darwinbox interview questions for engineering roles.", keywords: "Darwinbox interview questions 2026" } },
    { slug: "whatfix", name: "Whatfix", shortName: "Whatfix", logo: "💡", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2013", headquarters: "Bengaluru, India", employees: "900+", description: "Whatfix is a digital adoption platform for enterprise software.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Whatfix Interview Questions 2026 | DAP | MedhaHub", description: "Whatfix interview questions for engineering roles.", keywords: "Whatfix interview questions 2026" } },
    { slug: "hasura", name: "Hasura", shortName: "Hasura", logo: "🔷", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2017", headquarters: "San Francisco, USA", employees: "300+", description: "Hasura provides instant GraphQL APIs for your data.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "Culture Fit"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Hasura Interview Questions 2026 | GraphQL | MedhaHub", description: "Hasura interview questions for engineering roles.", keywords: "Hasura interview questions 2026" } },
  ] as CompanyInfo[]),

  // ── Final batch — reaching 200 ─────────────────────────────────────────────
  ...([
    { slug: "vercel", name: "Vercel", shortName: "Vercel", logo: "▲", color: "from-gray-800 to-gray-950", accent: "text-gray-800", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2015", headquarters: "San Francisco, USA", employees: "600+", description: "Vercel is the platform for frontend developers — creators of Next.js.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Culture Fit"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "Vercel Interview Questions 2026 | Frontend Infra | MedhaHub", description: "Vercel interview questions for frontend and platform engineering roles.", keywords: "Vercel interview questions 2026, Next.js interview" } },
    { slug: "supabase", name: "Supabase", shortName: "Supabase", logo: "⚡", color: "from-green-500 to-emerald-700", accent: "text-green-500", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2020", headquarters: "San Francisco, USA", employees: "200+", description: "Supabase is the open-source Firebase alternative (Postgres, Auth, Storage, Realtime).", interviewRounds: ["Async Coding Task", "Technical Interview", "Culture Fit"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Supabase Interview Questions 2026 | BaaS | MedhaHub", description: "Supabase interview questions for engineering roles.", keywords: "Supabase interview questions 2026" } },
    { slug: "render", name: "Render", shortName: "Render", logo: "🟢", color: "from-green-500 to-green-700", accent: "text-green-500", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2018", headquarters: "San Francisco, USA", employees: "250+", description: "Render is a unified cloud platform to build and run apps and websites.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Render Interview Questions 2026 | Cloud | MedhaHub", description: "Render interview questions for engineering roles.", keywords: "Render interview questions 2026" } },
    { slug: "razorpay-x", name: "RazorpayX", shortName: "RazorpayX", logo: "💸", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2018", headquarters: "Bengaluru, India", employees: "1,500+", description: "RazorpayX provides business banking and payroll solutions by Razorpay.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "RazorpayX Interview Questions 2026 | Neobank | MedhaHub", description: "RazorpayX interview questions for engineering roles.", keywords: "RazorpayX interview questions 2026" } },
    { slug: "pine-labs", name: "Pine Labs", shortName: "Pine Labs", logo: "💳", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1998", headquarters: "Noida, India", employees: "3,000+", description: "Pine Labs is a merchant commerce platform powering in-store and online payments.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Pine Labs Interview Questions 2026 | Payments | MedhaHub", description: "Pine Labs interview questions for engineering roles.", keywords: "Pine Labs interview questions 2026" } },
    { slug: "cred-club", name: "CRED", shortName: "CRED", logo: "💎", color: "from-gray-800 to-gray-950", accent: "text-gray-800", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2018", headquarters: "Bengaluru, India", employees: "800+", description: "CRED is a fintech platform for credit card users offering rewards and payments.", interviewRounds: ["Coding Test", "System Design", "Technical Deep Dive", "Culture Fit"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "CRED Interview Questions 2026 | Fintech | MedhaHub", description: "CRED interview questions for engineering and design roles.", keywords: "CRED interview questions 2026" } },
    { slug: "walmart-labs", name: "Walmart Global Tech", shortName: "Walmart Tech", logo: "🛒", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2007", headquarters: "Bengaluru, India", employees: "10,000+", description: "Walmart Global Tech India builds technology powering the world's largest retailer.", interviewRounds: ["Online Assessment", "Coding (2 rounds)", "System Design", "HR"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Walmart Tech Interview Questions 2026 | Retail | MedhaHub", description: "Walmart Global Tech interview questions for SDE roles.", keywords: "Walmart Labs interview questions 2026" } },
    { slug: "expedia", name: "Expedia Group", shortName: "Expedia", logo: "✈️", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "1996", headquarters: "Seattle, USA", employees: "17,100+", description: "Expedia Group is a global online travel and bookings technology company.", interviewRounds: ["Online Assessment", "Phone Screen", "Coding Round", "System Design"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Expedia Interview Questions 2026 | Travel Tech | MedhaHub", description: "Expedia interview questions for engineering roles.", keywords: "Expedia interview questions 2026" } },
    { slug: "booking", name: "Booking.com", shortName: "Booking", logo: "🏨", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1996", headquarters: "Amsterdam, Netherlands", employees: "21,500+", description: "Booking.com is the world's leading online travel agency.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Booking.com Interview Questions 2026 | MedhaHub", description: "Booking.com interview questions for engineering roles.", keywords: "Booking.com interview questions 2026" } },
    { slug: "grab", name: "Grab", shortName: "Grab", logo: "🚗", color: "from-green-500 to-green-700", accent: "text-green-500", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2012", headquarters: "Singapore", employees: "11,000+", description: "Grab is Southeast Asia's leading superapp for rides, food, and payments.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Grab Interview Questions 2026 | SuperApp | MedhaHub", description: "Grab interview questions for engineering roles.", keywords: "Grab interview questions 2026" } },
    { slug: "gojek", name: "GoTo (Gojek)", shortName: "Gojek", logo: "🟢", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2010", headquarters: "Jakarta, Indonesia", employees: "9,000+", description: "GoTo (Gojek+Tokopedia) is Indonesia's largest tech group with a Bengaluru R&D hub.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Gojek Interview Questions 2026 | SuperApp | MedhaHub", description: "Gojek interview questions for engineering roles.", keywords: "Gojek interview questions 2026, GoTo interview" } },
    { slug: "samsung-rd", name: "Samsung R&D India", shortName: "Samsung R&D", logo: "📱", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1991", headquarters: "Bengaluru, India", employees: "10,000+", description: "Samsung R&D Institute India is Samsung's largest R&D center outside Korea.", interviewRounds: ["Online Test", "Technical Interview (2 rounds)", "HR Interview"], avgPackage: "₹14 – ₹30 LPA", seo: { title: "Samsung R&D India Interview Questions 2026 | MedhaHub", description: "Samsung R&D India interview questions for engineering roles.", keywords: "Samsung R&D India interview questions 2026, SRI-B interview" } },
    { slug: "directi", name: "Directi", shortName: "Directi", logo: "🔵", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1998", headquarters: "Mumbai, India", employees: "2,500+", description: "Directi is a tech conglomerate that built Radix, Flock, Zeta, and Media.net.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Directi Interview Questions 2026 | MedhaHub", description: "Directi interview questions for engineering roles.", keywords: "Directi interview questions 2026" } },
    { slug: "zeta-suite", name: "Zeta", shortName: "Zeta", logo: "💳", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "2,000+", description: "Zeta is a banking-tech company powering next-gen digital banking for issuers.", interviewRounds: ["Coding Test", "Technical (2 rounds)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Zeta Interview Questions 2026 | Banking Tech | MedhaHub", description: "Zeta interview questions for engineering roles.", keywords: "Zeta interview questions 2026" } },
    { slug: "k2-pure", name: "K2 Pure Solutions", shortName: "K2 Pure", logo: "🧊", color: "from-cyan-500 to-cyan-700", accent: "text-cyan-500", bgAccent: "bg-cyan-50 dark:bg-cyan-950/30", founded: "2006", headquarters: "Vancouver, Canada", employees: "500+", description: "K2 Pure Solutions provides potassium-based chemicals and has growing tech ops.", interviewRounds: ["Technical Interview", "HR Interview"], avgPackage: "₹5 – ₹10 LPA", seo: { title: "K2 Pure Solutions Interview Questions 2026 | MedhaHub", description: "K2 Pure Solutions interview questions.", keywords: "K2 Pure Solutions interview questions 2026" } },
    { slug: "quora", name: "Quora", shortName: "Quora", logo: "❓", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2009", headquarters: "Mountain View, USA", employees: "800+", description: "Quora is a global knowledge-sharing platform with ML-driven content.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Quora Interview Questions 2026 | ML & Platform | MedhaHub", description: "Quora interview questions for ML and engineering roles.", keywords: "Quora interview questions 2026" } },
    { slug: "nutanix", name: "Nutanix", shortName: "Nutanix", logo: "☁️", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2009", headquarters: "San Jose, USA", employees: "7,000+", description: "Nutanix provides hyperconverged infrastructure and multi-cloud computing.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Nutanix Interview Questions 2026 | HCI & Cloud | MedhaHub", description: "Nutanix interview questions for engineering roles.", keywords: "Nutanix interview questions 2026" } },
    { slug: "rubrik", name: "Rubrik", shortName: "Rubrik", logo: "💎", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2014", headquarters: "Palo Alto, USA", employees: "3,500+", description: "Rubrik provides Zero Trust data security and cloud data management.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Rubrik Interview Questions 2026 | Data Security | MedhaHub", description: "Rubrik interview questions for engineering roles.", keywords: "Rubrik interview questions 2026" } },
    { slug: "cohesity", name: "Cohesity", shortName: "Cohesity", logo: "🔷", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2013", headquarters: "San Jose, USA", employees: "2,500+", description: "Cohesity provides modern data management and security for the multi-cloud era.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "HR"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Cohesity Interview Questions 2026 | Data Management | MedhaHub", description: "Cohesity interview questions for engineering roles.", keywords: "Cohesity interview questions 2026" } },
    { slug: "tower-research", name: "Tower Research Capital", shortName: "Tower Research", logo: "📈", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1998", headquarters: "New York, USA", employees: "1,200+", description: "Tower Research Capital is a quantitative trading and technology firm.", interviewRounds: ["Quant Test", "Coding Round", "System Design", "Brain Teasers"], avgPackage: "₹25 – ₹60 LPA", seo: { title: "Tower Research Capital Interview Questions 2026 | Quant | MedhaHub", description: "Tower Research Capital interview questions for quant and SDE roles.", keywords: "Tower Research interview questions 2026" } },

    // ── 100 New Companies (April 2026 expansion) ──
    { slug: "info-edge", name: "InfoEdge India", shortName: "InfoEdge", logo: "💼", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1995", headquarters: "Noida, India", employees: "5,000+", description: "InfoEdge India runs Naukri.com, 99acres, Jeevansathi, and Shiksha — India's leading internet classified platforms.", interviewRounds: ["Online Assessment", "Technical Interview (2 rounds)", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "InfoEdge Interview Questions 2026 | Naukri.com | MedhaHub", description: "InfoEdge India interview questions for SDE and product roles. Naukri.com, 99acres technical preparation.", keywords: "InfoEdge interview questions 2026, Naukri.com interview, InfoEdge SDE" } },
    { slug: "indiamart", name: "IndiaMART InterMESH", shortName: "IndiaMART", logo: "🏭", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1996", headquarters: "Noida, India", employees: "10,000+", description: "IndiaMART is India's largest online B2B marketplace connecting buyers with suppliers.", interviewRounds: ["Aptitude Test", "Technical Interview", "Managerial Round", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "IndiaMART Interview Questions 2026 | B2B Marketplace | MedhaHub", description: "IndiaMART interview questions for software and product roles.", keywords: "IndiaMART interview questions 2026, IndiaMART SDE interview" } },
    { slug: "justdial", name: "JustDial", shortName: "JustDial", logo: "📞", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "1996", headquarters: "Mumbai, India", employees: "8,000+", description: "JustDial is India's leading local search engine providing business listings and hyperlocal services.", interviewRounds: ["Aptitude Test", "Technical Interview", "HR Round"], avgPackage: "₹5 – ₹15 LPA", seo: { title: "JustDial Interview Questions 2026 | MedhaHub", description: "JustDial interview questions for software and engineering roles.", keywords: "JustDial interview questions 2026, JustDial developer interview" } },
    { slug: "physicswallah", name: "Physics Wallah", shortName: "PW", logo: "📚", color: "from-green-500 to-teal-600", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2020", headquarters: "Prayagraj, India", employees: "5,000+", description: "Physics Wallah is India's most affordable edtech unicorn democratising quality education for Tier 2 and Tier 3 cities.", interviewRounds: ["Coding Test", "Technical Interview", "DSA Round", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Physics Wallah Interview Questions 2026 | Edtech | MedhaHub", description: "Physics Wallah interview questions for SDE and product roles at PW.", keywords: "Physics Wallah interview questions 2026, PW edtech interview" } },
    { slug: "vedantu", name: "Vedantu", shortName: "Vedantu", logo: "🎓", color: "from-purple-500 to-purple-700", accent: "text-purple-500", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2014", headquarters: "Bengaluru, India", employees: "3,000+", description: "Vedantu is a live online tutoring platform using AI to personalise learning for K-12 and competitive exam students.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Vedantu Interview Questions 2026 | Edtech | MedhaHub", description: "Vedantu interview questions for software engineering roles.", keywords: "Vedantu interview questions 2026, Vedantu SDE interview" } },
    { slug: "upgrad", name: "upGrad", shortName: "upGrad", logo: "🚀", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2015", headquarters: "Mumbai, India", employees: "4,000+", description: "upGrad is India's largest higher edtech platform offering professional certifications and online degrees.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "Culture Fit"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "upGrad Interview Questions 2026 | Edtech | MedhaHub", description: "upGrad interview questions for SDE and backend engineering roles.", keywords: "upGrad interview questions 2026, upGrad SDE interview" } },
    { slug: "ather-energy", name: "Ather Energy", shortName: "Ather", logo: "⚡", color: "from-slate-700 to-slate-900", accent: "text-slate-700", bgAccent: "bg-slate-50 dark:bg-slate-950/30", founded: "2013", headquarters: "Bengaluru, India", employees: "3,500+", description: "Ather Energy designs and manufactures premium electric scooters with connected technology.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹32 LPA", seo: { title: "Ather Energy Interview Questions 2026 | EV Tech | MedhaHub", description: "Ather Energy interview questions for software and embedded engineering roles.", keywords: "Ather Energy interview questions 2026, Ather EV tech interview" } },
    { slug: "blackbuck", name: "BlackBuck", shortName: "BlackBuck", logo: "🚚", color: "from-yellow-600 to-yellow-800", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "2,000+", description: "BlackBuck is India's largest digital trucking platform managing freight logistics at scale.", interviewRounds: ["Coding Test", "DSA Round", "System Design", "Hiring Manager"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "BlackBuck Interview Questions 2026 | Logistics Tech | MedhaHub", description: "BlackBuck interview questions for SDE and data engineering roles.", keywords: "BlackBuck interview questions 2026, BlackBuck logistics tech" } },
    { slug: "ninjacart", name: "Ninjacart", shortName: "Ninjacart", logo: "🥦", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "5,000+", description: "Ninjacart is India's largest agri-commerce platform connecting farmers directly to retailers using technology.", interviewRounds: ["Technical Test", "Coding Round", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Ninjacart Interview Questions 2026 | Agri Tech | MedhaHub", description: "Ninjacart interview questions for software and data engineering roles.", keywords: "Ninjacart interview questions 2026, Ninjacart agri-tech interview" } },
    { slug: "licious", name: "Licious", shortName: "Licious", logo: "🥩", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "3,000+", description: "Licious is India's D2C meat and seafood platform with full cold-chain vertical integration.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹25 LPA", seo: { title: "Licious Interview Questions 2026 | D2C Food Tech | MedhaHub", description: "Licious interview questions for software engineering roles.", keywords: "Licious interview questions 2026" } },
    { slug: "cleartax", name: "Clear (ClearTax)", shortName: "ClearTax", logo: "🧾", color: "from-green-500 to-teal-600", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2011", headquarters: "Bengaluru, India", employees: "2,500+", description: "Clear is India's leading tax and compliance SaaS platform powering ITR filing, GST, and enterprise finance.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "ClearTax Interview Questions 2026 | FinTech | MedhaHub", description: "ClearTax (Clear) interview questions for SDE and product roles.", keywords: "ClearTax interview questions 2026, Clear fintech interview" } },
    { slug: "niyo", name: "Niyo", shortName: "Niyo", logo: "💳", color: "from-indigo-500 to-indigo-700", accent: "text-indigo-500", bgAccent: "bg-indigo-50 dark:bg-indigo-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "800+", description: "Niyo is a neobank offering salary accounts and international forex cards for salaried millennials.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹32 LPA", seo: { title: "Niyo Interview Questions 2026 | Neobank | MedhaHub", description: "Niyo interview questions for software and fintech engineering roles.", keywords: "Niyo interview questions 2026, Niyo neobank interview" } },
    { slug: "cashfree", name: "Cashfree Payments", shortName: "Cashfree", logo: "💸", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2015", headquarters: "Bengaluru, India", employees: "1,000+", description: "Cashfree Payments is an API-first payment gateway and banking API platform for businesses.", interviewRounds: ["Coding Test", "DSA Round", "System Design", "Culture Fit"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Cashfree Payments Interview Questions 2026 | FinTech | MedhaHub", description: "Cashfree Payments interview questions for SDE and backend roles.", keywords: "Cashfree interview questions 2026, Cashfree Payments SDE" } },
    { slug: "billdesk", name: "BillDesk", shortName: "BillDesk", logo: "🏦", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2000", headquarters: "Mumbai, India", employees: "1,500+", description: "BillDesk is India's pioneer online payment gateway processing billions of transactions for banks and utilities.", interviewRounds: ["Technical Test", "Coding Round", "System Design", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "BillDesk Interview Questions 2026 | Payments | MedhaHub", description: "BillDesk interview questions for engineering and platform roles.", keywords: "BillDesk interview questions 2026" } },
    { slug: "nobroker", name: "NoBroker", shortName: "NoBroker", logo: "🏠", color: "from-red-500 to-orange-600", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2014", headquarters: "Bengaluru, India", employees: "4,500+", description: "NoBroker is a proptech unicorn enabling direct rental and sale transactions eliminating middlemen.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "NoBroker Interview Questions 2026 | PropTech | MedhaHub", description: "NoBroker interview questions for software engineering and backend roles.", keywords: "NoBroker interview questions 2026, NoBroker proptech" } },
    { slug: "housing-com", name: "Housing.com", shortName: "Housing", logo: "🏡", color: "from-teal-500 to-teal-700", accent: "text-teal-500", bgAccent: "bg-teal-50 dark:bg-teal-950/30", founded: "2012", headquarters: "Mumbai, India", employees: "2,000+", description: "Housing.com (REA India) is a leading proptech platform for real estate search and transactions.", interviewRounds: ["Technical Test", "Coding Round", "System Design", "HR"], avgPackage: "₹12 – ₹25 LPA", seo: { title: "Housing.com Interview Questions 2026 | PropTech | MedhaHub", description: "Housing.com interview questions for software engineering roles.", keywords: "Housing.com interview questions 2026" } },
    { slug: "ixigo", name: "ixigo", shortName: "ixigo", logo: "🚆", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2007", headquarters: "Gurugram, India", employees: "1,000+", description: "ixigo is India's leading AI-powered travel app for trains, flights, and buses.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "ixigo Interview Questions 2026 | Travel Tech | MedhaHub", description: "ixigo interview questions for SDE and backend engineering roles.", keywords: "ixigo interview questions 2026, ixigo travel tech" } },
    { slug: "intellect-design", name: "Intellect Design Arena", shortName: "Intellect", logo: "🧠", color: "from-blue-600 to-indigo-700", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2011", headquarters: "Chennai, India", employees: "5,000+", description: "Intellect Design Arena is a global fintech product company building banking and insurance platforms.", interviewRounds: ["Technical Test", "Coding Round", "Domain Round", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "Intellect Design Arena Interview Questions 2026 | Fintech | MedhaHub", description: "Intellect Design Arena interview questions for product engineering roles.", keywords: "Intellect Design Arena interview questions 2026" } },
    { slug: "nucleus-software", name: "Nucleus Software", shortName: "Nucleus", logo: "⚙️", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1989", headquarters: "Noida, India", employees: "2,000+", description: "Nucleus Software builds FinnOne Neo — the world's number one retail lending platform used by 200+ banks.", interviewRounds: ["Technical Test", "Java/Product Round", "Domain Round", "HR"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "Nucleus Software Interview Questions 2026 | Banking Software | MedhaHub", description: "Nucleus Software Exports interview questions for Java developers.", keywords: "Nucleus Software interview questions 2026" } },
    { slug: "perfios", name: "Perfios", shortName: "Perfios", logo: "📊", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2008", headquarters: "Bengaluru, India", employees: "1,500+", description: "Perfios is a B2B fintech SaaS company providing real-time data aggregation and analytics for financial services.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Perfios Interview Questions 2026 | Fintech SaaS | MedhaHub", description: "Perfios interview questions for SDE and data engineering roles.", keywords: "Perfios interview questions 2026" } },
    { slug: "hdfc-bank", name: "HDFC Bank", shortName: "HDFC Bank", logo: "🏦", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1994", headquarters: "Mumbai, India", employees: "1,77,000+", description: "HDFC Bank is India's largest private sector bank with a cutting-edge technology and digital banking division.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "HDFC Bank Interview Questions 2026 | Banking Tech | MedhaHub", description: "HDFC Bank IT division interview questions for software engineers.", keywords: "HDFC Bank interview questions 2026, HDFC Bank IT interview" } },
    { slug: "icici-bank", name: "ICICI Bank", shortName: "ICICI Bank", logo: "🏦", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "1994", headquarters: "Mumbai, India", employees: "1,00,000+", description: "ICICI Bank is India's second-largest private bank with iMobile, trade services, and API banking platforms.", interviewRounds: ["Online Assessment", "Technical Interview", "Domain Round", "HR"], avgPackage: "₹8 – ₹22 LPA", seo: { title: "ICICI Bank Interview Questions 2026 | Banking Tech | MedhaHub", description: "ICICI Bank IT division interview questions for software and data engineers.", keywords: "ICICI Bank interview questions 2026, ICICI IT interview" } },
    { slug: "axis-bank", name: "Axis Bank", shortName: "Axis Bank", logo: "🏦", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "1993", headquarters: "Mumbai, India", employees: "75,000+", description: "Axis Bank is India's third-largest private bank running Axis Mobile and API banking innovations.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹8 – ₹18 LPA", seo: { title: "Axis Bank Interview Questions 2026 | Banking Tech | MedhaHub", description: "Axis Bank IT interview questions for software and product engineers.", keywords: "Axis Bank interview questions 2026, Axis Bank IT interview" } },
    { slug: "kotak", name: "Kotak Mahindra Bank", shortName: "Kotak", logo: "🔴", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2003", headquarters: "Mumbai, India", employees: "60,000+", description: "Kotak Mahindra Bank is India's fourth-largest private bank innovating with Kotak 811 digital banking.", interviewRounds: ["Online Assessment", "Technical Interview", "Domain Round", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "Kotak Mahindra Bank Interview Questions 2026 | MedhaHub", description: "Kotak Mahindra Bank IT interview questions for software engineers.", keywords: "Kotak Mahindra Bank interview questions 2026, Kotak IT interview" } },
    { slug: "sbi-tech", name: "State Bank of India (Tech)", shortName: "SBI Tech", logo: "🇮🇳", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1955", headquarters: "Mumbai, India", employees: "2,30,000+", description: "SBI is India's largest public sector bank with YONO, one of the world's largest banking super-apps.", interviewRounds: ["GATE / Written Test", "Group Discussion", "Technical Interview", "HR"], avgPackage: "₹7 – ₹15 LPA", seo: { title: "SBI Interview Questions 2026 | Banking Tech | MedhaHub", description: "State Bank of India IT/tech interview questions for software engineers.", keywords: "SBI interview questions 2026, SBI IT officer interview, YONO tech" } },
    { slug: "synopsys", name: "Synopsys", shortName: "Synopsys", logo: "🔬", color: "from-purple-700 to-purple-900", accent: "text-purple-700", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "1986", headquarters: "Sunnyvale, USA", employees: "20,000+", description: "Synopsys is the world's leading EDA company providing chip design, verification, and silicon IP solutions.", interviewRounds: ["Online Assessment", "Technical (2 rounds)", "DSA + C++", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Synopsys Interview Questions 2026 | EDA & Chip Design | MedhaHub", description: "Synopsys interview questions for EDA, verification, and software engineering roles.", keywords: "Synopsys interview questions 2026, Synopsys EDA interview" } },
    { slug: "cadence", name: "Cadence Design Systems", shortName: "Cadence", logo: "🔷", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1988", headquarters: "San Jose, USA", employees: "10,000+", description: "Cadence Design Systems provides EDA software, custom IC layout tools, and semiconductor IP.", interviewRounds: ["Online Assessment", "Technical Interview (C++/DSA)", "System Design", "HR"], avgPackage: "₹15 – ₹38 LPA", seo: { title: "Cadence Design Systems Interview Questions 2026 | EDA | MedhaHub", description: "Cadence Design Systems interview questions for EDA and software engineering roles.", keywords: "Cadence interview questions 2026, Cadence EDA interview" } },
    { slug: "arm", name: "ARM Holdings", shortName: "ARM", logo: "💪", color: "from-blue-700 to-indigo-800", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1990", headquarters: "Cambridge, UK", employees: "7,000+", description: "ARM designs the world's most widely used processor architecture powering 99% of smartphones and IoT devices.", interviewRounds: ["Online Assessment", "Technical Interview (C/C++/Architecture)", "System Design", "HR"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "ARM Holdings Interview Questions 2026 | Processor Architecture | MedhaHub", description: "ARM interview questions for chip architecture, firmware, and software engineering roles.", keywords: "ARM interview questions 2026, ARM processor interview" } },
    { slug: "marvell", name: "Marvell Technology", shortName: "Marvell", logo: "⚙️", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1995", headquarters: "Santa Clara, USA", employees: "10,000+", description: "Marvell Technology provides storage, networking, and infrastructure semiconductor solutions.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Embedded)", "System Design", "HR"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "Marvell Technology Interview Questions 2026 | Semiconductors | MedhaHub", description: "Marvell Technology interview questions for hardware and software engineering roles.", keywords: "Marvell interview questions 2026" } },
    { slug: "broadcom", name: "Broadcom", shortName: "Broadcom", logo: "📡", color: "from-red-700 to-red-900", accent: "text-red-700", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1991", headquarters: "San Jose, USA", employees: "39,000+", description: "Broadcom designs semiconductors for networking, broadband, storage, and enterprise software (VMware).", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹50 LPA", seo: { title: "Broadcom Interview Questions 2026 | Semiconductor & Software | MedhaHub", description: "Broadcom interview questions for network engineering and software roles.", keywords: "Broadcom interview questions 2026, Broadcom VMware interview" } },
    { slug: "autodesk", name: "Autodesk", shortName: "Autodesk", logo: "📐", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1982", headquarters: "San Francisco, USA", employees: "13,000+", description: "Autodesk makes AutoCAD, Revit, Fusion 360, and Maya — software for architecture, engineering, and media.", interviewRounds: ["Online Assessment", "Coding Round (Python/C++)", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Autodesk Interview Questions 2026 | CAD & Design Software | MedhaHub", description: "Autodesk interview questions for software engineering and data roles.", keywords: "Autodesk interview questions 2026" } },
    { slug: "ansys", name: "ANSYS", shortName: "ANSYS", logo: "🔭", color: "from-yellow-600 to-yellow-800", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "1970", headquarters: "Canonsburg, USA", employees: "6,000+", description: "ANSYS provides simulation software for structural, thermal, fluid, and electromagnetics engineering.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Math)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "ANSYS Interview Questions 2026 | Simulation Software | MedhaHub", description: "ANSYS interview questions for software engineering and simulation roles.", keywords: "ANSYS interview questions 2026" } },
    { slug: "dassault", name: "Dassault Systèmes", shortName: "Dassault", logo: "✈️", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1981", headquarters: "Vélizy-Villacoublay, France", employees: "22,000+", description: "Dassault Systèmes makes SOLIDWORKS, CATIA, and 3DEXPERIENCE — 3D design and PLM software for industry.", interviewRounds: ["Online Assessment", "Technical Interview (C++/3D Math)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Dassault Systèmes Interview Questions 2026 | PLM & 3D | MedhaHub", description: "Dassault Systèmes interview questions for SDE and computational roles.", keywords: "Dassault Systemes interview questions 2026, SOLIDWORKS CATIA interview" } },
    { slug: "veeva", name: "Veeva Systems", shortName: "Veeva", logo: "💊", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2007", headquarters: "Pleasanton, USA", employees: "7,000+", description: "Veeva Systems provides cloud software for life sciences — CRM, regulatory, and clinical data management.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Veeva Systems Interview Questions 2026 | Life Sciences SaaS | MedhaHub", description: "Veeva Systems interview questions for software engineering roles in pharma tech.", keywords: "Veeva Systems interview questions 2026" } },
    { slug: "iqvia", name: "IQVIA", shortName: "IQVIA", logo: "🏥", color: "from-teal-600 to-teal-800", accent: "text-teal-600", bgAccent: "bg-teal-50 dark:bg-teal-950/30", founded: "2016", headquarters: "Durham, USA", employees: "85,000+", description: "IQVIA provides healthcare data, analytics, and technology solutions to life sciences companies globally.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "IQVIA Interview Questions 2026 | Healthcare Tech | MedhaHub", description: "IQVIA interview questions for data engineering and software roles.", keywords: "IQVIA interview questions 2026, IQVIA healthcare data interview" } },
    { slug: "hubspot", name: "HubSpot", shortName: "HubSpot", logo: "🧲", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2006", headquarters: "Cambridge, USA", employees: "8,000+", description: "HubSpot is a leading CRM and inbound marketing SaaS platform used by 200,000+ businesses globally.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "HubSpot Interview Questions 2026 | CRM SaaS | MedhaHub", description: "HubSpot interview questions for software engineering and product roles.", keywords: "HubSpot interview questions 2026" } },
    { slug: "zendesk", name: "Zendesk", shortName: "Zendesk", logo: "🎧", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2007", headquarters: "San Francisco, USA", employees: "6,000+", description: "Zendesk provides cloud-based customer service software and CRM tools used by 100,000+ companies.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Zendesk Interview Questions 2026 | Customer Service SaaS | MedhaHub", description: "Zendesk interview questions for software engineering roles.", keywords: "Zendesk interview questions 2026" } },
    { slug: "pagerduty", name: "PagerDuty", shortName: "PagerDuty", logo: "🚨", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2009", headquarters: "San Francisco, USA", employees: "1,500+", description: "PagerDuty provides digital operations management and incident response for enterprise reliability.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "PagerDuty Interview Questions 2026 | DevOps | MedhaHub", description: "PagerDuty interview questions for software and reliability engineering roles.", keywords: "PagerDuty interview questions 2026" } },
    { slug: "sentry", name: "Sentry", shortName: "Sentry", logo: "🛡️", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2012", headquarters: "San Francisco, USA", employees: "600+", description: "Sentry is an open-source error monitoring and performance tracking platform used by 90,000+ companies.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Team Interview"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "Sentry Interview Questions 2026 | Error Monitoring | MedhaHub", description: "Sentry interview questions for software engineering and DevOps roles.", keywords: "Sentry interview questions 2026" } },
    { slug: "grafana", name: "Grafana Labs", shortName: "Grafana", logo: "📈", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2014", headquarters: "New York, USA", employees: "1,500+", description: "Grafana Labs develops the leading open-source observability platform for metrics, logs, and traces.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Grafana Labs Interview Questions 2026 | Observability | MedhaHub", description: "Grafana Labs interview questions for software and infrastructure engineering roles.", keywords: "Grafana Labs interview questions 2026" } },
    { slug: "fivetran", name: "Fivetran", shortName: "Fivetran", logo: "🔄", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2012", headquarters: "Oakland, USA", employees: "1,500+", description: "Fivetran provides automated data movement, syncing databases and APIs into cloud warehouses.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Fivetran Interview Questions 2026 | Data Integration | MedhaHub", description: "Fivetran interview questions for data and software engineering roles.", keywords: "Fivetran interview questions 2026" } },
    { slug: "informatica", name: "Informatica", shortName: "Informatica", logo: "🗄️", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "1993", headquarters: "Redwood City, USA", employees: "5,000+", description: "Informatica is a leading enterprise cloud data management platform for data integration, governance, and quality.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹30 LPA", seo: { title: "Informatica Interview Questions 2026 | Data Management | MedhaHub", description: "Informatica interview questions for data engineering and software roles.", keywords: "Informatica interview questions 2026" } },
    { slug: "mulesoft", name: "MuleSoft", shortName: "MuleSoft", logo: "🔗", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2006", headquarters: "San Francisco, USA", employees: "3,000+", description: "MuleSoft (a Salesforce company) provides the Anypoint Platform for API-led connectivity and integration.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "MuleSoft Interview Questions 2026 | API Integration | MedhaHub", description: "MuleSoft interview questions for integration and software engineering roles.", keywords: "MuleSoft interview questions 2026, MuleSoft Anypoint interview" } },
    { slug: "zapier", name: "Zapier", shortName: "Zapier", logo: "⚡", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2011", headquarters: "Sunnyvale, USA", employees: "800+", description: "Zapier is a no-code automation platform connecting 6,000+ apps, used by 2M+ businesses worldwide.", interviewRounds: ["Take-home Project", "Technical Interview", "System Design", "Team Interview"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Zapier Interview Questions 2026 | Automation | MedhaHub", description: "Zapier interview questions for software engineering and product roles.", keywords: "Zapier interview questions 2026" } },
    { slug: "docusign", name: "DocuSign", shortName: "DocuSign", logo: "✍️", color: "from-yellow-600 to-yellow-800", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2003", headquarters: "San Francisco, USA", employees: "7,000+", description: "DocuSign provides the world's leading electronic signature and agreement cloud platform.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "DocuSign Interview Questions 2026 | eSign SaaS | MedhaHub", description: "DocuSign interview questions for software engineering and platform roles.", keywords: "DocuSign interview questions 2026" } },
    { slug: "doordash", name: "DoorDash", shortName: "DoorDash", logo: "🍔", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2013", headquarters: "San Francisco, USA", employees: "22,000+", description: "DoorDash is America's largest food delivery and local commerce platform with real-time logistics tech.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "DoorDash Interview Questions 2026 | Food Delivery Tech | MedhaHub", description: "DoorDash interview questions for SDE and data engineering roles.", keywords: "DoorDash interview questions 2026, DoorDash SDE interview" } },
    { slug: "lyft", name: "Lyft", shortName: "Lyft", logo: "🚗", color: "from-pink-600 to-pink-800", accent: "text-pink-600", bgAccent: "bg-pink-50 dark:bg-pink-950/30", founded: "2012", headquarters: "San Francisco, USA", employees: "5,000+", description: "Lyft is the second-largest US ridesharing platform with mapping, payments, and driver intelligence tech.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹22 – ₹55 LPA", seo: { title: "Lyft Interview Questions 2026 | Ridesharing Tech | MedhaHub", description: "Lyft interview questions for SDE, data, and ML engineering roles.", keywords: "Lyft interview questions 2026" } },
    { slug: "pinterest", name: "Pinterest", shortName: "Pinterest", logo: "📌", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2010", headquarters: "San Francisco, USA", employees: "3,000+", description: "Pinterest is a visual discovery and inspiration platform with 500M+ monthly users and ML-driven recommendations.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "Pinterest Interview Questions 2026 | Visual Discovery | MedhaHub", description: "Pinterest interview questions for SDE and ML engineering roles.", keywords: "Pinterest interview questions 2026" } },
    { slug: "reddit", name: "Reddit", shortName: "Reddit", logo: "🤖", color: "from-orange-500 to-orange-700", accent: "text-orange-500", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2005", headquarters: "San Francisco, USA", employees: "2,000+", description: "Reddit is the front page of the internet — a network of communities with massive scale, ML, and content moderation.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "Reddit Interview Questions 2026 | Social Platform | MedhaHub", description: "Reddit interview questions for software engineering and infrastructure roles.", keywords: "Reddit interview questions 2026" } },
    { slug: "discord", name: "Discord", shortName: "Discord", logo: "💬", color: "from-indigo-500 to-indigo-700", accent: "text-indigo-500", bgAccent: "bg-indigo-50 dark:bg-indigo-950/30", founded: "2015", headquarters: "San Francisco, USA", employees: "800+", description: "Discord is a voice, video, and text communication platform with 600M+ users and real-time infrastructure.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹22 – ₹50 LPA", seo: { title: "Discord Interview Questions 2026 | Communications Platform | MedhaHub", description: "Discord interview questions for backend and infrastructure engineering roles.", keywords: "Discord interview questions 2026" } },
    { slug: "zoom", name: "Zoom Video Communications", shortName: "Zoom", logo: "📹", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2011", headquarters: "San Jose, USA", employees: "7,400+", description: "Zoom provides cloud-based video conferencing, webinars, and Zoom Phone used by 500M+ daily meeting participants.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "Zoom Interview Questions 2026 | Video Conferencing | MedhaHub", description: "Zoom interview questions for software and infrastructure engineering roles.", keywords: "Zoom interview questions 2026" } },
    { slug: "dropbox", name: "Dropbox", shortName: "Dropbox", logo: "📦", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2007", headquarters: "San Francisco, USA", employees: "2,500+", description: "Dropbox provides cloud storage, collaboration tools, and document workflows used by 700M+ registered users.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "Dropbox Interview Questions 2026 | Cloud Storage | MedhaHub", description: "Dropbox interview questions for software and infrastructure engineering roles.", keywords: "Dropbox interview questions 2026" } },
    { slug: "duolingo", name: "Duolingo", shortName: "Duolingo", logo: "🦉", color: "from-green-500 to-green-700", accent: "text-green-500", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2011", headquarters: "Pittsburgh, USA", employees: "800+", description: "Duolingo is the world's most popular language learning app with 90M+ daily active learners and AI-driven pedagogy.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹45 LPA", seo: { title: "Duolingo Interview Questions 2026 | Edtech | MedhaHub", description: "Duolingo interview questions for software engineering and ML roles.", keywords: "Duolingo interview questions 2026" } },
    { slug: "coursera", name: "Coursera", shortName: "Coursera", logo: "🎓", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2012", headquarters: "Mountain View, USA", employees: "1,500+", description: "Coursera partners with 300+ universities to offer degrees, certificates, and professional courses online.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "Coursera Interview Questions 2026 | Edtech Platform | MedhaHub", description: "Coursera interview questions for software engineering and data roles.", keywords: "Coursera interview questions 2026" } },
    { slug: "udemy", name: "Udemy", shortName: "Udemy", logo: "📖", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2010", headquarters: "San Francisco, USA", employees: "1,700+", description: "Udemy hosts 220,000+ online courses and serves 65M+ learners worldwide with marketplace and enterprise products.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Udemy Interview Questions 2026 | Online Learning | MedhaHub", description: "Udemy interview questions for software engineering and product roles.", keywords: "Udemy interview questions 2026" } },
    { slug: "couchbase", name: "Couchbase", shortName: "Couchbase", logo: "🪣", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2011", headquarters: "Santa Clara, USA", employees: "700+", description: "Couchbase provides a distributed NoSQL cloud database platform with SQL-like querying (N1QL) capabilities.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Couchbase Interview Questions 2026 | NoSQL Database | MedhaHub", description: "Couchbase interview questions for database and software engineering roles.", keywords: "Couchbase interview questions 2026" } },
    { slug: "redis-inc", name: "Redis Inc", shortName: "Redis", logo: "🔴", color: "from-red-500 to-red-700", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2011", headquarters: "Mountain View, USA", employees: "1,000+", description: "Redis Inc develops Redis — the world's most popular in-memory data structure store used for caching and queues.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "Redis Inc Interview Questions 2026 | In-Memory DB | MedhaHub", description: "Redis interview questions for database and software engineering roles.", keywords: "Redis interview questions 2026, Redis Inc engineer interview" } },
    { slug: "neo4j", name: "Neo4j", shortName: "Neo4j", logo: "🕸️", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2007", headquarters: "San Mateo, USA", employees: "900+", description: "Neo4j is the world's leading graph database platform used for knowledge graphs and relationship-heavy data.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "Neo4j Interview Questions 2026 | Graph Database | MedhaHub", description: "Neo4j interview questions for database and software engineering roles.", keywords: "Neo4j interview questions 2026" } },
    { slug: "cockroachdb", name: "CockroachDB", shortName: "CockroachDB", logo: "🪳", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2015", headquarters: "New York, USA", employees: "700+", description: "CockroachDB provides a distributed SQL database built for cloud-native apps with strong consistency and geo-partitioning.", interviewRounds: ["Phone Screen", "Coding Round (Go/SQL)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "CockroachDB Interview Questions 2026 | Distributed SQL | MedhaHub", description: "CockroachDB interview questions for database and software engineering roles.", keywords: "CockroachDB interview questions 2026, Cockroach Labs interview" } },
    { slug: "yugabyte", name: "YugabyteDB", shortName: "YugabyteDB", logo: "🌀", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2016", headquarters: "Sunnyvale, USA", employees: "400+", description: "YugabyteDB is a high-performance, cloud-native, distributed SQL database compatible with PostgreSQL.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "YugabyteDB Interview Questions 2026 | Distributed SQL | MedhaHub", description: "YugabyteDB interview questions for database and backend engineering roles.", keywords: "YugabyteDB interview questions 2026, Yugabyte interview" } },
    { slug: "singlestore", name: "SingleStore", shortName: "SingleStore", logo: "🗃️", color: "from-purple-700 to-indigo-800", accent: "text-purple-700", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2011", headquarters: "San Francisco, USA", employees: "600+", description: "SingleStore provides a real-time distributed database for transactions and analytics with vector search support.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹40 LPA", seo: { title: "SingleStore Interview Questions 2026 | Real-time Database | MedhaHub", description: "SingleStore interview questions for database and software engineering roles.", keywords: "SingleStore interview questions 2026" } },
    { slug: "clickhouse", name: "ClickHouse", shortName: "ClickHouse", logo: "🟡", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2021", headquarters: "San Francisco, USA", employees: "300+", description: "ClickHouse is an open-source column-oriented OLAP database delivering blazing-fast analytical queries at scale.", interviewRounds: ["Phone Screen", "Coding Round (C++/SQL)", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "ClickHouse Interview Questions 2026 | OLAP Database | MedhaHub", description: "ClickHouse interview questions for database and analytical engineering roles.", keywords: "ClickHouse interview questions 2026" } },
    { slug: "planetscale", name: "PlanetScale", shortName: "PlanetScale", logo: "🌍", color: "from-gray-700 to-gray-900", accent: "text-gray-700", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "2018", headquarters: "San Francisco, USA", employees: "200+", description: "PlanetScale offers a serverless MySQL-compatible database with Vitess-powered horizontal sharding at any scale.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Team Interview"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "PlanetScale Interview Questions 2026 | Serverless MySQL | MedhaHub", description: "PlanetScale interview questions for database and backend engineering roles.", keywords: "PlanetScale interview questions 2026" } },
    { slug: "dbt-labs", name: "dbt Labs", shortName: "dbt Labs", logo: "🔧", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2016", headquarters: "Philadelphia, USA", employees: "500+", description: "dbt Labs builds dbt — the transformation layer of the modern data stack — enabling analytics engineers at scale.", interviewRounds: ["Phone Screen", "Technical Interview (SQL / Python)", "System Design", "Behavioral"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "dbt Labs Interview Questions 2026 | Data Transformation | MedhaHub", description: "dbt Labs interview questions for analytics and data engineering roles.", keywords: "dbt Labs interview questions 2026" } },
    { slug: "airbyte", name: "Airbyte", shortName: "Airbyte", logo: "🔌", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2020", headquarters: "San Francisco, USA", employees: "300+", description: "Airbyte is an open-source data integration platform with 500+ connectors for ELT pipelines.", interviewRounds: ["Phone Screen", "Coding Round (Python/Java)", "System Design", "Team Interview"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "Airbyte Interview Questions 2026 | Data Integration | MedhaHub", description: "Airbyte interview questions for data engineering and software roles.", keywords: "Airbyte interview questions 2026" } },
    { slug: "fis-global", name: "FIS Global", shortName: "FIS", logo: "💳", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1968", headquarters: "Jacksonville, USA", employees: "55,000+", description: "FIS is a global leader in banking, payments, and capital markets financial technology software.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "FIS Global Interview Questions 2026 | Fintech | MedhaHub", description: "FIS Global interview questions for software and financial engineering roles.", keywords: "FIS Global interview questions 2026, FIS fintech interview" } },
    { slug: "fiserv", name: "Fiserv", shortName: "Fiserv", logo: "🏦", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "1984", headquarters: "Brookfield, USA", employees: "40,000+", description: "Fiserv provides fintech solutions to banks, credit unions, and merchants including Clover POS and payments APIs.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Fiserv Interview Questions 2026 | FinTech | MedhaHub", description: "Fiserv interview questions for software and payment engineering roles.", keywords: "Fiserv interview questions 2026" } },
    { slug: "finastra", name: "Finastra", shortName: "Finastra", logo: "💹", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2017", headquarters: "London, UK", employees: "10,000+", description: "Finastra delivers banking software including Fusion Lending, Treasury, and Capital Markets platforms to 90% of the world's top banks.", interviewRounds: ["Online Assessment", "Technical Interview", "Domain Round", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Finastra Interview Questions 2026 | Banking Software | MedhaHub", description: "Finastra interview questions for software and banking domain engineering roles.", keywords: "Finastra interview questions 2026" } },
    { slug: "temenos", name: "Temenos", shortName: "Temenos", logo: "🏛️", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1993", headquarters: "Geneva, Switzerland", employees: "7,000+", description: "Temenos provides the world's leading core banking software platform used by 3,000+ banks in 150+ countries.", interviewRounds: ["Technical Test", "Java/COBOL Interview", "Domain Round", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Temenos Interview Questions 2026 | Core Banking | MedhaHub", description: "Temenos interview questions for banking software and Java engineering roles.", keywords: "Temenos interview questions 2026" } },
    { slug: "worldline", name: "Worldline", shortName: "Worldline", logo: "🌐", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1973", headquarters: "Bezons, France", employees: "20,000+", description: "Worldline is Europe's largest payment and transactional services technology company.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Worldline Interview Questions 2026 | Payments Tech | MedhaHub", description: "Worldline interview questions for payments and software engineering roles.", keywords: "Worldline interview questions 2026" } },
    { slug: "wells-fargo", name: "Wells Fargo", shortName: "Wells Fargo", logo: "🏦", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1852", headquarters: "San Francisco, USA", employees: "2,35,000+", description: "Wells Fargo is one of the largest US banks with major technology and software engineering hubs in India.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Wells Fargo Interview Questions 2026 | Banking Tech | MedhaHub", description: "Wells Fargo technology interview questions for software engineering roles.", keywords: "Wells Fargo interview questions 2026, Wells Fargo tech India" } },
    { slug: "bofa", name: "Bank of America", shortName: "BofA", logo: "🏦", color: "from-red-700 to-red-900", accent: "text-red-700", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1998", headquarters: "Charlotte, USA", employees: "2,10,000+", description: "Bank of America has a large technology centre in Hyderabad and Mumbai, building trading and digital banking platforms.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Bank of America Interview Questions 2026 | Banking Tech | MedhaHub", description: "Bank of America technology interview questions for software engineers in India.", keywords: "Bank of America interview questions 2026, BofA tech India" } },
    { slug: "charles-schwab", name: "Charles Schwab", shortName: "Schwab", logo: "📊", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1971", headquarters: "Westlake, USA", employees: "35,000+", description: "Charles Schwab is a leading US brokerage and financial services firm with a growing tech center in India.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹15 – ₹32 LPA", seo: { title: "Charles Schwab Interview Questions 2026 | FinTech | MedhaHub", description: "Charles Schwab technology interview questions for software engineering roles.", keywords: "Charles Schwab interview questions 2026" } },
    { slug: "fidelity", name: "Fidelity Investments", shortName: "Fidelity", logo: "📈", color: "from-green-700 to-green-900", accent: "text-green-700", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "1946", headquarters: "Boston, USA", employees: "75,000+", description: "Fidelity Investments is the world's largest mutual fund company with a major software engineering centre in India.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Fidelity Investments Interview Questions 2026 | FinTech | MedhaHub", description: "Fidelity Investments technology interview questions for software engineers.", keywords: "Fidelity Investments interview questions 2026, Fidelity tech India" } },
    { slug: "scale-ai", name: "Scale AI", shortName: "Scale AI", logo: "🤖", color: "from-purple-600 to-purple-800", accent: "text-purple-600", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2016", headquarters: "San Francisco, USA", employees: "1,000+", description: "Scale AI provides high-quality data labeling and evaluation for AI systems, powering GPT, autonomous vehicles, and defense AI.", interviewRounds: ["Phone Screen", "Coding (2 rounds)", "System Design", "Behavioral"], avgPackage: "₹22 – ₹55 LPA", seo: { title: "Scale AI Interview Questions 2026 | AI Data | MedhaHub", description: "Scale AI interview questions for software and ML engineering roles.", keywords: "Scale AI interview questions 2026" } },
    { slug: "weights-biases", name: "Weights & Biases", shortName: "W&B", logo: "🏋️", color: "from-yellow-600 to-yellow-800", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2018", headquarters: "San Francisco, USA", employees: "400+", description: "Weights & Biases provides the leading MLOps platform for experiment tracking, model management, and LLM observability.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Team Interview"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "Weights & Biases Interview Questions 2026 | MLOps | MedhaHub", description: "Weights & Biases interview questions for ML engineering and platform roles.", keywords: "Weights and Biases interview questions 2026, W&B interview" } },
    { slug: "hugging-face", name: "Hugging Face", shortName: "Hugging Face", logo: "🤗", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2016", headquarters: "New York, USA", employees: "400+", description: "Hugging Face is the GitHub for AI — hosting 500,000+ ML models and datasets with Transformers library.", interviewRounds: ["Phone Screen", "Coding Round (Python/ML)", "System Design", "Team Interview"], avgPackage: "₹22 – ₹55 LPA", seo: { title: "Hugging Face Interview Questions 2026 | AI Platform | MedhaHub", description: "Hugging Face interview questions for ML and software engineering roles.", keywords: "Hugging Face interview questions 2026" } },
    { slug: "pinecone", name: "Pinecone", shortName: "Pinecone", logo: "🌲", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2019", headquarters: "San Francisco, USA", employees: "300+", description: "Pinecone provides the leading fully managed vector database for similarity search and RAG applications.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Team Interview"], avgPackage: "₹22 – ₹55 LPA", seo: { title: "Pinecone Interview Questions 2026 | Vector Database | MedhaHub", description: "Pinecone interview questions for database and ML engineering roles.", keywords: "Pinecone interview questions 2026" } },
    { slug: "cohere", name: "Cohere", shortName: "Cohere", logo: "🔮", color: "from-indigo-600 to-indigo-800", accent: "text-indigo-600", bgAccent: "bg-indigo-50 dark:bg-indigo-950/30", founded: "2019", headquarters: "Toronto, Canada", employees: "600+", description: "Cohere builds large language models for enterprise — Command R+, Embed, and the Coral AI assistant.", interviewRounds: ["Phone Screen", "ML / Coding Round", "System Design", "Behavioral"], avgPackage: "₹25 – ₹60 LPA", seo: { title: "Cohere Interview Questions 2026 | LLM & AI | MedhaHub", description: "Cohere interview questions for ML and software engineering roles.", keywords: "Cohere interview questions 2026, Cohere AI interview" } },
    { slug: "linear-app", name: "Linear", shortName: "Linear", logo: "⚡", color: "from-purple-700 to-indigo-800", accent: "text-purple-700", bgAccent: "bg-purple-50 dark:bg-purple-950/30", founded: "2019", headquarters: "San Francisco, USA", employees: "60+", description: "Linear is a fast, keyboard-first issue tracking and project management tool loved by engineering teams globally.", interviewRounds: ["Take-home Project", "Technical Interview", "System Design", "Team Interview"], avgPackage: "₹22 – ₹55 LPA", seo: { title: "Linear Interview Questions 2026 | Dev Tools | MedhaHub", description: "Linear interview questions for software and product engineering roles.", keywords: "Linear interview questions 2026, Linear app interview" } },
    { slug: "miro", name: "Miro", shortName: "Miro", logo: "🖊️", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2011", headquarters: "San Francisco, USA", employees: "1,500+", description: "Miro is the world's leading online collaborative whiteboard platform used by 60M+ users for brainstorming and design.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "Miro Interview Questions 2026 | Collaboration SaaS | MedhaHub", description: "Miro interview questions for software and platform engineering roles.", keywords: "Miro interview questions 2026" } },
    { slug: "airtable", name: "Airtable", shortName: "Airtable", logo: "🗂️", color: "from-yellow-500 to-orange-600", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "2012", headquarters: "San Francisco, USA", employees: "800+", description: "Airtable is a no-code / low-code relational database and app-building platform used by 300,000+ organizations.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "Airtable Interview Questions 2026 | No-Code Platform | MedhaHub", description: "Airtable interview questions for software and platform engineering roles.", keywords: "Airtable interview questions 2026" } },
    { slug: "grammarly", name: "Grammarly", shortName: "Grammarly", logo: "✍️", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2009", headquarters: "San Francisco, USA", employees: "1,000+", description: "Grammarly is an AI-powered writing assistant with NLP and LLM capabilities used by 30M+ daily users.", interviewRounds: ["Phone Screen", "Coding Round (NLP + Algorithms)", "System Design", "Behavioral"], avgPackage: "₹22 – ₹55 LPA", seo: { title: "Grammarly Interview Questions 2026 | AI Writing | MedhaHub", description: "Grammarly interview questions for SDE and NLP engineering roles.", keywords: "Grammarly interview questions 2026" } },
    { slug: "asana", name: "Asana", shortName: "Asana", logo: "✅", color: "from-pink-500 to-pink-700", accent: "text-pink-500", bgAccent: "bg-pink-50 dark:bg-pink-950/30", founded: "2008", headquarters: "San Francisco, USA", employees: "1,800+", description: "Asana is a work management platform used by 150,000+ businesses to plan, organize, and track team projects.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹20 – ₹48 LPA", seo: { title: "Asana Interview Questions 2026 | Project Management SaaS | MedhaHub", description: "Asana interview questions for software engineering and product roles.", keywords: "Asana interview questions 2026" } },
    { slug: "monday-com", name: "Monday.com", shortName: "Monday", logo: "📅", color: "from-red-500 to-orange-600", accent: "text-red-500", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2012", headquarters: "Tel Aviv, Israel", employees: "1,700+", description: "Monday.com is a Work OS platform enabling teams to build custom workflow apps — no coding required.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "Monday.com Interview Questions 2026 | Work OS | MedhaHub", description: "Monday.com interview questions for software engineering roles.", keywords: "Monday.com interview questions 2026" } },
    { slug: "new-relic", name: "New Relic", shortName: "New Relic", logo: "🔍", color: "from-green-600 to-green-800", accent: "text-green-600", bgAccent: "bg-green-50 dark:bg-green-950/30", founded: "2008", headquarters: "San Francisco, USA", employees: "2,000+", description: "New Relic provides all-in-one observability — APM, browser, infrastructure, logs, and errors in one platform.", interviewRounds: ["Phone Screen", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹18 – ₹42 LPA", seo: { title: "New Relic Interview Questions 2026 | Observability | MedhaHub", description: "New Relic interview questions for SDE and SRE engineering roles.", keywords: "New Relic interview questions 2026" } },
    { slug: "dynatrace", name: "Dynatrace", shortName: "Dynatrace", logo: "🐦", color: "from-teal-600 to-teal-800", accent: "text-teal-600", bgAccent: "bg-teal-50 dark:bg-teal-950/30", founded: "2005", headquarters: "Waltham, USA", employees: "4,500+", description: "Dynatrace provides AI-powered observability and security for cloud-native applications at enterprise scale.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Dynatrace Interview Questions 2026 | APM & Observability | MedhaHub", description: "Dynatrace interview questions for software and SRE engineering roles.", keywords: "Dynatrace interview questions 2026" } },
    { slug: "appdynamics", name: "AppDynamics", shortName: "AppDynamics", logo: "📊", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2008", headquarters: "San Francisco, USA", employees: "2,000+", description: "AppDynamics (Cisco) provides full-stack application performance management and business observability.", interviewRounds: ["Online Assessment", "Coding Round", "System Design", "Behavioral"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "AppDynamics Interview Questions 2026 | APM | MedhaHub", description: "AppDynamics (Cisco) interview questions for software engineering roles.", keywords: "AppDynamics interview questions 2026, Cisco AppDynamics" } },
    { slug: "ericsson", name: "Ericsson India", shortName: "Ericsson", logo: "📡", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1876", headquarters: "Stockholm, Sweden", employees: "1,06,000+", description: "Ericsson is a global telecom equipment giant with large R&D centres in India building 5G, OSS, and network software.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Networking)", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Ericsson Interview Questions 2026 | Telecom Tech | MedhaHub", description: "Ericsson India interview questions for software and telecom engineering roles.", keywords: "Ericsson interview questions 2026, Ericsson India telecom" } },
    { slug: "nokia", name: "Nokia India", shortName: "Nokia", logo: "📱", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1865", headquarters: "Espoo, Finland", employees: "86,000+", description: "Nokia Networks has a major engineering hub in India building 5G RAN, IP routing, and cloud-native telecom software.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Linux)", "System Design", "HR"], avgPackage: "₹10 – ₹25 LPA", seo: { title: "Nokia Interview Questions 2026 | Telecom Engineering | MedhaHub", description: "Nokia India interview questions for software and network engineering roles.", keywords: "Nokia interview questions 2026, Nokia Networks India" } },
    { slug: "motorola-solutions", name: "Motorola Solutions", shortName: "Motorola Solutions", logo: "📻", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1928", headquarters: "Chicago, USA", employees: "21,000+", description: "Motorola Solutions provides public safety communications, body cameras, and video security software for governments.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Motorola Solutions Interview Questions 2026 | Public Safety Tech | MedhaHub", description: "Motorola Solutions interview questions for software engineering roles.", keywords: "Motorola Solutions interview questions 2026" } },
    { slug: "lenovo", name: "Lenovo India", shortName: "Lenovo", logo: "💻", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "1984", headquarters: "Beijing, China", employees: "77,000+", description: "Lenovo is the world's largest PC vendor with an R&D and services hub in Bengaluru for ThinkSmart and data center.", interviewRounds: ["Online Assessment", "Technical Interview", "System Design", "HR"], avgPackage: "₹10 – ₹22 LPA", seo: { title: "Lenovo Interview Questions 2026 | IT & Devices | MedhaHub", description: "Lenovo India interview questions for software and hardware engineering roles.", keywords: "Lenovo interview questions 2026, Lenovo India interview" } },
    { slug: "zebra-technologies", name: "Zebra Technologies", shortName: "Zebra Tech", logo: "🦓", color: "from-gray-700 to-gray-900", accent: "text-gray-700", bgAccent: "bg-gray-50 dark:bg-gray-950/30", founded: "1969", headquarters: "Lincolnshire, USA", employees: "10,000+", description: "Zebra Technologies provides enterprise mobile computers, barcode scanners, and IoT solutions for retail and logistics.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Java)", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Zebra Technologies Interview Questions 2026 | Enterprise IoT | MedhaHub", description: "Zebra Technologies interview questions for embedded and software engineering roles.", keywords: "Zebra Technologies interview questions 2026" } },
    { slug: "tata-technologies", name: "Tata Technologies", shortName: "Tata Tech", logo: "🚗", color: "from-blue-700 to-blue-900", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1989", headquarters: "Pune, India", employees: "12,000+", description: "Tata Technologies provides engineering services and digital transformation to global automotive, aerospace, and industrial companies.", interviewRounds: ["Online Assessment", "Technical Interview", "Domain Round", "HR"], avgPackage: "₹8 – ₹20 LPA", seo: { title: "Tata Technologies Interview Questions 2026 | Engineering Services | MedhaHub", description: "Tata Technologies interview questions for software and embedded engineering roles.", keywords: "Tata Technologies interview questions 2026" } },
    { slug: "lam-research", name: "Lam Research", shortName: "Lam Research", logo: "🔬", color: "from-blue-600 to-blue-800", accent: "text-blue-600", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1980", headquarters: "Fremont, USA", employees: "18,000+", description: "Lam Research designs semiconductor fabrication equipment for wafer etch, deposition, and clean processes.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Python)", "System Design", "HR"], avgPackage: "₹15 – ₹35 LPA", seo: { title: "Lam Research Interview Questions 2026 | Semiconductor Equipment | MedhaHub", description: "Lam Research interview questions for software and systems engineering roles.", keywords: "Lam Research interview questions 2026" } },
    { slug: "applied-materials", name: "Applied Materials", shortName: "Applied Materials", logo: "⚗️", color: "from-blue-700 to-indigo-800", accent: "text-blue-700", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "1967", headquarters: "Santa Clara, USA", employees: "34,000+", description: "Applied Materials is the world's largest maker of semiconductor equipment — CVD, PVD, and ALD tools for chip fabrication.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Python)", "System Design", "HR"], avgPackage: "₹15 – ₹38 LPA", seo: { title: "Applied Materials Interview Questions 2026 | Semiconductor | MedhaHub", description: "Applied Materials interview questions for software and chip engineering roles.", keywords: "Applied Materials interview questions 2026, AMAT interview" } },
    { slug: "kla-corporation", name: "KLA Corporation", shortName: "KLA", logo: "🔭", color: "from-yellow-600 to-yellow-800", accent: "text-yellow-600", bgAccent: "bg-yellow-50 dark:bg-yellow-950/30", founded: "1975", headquarters: "Milpitas, USA", employees: "15,000+", description: "KLA Corporation provides process control and yield management equipment for semiconductor manufacturing.", interviewRounds: ["Online Assessment", "Technical Interview (C++/Image Processing)", "System Design", "HR"], avgPackage: "₹15 – ₹38 LPA", seo: { title: "KLA Corporation Interview Questions 2026 | Semiconductor | MedhaHub", description: "KLA Corporation interview questions for software and hardware engineering roles.", keywords: "KLA Corporation interview questions 2026, KLA interview" } },
    { slug: "khatabook", name: "KhataBook", shortName: "KhataBook", logo: "📒", color: "from-blue-500 to-blue-700", accent: "text-blue-500", bgAccent: "bg-blue-50 dark:bg-blue-950/30", founded: "2018", headquarters: "Bengaluru, India", employees: "1,000+", description: "KhataBook is a B2B fintech unicorn providing a digital ledger and business accounting app for 10M+ SMBs in India.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "KhataBook Interview Questions 2026 | SMB Fintech | MedhaHub", description: "KhataBook interview questions for software engineering and product roles.", keywords: "KhataBook interview questions 2026" } },
    { slug: "ofbusiness", name: "OfBusiness", shortName: "OfBusiness", logo: "🏗️", color: "from-orange-600 to-orange-800", accent: "text-orange-600", bgAccent: "bg-orange-50 dark:bg-orange-950/30", founded: "2015", headquarters: "Gurugram, India", employees: "3,000+", description: "OfBusiness is a B2B commerce unicorn enabling SMBs to procure raw materials and access credit at scale.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹15 – ₹30 LPA", seo: { title: "OfBusiness Interview Questions 2026 | B2B Commerce | MedhaHub", description: "OfBusiness interview questions for software engineering roles.", keywords: "OfBusiness interview questions 2026" } },
    { slug: "moglix", name: "Moglix", shortName: "Moglix", logo: "🔩", color: "from-red-600 to-red-800", accent: "text-red-600", bgAccent: "bg-red-50 dark:bg-red-950/30", founded: "2015", headquarters: "Noida, India", employees: "3,000+", description: "Moglix is Asia's largest B2B industrial e-commerce platform for procurement of MRO and industrial supplies.", interviewRounds: ["Coding Test", "Technical Interview", "System Design", "HR"], avgPackage: "₹12 – ₹28 LPA", seo: { title: "Moglix Interview Questions 2026 | Industrial B2B | MedhaHub", description: "Moglix interview questions for software engineering roles.", keywords: "Moglix interview questions 2026" } },
  ] as CompanyInfo[]),
];

export const COMPANY_MAP = new Map(COMPANIES.map((c) => [c.slug, c]));

export function getCompanyBySlug(slug: string): CompanyInfo | undefined {
  return COMPANY_MAP.get(slug);
}

// ── Static Fallback Questions ────────────────────────────────────────────────
// Generated from company metadata so users ALWAYS see content, even if API is down.

function generateFallbackQuestions(company: CompanyInfo): CompanyQuestionsResponse {
  const c = company;
  const q: CompanyQuestion[] = [];
  let id = 1;

  const push = (question: string, answer: string, category: string, difficulty: CompanyQuestion["difficulty"], tags: string[]) => {
    q.push({ id: id++, question, answer, category, difficulty, tags });
  };

  // ── About the Company ──
  push(
    `Tell me about ${c.name}. Why do you want to join?`,
    `${c.name} (commonly known as ${c.shortName}) was founded in ${c.founded} and is headquartered in ${c.headquarters}. It currently employs ${c.employees} people globally. ${c.description} I want to join ${c.shortName} because of its strong reputation, growth opportunities, and the chance to work on impactful projects.`,
    "HR & Behavioral",
    "Easy",
    ["about company", "why join", c.shortName.toLowerCase()],
  );

  push(
    `What do you know about ${c.shortName}'s interview process?`,
    `The ${c.shortName} interview process typically consists of ${c.interviewRounds.length} rounds: ${c.interviewRounds.join(", ")}. Each round tests different skills — from technical knowledge and problem-solving to communication and cultural fit. The average package for freshers is ${c.avgPackage}.`,
    "HR & Behavioral",
    "Easy",
    ["interview process", "rounds", c.shortName.toLowerCase()],
  );

  push(
    "Where do you see yourself in 5 years?",
    `In 5 years, I see myself as a senior professional at ${c.shortName}, having grown both technically and as a leader. I aim to contribute to high-impact projects, mentor junior team members, and continuously upskill in emerging technologies relevant to ${c.shortName}'s domain.`,
    "HR & Behavioral",
    "Easy",
    ["career goals", "5 years", "HR"],
  );

  push(
    "What are your strengths and weaknesses?",
    "My strengths include strong problem-solving ability, attention to detail, and good communication skills. I'm a quick learner, which helps me adapt to new technologies. As for weaknesses, I sometimes tend to over-analyze problems before acting. I've been working on this by setting decision deadlines and trusting my initial analysis more.",
    "HR & Behavioral",
    "Easy",
    ["strengths", "weaknesses", "self-assessment"],
  );

  push(
    "Tell me about a challenging project you worked on.",
    "In my recent project, I worked on building a scalable web application that needed to handle high concurrent traffic. The challenge was optimizing database queries and implementing caching to reduce response times from 3 seconds to under 200ms. I used connection pooling, Redis caching, and lazy loading techniques. This taught me the importance of profiling before optimizing and writing maintainable code under pressure.",
    "HR & Behavioral",
    "Medium",
    ["project", "challenge", "experience"],
  );

  // ── Technical / CS Fundamentals ──
  push(
    "Explain the difference between Stack and Queue data structures.",
    "A Stack follows Last In, First Out (LIFO) — the last element added is the first removed (like a stack of plates). Operations: push(), pop(), peek(). A Queue follows First In, First Out (FIFO) — the first element added is the first removed (like a line at a ticket counter). Operations: enqueue(), dequeue(), front(). Stacks are used in function calls, undo operations, and expression parsing. Queues are used in BFS, task scheduling, and print spooling.",
    "Data Structures",
    "Easy",
    ["stack", "queue", "LIFO", "FIFO"],
  );

  push(
    "What is the difference between an Array and a Linked List?",
    "Arrays store elements in contiguous memory locations, allowing O(1) random access via index but O(n) insertion/deletion in the middle. Linked Lists store elements in nodes with pointers; they allow O(1) insertion/deletion at known positions but O(n) access. Arrays are better for frequent lookups; Linked Lists for frequent insertions/deletions. Arrays have fixed size (in most languages), while Linked Lists are dynamic.",
    "Data Structures",
    "Easy",
    ["array", "linked list", "comparison"],
  );

  push(
    "Explain Object-Oriented Programming (OOP) concepts.",
    "OOP has four pillars: 1) **Encapsulation** — bundling data and methods into a class, hiding internal state. 2) **Abstraction** — showing only essential features, hiding complexity. 3) **Inheritance** — creating child classes that reuse parent class code. 4) **Polymorphism** — same method name behaving differently based on the object (compile-time via overloading, runtime via overriding). OOP enables modularity, code reuse, and maintainability.",
    "Object-Oriented Programming",
    "Easy",
    ["OOP", "encapsulation", "inheritance", "polymorphism", "abstraction"],
  );

  push(
    "What is the difference between SQL and NoSQL databases?",
    "SQL databases (MySQL, PostgreSQL) are relational, use structured schemas with tables/rows/columns, and support ACID transactions. They're ideal for structured data with complex relationships. NoSQL databases (MongoDB, Cassandra, Redis) are non-relational, schema-flexible, and optimized for horizontal scaling. Types include document stores, key-value, column-family, and graph databases. Choose SQL for consistency-critical applications, NoSQL for high-scale, schema-evolving applications.",
    "Database",
    "Medium",
    ["SQL", "NoSQL", "database", "comparison"],
  );

  push(
    "What are the different types of joins in SQL?",
    "SQL has several join types: 1) **INNER JOIN** — returns only matching rows from both tables. 2) **LEFT JOIN** — returns all rows from left table + matched rows from right. 3) **RIGHT JOIN** — returns all rows from right table + matched rows from left. 4) **FULL OUTER JOIN** — returns all rows from both tables, with NULL for non-matches. 5) **CROSS JOIN** — returns Cartesian product of both tables. 6) **SELF JOIN** — joins a table with itself.",
    "Database",
    "Medium",
    ["SQL", "joins", "inner join", "left join"],
  );

  push(
    "Explain the concept of time and space complexity.",
    "Time complexity measures how the runtime of an algorithm grows with input size (n). Common complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2ⁿ) exponential. Space complexity measures additional memory used. Big-O notation describes the worst case. For example, binary search is O(log n) time, O(1) space; merge sort is O(n log n) time, O(n) space. Efficient algorithms optimize both.",
    "Data Structures",
    "Medium",
    ["time complexity", "space complexity", "Big-O", "algorithm"],
  );

  push(
    "What is a Binary Search Tree and how does it work?",
    "A Binary Search Tree (BST) is a binary tree where: the left subtree contains only nodes with values less than the parent, and the right subtree contains only nodes with values greater than the parent. This property makes search, insertion, and deletion O(log n) on average (O(n) worst case for skewed trees). In-order traversal gives sorted output. Balanced BSTs (AVL, Red-Black trees) guarantee O(log n) operations.",
    "Data Structures",
    "Medium",
    ["BST", "binary search tree", "tree", "data structure"],
  );

  // ── Programming ──
  push(
    "What is the difference between == and === in JavaScript?",
    "== (loose equality) compares values after type coercion — '5' == 5 is true. === (strict equality) compares both value AND type — '5' === 5 is false. Always prefer === to avoid unexpected type coercion bugs. Similarly, != does loose comparison while !== does strict comparison.",
    "Programming",
    "Easy",
    ["JavaScript", "equality", "comparison", "type coercion"],
  );

  push(
    "Explain the concepts of Multithreading and Multiprocessing.",
    "Multithreading runs multiple threads within a single process, sharing the same memory space. It's efficient for I/O-bound tasks but requires careful synchronization (mutexes, semaphores) to avoid race conditions. Multiprocessing runs multiple processes with separate memory spaces. It's better for CPU-bound tasks and avoids the GIL issue in Python. Both enable parallel/concurrent execution but differ in memory isolation, overhead, and communication mechanisms.",
    "Operating Systems",
    "Medium",
    ["multithreading", "multiprocessing", "concurrency", "OS"],
  );

  push(
    "Write a program to check if a string is a palindrome.",
    `A palindrome reads the same forwards and backwards. Algorithm: compare characters from both ends moving inward.\n\nPython:\ndef is_palindrome(s):\n    s = s.lower().replace(' ', '')\n    return s == s[::-1]\n\nJava:\nboolean isPalindrome(String s) {\n    s = s.toLowerCase().replaceAll(" ", "");\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        if (s.charAt(l++) != s.charAt(r--)) return false;\n    }\n    return true;\n}\n\nTime: O(n), Space: O(1) for the two-pointer approach.`,
    "Programming",
    "Easy",
    ["palindrome", "string", "coding", "two-pointer"],
  );

  push(
    "What is the difference between Process and Thread?",
    "A Process is an independent program in execution with its own memory space, resources, and address space. A Thread is the smallest unit of execution within a process, sharing the process's memory space. Processes are isolated — crash in one doesn't affect others. Threads are lightweight — context switching is faster. Inter-process communication (IPC) is slower than inter-thread communication. Multi-threading is used for parallelism within an application; multi-processing for isolation.",
    "Operating Systems",
    "Medium",
    ["process", "thread", "OS", "concurrency"],
  );

  // ── Networking & Web ──
  push(
    "Explain the difference between HTTP and HTTPS.",
    "HTTP (Hypertext Transfer Protocol) transmits data in plain text — vulnerable to interception. HTTPS (HTTP Secure) uses SSL/TLS encryption to secure data in transit. HTTPS provides: 1) Encryption — prevents eavesdropping, 2) Authentication — verifies server identity via certificates, 3) Data integrity — prevents tampering. Port 80 for HTTP, port 443 for HTTPS. HTTPS is essential for login pages, payments, and any sensitive data transfer.",
    "Networking",
    "Easy",
    ["HTTP", "HTTPS", "SSL", "security", "networking"],
  );

  push(
    "What is REST API and what are its principles?",
    "REST (Representational State Transfer) is an architectural style for web APIs. Key principles: 1) **Stateless** — each request contains all needed information, 2) **Client-Server** — separation of concerns, 3) **Uniform Interface** — standard HTTP methods (GET, POST, PUT, DELETE), 4) **Resource-based** — URLs represent resources, 5) **Cacheable** — responses can be cached, 6) **Layered System** — client can't tell if connected directly to server. REST APIs use JSON/XML for data exchange.",
    "Networking",
    "Medium",
    ["REST", "API", "HTTP methods", "web services"],
  );

  // ── System Design (for product companies) ──
  push(
    "How would you design a URL shortener like bit.ly?",
    "Key components: 1) **API** — POST /shorten (long URL → short code), GET /:code (redirect). 2) **Encoding** — use base62 encoding of an auto-increment ID or a hash (MD5/SHA256) truncated to 6-7 chars. 3) **Database** — store mappings (shortCode → longURL, createdAt, userId). 4) **Cache** — Redis for frequently accessed URLs. 5) **Scaling** — use a distributed ID generator (Twitter Snowflake), database sharding by hash prefix. 6) **Analytics** — track clicks with async writes. Expected: ~100M URLs/month, 10:1 read/write ratio.",
    "System Design",
    "Hard",
    ["URL shortener", "system design", "scaling", "database"],
  );

  push(
    "Explain the concept of caching and its types.",
    "Caching stores frequently accessed data in fast storage to reduce latency and database load. Types: 1) **Client-side** — browser cache, CDN. 2) **Application-level** — in-memory (Redis, Memcached). 3) **Database-level** — query cache, buffer pool. Strategies: **Cache-aside** (lazy loading), **Write-through** (write to cache + DB), **Write-behind** (write to cache, async DB write), **Read-through**. Eviction policies: LRU (Least Recently Used), LFU (Least Frequently Used), TTL (Time To Live).",
    "System Design",
    "Medium",
    ["caching", "Redis", "system design", "performance"],
  );

  // ── Aptitude / Logical ──
  push(
    "A train 150m long passes a pole in 15 seconds. What is its speed?",
    "Speed = Distance / Time = 150m / 15s = 10 m/s. Converting to km/h: 10 × (18/5) = 36 km/h. The train's speed is 36 km/h.",
    "Aptitude",
    "Easy",
    ["speed", "distance", "time", "train"],
  );

  push(
    "If the ratio of boys to girls in a class is 3:5 and total students are 40, find the number of girls.",
    "Total parts = 3 + 5 = 8. Each part = 40 / 8 = 5 students. Number of girls = 5 × 5 = 25 girls. Number of boys = 3 × 5 = 15 boys.",
    "Aptitude",
    "Easy",
    ["ratio", "proportion", "aptitude"],
  );

  // ── Company-specific round questions ──
  for (const round of c.interviewRounds) {
    const roundLower = round.toLowerCase();
    if (roundLower.includes("hr")) {
      push(
        `What is your expected salary at ${c.shortName}?`,
        `I am aware that ${c.shortName} offers competitive packages in the range of ${c.avgPackage} for freshers. I am flexible on compensation and more focused on the learning opportunity and growth at ${c.shortName}. I trust the company to make a fair offer based on my skills and the role requirements.`,
        "HR & Behavioral",
        "Easy",
        ["salary", "HR", "negotiation"],
      );
    }
    if (roundLower.includes("coding") || roundLower.includes("programming")) {
      push(
        "Write a function to find the second largest element in an array.",
        `Approach: Track the largest and second largest in a single pass.\n\nPython:\ndef second_largest(arr):\n    first = second = float('-inf')\n    for num in arr:\n        if num > first:\n            second = first\n            first = num\n        elif num > second and num != first:\n            second = num\n    return second if second != float('-inf') else None\n\nTime: O(n), Space: O(1). This is optimal — no sorting needed.`,
        "Programming",
        "Easy",
        ["array", "coding", "second largest"],
      );
    }
    if (roundLower.includes("system design")) {
      push(
        "Design a rate limiter for an API.",
        "Approaches: 1) **Token Bucket** — tokens added at fixed rate, each request consumes a token. Allows bursts. 2) **Sliding Window** — count requests in a rolling time window. 3) **Fixed Window Counter** — count requests per fixed time slot (simpler but has boundary issues). Implementation: Use Redis with INCR + EXPIRE for distributed rate limiting. Key = user_id:endpoint:minute. Return HTTP 429 when limit exceeded. Consider: per-user vs global limits, different limits per endpoint, grace period headers (X-RateLimit-Remaining).",
        "System Design",
        "Hard",
        ["rate limiter", "system design", "API", "Redis"],
      );
    }
    if (roundLower.includes("aptitude") || roundLower.includes("online test") || roundLower.includes("assessment")) {
      push(
        "A person can do a piece of work in 12 days. How much work can be done in 8 days?",
        "Work done per day = 1/12. Work done in 8 days = 8 × (1/12) = 8/12 = 2/3 of the total work. So 2/3 of the work is completed in 8 days.",
        "Aptitude",
        "Easy",
        ["work", "time", "aptitude"],
      );
    }
  }

  // Deduplicate categories
  const categories = [...new Set(q.map((x) => x.category))];

  return {
    success: true,
    company: c.slug,
    totalQuestions: q.length,
    categories,
    questions: q,
  };
}

// ── API Helpers ──────────────────────────────────────────────────────────────

export async function fetchCompanyQuestions(slug: string): Promise<CompanyQuestionsResponse> {
  const company = getCompanyBySlug(slug);
  try {
    const res = await fetch(`${API_BASE}/company-interviews/${slug}`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    if (data && data.success) return data;
    throw new Error("Invalid response");
  } catch {
    // Silently fall back to static questions — users always see content
    if (company) return generateFallbackQuestions(company);
    return {
      success: true,
      company: slug,
      totalQuestions: 0,
      categories: [],
      questions: [],
    };
  }
}
