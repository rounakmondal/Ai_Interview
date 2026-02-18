import type {
  StartInterviewRequest,
  StartInterviewResponse,
  NextQuestionRequest,
  NextQuestionResponse,
  FinishInterviewRequest,
  FinishInterviewResponse,
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
};

const mockFollowUps = [
  "Can you provide a specific example?",
  "How did you measure success?",
  "What would you do differently?",
  "What did you learn from this experience?",
  "How did your team respond?",
  "What was the outcome?",
];

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
  
  // Technical keywords by type
  const technicalKeywords: Record<string, RegExp> = {
    it: /api|database|code|system|algorithm|architecture|testing|deployment|cloud|agile|scrum|git|docker|kubernetes|react|node|python|java|sql|rest|microservice|ci\/cd|devops/,
    government: /policy|regulation|compliance|stakeholder|public|citizen|government|procedure|protocol|legal|administrative|bureaucratic/,
    private: /strategy|market|revenue|client|customer|profit|growth|competitive|stakeholder|kpi|roi|metrics/,
    "non-it": /process|workflow|efficiency|quality|customer|service|management|organization|coordination|communication/,
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

// Simple session storage
const sessions = new Map<
  string,
  {
    type: string;
    language: string;
    cvText?: string;
    questionIndex: number;
    questions: string[];
    answers: string[];
    answerAnalyses: ReturnType<typeof analyzeAnswer>[];
    scores: {
      communication: number;
      technical: number;
      confidence: number;
    };
  }
>();

function generateSessionId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate personalized interview questions based on CV content
 */
function generateCVBasedQuestions(cvText: string, interviewType: string): string[] {
  const questions: string[] = [];
  const lowerCV = cvText.toLowerCase();
  
  // Extract skills mentioned in CV
  const techSkills = ["react", "angular", "vue", "node", "python", "java", "javascript", "typescript", "sql", "mongodb", "aws", "azure", "docker", "kubernetes", "git", "agile", "scrum"];
  const foundSkills = techSkills.filter(skill => lowerCV.includes(skill));
  
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
  
  // Generate questions based on CV content
  if (foundSkills.length > 0) {
    const primarySkill = foundSkills[0];
    questions.push(`I see you have experience with ${primarySkill}. Can you describe a challenging project where you used ${primarySkill}?`);
    
    if (foundSkills.length > 2) {
      questions.push(`Your CV shows expertise in ${foundSkills.slice(0, 3).join(", ")}. How do you stay updated with these technologies?`);
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
    let questions = [...(mockQuestions[data.interviewType] || mockQuestions.it)];
    
    // If CV is provided, generate personalized questions based on CV content
    if (data.cvText && data.cvText.trim().length > 50) {
      const cvQuestions = generateCVBasedQuestions(data.cvText, data.interviewType);
      // Mix CV-based questions with standard questions
      questions = [...cvQuestions, ...questions.slice(0, 5)];
      console.log("Generated CV-based questions:", cvQuestions);
    }
    
    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    sessions.set(sessionId, {
      type: data.interviewType,
      language: data.language,
      cvText: data.cvText,
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

    // Create personalized opening message if CV was provided
    let openingMessage = shuffled[0];
    if (data.cvText && data.cvText.trim().length > 50) {
      openingMessage = `I've reviewed your CV. ${shuffled[0]}`;
    }

    return {
      sessionId,
      message: openingMessage,
      success: true,
      cvUploaded: !!(data.cvText && data.cvText.trim().length > 50),
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

    // Score based on actual answer quality
    // Communication: structure, examples, transitions, appropriate length
    let commScore = 0;
    if (analysis.isWellStructured) commScore += 2;
    if (analysis.hasExamples) commScore += 1.5;
    if (analysis.hasTransitions) commScore += 1;
    if (analysis.wordCount >= 50 && analysis.wordCount <= 150) commScore += 1.5;
    else if (analysis.wordCount >= 30) commScore += 0.5;
    session.scores.communication += commScore;

    // Technical: STAR method, technical keywords, depth
    let techScore = 0;
    techScore += analysis.starScore * 1.5; // Up to 6 points for STAR
    techScore += Math.min(analysis.techMatches * 0.5, 2); // Up to 2 points for keywords
    session.scores.technical += techScore;

    // Confidence: assertive language, lack of hedging
    let confScore = 0;
    if (analysis.hasAssertive) confScore += 3;
    if (!analysis.hasHedging) confScore += 2;
    else confScore += 0.5; // Some hedging is okay
    if (analysis.wordCount >= 30) confScore += 1; // Didn't give up quickly
    session.scores.confidence += confScore;

    // Randomly decide if follow-up or next question
    const isFollowUp = Math.random() < 0.3 && session.questionIndex < 6;

    if (isFollowUp) {
      const followUp =
        mockFollowUps[Math.floor(Math.random() * mockFollowUps.length)];
      return {
        message: followUp,
        isFollowUp: true,
        questionNumber: session.questionIndex + 1,
        totalQuestions: session.questions.length,
      };
    }

    // Move to next question
    session.questionIndex += 1;

    // Check if interview complete
    if (session.questionIndex >= session.questions.length) {
      return {
        message: "Thank you! Your interview is complete.",
        isFollowUp: false,
        questionNumber: session.questions.length + 1,
        totalQuestions: session.questions.length,
      };
    }

    return {
      message: session.questions[session.questionIndex],
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
          "Session data was not tracked properly",
        ],
        improvementSuggestions: [
          "Try starting a new interview for accurate feedback",
        ],
      };
    }

    const answerCount = session.answers.length || 1;
    
    // Calculate final scores (normalize to 10)
    const maxPossibleComm = 6 * answerCount; // ~6 points possible per answer
    const maxPossibleTech = 8 * answerCount; // ~8 points possible per answer  
    const maxPossibleConf = 6 * answerCount; // ~6 points possible per answer

    const communicationScore = Math.min(
      Math.max((session.scores.communication / maxPossibleComm) * 10, 3),
      10
    );
    const technicalScore = Math.min(
      Math.max((session.scores.technical / maxPossibleTech) * 10, 3),
      10
    );
    const confidenceScore = Math.min(
      Math.max((session.scores.confidence / maxPossibleConf) * 10, 3),
      10
    );
    const overallScore = (communicationScore + technicalScore + confidenceScore) / 3;

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
    const weakAreas: string[] = [];
    
    if (starUsage < 0.3) {
      weakAreas.push("Answers lacked clear structure (consider using STAR method: Situation, Task, Action, Result)");
    }
    if (exampleUsage < 0.3) {
      weakAreas.push("Few concrete examples were provided to support your claims");
    }
    if (avgWordCount < 30) {
      weakAreas.push("Responses were too brief - try to elaborate more on your experiences");
    } else if (avgWordCount > 200) {
      weakAreas.push("Responses tended to be lengthy - practice being more concise");
    }
    if (hedgingCount >= answerCount * 0.5) {
      weakAreas.push("Frequent use of uncertain language (\"maybe\", \"I think\", \"probably\")");
    }
    if (techKeywordUsage < 0.3 && session.type === 'it') {
      weakAreas.push("Limited use of technical terminology - be more specific about technologies used");
    }
    if (analyses.filter(a => !a.hasAction).length >= answerCount * 0.5) {
      weakAreas.push("Answers often missed the \"Action\" component - describe what YOU specifically did");
    }

    // Ensure at least one weak area for constructive feedback
    if (weakAreas.length === 0) {
      weakAreas.push("Continue practicing to maintain consistency across longer interviews");
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

    // Clean up session
    sessions.delete(data.sessionId);

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      communicationScore: Math.round(communicationScore * 10) / 10,
      technicalScore: Math.round(technicalScore * 10) / 10,
      confidenceScore: Math.round(confidenceScore * 10) / 10,
      strengths: strengths.slice(0, 4), // Limit to top 4
      weakAreas: weakAreas.slice(0, 3), // Limit to top 3
      improvementSuggestions: improvementSuggestions.slice(0, 4), // Limit to top 4
    };
  },
};
