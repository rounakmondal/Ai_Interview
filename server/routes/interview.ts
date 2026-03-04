import { RequestHandler } from "express";
import {
  StartInterviewRequest,
  StartInterviewResponse,
  NextQuestionRequest,
  NextQuestionResponse,
  FinishInterviewRequest,
  FinishInterviewResponse,
  WeakArea,
} from "@shared/api";

// Interview session storage (in-memory for now)
interface InterviewSession {
  sessionId: string;
  interviewType: string;
  language: string;
  cvText: string;
  jobDescription?: string;
  questions: Array<{ question: string; answer?: string }>;
  currentQuestionIndex: number;
  startTime: number;
}

const sessions = new Map<string, InterviewSession>();

// Generate unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Extract skills from CV text
function extractSkillsFromCV(cvText: string): string[] {
  const skills: string[] = [];
  const cvLower = cvText.toLowerCase();

  const skillPatterns = [
    ".net core", "asp.net", "c#", "entity framework", "sql server",
    "react", "angular", "vue", "node.js", "express",
    "python", "django", "flask", "fastapi",
    "java", "spring boot", "hibernate",
    "javascript", "typescript",
    "mongodb", "postgresql", "mysql", "redis",
    "docker", "kubernetes", "aws", "azure", "gcp",
    "microservices", "rest api", "graphql",
    "git", "ci/cd", "devops", "agile", "scrum"
  ];

  for (const skill of skillPatterns) {
    if (cvLower.includes(skill)) {
      skills.push(skill);
    }
  }

  return skills;
}

// Generate CV-based questions
function generateCVBasedQuestions(
  cvText: string,
  interviewType: string,
  jobDescription?: string
): string[] {
  const skills = extractSkillsFromCV(cvText);
  const questions: string[] = [];

  // Opening question
  questions.push(
    `Hello! Thank you for joining. Can you start by telling me about yourself and your experience in ${interviewType}?`
  );

  // Skill-based questions
  if (skills.length > 0) {
    const primarySkills = skills.slice(0, 3);
    
    for (const skill of primarySkills) {
      if (skill.includes(".net") || skill === "c#") {
        questions.push(
          `I see you have experience with ${skill}. Can you explain a challenging problem you solved using dependency injection or the repository pattern?`
        );
      } else if (skill.includes("react") || skill.includes("angular") || skill.includes("vue")) {
        questions.push(
          `You've worked with ${skill}. How do you approach state management in large-scale applications?`
        );
      } else if (skill.includes("node") || skill.includes("express")) {
        questions.push(
          `Tell me about your experience with ${skill}. How do you handle error handling and middleware in production applications?`
        );
      } else if (skill.includes("python")) {
        questions.push(
          `I notice you have ${skill} experience. Can you discuss a situation where you optimized Python code for performance?`
        );
      } else if (skill.includes("docker") || skill.includes("kubernetes")) {
        questions.push(
          `You have ${skill} on your resume. How do you approach containerization and orchestration in microservices?`
        );
      } else {
        questions.push(
          `Can you tell me about a project where you used ${skill} and what challenges you faced?`
        );
      }
    }
  }

  // Generic questions based on job description or default
  questions.push(
    "Describe a situation where you had to solve a complex problem. How did you approach it?"
  );
  questions.push(
    "How do you stay updated with new technologies and best practices in your field?"
  );
  
  if (jobDescription && jobDescription.toLowerCase().includes("senior")) {
    questions.push(
      "Can you describe a time when you had to make a critical decision and lead a team?"
    );
  }

  // Closing questions
  questions.push(
    "What are your biggest strengths as a developer?"
  );
  questions.push(
    "Where do you see yourself in the next 2-3 years?"
  );
  questions.push(
    "Do you have any questions for me about the role or company?"
  );

  return questions;
}

// Analyze answer for contextual follow-up
function generateContextualFollowUp(answer: string, previousQuestion: string): string | null {
  const answerLower = answer.toLowerCase();

  // Technology-specific follow-ups
  const techPatterns = [
    { keywords: [".net core", "net core", "asp.net core"], followUp: "That's interesting! How do you handle dependency injection and service lifetimes in .NET Core applications?" },
    { keywords: ["entity framework", "ef core"], followUp: "Great! Can you explain your approach to handling complex queries and performance optimization with Entity Framework?" },
    { keywords: ["microservices", "microservice"], followUp: "Microservices are crucial! How do you handle inter-service communication and data consistency across services?" },
    { keywords: ["react", "redux", "context api"], followUp: "Excellent! How do you decide between using Redux, Context API, or other state management solutions?" },
    { keywords: ["angular"], followUp: "That's good experience! How do you handle lazy loading and performance optimization in Angular applications?" },
    { keywords: ["docker", "container"], followUp: "Docker is essential nowadays! How do you approach multi-stage builds and image optimization?" },
    { keywords: ["kubernetes", "k8s"], followUp: "Great! Can you explain your strategy for handling deployments and scaling with Kubernetes?" },
    { keywords: ["sql server", "database"], followUp: "Database knowledge is key! How do you approach query optimization and indexing strategies?" },
    { keywords: ["azure", "aws", "cloud"], followUp: "Cloud experience is valuable! What's your approach to cost optimization and security in cloud deployments?" },
    { keywords: ["api", "rest", "graphql"], followUp: "APIs are fundamental! How do you handle versioning, authentication, and rate limiting?" },
    { keywords: ["testing", "unit test", "integration test"], followUp: "Testing is important! What's your testing strategy and how do you maintain high code coverage?" },
    { keywords: ["ci/cd", "devops", "pipeline"], followUp: "Automation is crucial! How do you structure your CI/CD pipelines for reliability and speed?" },
    { keywords: ["performance", "optimization", "slow"], followUp: "Performance matters! What tools and techniques do you use to profile and optimize applications?" },
    { keywords: ["security", "authentication", "authorization"], followUp: "Security is critical! How do you implement secure authentication and protect against common vulnerabilities?" },
    { keywords: ["bug", "debug", "issue"], followUp: "Debugging is a key skill! Can you walk me through your debugging process and tools you rely on?" },
  ];

  for (const pattern of techPatterns) {
    if (pattern.keywords.some(keyword => answerLower.includes(keyword))) {
      return pattern.followUp;
    }
  }

  // Project-based follow-ups
  if (answerLower.includes("project") && answerLower.length > 100) {
    return "That sounds like a complex project! What was the most challenging technical decision you had to make?";
  }

  if (answerLower.includes("team") && answerLower.length > 100) {
    return "Team collaboration is important! How did you handle disagreements or conflicting approaches?";
  }

  return null;
}

// Evaluate answer
function evaluateAnswer(answer: string, question: string): {
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
} {
  const wordCount = answer.split(/\s+/).length;
  const hasExamples = /for example|such as|like when|instance|specifically/i.test(answer);
  const hasTechnicalTerms = /api|database|code|system|algorithm|architecture|testing|deployment|cloud|framework|library|pattern|optimization|security|performance|scalable/i.test(answer);
  const answerLength = answer.length;

  // Communication score (0-10)
  let communicationScore = 5;
  if (wordCount > 50) communicationScore += 1;
  if (wordCount > 100) communicationScore += 1;
  if (hasExamples) communicationScore += 1;
  if (answerLength > 300) communicationScore += 0.5;
  if (answerLength > 500) communicationScore += 0.5;

  // Technical score (0-10)
  let technicalScore = 5;
  if (hasTechnicalTerms) technicalScore += 2;
  const technicalKeywords = answer.match(/\.net core|net core|asp\.net core|c#|entity framework|sql server|azure|react|angular|vue|node|python|java|javascript|typescript|api|rest|graphql|database|sql|mongodb|postgresql|docker|kubernetes|microservice|cloud|aws|devops|ci\/cd|git|agile|scrum|architecture|design pattern|solid|unit test|integration test|debugg|performance|scalability|security|authentication|authorization|cache|redis|rabbitmq|kafka|elk|monitoring|logging|swagger|linq|dependency injection|middleware|jwt|oauth|blazor/gi);
  if (technicalKeywords) {
    technicalScore += Math.min(technicalKeywords.length * 0.5, 3);
  }

  // Confidence score (0-10)
  let confidenceScore = 6;
  const uncertainWords = /maybe|perhaps|i think|not sure|don't know|probably/gi.test(answer);
  const confidentWords = /definitely|absolutely|certainly|confident|experienced|successfully/gi.test(answer);
  
  if (uncertainWords) confidenceScore -= 1.5;
  if (confidentWords) confidenceScore += 1.5;
  if (wordCount < 30) confidenceScore -= 1;
  if (hasExamples) confidenceScore += 1;

  // Normalize scores to realistic ranges
  communicationScore = Math.max(4, Math.min(9.5, communicationScore));
  technicalScore = Math.max(4, Math.min(9.5, technicalScore));
  confidenceScore = Math.max(4, Math.min(9.5, confidenceScore));

  return { communicationScore, technicalScore, confidenceScore };
}

// POST /api/interview/start
export const handleStartInterview: RequestHandler = async (req, res) => {
  try {
    const { interviewType, language, cvText = "", jobDescription } = req.body as StartInterviewRequest;

    // Generate session
    const sessionId = generateSessionId();
    const questions = generateCVBasedQuestions(cvText, interviewType, jobDescription);

    const session: InterviewSession = {
      sessionId,
      interviewType,
      language,
      cvText,
      jobDescription,
      questions: questions.map(q => ({ question: q })),
      currentQuestionIndex: 0,
      startTime: Date.now(),
    };

    sessions.set(sessionId, session);

    const response: StartInterviewResponse = {
      sessionId,
      message: questions[0],
      success: true,
      cvUploaded: cvText.length > 0,
      interviewType,
      language,
    };

    console.log(`✅ Interview started: ${sessionId} for ${interviewType} (${language})`);
    res.json(response);
  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
};

// POST /api/interview/next-question
export const handleNextQuestion: RequestHandler = async (req, res) => {
  try {
    const { sessionId, userAnswer } = req.body as NextQuestionRequest;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Save previous answer
    let isFollowUp = false;
    if (userAnswer && session.currentQuestionIndex > 0) {
      const previousQuestionIndex = session.currentQuestionIndex - 1;
      if (session.questions[previousQuestionIndex]) {
        session.questions[previousQuestionIndex].answer = userAnswer;

        // Try to generate contextual follow-up
        const currentQuestion = session.questions[session.currentQuestionIndex]?.question;
        if (currentQuestion) {
          const followUp = generateContextualFollowUp(
            userAnswer,
            session.questions[previousQuestionIndex].question
          );
          
          if (followUp) {
            // Replace current question with contextual follow-up
            session.questions[session.currentQuestionIndex].question = followUp;
            isFollowUp = true;
          }
        }
      }
    }

    // Get next question
    const nextQuestion = session.questions[session.currentQuestionIndex];
    
    if (!nextQuestion) {
      return res.status(400).json({ error: "No more questions available" });
    }

    session.currentQuestionIndex++;

    const response: NextQuestionResponse = {
      message: nextQuestion.question,
      isFollowUp,
      questionNumber: session.currentQuestionIndex,
      totalQuestions: session.questions.length,
    };

    console.log(`➡️  Question ${session.currentQuestionIndex}/${session.questions.length}: ${sessionId}`);
    res.json(response);
  } catch (error) {
    console.error("Error getting next question:", error);
    res.status(500).json({ error: "Failed to get next question" });
  }
};

// POST /api/interview/finish
export const handleFinishInterview: RequestHandler = async (req, res) => {
  try {
    const { sessionId } = req.body as FinishInterviewRequest;

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Evaluate all answers
    let totalCommunication = 0;
    let totalTechnical = 0;
    let totalConfidence = 0;
    let answeredCount = 0;

    for (const q of session.questions) {
      if (q.answer) {
        const scores = evaluateAnswer(q.answer, q.question);
        totalCommunication += scores.communicationScore;
        totalTechnical += scores.technicalScore;
        totalConfidence += scores.confidenceScore;
        answeredCount++;
      }
    }

    const communicationScore = answeredCount > 0 ? totalCommunication / answeredCount : 5;
    const technicalScore = answeredCount > 0 ? totalTechnical / answeredCount : 5;
    const confidenceScore = answeredCount > 0 ? totalConfidence / answeredCount : 5;

    // Weighted average: Technical (40%), Communication (35%), Confidence (25%)
    const overallScore = (communicationScore * 0.35 + technicalScore * 0.40 + confidenceScore * 0.25);

    // Generate detailed feedback
    let detailedFeedback = "";
    if (overallScore >= 8.5) {
      detailedFeedback = "Excellent performance! You demonstrated strong technical knowledge, clear communication, and confidence. You're well-prepared for this role.";
    } else if (overallScore >= 7.5) {
      detailedFeedback = "Good performance overall. You showed solid understanding and communication skills. Focus on providing more specific examples to strengthen your technical answers.";
    } else if (overallScore >= 6.5) {
      detailedFeedback = "Decent performance with room for improvement. Work on explaining technical concepts more clearly and providing concrete examples from your experience.";
    } else {
      detailedFeedback = "There's potential, but you need more preparation. Practice articulating your thoughts clearly and dive deeper into technical concepts relevant to your role.";
    }

    // Identify weak areas
    const weakAreas = [];
    if (technicalScore < 7) {
      weakAreas.push({
        area: "Technical Knowledge",
        issue: "Your responses lacked specific technical details and depth",
        howToImprove: "Study core concepts, work on hands-on projects, and review system design patterns"
      });
    }
    if (communicationScore < 7) {
      weakAreas.push({
        area: "Communication",
        issue: "Some answers were unclear or lacked structure",
        howToImprove: "Practice the STAR method (Situation, Task, Action, Result) and explain concepts more clearly"
      });
    }
    if (confidenceScore < 7) {
      weakAreas.push({
        area: "Confidence",
        issue: "You seemed uncertain in your responses",
        howToImprove: "Practice mock interviews, prepare specific examples, and build hands-on experience"
      });
    }

    // Generate strengths
    const strengths = [];
    if (technicalScore >= 7.5) strengths.push("Strong technical knowledge");
    if (communicationScore >= 7.5) strengths.push("Clear and effective communication");
    if (confidenceScore >= 7.5) strengths.push("Confident and well-prepared");
    
    const response: FinishInterviewResponse = {
      overallScore: Math.round(overallScore * 10) / 10,
      communicationScore: Math.round(communicationScore * 10) / 10,
      technicalScore: Math.round(technicalScore * 10) / 10,
      confidenceScore: Math.round(confidenceScore * 10) / 10,
      weakAreas,
      detailedFeedback,
      strengths,
      interviewType: session.interviewType,
    };

    console.log(`🏁 Interview completed: ${sessionId} - Score: ${response.overallScore}/10`);
    
    // Clean up session after a delay
    setTimeout(() => sessions.delete(sessionId), 5 * 60 * 1000); // 5 minutes

    res.json(response);
  } catch (error) {
    console.error("Error finishing interview:", error);
    res.status(500).json({ error: "Failed to finish interview" });
  }
};
