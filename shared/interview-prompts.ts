/**
 * Prompts for backend LLM routes (e.g. POST /api/interview/finish).
 * Mirror this structure when implementing the real API so outputs match the frontend types:
 * `questionReviews[]` with questionText, userAnswer, idealAnswer, shortFeedback.
 */

export const INTERVIEW_IDEAL_ANSWER_SYSTEM = `You are an expert interview coach. Given one interview question, the candidate's spoken/written answer, and job context, you produce:
1) idealAnswer: A strong example response the candidate could learn from — concise (roughly 90–180 words), structured, and spoken-interview tone. If the question is behavioral, use STAR (Situation, Task, Action, Result) with plausible placeholders like [Company], [Metric], [Tool] that the candidate should replace with their truth. If technical, give accurate, role-appropriate content. Match the interview language if a language code is provided (e.g. respond in Hindi for hindi).
2) shortFeedback: One or two sentences on what was missing or weak in the candidate's answer (specific, actionable).

Rules:
- Do not invent personal facts about the candidate; use generic placeholders where needed.
- idealAnswer must directly address the same question asked.
- Output strictly valid JSON only, no markdown, matching the schema in the user message.`;

export function buildInterviewIdealAnswerUserPayload(input: {
  interviewType: string;
  language: string;
  questionText: string;
  userAnswer: string;
  jobDescriptionSnippet?: string;
}): string {
  return JSON.stringify(
    {
      interviewType: input.interviewType,
      language: input.language,
      questionText: input.questionText,
      userAnswer: input.userAnswer,
      jobDescriptionSnippet: input.jobDescriptionSnippet ?? null,
      schema: {
        idealAnswer: "string",
        shortFeedback: "string",
      },
    },
    null,
    2,
  );
}

/** Batch variant: one call with all turns (cheaper) or loop per turn with the system prompt above. */
export const INTERVIEW_FINISH_BATCH_USER_INSTRUCTION = `You receive an array of objects: { questionText, userAnswer } in order, plus interviewType, language, and optional jobDescription.

Return JSON: { "questionReviews": [ { "questionText", "userAnswer", "idealAnswer", "shortFeedback" } ] }
with the same length and order as the input turns. Each idealAnswer must map to the matching questionText.`;
