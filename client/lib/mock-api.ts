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

// Simple session storage
const sessions = new Map<
  string,
  {
    type: string;
    language: string;
    questionIndex: number;
    questions: string[];
    answers: string[];
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
    const questions = mockQuestions[data.interviewType] || mockQuestions.it;
    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    sessions.set(sessionId, {
      type: data.interviewType,
      language: data.language,
      questionIndex: 0,
      questions: shuffled,
      answers: [],
      scores: {
        communication: 0,
        technical: 0,
        confidence: 0,
      },
    });

    return {
      sessionId,
      firstQuestion: shuffled[0],
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

    // Store answer
    session.answers.push(data.userAnswer);

    // Mock scoring based on answer length and keywords
    const answerLength = data.userAnswer.length;
    const hasKeywords =
      /experience|implemented|learned|achieved|problem|solution/.test(
        data.userAnswer.toLowerCase(),
      );

    session.scores.communication += Math.min(answerLength / 50, 1) * 2;
    session.scores.technical += hasKeywords ? Math.random() * 2 : Math.random();
    session.scores.confidence += Math.random() * 2;

    // Randomly decide if follow-up or next question
    const isFollowUp = Math.random() < 0.3 && session.questionIndex < 6;

    if (isFollowUp) {
      const followUp =
        mockFollowUps[Math.floor(Math.random() * mockFollowUps.length)];
      return {
        questionText: followUp,
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
        questionText: "Thank you! Your interview is complete.",
        isFollowUp: false,
        questionNumber: session.questions.length + 1,
        totalQuestions: session.questions.length,
      };
    }

    return {
      questionText: session.questions[session.questionIndex],
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
    if (!session) {
      throw new Error("Session not found");
    }

    // Calculate final scores
    const communicationScore = Math.min(
      (session.scores.communication / session.answers.length) * 10,
      10,
    );
    const technicalScore = Math.min(
      (session.scores.technical / session.answers.length) * 10,
      10,
    );
    const confidenceScore = Math.min(
      (session.scores.confidence / session.answers.length) * 10,
      10,
    );
    const overallScore =
      (communicationScore + technicalScore + confidenceScore) / 3;

    // Clean up session
    sessions.delete(data.sessionId);

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      communicationScore: Math.round(communicationScore * 10) / 10,
      technicalScore: Math.round(technicalScore * 10) / 10,
      confidenceScore: Math.round(confidenceScore * 10) / 10,
      strengths: [
        "Good articulation and communication",
        "Relevant examples provided",
        "Positive attitude throughout",
      ],
      weakAreas: [
        "Could provide more technical depth",
        "Some hesitation in certain responses",
      ],
      improvementSuggestions: [
        "Practice explaining technical concepts more clearly",
        "Prepare more concrete examples for common questions",
        "Work on confidence and speaking pace",
      ],
    };
  },
};
