import type {
  StartInterviewRequest,
  StartInterviewResponse,
  NextQuestionRequest,
  NextQuestionResponse,
  FinishInterviewRequest,
  FinishInterviewResponse,
  PracticeQuestion,
  InterviewTranscriptTurn,
  InterviewQuestionReview,
} from "@shared/api";

// Mock questions database
const mockQuestions: Record<string, string[]> = {
  it: [
    "Tell me about your experience with your primary programming language.",
    "Can you explain the difference between synchronous and asynchronous programming?",
    "Describe a challenging problem you solved in your last project.",
    "How do you approach debugging complex issues?",
    "Tell me about your experience with version control systems.",
    "What design patterns are you familiar with?",
    "How do you ensure code quality and maintainability?",
    "Describe your experience with testing frameworks.",
  ],
  government: [
    "What motivated you to apply for this government position?",
    "How would you handle a situation with conflicting priorities?",
    "Tell me about your understanding of public service.",
    "Describe your experience working in teams.",
    "How do you stay updated with current affairs?",
    "What is your approach to ethical decision-making?",
    "Tell me about a time you handled a difficult client.",
    "How would you contribute to nation building?",
  ],
  private: [
    "Why are you interested in our company?",
    "Tell me about your greatest professional achievement.",
    "How do you handle pressure and deadlines?",
    "Describe your leadership style.",
    "What are your career goals?",
    "How do you approach problem-solving?",
    "Tell me about a time you overcame a challenge.",
    "Why should we hire you?",
  ],
  "non-it": [
    "Tell me about your professional background.",
    "What attracted you to this role?",
    "How do you handle customer interactions?",
    "Describe your approach to project management.",
    "What soft skills do you consider your strength?",
    "Tell me about a time you improved a process.",
    "How do you stay organized and meet deadlines?",
    "What do you know about our company?",
  ],
  manager: [
    "Describe your leadership philosophy and how you motivate a team.",
    "Tell me about a time you had to make a difficult decision that affected your team. How did you handle it?",
    "How do you set goals and measure your team's performance?",
    "Describe a situation where you had to manage a conflict within your team.",
    "How do you delegate responsibilities while maintaining accountability?",
    "Tell me about a time you drove a significant process improvement or change initiative.",
    "How do you handle an underperforming team member?",
    "What is your approach to communicating strategy and vision to your team?",
    "How do you balance short-term delivery pressure with long-term team development?",
    "Describe how you build trust and psychological safety within your team.",
  ],
  hr: [
    "Tell me about yourself and your career journey so far.",
    "Why are you looking to leave your current role?",
    "Where do you see yourself in the next 3–5 years?",
    "What are your salary expectations?",
    "How do you align with our company's culture and values?",
    "Describe a situation where you had to adapt quickly to a major change at work.",
    "What are your greatest strengths and one area you are actively working to improve?",
    "How do you maintain a healthy work-life balance?",
    "Tell me about a time you went above and beyond in your role.",
    "Why do you want to join our organisation specifically?",
  ],
};

const mockFollowUps = [
  "Can you provide a specific example?",
  "How did you measure success?",
  "What would you do differently?",
  "What did you learn from this experience?",
  "How did your team respond?",
  "What was the outcome?",
];

/**
 * Generate a contextual follow-up question based on the user's answer
 */
function generateContextualFollowUp(answer: string, questionType: string): string {
  const lowerAnswer = answer.toLowerCase();
  
  // Technology mentions - ask for more details with specific technology follow-ups
  const techPatterns: Array<[RegExp, string[]]> = [
    // .NET Family
    [/\.net core|net core|dotnet core|asp\.net core|\.net 6|\.net 7|\.net 8|c#|csharp/, [
      "You mentioned .NET Core - can you explain how you handle dependency injection in your applications?",
      "Tell me about your experience with Entity Framework Core and how you optimize database queries.",
      "How do you implement authentication and authorization in ASP.NET Core applications?",
      "Can you describe your approach to building RESTful APIs using .NET Core?",
      "What's your experience with middleware in ASP.NET Core and how do you use it?",
      "How do you handle exception handling and logging in your .NET Core applications?",
    ]],
    [/\.net framework|asp\.net|web forms|mvc|wcf/, [
      "You have .NET Framework experience - how is it different from working with .NET Core?",
      "Can you describe a migration from .NET Framework to .NET Core you've worked on?",
      "How do you handle legacy code in .NET Framework applications?",
    ]],
    // Frontend Frameworks
    [/react(?!ive)|nextjs|next\.js/, [
      "You mentioned React - how do you manage complex state across your application?",
      "Can you describe your approach to React performance optimization?",
      "How do you handle server-side rendering or use Next.js features?",
      "What's your testing strategy for React components?",
    ]],
    [/angular|typescript/, [
      "Tell me about your Angular architecture - how do you structure modules and services?",
      "How do you handle RxJS observables and reactive programming in Angular?",
      "Can you describe your approach to Angular dependency injection?",
    ]],
    [/vue|vuex|nuxt/, [
      "You mentioned Vue - how do you handle state management with Vuex or Pinia?",
      "Can you describe your approach to Vue composition API vs options API?",
      "What's your experience with Vue 3 and its performance improvements?",
    ]],
    // Backend Technologies
    [/python|django|flask|fastapi/, [
      "Tell me more about your Python backend architecture decisions.",
      "How do you handle async programming in Python?",
      "Can you describe your experience with Python performance optimization?",
      "What's your approach to API design using Python frameworks?",
    ]],
    [/java|spring boot|spring framework|hibernate/, [
      "You mentioned Java/Spring - can you explain your approach to microservices architecture?",
      "How do you handle transaction management in Spring applications?",
      "Tell me about your experience with Spring Security and JWT authentication.",
      "What's your approach to testing Spring Boot applications?",
    ]],
    [/node(?:js)?|express|nestjs/, [
      "Tell me more about your Node.js backend architecture.",
      "How do you prevent callback hell or manage async/await patterns?",
      "Can you describe your experience with Node.js performance optimization?",
      "What's your approach to handling concurrent requests in Node.js?",
    ]],
    [/go|golang|gin|fiber/, [
      "You mentioned Go - what do you love about goroutines and concurrency in Go?",
      "How do you handle error handling patterns in Go?",
      "Can you describe a performance-critical system you built with Go?",
    ]],
    // Databases
    [/sql server|mssql|t-sql/, [
      "You mentioned SQL Server - how do you optimize stored procedures and query performance?",
      "Can you explain your approach to database indexing strategies?",
      "What's your experience with SQL Server Integration Services or reporting?",
    ]],
    [/postgresql|postgres/, [
      "Tell me about your PostgreSQL experience - how do you leverage its advanced features?",
      "How do you handle database partitioning or sharding in PostgreSQL?",
      "What's your approach to PostgreSQL performance tuning?",
    ]],
    [/mongodb|nosql|document database/, [
      "How do you approach data modeling in MongoDB differently from SQL?",
      "Can you describe your experience with MongoDB aggregation pipelines?",
      "What's your strategy for handling MongoDB indexes and performance?",
    ]],
    [/redis|caching|cache/, [
      "You mentioned caching - can you explain your caching strategy?",
      "How do you handle cache invalidation and maintain data consistency?",
      "What's your experience with distributed caching systems?",
    ]],
    // Cloud & DevOps
    [/azure|microsoft azure/, [
      "You have Azure experience - which Azure services do you use most?",
      "Can you describe your experience with Azure DevOps or CI/CD pipelines?",
      "How do you handle Azure resource management and cost optimization?",
      "What's your experience with Azure Functions or serverless architecture?",
    ]],
    [/aws|amazon web services/, [
      "Tell me about your AWS architecture decisions - which services do you prefer and why?",
      "How do you approach AWS security and IAM policies?",
      "Can you describe your experience with AWS Lambda and serverless?",
    ]],
    [/docker|containerization|containers/, [
      "You mentioned Docker - how do you optimize Docker images for production?",
      "Can you explain your Docker compose or container orchestration strategy?",
      "What's your approach to Docker networking and secret management?",
    ]],
    [/kubernetes|k8s|container orchestration/, [
      "Tell me about your Kubernetes experience - how do you handle deployments?",
      "Can you describe your approach to Kubernetes monitoring and logging?",
      "How do you manage Kubernetes configurations and secrets?",
    ]],
    [/ci\/cd|jenkins|github actions|gitlab ci|azure devops/, [
      "You mentioned CI/CD - can you walk me through your pipeline setup?",
      "How do you handle automated testing in your CI/CD pipeline?",
      "What's your strategy for deployment rollbacks and blue-green deployments?",
    ]],
    // Methodologies
    [/agile|scrum|sprint/, [
      "How do you contribute to sprint planning and estimation?",
      "Can you describe how you handle changing requirements mid-sprint?",
      "What's your experience with retrospectives and continuous improvement?",
    ]],
    [/microservices|service-oriented/, [
      "You mentioned microservices - how do you handle inter-service communication?",
      "Can you describe your approach to distributed transactions and data consistency?",
      "What's your strategy for microservices monitoring and debugging?",
    ]],
  ];

  // Project/achievement mentions with deeper probing
  const projectPatterns: Array<[RegExp, string[]]> = [
    [/e-?commerce|online store|shopping cart/, [
      "Tell me about how you handled payment integration and security for that e-commerce project.",
      "How did you optimize the user experience for the checkout flow?",
      "What was your approach to handling inventory management and real-time updates?",
    ]],
    [/api|rest|graphql|microservice/, [
      "Can you explain the API design principles you followed?",
      "How did you handle API versioning and backward compatibility?",
      "What was your approach to API authentication and rate limiting?",
    ]],
    [/project|built|developed|created|implemented/, [
      "What was the most challenging technical decision you made in that project?",
      "How did you ensure code quality and maintainability?",
      "If you could do that project again, what would you architect differently?",
      "How did you measure the success of that project?",
    ]],
    [/team|collaborated|worked with/, [
      "How did you handle disagreements within the team?",
      "What role did you typically play in team dynamics?",
      "Can you describe a situation where team collaboration was critical?",
      "How did you ensure effective communication across the team?",
    ]],
    [/challenge|problem|difficult|solved|bug|issue/, [
      "Walk me through your problem-solving approach step by step.",
      "How did you validate that your solution was effective?",
      "What was your debugging process for that issue?",
      "What resources or people did you consult to solve this?",
    ]],
    [/performance|optimiz|slow|latency|bottleneck/, [
      "Can you quantify the performance improvements you achieved?",
      "What profiling tools did you use to identify the bottleneck?",
      "How did you balance performance with code maintainability?",
    ]],
    [/improved|increased|reduced|saved|achieved|delivered/, [
      "How did you measure that improvement?",
      "What was the baseline before your contribution?",
      "Can you share the specific metrics or data behind that achievement?",
      "What was the business impact of that improvement?",
    ]],
    [/learned|grew|developed skills|new technology/, [
      "How do you continue to learn and grow professionally?",
      "What resources do you use to stay updated in your field?",
      "Can you give an example of applying something you recently learned?",
      "How long did it take you to become proficient in that new skill?",
    ]],
  ];

  // Leadership/soft skills mentions
  const leadershipPatterns: Array<[RegExp, string[]]> = [
    [/managed|led|supervised|mentored/, [
      "How do you adapt your management style to different team members?",
      "Can you describe a difficult conversation you had to have with a team member?",
      "What's your approach to giving constructive feedback?",
    ]],
    [/deadline|pressure|stress/, [
      "How do you prioritize when everything seems urgent?",
      "Can you describe your approach to managing stakeholder expectations?",
      "What techniques do you use to maintain quality under pressure?",
    ]],
    [/customer|client|stakeholder/, [
      "How do you handle conflicting requirements from different stakeholders?",
      "Can you describe a time you had to push back on a client request?",
      "What's your approach to gathering and validating requirements?",
    ]],
  ];

  // Check all patterns and collect matching follow-ups
  const allPatterns = [...techPatterns, ...projectPatterns, ...leadershipPatterns];
  const matchingFollowUps: string[] = [];
  
  for (const [pattern, followUps] of allPatterns) {
    if (pattern.test(lowerAnswer)) {
      matchingFollowUps.push(...followUps);
    }
  }
  
  // If we found contextual follow-ups, pick one randomly
  if (matchingFollowUps.length > 0) {
    return matchingFollowUps[Math.floor(Math.random() * matchingFollowUps.length)];
  }
  
  // Fall back to generic but still contextual follow-ups
  const genericContextual = [
    "That's interesting. Can you elaborate more on the specific actions you took?",
    "Can you walk me through the decision-making process there?",
    "What was the most valuable lesson you took from that experience?",
    "How would you apply what you learned to a similar situation in the future?",
    "What feedback did you receive about your approach?",
  ];
  
  return genericContextual[Math.floor(Math.random() * genericContextual.length)];
}

/**
 * Pick the next question that best connects to what the candidate just talked about.
 * Returns the index within remainingQuestions of the best match.
 */
function selectNextContextualQuestion(
  userAnswer: string,
  remainingQuestions: string[],
): number {
  if (remainingQuestions.length <= 1) return 0;

  const lowerAnswer = userAnswer.toLowerCase();

  // Pairs of [what user talked about] → [questions that continue that thread]
  const contextPairs: Array<[RegExp, RegExp]> = [
    [/tech|code|software|program|engineer|architect|build|develop|api|database|cloud|devops/, /technical|code|software|program|engineer|architect|build|develop|api|database|cloud|devops|debug|performance|quality/],
    [/team|collaborat|colleague|pair|cross|cross-functional/, /team|collaborat|colleague|conflict|dynamic|communication|cross/],
    [/project|built|develop|created|implement|delivered/, /project|built|develop|created|implement|deliver|lead|ownership/],
    [/challenge|problem|difficult|obstacle|bug|issue|failure/, /challenge|problem|difficult|obstacle|mistake|failure|overcome|lesson/],
    [/lead|manag|supervis|head|director/, /lead|manag|supervis|decision|priorit|delegate|coach|mentor/],
    [/customer|client|stakeholder|user/, /customer|client|stakeholder|expectation|relationship|requirement/],
    [/learn|growth|new skill|upskill|course|study/, /learn|grow|skill|develop|career|improve|adapt/],
    [/deadline|pressure|urgent|crunch|stress/, /deadline|pressure|priorit|urgent|time|manage|balance/],
    [/achieve|success|impact|result|win|exceed/, /achieve|impact|proud|greatest|significant|measur/],
    [/conflict|disagree|tension|push back/, /conflict|disagree|feedback|difficult|conversation|handle/],
    [/culture|values|team spirit|motivation/, /culture|value|motivat|engage|onboard|retention/],
  ];

  const scores = remainingQuestions.map((q, i) => {
    const lowerQ = q.toLowerCase();
    let score = 0;
    for (const [answerPat, questionPat] of contextPairs) {
      if (answerPat.test(lowerAnswer) && questionPat.test(lowerQ)) {
        score += 3;
      }
    }
    return { i, score };
  });

  const maxScore = Math.max(...scores.map(s => s.score));
  // Only apply contextual pick if there's a real match; otherwise keep order
  if (maxScore === 0) return 0;

  const topMatches = scores.filter(s => s.score === maxScore);
  return topMatches[Math.floor(Math.random() * topMatches.length)].i;
}

/**
 * Generate a transitional question that connects to the previous answer
 */
function generateConnectedQuestion(
  previousAnswer: string, 
  nextQuestion: string, 
  questionType: string
): string {
  const lowerAnswer = previousAnswer.toLowerCase();
  
  // Create natural transitions based on what was mentioned
  const transitions: Array<[RegExp, string]> = [
    [/team|collaborated/, "Speaking of teamwork, "],
    [/project|developed|built/, "Building on your project experience, "],
    [/challenge|problem/, "Since you mentioned problem-solving, "],
    [/learned|improved/, "Given your focus on growth, "],
    [/managed|led/, "With your leadership background, "],
    [/customer|client/, "Considering your client interaction, "],
    [/technical|code|programming/, "On the technical side, "],
  ];
  
  for (const [pattern, prefix] of transitions) {
    if (pattern.test(lowerAnswer)) {
      // Add transition prefix to make it flow
      return prefix.toLowerCase() + nextQuestion.charAt(0).toLowerCase() + nextQuestion.slice(1);
    }
  }
  
  // Simple connectors for smooth flow
  const connectors = [
    "Moving on, ",
    "Now, ",
    "Next, I'd like to ask: ",
    "Let's explore another area. ",
    "",  // Sometimes no connector sounds natural
  ];
  
  const connector = connectors[Math.floor(Math.random() * connectors.length)];
  return connector + nextQuestion;
}

// Answer analysis helpers
function analyzeAnswer(answer: string, questionType: string) {
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const sentenceCount = answer.split(/[.!?]+/).filter(Boolean).length;
  const lowerAnswer = answer.toLowerCase();
  
  // Check for STAR method components
  const hasSituation = /situation|background|context|when|was working|at my|in my/.test(lowerAnswer);
  const hasTask = /task|goal|objective|needed to|responsible for|had to/.test(lowerAnswer);
  const hasAction = /action|implemented|created|developed|built|designed|led|managed|organized/.test(lowerAnswer);
  const hasResult = /result|outcome|achieved|improved|increased|reduced|saved|delivered|completed/.test(lowerAnswer);
  const starScore = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  
  // Technical keywords by type (enhanced with more modern tech)
  const technicalKeywords: Record<string, RegExp> = {
    it: /\.net core|net core|asp\.net core|c#|entity framework|sql server|azure|react|angular|vue|node|python|java|javascript|typescript|api|rest|graphql|database|sql|mongodb|postgresql|docker|kubernetes|microservice|cloud|aws|devops|ci\/cd|git|agile|scrum|architecture|design pattern|solid|unit test|integration test|debugg|performance|scalability|security|authentication|authorization|cache|redis|rabbitmq|kafka|elk|monitoring|logging|swagger|linq|dependency injection|middleware|jwt|oauth|blazor/i,
    government: /policy|regulation|compliance|stakeholder|public|citizen|government|procedure|protocol|legal|administrative|bureaucratic|ministry|department|service delivery|public sector|governance|transparency|accountability/i,
    private: /strategy|market|revenue|client|customer|profit|growth|competitive|stakeholder|kpi|roi|metrics|business development|sales|marketing|branding|product management|user acquisition|retention|conversion/i,
    "non-it": /process|workflow|efficiency|quality|customer|service|management|organization|coordination|communication|leadership|planning|project management|collaboration|stakeholder|deadline|operational/i,
  };
  
  const techPattern = technicalKeywords[questionType] || technicalKeywords.it;
  const techMatches = (lowerAnswer.match(techPattern) || []).length;
  
  // Communication indicators
  const hasTransitions = /firstly|secondly|additionally|moreover|furthermore|finally|in conclusion|as a result/.test(lowerAnswer);
  const hasExamples = /for example|for instance|such as|specifically|in particular/.test(lowerAnswer);
  const isWellStructured = sentenceCount >= 2 && wordCount >= 30 && wordCount <= 200;
  
  // Confidence indicators
  const hasHedging = /maybe|perhaps|i think|i guess|not sure|probably|might/.test(lowerAnswer);
  const hasAssertive = /i am|i have|i can|i will|i did|i achieved|definitely|certainly|absolutely/.test(lowerAnswer);
  
  return {
    wordCount,
    sentenceCount,
    starScore,
    techMatches,
    hasTransitions,
    hasExamples,
    isWellStructured,
    hasHedging,
    hasAssertive,
    hasSituation,
    hasTask,
    hasAction,
    hasResult,
  };
}

// Session data type
type SessionData = {
  type: string;
  language: string;
  cvText?: string;
  jobDescription?: string;
  questionIndex: number;
  questions: string[];
  answers: string[];
  answerAnalyses: ReturnType<typeof analyzeAnswer>[];
  scores: {
    communication: number;
    technical: number;
    confidence: number;
  };
};

// Session storage key for persistence
const SESSION_STORAGE_KEY = "mock-api-sessions";

// Persistent session storage that survives hot module replacement
function loadSessionsFromStorage(): Map<string, SessionData> {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
  } catch (e) {
    console.warn("Failed to load sessions from storage:", e);
  }
  return new Map();
}

function saveSessionsToStorage(sessions: Map<string, SessionData>): void {
  try {
    const obj = Object.fromEntries(sessions.entries());
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("Failed to save sessions to storage:", e);
  }
}

// Initialize sessions from storage (survives HMR)
const sessions = loadSessionsFromStorage();

function generateSessionId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate personalized interview questions based on CV content
 */
function generateCVBasedQuestions(cvText: string, interviewType: string): string[] {
  const questions: string[] = [];
  const lowerCV = cvText.toLowerCase();
  
  // Extract skills mentioned in CV (enhanced for .NET and other frameworks)
  const techSkills = [
    // .NET Family
    ".net core", "asp.net core", ".net 6", ".net 7", ".net 8", "c#", "entity framework",
    "linq", "asp.net", "blazor", "xamarin", "maui", "wcf", "web api",
    // Frontend
    "react", "angular", "vue", "next.js", "nuxt", "svelte",
    // Backend
    "node", "express", "nestjs", "python", "django", "flask", "fastapi",
    "java", "spring boot", "spring", "go", "golang", "ruby", "rails",
    // Databases
    "sql server", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    // Cloud & DevOps
    "azure", "aws", "gcp", "docker", "kubernetes", "jenkins", "github actions",
    "terraform", "ansible",
    // General
    "javascript", "typescript", "sql", "nosql", "git", "agile", "scrum",
    "microservices", "rest api", "graphql",
  ];
  const foundSkills = techSkills.filter(skill => lowerCV.includes(skill.toLowerCase()));
  
  // Extract experience indicators
  const hasManagement = /manager|lead|supervisor|director|head of|team lead/.test(lowerCV);
  const yearsMatch = lowerCV.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/);
  const yearsExperience = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  
  // Extract company names (simplified detection)
  const hasCompanyExperience = /worked at|employed at|company|organization|corporation/.test(lowerCV);
  
  // Extract education
  const hasHigherEd = /bachelor|master|phd|b\.tech|m\.tech|mba|degree/.test(lowerCV);
  
  // Extract projects
  const hasProjects = /project|developed|built|created|implemented|designed/.test(lowerCV);
  
  // Generate questions based on CV content (more authentic and contextual)
  if (foundSkills.length > 0) {
    const primarySkill = foundSkills[0];
    const skillName = primarySkill.charAt(0).toUpperCase() + primarySkill.slice(1);
    questions.push(`I see you have experience with ${skillName}. Can you walk me through a specific project where you used ${skillName} to solve a challenging problem?`);
    
    if (foundSkills.length > 2) {
      const skills = foundSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ");
      questions.push(`Your CV shows expertise in ${skills}. How do you choose between these technologies when starting a new project?`);
    }
    
    // Add technology-specific follow-up questions
    if (primarySkill.includes("net") || primarySkill.includes("c#")) {
      questions.push("Can you explain how you implement dependency injection and the repository pattern in .NET applications?");
    } else if (["react", "angular", "vue"].some(fw => primarySkill.includes(fw))) {
      questions.push("How do you approach state management and performance optimization in your frontend applications?");
    } else if (["node", "python", "java", "go"].some(lang => primarySkill.includes(lang))) {
      questions.push("Describe your approach to building scalable backend services. How do you handle monitoring and error tracking?");
    } else if (["azure", "aws", "gcp"].some(cloud => primarySkill.includes(cloud))) {
      questions.push("What's your experience with cloud architecture design and cost optimization?");
    }
  }
  
  if (hasManagement) {
    questions.push("Your CV indicates leadership experience. Can you describe your management style and how you handle team conflicts?");
  }
  
  if (yearsExperience > 5) {
    questions.push(`With ${yearsExperience}+ years of experience, what would you say has been your most significant professional achievement?`);
  } else if (yearsExperience > 0) {
    questions.push("What key lessons have you learned early in your career that you apply today?");
  }
  
  if (hasProjects) {
    questions.push("Walk me through one of the projects mentioned in your CV. What was your specific role and contribution?");
  }
  
  if (hasHigherEd) {
    questions.push("How has your educational background prepared you for this role?");
  }
  
  // Add generic CV-based question if we couldn't extract specific info
  if (questions.length === 0) {
    questions.push("Based on your CV, tell me more about your most recent role and responsibilities.");
    questions.push("What aspects of your background make you a strong fit for this position?");
  }
  
  // Limit to 3-4 CV-based questions
  return questions.slice(0, 4);
}

/**
 * Generate personalized interview questions based on job description
 */
function generateJDBasedQuestions(jobDescription: string, interviewType: string): string[] {
  const questions: string[] = [];
  const lowerJD = jobDescription.toLowerCase();
  
  // Extract key requirements from job description
  const extractedSkills: string[] = [];
  const extractedResponsibilities: string[] = [];
  
  // Common tech skills to look for
  const techKeywords = [
    "react", "angular", "vue", "node", "python", "java", "javascript", "typescript",
    "sql", "mongodb", "postgresql", "mysql", "aws", "azure", "gcp", "docker", "kubernetes",
    "git", "ci/cd", "agile", "scrum", "rest api", "graphql", "microservices",
    "machine learning", "data science", "ai", "cloud", "devops", "security"
  ];
  
  // Soft skills and competencies
  const softSkills = [
    "leadership", "communication", "teamwork", "problem-solving", "analytical",
    "project management", "stakeholder", "collaboration", "presentation",
    "customer service", "sales", "marketing", "strategy", "planning"
  ];
  
  // Extract mentioned tech skills
  techKeywords.forEach(skill => {
    if (lowerJD.includes(skill)) {
      extractedSkills.push(skill);
    }
  });
  
  // Extract mentioned soft skills
  softSkills.forEach(skill => {
    if (lowerJD.includes(skill)) {
      extractedSkills.push(skill);
    }
  });
  
  // Look for experience requirements
  const expMatch = lowerJD.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/);
  const yearsRequired = expMatch ? parseInt(expMatch[1]) : 0;
  
  // Look for education requirements
  const hasEducationReq = /bachelor|master|phd|degree|graduate|undergraduate|mba|b\.tech|m\.tech/.test(lowerJD);
  
  // Look for responsibility indicators
  const responsibilityPatterns = [
    /responsible for ([^.]+)/gi,
    /will be ([^.]+)/gi,
    /duties include ([^.]+)/gi,
    /you will ([^.]+)/gi,
  ];
  
  responsibilityPatterns.forEach(pattern => {
    const matches = lowerJD.match(pattern);
    if (matches && matches.length > 0) {
      extractedResponsibilities.push(...matches.slice(0, 2));
    }
  });
  
  // Generate questions based on extracted information
  if (extractedSkills.length > 0) {
    // Group questions by skill relevance
    const topSkills = extractedSkills.slice(0, 3);
    
    if (topSkills.length >= 2) {
      questions.push(`This role requires expertise in ${topSkills.join(" and ")}. Can you walk me through a project where you used ${topSkills[0]} extensively?`);
    } else if (topSkills.length === 1) {
      questions.push(`I see ${topSkills[0]} is important for this role. Describe your experience and a challenging project using ${topSkills[0]}.`);
    }
    
    // Ask about staying current with technologies
    if (extractedSkills.some(s => techKeywords.includes(s))) {
      questions.push("How do you stay updated with the latest developments in your technical field?");
    }
  }
  
  if (yearsRequired > 0) {
    if (yearsRequired >= 5) {
      questions.push(`This position requires ${yearsRequired}+ years of experience. Can you describe your most significant achievement that demonstrates your expertise at this level?`);
    } else {
      questions.push("Tell me about a recent accomplishment that showcases your professional growth.");
    }
  }
  
  // Soft skill questions based on JD
  if (lowerJD.includes("leadership") || lowerJD.includes("lead") || lowerJD.includes("manage team")) {
    questions.push("Describe your leadership style and give an example of how you've successfully led a team through a challenging project.");
  }
  
  if (lowerJD.includes("stakeholder") || lowerJD.includes("client") || lowerJD.includes("customer")) {
    questions.push("How do you handle challenging stakeholder or client expectations? Give me a specific example.");
  }
  
  if (lowerJD.includes("cross-functional") || lowerJD.includes("collaboration") || lowerJD.includes("teamwork")) {
    questions.push("Tell me about a time you collaborated with cross-functional teams. What was your approach to ensure effective communication?");
  }
  
  if (lowerJD.includes("deadline") || lowerJD.includes("fast-paced") || lowerJD.includes("pressure")) {
    questions.push("How do you manage competing priorities and tight deadlines? Walk me through your approach.");
  }
  
  if (lowerJD.includes("problem") || lowerJD.includes("analytical") || lowerJD.includes("troubleshoot")) {
    questions.push("Describe a complex problem you encountered at work. What was your analytical approach to solving it?");
  }
  
  // Role-specific question based on interview type
  questions.push(`What specifically attracted you to this ${interviewType} role, and what unique value do you bring?`);
  
  // Fallback generic JD-based questions if we couldn't extract much
  if (questions.length < 3) {
    questions.push("Based on the job description, what aspects of this role excite you the most?");
    questions.push("How does your background align with the key requirements of this position?");
    questions.push("What do you see as the biggest challenges in this role, and how would you address them?");
  }
  
  // Shuffle and limit
  return questions.sort(() => Math.random() - 0.5).slice(0, 5);
}

/**
 * Generate 30 practice questions with answers based on job description and interview type
 */
function generatePracticeQuestionsWithAnswers(
  interviewType: string,
  jobDescription?: string
): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];
  const lowerType = interviewType.toLowerCase();
  const lowerJD = (jobDescription || "").toLowerCase();
  
  // Determine if it's a technical role
  const isTechnical = lowerType.includes("software") || lowerType.includes("developer") ||
    lowerType.includes("engineer") || lowerType.includes("data") || lowerType.includes("tech") ||
    lowerType.includes("devops") || lowerType.includes("cloud") || lowerType.includes("full stack") ||
    lowerType.includes("backend") || lowerType.includes("frontend") ||
    lowerJD.includes("programming") || lowerJD.includes("coding") || lowerJD.includes("software");
  
  const isManagement = lowerType.includes("manager") || lowerType.includes("lead") ||
    lowerType.includes("director") || lowerType.includes("head") ||
    lowerJD.includes("manage team") || lowerJD.includes("leadership");
  
  const isSales = lowerType.includes("sales") || lowerType.includes("business development") ||
    lowerType.includes("account") || lowerJD.includes("sales") || lowerJD.includes("revenue");
  
  const isMarketing = lowerType.includes("marketing") || lowerType.includes("brand") ||
    lowerType.includes("content") || lowerJD.includes("marketing") || lowerJD.includes("campaign");

  // Extract skills from JD for personalization
  const extractedSkills: string[] = [];
  const techSkills = ["react", "angular", "vue", "node", "python", "java", "javascript", "typescript", "sql", "mongodb", "aws", "azure", "docker", "kubernetes", "git", "agile", "scrum"];
  techSkills.forEach(skill => {
    if (lowerJD.includes(skill) || lowerType.includes(skill)) {
      extractedSkills.push(skill);
    }
  });

  // === BEHAVIORAL QUESTIONS (10 questions) ===
  const behavioralQuestions: PracticeQuestion[] = [
    {
      question: `Tell me about yourself and why you're interested in this ${interviewType} position.`,
      suggestedAnswer: `I'm a dedicated professional with [X years] of experience in [relevant field]. My background includes [key achievements]. I'm drawn to this ${interviewType} role because it aligns with my passion for [relevant area] and offers the opportunity to [specific contribution]. My experience in [relevant skill] makes me confident I can add immediate value to your team.`,
      category: "Behavioral",
      difficulty: "easy"
    },
    {
      question: "Describe a challenging project you worked on. What made it challenging and how did you handle it?",
      suggestedAnswer: "In my previous role, I led a project to [specific challenge]. The main difficulty was [specific obstacle]. I addressed this by first [action 1], then [action 2]. I collaborated with [team/stakeholders] and implemented [solution]. The result was [quantifiable outcome], and I learned the importance of [key takeaway].",
      category: "Behavioral",
      difficulty: "medium"
    },
    {
      question: "Tell me about a time you had a conflict with a coworker. How did you resolve it?",
      suggestedAnswer: "I once disagreed with a colleague about [specific issue]. Rather than letting it escalate, I scheduled a private conversation to understand their perspective. I discovered they were concerned about [their concern]. We found common ground by [solution], and ultimately our combined approach led to [positive outcome]. This taught me the value of active listening and collaborative problem-solving.",
      category: "Behavioral",
      difficulty: "medium"
    },
    {
      question: "Describe a situation where you had to meet a tight deadline. How did you manage your time?",
      suggestedAnswer: "When faced with a [specific project] due in [timeframe], I immediately prioritized tasks by impact and urgency. I broke the work into milestones, delegated [specific tasks] where appropriate, and focused on high-value activities first. I also communicated proactively with stakeholders about progress. We delivered on time, achieving [specific result].",
      category: "Behavioral",
      difficulty: "medium"
    },
    {
      question: "Give an example of when you went above and beyond what was expected.",
      suggestedAnswer: "When I noticed [opportunity/problem], I took initiative to [specific action] even though it wasn't part of my responsibilities. I spent [timeframe] developing [solution/improvement], which resulted in [measurable benefit - e.g., 20% efficiency increase]. My manager recognized this effort with [recognition], and the approach was adopted company-wide.",
      category: "Behavioral",
      difficulty: "easy"
    },
    {
      question: "Tell me about a mistake you made at work and how you handled it.",
      suggestedAnswer: "Early in a project, I [specific mistake], which resulted in [consequence]. I immediately took ownership, informed my manager, and developed a plan to fix it. I [corrective actions] and implemented safeguards to prevent recurrence. The experience taught me to [lesson learned], and I've since applied this by [how you've improved].",
      category: "Behavioral",
      difficulty: "medium"
    },
    {
      question: "How do you handle working under pressure?",
      suggestedAnswer: "I thrive under pressure by staying organized and focused. When facing high-pressure situations, I first take a moment to assess priorities, break down complex tasks, and create an action plan. For example, during [specific situation], I [specific actions] and maintained quality by [how you ensured quality]. I find that clear communication with stakeholders helps manage expectations effectively.",
      category: "Behavioral",
      difficulty: "easy"
    },
    {
      question: "Describe your greatest professional achievement.",
      suggestedAnswer: "My greatest achievement was [specific accomplishment] at [company]. I was responsible for [your role], and faced challenges including [obstacles]. Through [specific actions - strategic planning, team coordination, innovative solutions], we achieved [quantifiable results - percentages, revenue, efficiency gains]. This demonstrated my ability to [key skills] and directly contributed to [business impact].",
      category: "Behavioral",
      difficulty: "medium"
    },
    {
      question: "How do you stay motivated when tasks become repetitive or mundane?",
      suggestedAnswer: "I find motivation by connecting routine tasks to larger goals and continuous improvement. I challenge myself to find efficiencies - for instance, I automated [specific process], saving [time/resources]. I also set mini-goals, celebrate small wins, and look for learning opportunities within any task. Maintaining a growth mindset helps me see every task as a chance to improve.",
      category: "Behavioral",
      difficulty: "easy"
    },
    {
      question: "Tell me about a time you had to adapt to a significant change at work.",
      suggestedAnswer: "When my company [specific change - reorganization, new technology, process change], I initially [honest reaction]. I embraced the change by [specific actions - learning new skills, seeking mentorship, staying positive]. I helped my team adapt by [how you supported others]. Within [timeframe], I became proficient and even [additional achievement]. This taught me that adaptability is key to career growth.",
      category: "Behavioral",
      difficulty: "medium"
    }
  ];
  questions.push(...behavioralQuestions);

  // === SITUATIONAL QUESTIONS (8 questions) ===
  const situationalQuestions: PracticeQuestion[] = [
    {
      question: `If you joined our team as a ${interviewType}, what would be your approach in the first 90 days?`,
      suggestedAnswer: "In the first 30 days, I'd focus on learning - understanding the team dynamics, processes, and key stakeholders. I'd schedule 1:1s with team members to build relationships. Days 31-60, I'd identify quick wins and start contributing meaningfully while deepening my understanding of challenges. Days 61-90, I'd propose and implement improvements based on my observations, aiming to deliver measurable value while setting longer-term strategic goals.",
      category: "Situational",
      difficulty: "medium"
    },
    {
      question: "How would you handle a situation where you disagree with your manager's decision?",
      suggestedAnswer: "I'd first ensure I fully understand their reasoning by asking clarifying questions. If I still disagree, I'd request a private conversation to share my perspective respectfully, backing my view with data and potential impacts. If the decision stands, I would commit fully to execution while documenting outcomes. I believe healthy dissent makes teams stronger, but unity of action is essential once decisions are made.",
      category: "Situational",
      difficulty: "medium"
    },
    {
      question: "What would you do if you were assigned a project outside your area of expertise?",
      suggestedAnswer: "I'd view it as a growth opportunity. First, I'd research the domain extensively. I'd identify internal experts or mentors who could guide me and ask thoughtful questions. I'd break the project into phases, focusing on learning while delivering. I'd be transparent about my learning curve while showing commitment. I've successfully done this before when [specific example], which built valuable new skills.",
      category: "Situational",
      difficulty: "medium"
    },
    {
      question: "How would you handle multiple high-priority tasks with the same deadline?",
      suggestedAnswer: "I'd assess each task's true impact and dependencies. I'd communicate immediately with stakeholders to clarify actual priorities and negotiate deadlines where possible. For non-negotiable deadlines, I'd identify what can be delegated, what requires my direct involvement, and create a minute-by-minute schedule. I'd focus on high-quality completion of the most critical items rather than mediocre delivery across all.",
      category: "Situational",
      difficulty: "hard"
    },
    {
      question: "If a team member wasn't pulling their weight, how would you address it?",
      suggestedAnswer: "I'd first have a private, empathetic conversation to understand if there are underlying issues - personal challenges, unclear expectations, or skill gaps. I'd offer support and clearly communicate the impact on the team. Together, we'd create an improvement plan with specific milestones. If issues persist despite support, I'd involve management appropriately, but my first approach is always to help and understand.",
      category: "Situational",
      difficulty: "hard"
    },
    {
      question: "How would you approach a situation where you need information from an unresponsive colleague?",
      suggestedAnswer: "I'd vary my communication approach - try different channels (email, chat, in-person). I'd be specific about what I need and why it's time-sensitive. If unresponsive, I'd explore alternative sources or CC their manager while remaining professional. I'd also build relationships proactively so future requests are prioritized. The key is persistence without damaging the relationship.",
      category: "Situational",
      difficulty: "easy"
    },
    {
      question: "What would you do if you realized a project you're leading is going to miss its deadline?",
      suggestedAnswer: "I'd immediately assess the gap - how much delay and why. I'd explore options: scope reduction, resource addition, or timeline extension. Before escalating, I'd have solutions ready, not just problems. I'd communicate proactively to stakeholders with transparency, a revised plan, and lessons learned. Taking accountability while presenting solutions maintains trust and shows leadership.",
      category: "Situational",
      difficulty: "hard"
    },
    {
      question: "How would you handle receiving critical feedback that you feel is unfair?",
      suggestedAnswer: "I'd stay calm and listen fully without becoming defensive. I'd ask for specific examples to better understand the feedback. Even if I disagree, I'd acknowledge their perception and thank them for sharing. After reflection, I'd have a follow-up conversation to address any misunderstandings with facts. I believe feedback, even uncomfortable, is valuable for growth.",
      category: "Situational",
      difficulty: "medium"
    }
  ];
  questions.push(...situationalQuestions);

  // === TECHNICAL/ROLE-SPECIFIC QUESTIONS (12 questions based on role type) ===
  if (isTechnical) {
    const techQuestions: PracticeQuestion[] = [
      {
        question: extractedSkills.length > 0 
          ? `Explain your experience with ${extractedSkills[0]}. What's a complex problem you solved using it?`
          : "Walk me through your technical stack and how you decide which technologies to use for a project.",
        suggestedAnswer: extractedSkills.length > 0
          ? `I have [X years] of experience with ${extractedSkills[0]}. A complex problem I solved was [specific challenge]. The approach involved [technical details]. Key decisions included [architecture choices]. The result was [measurable outcome - performance improvement, scalability achieved]. I chose this approach because [reasoning].`
          : "My technical stack includes [technologies]. When selecting technologies, I consider: scalability requirements, team expertise, community support, and long-term maintainability. For example, for [project type], I chose [tech] because [specific reasons]. This decision resulted in [outcome].",
        category: "Technical",
        difficulty: "medium"
      },
      {
        question: "Describe your approach to debugging a complex issue that spans multiple systems.",
        suggestedAnswer: "I follow a systematic approach: First, reproduce the issue consistently. Then, isolate variables using logs, monitoring tools, and binary search through recent changes. I trace data flow across systems, use distributed tracing tools, and check integration points. Recently, I debugged [specific issue] by [approach], which took [time] and taught me [lesson]. Documentation of root cause prevents recurrence.",
        category: "Technical",
        difficulty: "hard"
      },
      {
        question: "How do you ensure code quality and maintainability in your projects?",
        suggestedAnswer: "I enforce quality through: comprehensive code reviews with focus on readability, unit tests with meaningful coverage targets (not just numbers), integration tests for critical paths, automated linting and formatting, clear documentation, and meaningful commit messages. I also practice refactoring regularly and follow SOLID principles. At [previous company], implementing these practices reduced bugs by [percentage].",
        category: "Technical",
        difficulty: "medium"
      },
      {
        question: "Explain a situation where you had to make a trade-off between code quality and delivery speed.",
        suggestedAnswer: "During [project], we faced a tight deadline for [feature]. I made a calculated decision to [specific shortcut] with documented technical debt. I created tickets for remediation and communicated the trade-off to stakeholders. Within [timeframe] after launch, we addressed the debt. The key is transparency, documentation, and following through on cleanup.",
        category: "Technical",
        difficulty: "hard"
      },
      {
        question: "How do you stay updated with new technologies and decide which ones to learn?",
        suggestedAnswer: "I follow industry leaders on Twitter/LinkedIn, read tech blogs (Martin Fowler, Netflix Tech Blog), attend conferences, and participate in communities. For deciding what to learn, I consider: job market demand, relevance to my projects, and personal interest. I allocate [X hours/week] for learning. Recently, I learned [technology] which I applied in [project] with [result].",
        category: "Technical",
        difficulty: "easy"
      },
      {
        question: "Describe your experience with agile methodologies. What works well and what doesn't?",
        suggestedAnswer: "I've worked with Scrum and Kanban. What works: daily standups for alignment, sprint retrospectives for continuous improvement, and user story focus. Challenges: story point estimation can be inconsistent, and meetings can consume too much time. I've found success with [specific adaptation], which improved our velocity by [percentage] while maintaining flexibility.",
        category: "Technical",
        difficulty: "medium"
      },
      {
        question: extractedSkills.includes("aws") || extractedSkills.includes("azure") || extractedSkills.includes("cloud")
          ? "Describe your experience deploying and managing applications in the cloud. What challenges have you faced?"
          : "How do you approach system design for a scalable application?",
        suggestedAnswer: extractedSkills.includes("aws") || extractedSkills.includes("azure") || extractedSkills.includes("cloud")
          ? "I've deployed applications on [AWS/Azure/GCP] using services like [specific services]. A key challenge was [specific challenge - cost optimization, security, availability]. I addressed this through [approach]. I implemented [specific solution - auto-scaling, container orchestration, CI/CD]. Results included [metrics - uptime, cost reduction, deployment frequency]."
          : "I start with requirements gathering - understanding expected load, latency requirements, and growth projections. I identify bottlenecks, design for horizontal scaling, implement caching strategies, and consider database sharding if needed. For a recent project, I designed [system] that handled [scale] by [specific decisions]. Key patterns I use include [specific patterns].",
        category: "Technical",
        difficulty: "hard"
      },
      {
        question: "How do you handle technical disagreements with team members?",
        suggestedAnswer: "I approach them as opportunities for better solutions. I present my reasoning with data, listen actively to alternatives, and focus on objective criteria like performance, maintainability, and team capability. If consensus isn't reached, I suggest timeboxed experiments or prototypes. I've resolved such disagreements by [specific example], ultimately arriving at a solution neither of us originally proposed but superior to both.",
        category: "Technical",
        difficulty: "medium"
      },
      {
        question: "What's your approach to writing and maintaining documentation?",
        suggestedAnswer: "I believe documentation should be living and minimum viable. I document: architecture decisions (ADRs), API contracts, setup/deployment procedures, and non-obvious code. I keep docs close to code (README, code comments) where possible. I review docs during refactoring. At [company], I improved our onboarding time by [X%] through better documentation.",
        category: "Technical",
        difficulty: "easy"
      },
      {
        question: "Describe a performance optimization you implemented. What was the impact?",
        suggestedAnswer: "I optimized [specific feature/system] that was experiencing [performance issue]. Analysis revealed [root cause - N+1 queries, memory leaks, inefficient algorithm]. I implemented [specific solution - caching, query optimization, algorithm improvement]. Results: [quantified improvement - response time reduced by 80%, throughput increased 3x]. I learned the importance of profiling before optimizing.",
        category: "Technical",
        difficulty: "hard"
      },
      {
        question: "How do you ensure security in the applications you develop?",
        suggestedAnswer: "Security is integrated throughout my development process. I follow OWASP guidelines, implement input validation, use parameterized queries, manage secrets properly (never in code), and keep dependencies updated. I conduct code reviews with security focus and use static analysis tools. At [company], I identified and fixed [specific vulnerability] before deployment, preventing potential [impact].",
        category: "Technical",
        difficulty: "medium"
      },
      {
        question: "Tell me about a time you had to learn a new technology quickly for a project.",
        suggestedAnswer: "For [project], I needed to learn [technology] within [timeframe]. I approached it by: focusing on fundamentals first, building a prototype project, finding mentors (internal experts, online communities), and reading source code of well-regarded projects. Within [time], I was productive enough to [achievement]. This reinforced that structured learning combined with hands-on practice is most effective.",
        category: "Technical",
        difficulty: "easy"
      }
    ];
    questions.push(...techQuestions);
  } else if (isManagement) {
    const mgmtQuestions: PracticeQuestion[] = [
      {
        question: "Describe your leadership style and how it has evolved.",
        suggestedAnswer: "My leadership style is [style - servant leadership, situational, transformational]. I focus on empowering my team, providing clear direction, and removing obstacles. Earlier in my career, I was more [previous style], but I evolved after learning that [key insight]. I adapt my approach based on team maturity and situation. For example, with senior team members I [approach], while newer team members benefit from [different approach].",
        category: "Leadership",
        difficulty: "medium"
      },
      {
        question: "How do you handle underperforming team members?",
        suggestedAnswer: "First, I have a private conversation to understand root causes - unclear expectations, personal issues, or skill gaps. Together, we create a performance improvement plan with specific, measurable goals and regular check-ins. I provide necessary support and training. If improvement doesn't happen despite support, I have honest conversations about fit and involve HR appropriately. I've successfully coached [X] team members through similar situations.",
        category: "Leadership",
        difficulty: "hard"
      },
      {
        question: "How do you prioritize competing demands from your team and upper management?",
        suggestedAnswer: "I use transparent prioritization frameworks. I understand business objectives from leadership and team capacity constraints. I facilitate priority discussions with data on impact and effort. When conflicts arise, I push back constructively with alternatives rather than just saying no. I buffer my team from constant priority changes while staying aligned with business needs. Communication in both directions is key.",
        category: "Leadership",
        difficulty: "hard"
      },
      {
        question: "Describe a time you had to deliver difficult news to your team.",
        suggestedAnswer: "When [situation - layoffs, project cancellation, org change], I was direct and empathetic. I communicated clearly about what was happening, why, and what it meant for them. I acknowledged emotions, answered questions honestly (including 'I don't know' when appropriate), and focused on actionable next steps. I made myself available for follow-up conversations. Transparency maintained trust during a difficult time.",
        category: "Leadership",
        difficulty: "hard"
      },
      {
        question: "How do you build and maintain team culture?",
        suggestedAnswer: "Culture is built through consistent actions, not just words. I model the values I want to see - accountability, collaboration, continuous learning. I establish rituals: regular team celebrations, open feedback sessions, and learning time. I hire for culture fit and address toxic behaviors quickly. At [company], I built a culture of [specific value] that was recognized by [achievement - high retention, awards, satisfaction scores].",
        category: "Leadership",
        difficulty: "medium"
      },
      {
        question: "How do you develop talent on your team?",
        suggestedAnswer: "I believe in individualized development. I conduct career conversations to understand each person's goals, create stretch opportunities, and provide regular feedback. I pair junior members with mentors, support training budgets, and give autonomy for ownership. Success stories include [specific example] where I helped [team member] grow from [A to B]. My teams consistently have strong retention and internal promotions.",
        category: "Leadership",
        difficulty: "medium"
      },
      {
        question: "Describe your approach to setting and tracking goals.",
        suggestedAnswer: "I use OKRs aligned with company objectives. I involve the team in goal-setting for ownership. Goals are specific, measurable, and ambitious but achievable. We track progress weekly with quick check-ins and course-correct as needed. Quarterly reviews assess achievement and learnings. I separate performance discussions from goal achievement to encourage ambitious targets without penalizing stretch failure.",
        category: "Leadership",
        difficulty: "medium"
      },
      {
        question: "How do you handle conflicts between team members?",
        suggestedAnswer: "I address conflicts quickly before they escalate. First, I meet individually to understand perspectives. Then, I facilitate a conversation focused on shared goals and finding solutions, not assigning blame. I help establish clear communication norms and boundaries going forward. For recurring issues, I dig deeper into root causes. Most conflicts stem from miscommunication or unclear roles, both fixable.",
        category: "Leadership",
        difficulty: "medium"
      },
      {
        question: "What metrics do you use to measure team success?",
        suggestedAnswer: "I track both output and health metrics. Output: delivery velocity, quality (bug rates, customer satisfaction), and business impact. Health: team satisfaction (eNPS), retention, growth (skills developed), and collaboration quality. I use leading indicators to catch problems early. At [company], I improved [specific metric] by [amount] through [specific initiative] while maintaining team health scores.",
        category: "Leadership",
        difficulty: "hard"
      },
      {
        question: "How do you ensure effective communication across a distributed team?",
        suggestedAnswer: "I establish clear communication norms: which tools for which purposes, response time expectations, and overlap hours. I prioritize written documentation and async updates while preserving synchronous time for collaboration and bonding. I'm intentional about including remote members in discussions. Regular video 1:1s maintain personal connection. At [company], I managed a [X]-person distributed team that outperformed co-located teams in [metric].",
        category: "Leadership",
        difficulty: "medium"
      },
      {
        question: "Describe how you would approach hiring for a new position on your team.",
        suggestedAnswer: "I start with a clear job description reflecting actual needs, involvement from team in defining requirements. I structure interviews to assess skills, culture fit, and potential, using consistent rubrics to reduce bias. I involve diverse interviewers and check references deliberately. I move quickly for strong candidates. My hiring decisions have a [X%] success rate, measured by [metric].",
        category: "Leadership",
        difficulty: "medium"
      },
      {
        question: "How do you keep your team motivated during challenging periods?",
        suggestedAnswer: "During challenging times, I increase communication and transparency about the situation. I acknowledge the difficulty while connecting work to meaningful purpose. I celebrate small wins, recognize individual contributions, and protect the team from burnout by adjusting expectations when possible. I'm visible and available. During [challenge], I maintained team morale by [specific actions], and we emerged stronger.",
        category: "Leadership",
        difficulty: "hard"
      }
    ];
    questions.push(...mgmtQuestions);
  } else if (isSales || isMarketing) {
    const salesMarketingQuestions: PracticeQuestion[] = [
      {
        question: "Tell me about your most successful sales/marketing campaign. What made it successful?",
        suggestedAnswer: "My most successful campaign was for [product/service]. I identified that [customer insight]. The strategy focused on [approach - specific channels, messaging, tactics]. We executed over [timeframe] with a budget of [amount]. Results: [quantified success - ROI, leads generated, revenue, conversions]. Key success factors were [factors]. I learned [lesson] which I've applied since.",
        category: "Achievement",
        difficulty: "medium"
      },
      {
        question: "How do you approach building relationships with clients or customers?",
        suggestedAnswer: "I focus on understanding before selling. I research their business, ask insightful questions, and listen actively to uncover real needs. I provide value first - insights, connections, resources - building trust over time. I maintain regular touchpoints without being pushy, and I deliver on every promise. This approach has led to [example] where a relationship I built resulted in [outcome].",
        category: "Relationship",
        difficulty: "medium"
      },
      {
        question: "Describe how you handle rejection or losing a deal.",
        suggestedAnswer: "Rejection is learning opportunity, not failure. I always ask for feedback to understand what I could improve. I analyze: was it timing, pricing, product fit, or my approach? I maintain the relationship for future opportunities - some of my best customers were initially lost deals. I don't take it personally and maintain resilience through focus on the pipeline. Specific example: I lost [deal] but [how it led to future success].",
        category: "Resilience",
        difficulty: "medium"
      },
      {
        question: "How do you identify and qualify leads?",
        suggestedAnswer: "I use a framework like BANT (Budget, Authority, Need, Timeline) or MEDDIC for complex sales. I research prospects before outreach, use triggers (hiring, funding, news) to time conversations. I ask qualification questions early to prioritize effort. My qualification process has resulted in [X%] conversion rate from qualified leads. I use CRM rigorously to track and nurture leads systematically.",
        category: "Process",
        difficulty: "easy"
      },
      {
        question: "How do you stay current with market trends in your industry?",
        suggestedAnswer: "I dedicate time weekly to industry reading - reports, news, thought leaders. I attend industry conferences and webinars. I learn from customers directly about their challenges and emerging needs. I network with peers. I use this knowledge to anticipate market shifts - for example, I identified [trend] early and positioned our approach which gave us [competitive advantage].",
        category: "Knowledge",
        difficulty: "easy"
      },
      {
        question: "Describe your approach to meeting revenue or performance targets.",
        suggestedAnswer: "I break annual targets into quarterly, monthly, and weekly goals. I work backwards from targets to required activities (calls, meetings, proposals). I track leading indicators daily and adjust tactics quickly. I front-load effort early in periods and maintain discipline on activities even when things are going well. My track record: [X% target achievement] over [period]. When I've missed targets, I've analyzed and adapted.",
        category: "Achievement",
        difficulty: "medium"
      },
      {
        question: "How do you handle objections from prospects?",
        suggestedAnswer: "I welcome objections as signs of interest. I listen fully without interrupting, acknowledge the concern, and ask clarifying questions. I address with relevant evidence - customer stories, data, demonstrations. For pricing objections, I focus on value and ROI. I prepare for common objections in advance. Example: When faced with [common objection], I respond with [effective approach] which has converted [X%] of those situations.",
        category: "Sales Skills",
        difficulty: "medium"
      },
      {
        question: "How do you use data to inform your sales/marketing strategy?",
        suggestedAnswer: "Data drives my decisions. I track metrics across the funnel - awareness, engagement, conversion, retention. I use A/B testing for campaigns. I analyze win/loss data for patterns. I segment customers for targeted approaches. Example: data analysis revealed [insight], leading me to [action] which improved [metric] by [amount]. I balance data with customer qualitative feedback.",
        category: "Analytics",
        difficulty: "medium"
      },
      {
        question: "How do you handle a customer or client who is unhappy with your product or service?",
        suggestedAnswer: "I respond quickly and take ownership regardless of fault. I listen without defensiveness to fully understand the issue. I apologize for their experience and outline clear resolution steps. I follow up to ensure satisfaction. I analyze root causes to prevent recurrence. Turning around unhappy customers has actually created some of my most loyal advocates - example: [specific situation and outcome].",
        category: "Customer Service",
        difficulty: "medium"
      },
      {
        question: "What's your experience with CRM systems and sales tools?",
        suggestedAnswer: "I've used [specific CRMs - Salesforce, HubSpot, etc.] extensively. I use CRM discipline to track all interactions, pipeline stages, and forecasts. I leverage automation for follow-ups and reporting. I've also used tools like [other tools - LinkedIn Sales Navigator, ZoomInfo, Outreach]. Proper tool usage improved my productivity by [estimate] and gave leadership accurate forecasting.",
        category: "Technical",
        difficulty: "easy"
      },
      {
        question: "How do you collaborate with other departments (product, marketing, customer success)?",
        suggestedAnswer: "Cross-functional collaboration is crucial. I share customer feedback with product regularly. I work with marketing on content and campaigns that address real customer pain points. I partner with customer success for smooth handoffs and expansion opportunities. Example: my collaboration with [team] on [initiative] resulted in [business outcome]. I believe sales succeeds when the whole organization is aligned.",
        category: "Collaboration",
        difficulty: "easy"
      },
      {
        question: "Where do you see the future of [sales/marketing] heading, and how do you prepare for it?",
        suggestedAnswer: "I see [trends - personalization at scale, AI-powered insights, customer experience focus, etc.] shaping the future. Customers are more informed, so value-added consultative approaches matter more. I'm preparing by [specific actions - learning new skills, experimenting with new tools, focusing on relationship depth]. Companies that adapt to [specific change] will win. I stay curious and agile to evolve with the market.",
        category: "Vision",
        difficulty: "medium"
      }
    ];
    questions.push(...salesMarketingQuestions);
  } else {
    // Generic professional questions
    const genericQuestions: PracticeQuestion[] = [
      {
        question: `What specific skills or experience make you the right fit for this ${interviewType} role?`,
        suggestedAnswer: `My background in [relevant experience] directly aligns with this role. Specifically, I bring [skill 1], [skill 2], and [skill 3]. For example, at [company], I [specific achievement] which demonstrates my capability in [relevant area]. I'm also passionate about [aspect of role], which drives my commitment to excel. My unique combination of [competencies] makes me confident I can contribute immediately.`,
        category: "Fit",
        difficulty: "medium"
      },
      {
        question: "How do you prioritize your work when everything seems urgent?",
        suggestedAnswer: "I use a systematic approach. First, I clarify actual urgency vs. perceived urgency with stakeholders. I consider impact - what delivers most value? I factor in dependencies and deadlines. I'm transparent about trade-offs when needed. I protect time for important but not urgent work. Example: facing [situation], I prioritized [action] because [reasoning], resulting in [outcome].",
        category: "Organization",
        difficulty: "easy"
      },
      {
        question: "Describe how you approach learning new skills required for your job.",
        suggestedAnswer: "I'm a proactive learner. I identify skill gaps by reflecting on challenges and seeking feedback. I create learning plans combining various methods: courses, reading, mentorship, and hands-on practice. I set specific goals and timelines. Recent example: I needed to learn [skill], so I [specific approach], achieved competency in [timeframe], and applied it to [result]. Continuous learning is non-negotiable in my career.",
        category: "Growth",
        difficulty: "easy"
      },
      {
        question: "How do you handle situations where you don't have all the information you need?",
        suggestedAnswer: "I identify what I know, what I don't, and what I need to decide. I seek out information efficiently from available sources. When gaps remain, I make reasoned assumptions, document them, and proceed with calculated risk. I build in checkpoints to course-correct. Example: In [situation] with limited information, I [approach] which led to [outcome]. Waiting for perfect information often means missing opportunities.",
        category: "Decision Making",
        difficulty: "medium"
      },
      {
        question: "What do you consider your biggest professional weakness, and how do you work on it?",
        suggestedAnswer: "My biggest area for growth is [genuine weakness - e.g., public speaking, delegation, perfectionism]. I've actively worked on this by [specific actions - taking a course, seeking opportunities, getting coaching]. Progress I've made includes [specific improvement]. I continue to work on it by [ongoing strategies]. I believe self-awareness about weaknesses and deliberate improvement is a strength.",
        category: "Self-Awareness",
        difficulty: "medium"
      },
      {
        question: "Why are you looking to leave your current position?",
        suggestedAnswer: "I've valued my time at [current company] where I [achievements]. I'm seeking new challenges because [positive reasons - growth opportunities, new industry, larger scope, different culture]. This role excites me specifically because [specific aspects of new role]. I'm not running from anything - I'm running toward an opportunity that aligns with my career goals of [aspirations].",
        category: "Motivation",
        difficulty: "easy"
      },
      {
        question: "Where do you see yourself in five years?",
        suggestedAnswer: "In five years, I aim to [career goal] having developed expertise in [areas]. I want to have made significant impact through [type of contributions]. I see this role as a key step because [connection to goal]. While I'm focused on excelling in the immediate role, I'm drawn to organizations where growth and advancement are possible for strong performers.",
        category: "Career Goals",
        difficulty: "easy"
      },
      {
        question: "How do you handle a situation where you're asked to do something you've never done before?",
        suggestedAnswer: "I embrace it as growth opportunity. I break down the unfamiliar task into components, research best practices, and identify who might help. I'm transparent about my learning curve while showing confidence in my ability to figure it out. I start with small experiments, iterate, and ask for feedback. Example: I was asked to [unfamiliar task], approached it by [method], and achieved [successful outcome].",
        category: "Adaptability",
        difficulty: "medium"
      },
      {
        question: "How would your current or former colleagues describe you?",
        suggestedAnswer: "They'd describe me as [2-3 positive traits - reliable, collaborative, innovative - with specifics]. For example, 'always willing to help' because I [example]. They'd also say I'm [trait] - one colleague told me [specific quote or feedback]. They might also mention that I [area you're working on] , which I'm actively improving. Overall, I strive to be someone people trust and enjoy working with.",
        category: "Self-Awareness",
        difficulty: "easy"
      },
      {
        question: "What questions do you have for us about this role or the company?",
        suggestedAnswer: "I'd like to ask: 1) What does success look like in this role in the first year? 2) What are the biggest challenges the team is currently facing? 3) How would you describe the team culture? 4) What opportunities for growth and development exist? 5) What do you enjoy most about working here? These questions show my interest in thriving here, not just getting the job.",
        category: "Engagement",
        difficulty: "easy"
      },
      {
        question: "Describe a time when you had to influence someone without having direct authority.",
        suggestedAnswer: "When I needed [specific outcome] from [colleague/stakeholder], I couldn't simply direct them. Instead, I built a relationship first, understood their priorities and constraints. I framed my request in terms of their interests and the shared benefit. I provided supporting data and made it easy to say yes. Result: [outcome]. This taught me that influence comes from trust, empathy, and finding win-wins.",
        category: "Influence",
        difficulty: "hard"
      },
      {
        question: `What do you know about our company, and why do you want to work here?`,
        suggestedAnswer: `I've researched your company extensively. I know you [specific fact about company - products, mission, recent news, culture]. I'm impressed by [specific admirable aspect]. Your [specific initiative or value] resonates with me because [personal connection]. I want to work here because [specific reasons - growth opportunity, industry leadership, culture fit, impactful work]. I believe I can contribute to [specific area].`,
        category: "Company Knowledge",
        difficulty: "medium"
      }
    ];
    questions.push(...genericQuestions);
  }

  // Ensure we have exactly 30 questions, shuffle them
  const shuffled = questions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 30);
}

function mockShortFeedback(userAnswer: string): string {
  const wc = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  if (wc < 15) {
    return "Aim for a fuller answer (roughly 60–120 spoken words): state your point, add one example, close with impact.";
  }
  if (!/\d|%|percent|times|saved|reduced|increased|improved/i.test(userAnswer)) {
    return "Add one measurable outcome (%, time, revenue, scale) so the panel can calibrate your impact.";
  }
  return "Good substance — sharpen the opening (direct answer first) and explicitly tie your experience to this role.";
}

function mockIdealAnswer(
  questionText: string,
  userAnswer: string,
  interviewType: string,
  jobDescription?: string,
): string {
  const role = interviewType.split("|")[0]?.trim() || "this role";
  const jdHint =
    jobDescription && jobDescription.length > 40
      ? `\n\nAlign with the job context when you personalize: pick 1–2 requirements from the JD and name how you’ve done that before.`
      : "";

  return (
    `Here is a strong sample structure for “${questionText.slice(0, 120)}${questionText.length > 120 ? "…" : ""}” targeting ${role}:\n\n` +
    `Open with a one-sentence headline that answers the question. Then use STAR if it’s experience-based: Situation (brief), Task (your responsibility), Action (what *you* did, tools/process), Result (metric or lesson). If it’s technical, define the concept, trade-offs, and where you applied it.\n\n` +
    `Example skeleton you can adapt with your real details: “In my role at [Company] as [Title], we faced [constraint]. I owned [scope]. I [steps using tools/methods], partnering with [stakeholders]. We measured success by [metric] and achieved [outcome]. I’d bring the same approach here by [tie-in to ${role}].”\n\n` +
    `Your answer mentioned: “${userAnswer.slice(0, 100)}${userAnswer.length > 100 ? "…" : ""}” — keep that honesty, but replace vague phrases with one sharper example and one number.${jdHint}`
  );
}

function buildMockQuestionReviews(
  turns: InterviewTranscriptTurn[],
  interviewType: string,
  jobDescription?: string,
): InterviewQuestionReview[] {
  return turns.map((t) => ({
    questionText: t.questionText,
    userAnswer: t.userAnswer,
    shortFeedback: mockShortFeedback(t.userAnswer),
    idealAnswer: mockIdealAnswer(t.questionText, t.userAnswer, interviewType, jobDescription),
  }));
}

// Log startup message
if (typeof window !== "undefined") {
  console.log(
    "%c Mock Interview API Active",
    "color: #f97316; font-weight: bold; font-size: 12px;",
  );
  console.log(
    "%c Using mock data for development & testing",
    "color: #f97316; font-size: 11px;",
  );
}

export const mockApi = {
  async startInterview(
    data: StartInterviewRequest,
  ): Promise<StartInterviewResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const sessionId = generateSessionId();
    let questions: string[] = [];
    let hasJD = false;
    let hasCV = false;
    
    // Priority 1: Generate questions from Job Description if provided
    if (data.jobDescription && data.jobDescription.trim().length > 50) {
      const jdQuestions = generateJDBasedQuestions(data.jobDescription, data.interviewType);
      questions = [...jdQuestions];
      hasJD = true;
      console.log("Generated JD-based questions:", jdQuestions);
    }
    
    // Priority 2: Generate questions from CV if provided
    if (data.cvText && data.cvText.trim().length > 50) {
      const cvQuestions = generateCVBasedQuestions(data.cvText, data.interviewType);
      // Add CV questions (avoiding duplicates with JD questions)
      const existingQuestionLower = questions.map(q => q.toLowerCase());
      cvQuestions.forEach(q => {
        if (!existingQuestionLower.some(eq => eq.includes(q.substring(0, 30).toLowerCase()))) {
          questions.push(q);
        }
      });
      hasCV = true;
      console.log("Generated CV-based questions:", cvQuestions);
    }
    
    // Priority 3: Add generic questions based on interview type keywords
    // The interviewType string is built as: "[role] | Tech/Non-Tech/Govt | Manager/HR Round"
    const lowerType = data.interviewType.toLowerCase();
    let genericQuestions: string[] = [];

    // Detect Manager Round — strict: must be manager round questions
    if (lowerType.includes("manager round")) {
      genericQuestions = [...mockQuestions.manager];
    // Detect HR Round — strict: must be hr round questions
    } else if (lowerType.includes("hr round")) {
      genericQuestions = [...mockQuestions.hr];
    // Detect Government category
    } else if (lowerType.includes("government interview") || lowerType.includes("govt") || lowerType.includes("government") || lowerType.includes("civil") || lowerType.includes("public service")) {
      genericQuestions = [...mockQuestions.government];
    // Detect Tech category
    } else if (lowerType.includes("tech interview") || lowerType.includes("software") || lowerType.includes("developer") || lowerType.includes("engineer") ||
        lowerType.includes("programmer") || lowerType.includes("data") ||
        lowerType.includes("devops") || lowerType.includes("cloud") || lowerType.includes("backend") ||
        lowerType.includes("frontend") || lowerType.includes("fullstack")) {
      genericQuestions = [...mockQuestions.it];
    // Detect Non-Tech category
    } else if (lowerType.includes("non-tech interview") || lowerType.includes("non-tech") || lowerType.includes("nontech")) {
      genericQuestions = [...mockQuestions["non-it"]];
    } else {
      genericQuestions = [...mockQuestions.private];
    }

    // Add generic questions to fill up to 8 total questions
    const targetQuestionCount = 8;
    while (questions.length < targetQuestionCount && genericQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * genericQuestions.length);
      const q = genericQuestions.splice(randomIndex, 1)[0];
      // Avoid adding duplicates
      if (!questions.some(eq => eq.toLowerCase().includes(q.substring(0, 30).toLowerCase()))) {
        questions.push(q);
      }
    }
    
    // Shuffle questions but keep personalized ones near the front
    const shuffled = questions.length > 0 
      ? questions 
      : [...mockQuestions.private].sort(() => Math.random() - 0.5);

    sessions.set(sessionId, {
      type: data.interviewType,
      language: data.language,
      cvText: data.cvText,
      jobDescription: data.jobDescription,
      questionIndex: 0,
      questions: shuffled,
      answers: [],
      answerAnalyses: [],
      scores: {
        communication: 0,
        technical: 0,
        confidence: 0,
      },
    });
    saveSessionsToStorage(sessions);

    // Create personalized opening message
    const lowerTypeOpening = data.interviewType.toLowerCase();
    const isManagerRound = lowerTypeOpening.includes("manager round");
    const isHRRound = lowerTypeOpening.includes("hr round");
    const roundLabel = isManagerRound ? "Manager Round" : isHRRound ? "HR Round" : "";

    let openingMessage = shuffled[0];
    if (hasJD && hasCV) {
      openingMessage = `I've reviewed your CV and the job description. ${roundLabel ? `This is your ${roundLabel}. ` : ""}Let's begin. ${shuffled[0]}`;
    } else if (hasJD) {
      openingMessage = `I've reviewed the job description. ${roundLabel ? `This is your ${roundLabel}. ` : ""}Let's start. ${shuffled[0]}`;
    } else if (hasCV) {
      openingMessage = `I've reviewed your CV. ${roundLabel ? `This is your ${roundLabel}. ` : ""}${shuffled[0]}`;
    } else if (roundLabel) {
      openingMessage = `Welcome to your ${roundLabel}. ${shuffled[0]}`;
    }

    return {
      sessionId,
      message: openingMessage,
      success: true,
      cvUploaded: hasCV,
      interviewType: data.interviewType,
      language: data.language,
    };
  },

  async getNextQuestion(
    data: NextQuestionRequest,
  ): Promise<NextQuestionResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const session = sessions.get(data.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Store answer and analyze it
    session.answers.push(data.userAnswer);
    const analysis = analyzeAnswer(data.userAnswer, session.type);
    session.answerAnalyses.push(analysis);

       // Score based on actual answer quality (more realistic and nuanced)
    // Communication: structure, examples, transitions, appropriate length
    let commScore = 0;
    if (analysis.isWellStructured) commScore += 1.8;
    if (analysis.hasExamples) commScore += 1.5;
    if (analysis.hasTransitions) commScore += 0.8;
    // Ideal length is 50-120 words
    if (analysis.wordCount >= 50 && analysis.wordCount <= 120) commScore += 1.5;
    else if (analysis.wordCount >= 30 && analysis.wordCount < 50) commScore += 1;
    else if (analysis.wordCount > 120 && analysis.wordCount <= 180) commScore += 1;
    else if (analysis.wordCount >= 20) commScore += 0.5;
    // Bonus for multiple sentences (shows detail)
    if (analysis.sentenceCount >= 3) commScore += 0.5;
    session.scores.communication += commScore;

    // Technical: STAR method, technical keywords, depth (more realistic scoring)
    let techScore = 0;
    // STAR method bonus (but not too heavy - real interviews value other things too)
    techScore += analysis.starScore * 1.2; // Up to 4.8 points for full STAR
    // Technical keywords (relevant terminology matters)
    techScore += Math.min(analysis.techMatches * 0.6, 2.5); // Up to 2.5 points for keywords
    // Bonus for having situation AND action (core of good answer)
    if (analysis.hasSituation && analysis.hasAction) techScore += 1;
    // Bonus for quantifiable result
    if (analysis.hasResult && /\d+%|\d+x|increased|decreased|saved|improved/.test(data.userAnswer.toLowerCase())) {
      techScore += 1.2;
    }
    session.scores.technical += techScore;

    // Confidence: assertive language, lack of excessive hedging (more nuanced)
    let confScore = 0;
    if (analysis.hasAssertive) confScore += 2.5;
    // A little hedging is okay and shows thoughtfulness
    if (!analysis.hasHedging) confScore += 1.8;
    else confScore += 0.8; // Some hedging is actually professional
    // Bonus for substantive answers
    if (analysis.wordCount >= 40) confScore += 1;
    if (analysis.wordCount >= 70) confScore += 0.5; // Extra for detailed
    // Penalty for being too brief (shows lack of confidence or preparation)
    if (analysis.wordCount < 20) confScore -= 1;
    session.scores.confidence += confScore;

    // Persist session changes
    saveSessionsToStorage(sessions);

    // More likely to follow up if the answer was detailed or mentioned interesting points
    const hasInterestingContent = analysis.techMatches > 0 || 
                                   analysis.starScore >= 2 || 
                                   analysis.wordCount > 80;
    const followUpChance = hasInterestingContent ? 0.5 : 0.3;
    const isFollowUp = Math.random() < followUpChance && session.questionIndex < 6;

    if (isFollowUp) {
      // Generate contextual follow-up based on the user's answer
      const followUp = generateContextualFollowUp(data.userAnswer, session.type);
      return {
        message: followUp,
        isFollowUp: true,
        questionNumber: session.questionIndex + 1,
        totalQuestions: session.questions.length,
      };
    }

    // Move to next question
    session.questionIndex += 1;
    saveSessionsToStorage(sessions);

    // Check if interview complete
    if (session.questionIndex >= session.questions.length) {
      return {
        message: "Thank you for your detailed responses! Your interview is now complete. I'll prepare your evaluation.",
        isFollowUp: false,
        questionNumber: session.questions.length + 1,
        totalQuestions: session.questions.length,
      };
    }

    // Generate a contextually connected next question
    const remaining = session.questions.slice(session.questionIndex);
    const bestIdx = selectNextContextualQuestion(data.userAnswer, remaining);

    // Swap the most relevant question into the next slot
    if (bestIdx !== 0) {
      const tmp = session.questions[session.questionIndex];
      session.questions[session.questionIndex] = session.questions[session.questionIndex + bestIdx];
      session.questions[session.questionIndex + bestIdx] = tmp;
    }

    const baseQuestion = session.questions[session.questionIndex];
    const connectedQuestion = generateConnectedQuestion(
      data.userAnswer,
      baseQuestion,
      session.type
    );

    return {
      message: connectedQuestion,
      isFollowUp: false,
      questionNumber: session.questionIndex + 1,
      totalQuestions: session.questions.length,
    };
  },

  async finishInterview(
    data: FinishInterviewRequest,
  ): Promise<FinishInterviewResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const session = sessions.get(data.sessionId);

    let transcriptTurns: InterviewTranscriptTurn[] = data.transcriptTurns ?? [];
    if (transcriptTurns.length === 0 && session?.answers?.length) {
      transcriptTurns = session.answers.map((userAnswer, i) => ({
        questionText:
          session.questions[Math.min(i, Math.max(0, session.questions.length - 1))] ??
          `Question ${i + 1}`,
        userAnswer,
      }));
    }

    const questionReviews =
      transcriptTurns.length > 0
        ? buildMockQuestionReviews(
            transcriptTurns,
            session?.type ?? "Interview",
            session?.jobDescription,
          )
        : undefined;

    // If session not found, return default evaluation (graceful fallback)
    if (!session) {
      console.warn("Session not found, returning default evaluation");
      return {
        overallScore: 7.5,
        communicationScore: 7.8,
        technicalScore: 7.2,
        confidenceScore: 7.5,
        strengths: [
          "Completed the interview session",
          "Demonstrated willingness to participate",
        ],
        weakAreas: [
          { area: "Session", issue: "Interview session could not be found or expired.", howToImprove: "Please restart your interview to receive personalized feedback and video suggestions." },
        ],
        transcriptTurns: transcriptTurns.length ? transcriptTurns : undefined,
        questionReviews,
      };
    }

    const answerCount = session.answers.length || 1;
    
    // Calculate final scores (normalize to 10) - more realistic scoring
    const maxPossibleComm = 5.6 * answerCount; // Adjusted for new scoring system
    const maxPossibleTech = 7.5 * answerCount; // Adjusted for new scoring system 
    const maxPossibleConf = 5.3 * answerCount; // Adjusted for new scoring system

    // Realistic score ranges: 4-9.5, with 7-8 being good, 8.5+ being excellent
    const communicationScore = Math.min(
      Math.max((session.scores.communication / maxPossibleComm) * 10, 4.0),
      9.5
    );
    const technicalScore = Math.min(
      Math.max((session.scores.technical / maxPossibleTech) * 10, 4.0),
      9.5
    );
    const confidenceScore = Math.min(
      Math.max((session.scores.confidence / maxPossibleConf) * 10, 4.0),
      9.5
    );
    // Weighted average: Technical (40%), Communication (35%), Confidence (25%)
    const overallScore = (communicationScore * 0.35 + technicalScore * 0.40 + confidenceScore * 0.25);

    // Analyze performance patterns
    const analyses = session.answerAnalyses;
    const avgWordCount = analyses.reduce((sum, a) => sum + a.wordCount, 0) / answerCount;
    const starUsage = analyses.filter(a => a.starScore >= 3).length / answerCount;
    const exampleUsage = analyses.filter(a => a.hasExamples).length / answerCount;
    const hedgingCount = analyses.filter(a => a.hasHedging).length;
    const assertiveCount = analyses.filter(a => a.hasAssertive).length;
    const wellStructuredCount = analyses.filter(a => a.isWellStructured).length;
    const techKeywordUsage = analyses.filter(a => a.techMatches > 0).length / answerCount;

    // Generate dynamic strengths based on actual performance
    const strengths: string[] = [];
    
    if (starUsage >= 0.5) {
      strengths.push("Excellent use of the STAR method to structure responses");
    }
    if (exampleUsage >= 0.4) {
      strengths.push("Good use of specific examples to support answers");
    }
    if (avgWordCount >= 50 && avgWordCount <= 150) {
      strengths.push("Provided appropriately detailed responses without being too verbose");
    }
    if (assertiveCount >= answerCount * 0.6) {
      strengths.push("Demonstrated confidence in your abilities and experience");
    }
    if (techKeywordUsage >= 0.5) {
      strengths.push("Strong use of relevant technical/professional terminology");
    }
    if (wellStructuredCount >= answerCount * 0.5) {
      strengths.push("Well-organized and structured communication style");
    }
    if (analyses.some(a => a.hasResult)) {
      strengths.push("Good at highlighting outcomes and achievements");
    }
    
    // Ensure at least one strength
    if (strengths.length === 0) {
      strengths.push("Completed the interview and provided responses to all questions");
    }

    // Generate dynamic weak areas based on actual performance
    const weakAreas: { area: string; issue: string; howToImprove: string }[] = [];
    
    if (starUsage < 0.3) {
      weakAreas.push({ area: "Structure", issue: "Answers lacked clear structure", howToImprove: "Use the STAR method: Situation, Task, Action, Result" });
    }
    if (exampleUsage < 0.3) {
      weakAreas.push({ area: "Examples", issue: "Few concrete examples were provided to support your claims", howToImprove: "Prepare 3-5 detailed examples from your experience that you can adapt to different questions" });
    }
    if (avgWordCount < 30) {
      weakAreas.push({ area: "Detail", issue: "Responses were too brief", howToImprove: "Aim for 60-120 word responses with specific details and outcomes" });
    } else if (avgWordCount > 200) {
      weakAreas.push({ area: "Conciseness", issue: "Responses tended to be lengthy", howToImprove: "Practice being more concise — focus on key points and trim filler" });
    }
    if (hedgingCount >= answerCount * 0.5) {
      weakAreas.push({ area: "Confidence", issue: "Frequent use of uncertain language (\"maybe\", \"I think\", \"probably\")", howToImprove: "Replace uncertain phrases with confident statements. Say \"I can...\" instead of \"I think I can...\"" });
    }
    if (techKeywordUsage < 0.3 && session.type === 'it') {
      weakAreas.push({ area: "Technical Vocabulary", issue: "Limited use of technical terminology", howToImprove: "Research common terminology in your field and incorporate it naturally into your responses" });
    }
    if (analyses.filter(a => !a.hasAction).length >= answerCount * 0.5) {
      weakAreas.push({ area: "Action Clarity", issue: "Answers often missed the \"Action\" component", howToImprove: "Describe what YOU specifically did — use strong action verbs" });
    }

    // Ensure at least one weak area for constructive feedback
    if (weakAreas.length === 0) {
      weakAreas.push({ area: "Consistency", issue: "Performance was generally good", howToImprove: "Continue practicing to maintain consistency across longer interviews" });
    }

    // Generate dynamic improvement suggestions based on weak areas
    const improvementSuggestions: string[] = [];
    
    if (starUsage < 0.3) {
      improvementSuggestions.push("Practice structuring responses using STAR: Start with the Situation, explain the Task, detail your Actions, and highlight the Results");
    }
    if (exampleUsage < 0.3) {
      improvementSuggestions.push("Prepare 3-5 detailed examples from your experience that you can adapt to different questions");
    }
    if (hedgingCount >= answerCount * 0.5) {
      improvementSuggestions.push("Replace uncertain phrases with confident statements. Instead of \"I think I can...\", say \"I can...\"");
    }
    if (avgWordCount < 30) {
      improvementSuggestions.push("Aim for responses that are 60-120 words. Practice expanding on your initial answer with specific details");
    }
    if (techKeywordUsage < 0.3) {
      improvementSuggestions.push("Research common terminology in your field and incorporate it naturally into your responses");
    }
    if (analyses.filter(a => !a.hasResult).length >= answerCount * 0.5) {
      improvementSuggestions.push("Always conclude with measurable results or impact - numbers, percentages, or tangible outcomes make answers memorable");
    }
    if (wellStructuredCount < answerCount * 0.5) {
      improvementSuggestions.push("Use transition phrases like \"firstly\", \"additionally\", \"as a result\" to improve answer flow");
    }

    // Ensure at least one suggestion
    if (improvementSuggestions.length === 0) {
      improvementSuggestions.push("Keep practicing with mock interviews to build consistency and natural delivery");
    }

    // Build improvement plan from suggestions
    const improvementPlan = {
      immediateActions: improvementSuggestions.slice(0, 3),
      resourcesToStudy: [
        "Practice with STAR method templates",
        "Review common interview questions for your field",
      ],
      practiceStrategy: "Do 2-3 mock interviews per week, record yourself, and review for areas of improvement.",
    };

    // Generate practice questions based on interview type and job description
    const practiceQuestions = generatePracticeQuestionsWithAnswers(
      session.type,
      session.jobDescription
    );

    // Clean up session
    sessions.delete(data.sessionId);
    saveSessionsToStorage(sessions);

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      communicationScore: Math.round(communicationScore * 10) / 10,
      technicalScore: Math.round(technicalScore * 10) / 10,
      confidenceScore: Math.round(confidenceScore * 10) / 10,
      strengths: strengths.slice(0, 4), // Limit to top 4
      weakAreas: weakAreas.slice(0, 3), // Limit to top 3
      improvementPlan,
      detailedFeedback: `Based on your ${answerCount} responses, you demonstrated ${strengths[0]?.toLowerCase() || "solid effort"}. ${weakAreas[0]?.issue ? `Key area to focus on: ${weakAreas[0].issue}.` : ""} With targeted practice, you can significantly improve your interview performance.`,
           practiceQuestions,
      interviewType: session.type,
      transcriptTurns: transcriptTurns.length ? transcriptTurns : undefined,
      questionReviews,
    };
  },
};
