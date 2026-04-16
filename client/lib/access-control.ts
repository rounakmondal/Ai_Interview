/**
 * Access Control Rules
 * --------------------
 * Guest (not logged in)        : 1 free test (any exam)
 * Free user (logged in)        : 1 extra free test per exam (tracked in DB)
 * single_test (₹9)             : 1 additional test credit (consumed on use)
 * single_exam (₹29/mo)         : unlimited tests for ONE specific exam, no PDF, has recommendations
 * pro_monthly (₹99/mo)         : unlimited all exams + PDF + recommendations
 *
 * AI Interview:
 * Free user                    : 1 free interview
 * ai_interview_single (₹19)   : 1 interview for a specific company
 * ai_interview_all (₹11/mo)   : unlimited interviews for all 200 companies
 * pro_monthly (₹99/mo)         : AI interviews cost ₹19 each (or ₹11 bundle)
 *
 * PDF Download                 : pro_monthly (₹99/mo) ONLY
 * Analytics (full)             : any paid plan (₹9 per-test, ₹29, ₹99)
 * Recommendations              : ₹29/mo or ₹99/mo only
 *
 * Trial: First calendar day after signup is free (all features unlocked).
 *        From day 2 onward, payment is required.
 */

const GUEST_KEY = 'mh_guest_tests';
const USER_FREE_KEY = 'mh_free_tests_';

export type PlanType = 'single_test' | 'single_exam' | 'pro_monthly' | 'ai_interview_single' | 'ai_interview_all';

export interface PremiumStatus {
  active: boolean;
  plan?: PlanType;
  expiresAt?: string;
  unlockedExams?: string[];         // for single_exam plan
  testCredits?: number;             // ₹9 per-test credits remaining
  interviewCredits?: number;        // ₹19 per-interview credits
  unlockedInterviews?: string[];    // company names with individual purchase
  aiInterviewAll?: boolean;         // ₹11 all-company pass active
  aiInterviewExpiresAt?: string;    // when ₹11 pass expires
  firstSeenAt?: string;             // user's first-seen date for trial calculation
}

/**
 * Returns true if the user is still within their free trial day.
 * Trial lasts until midnight of the signup day (IST).
 */
export function isTrialActive(firstSeenAt?: string): boolean {
  if (!firstSeenAt) return false;
  const signupDate = new Date(firstSeenAt);
  const now = new Date();
  // Same calendar date → trial active
  return (
    signupDate.getFullYear() === now.getFullYear() &&
    signupDate.getMonth() === now.getMonth() &&
    signupDate.getDate() === now.getDate()
  );
}

export interface AccessResult {
  allowed: boolean;
  needsLogin: boolean;   // show login prompt
  needsPayment: boolean; // show paywall
  reason: string;
}

// ─── Guest / free attempt counters ───────────────────────────────────────────

export function getGuestTestCount(): number {
  return parseInt(localStorage.getItem(GUEST_KEY) || '0', 10);
}

export function incrementGuestTestCount(): void {
  localStorage.setItem(GUEST_KEY, String(getGuestTestCount() + 1));
}

export function getUserFreeTestCount(userId: string): number {
  return parseInt(localStorage.getItem(USER_FREE_KEY + userId) || '0', 10);
}

export function incrementUserFreeTestCount(userId: string): void {
  localStorage.setItem(USER_FREE_KEY + userId, String(getUserFreeTestCount(userId) + 1));
}

// ─── Core access check ───────────────────────────────────────────────────────

/**
 * Checks whether a user can start a test for `examType`.
 * `userId` is null when guest.
 * `premium` is null when not loaded yet — treat as free user.
 */
export function checkTestAccess(
  userId: string | null,
  examType: string,
  premium: PremiumStatus | null,
): AccessResult {
  // Trial day — full access
  if (userId && isTrialActive(premium?.firstSeenAt)) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  // Not logged in
  if (!userId) {
    const used = getGuestTestCount();
    if (used < 1) {
      return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
    }
    return {
      allowed: false,
      needsLogin: true,
      needsPayment: false,
      reason: 'You\'ve used your free guest test. Log in to get one more free test!',
    };
  }

  // Logged in — check active paid plan first
  if (premium?.active) {
    const plan = premium.plan;

    // ₹99/mo — unlimited everything
    if (plan === 'pro_monthly') {
      return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
    }

    // ₹49/mo — unlimited tests for specific exam only
    if (plan === 'single_exam') {
      const unlocked = premium.unlockedExams ?? [];
      const examKey = examType.toLowerCase();
      const hasExam = unlocked.some((e) => e.toLowerCase() === examKey);
      if (hasExam) {
        return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
      }
      // Has single_exam plan but not this specific exam — show paywall
      return {
        allowed: false,
        needsLogin: false,
        needsPayment: true,
        reason: `This exam is not in your plan. Unlock ${examType} for ₹29/month or get full access at ₹99/month.`,
      };
    }
  }

  // Check ₹9 per-test credits
  if ((premium?.testCredits ?? 0) > 0) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  // Also check unlockedExams even if active flag is missing (defensive)
  if (premium?.unlockedExams?.length) {
    const examKey = examType.toLowerCase();
    const hasExam = premium.unlockedExams.some((e) => e.toLowerCase() === examKey);
    if (hasExam) {
      return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
    }
  }

  // Logged-in free user — 1 free test per exam
  const used = getUserFreeTestCount(userId);
  if (used < 1) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  return {
    allowed: false,
    needsLogin: false,
    needsPayment: true,
    reason: 'You\'ve used your free test. ₹9 for one more test, or ₹29/month for unlimited!',
  };
}

/**
 * Checks whether a user can download a PDF result.
 * Only pro_monthly plan is allowed.
 */
export function checkPdfAccess(
  userId: string | null,
  premium: PremiumStatus | null,
): AccessResult {
  if (!userId) {
    return {
      allowed: false,
      needsLogin: true,
      needsPayment: false,
      reason: 'Please log in to download PDFs.',
    };
  }

  if (premium?.active && premium.plan === 'pro_monthly') {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  return {
    allowed: false,
    needsLogin: false,
    needsPayment: true,
    reason: 'PDF download is available on the Pro Plan (₹99/month).',
  };
}

// ─── Interview access ─────────────────────────────────────────────────────────

const INTERVIEW_FREE_KEY = 'mh_interview_free_';

export function getInterviewUsedCount(userId: string): number {
  return parseInt(localStorage.getItem(INTERVIEW_FREE_KEY + userId) || '0', 10);
}

export function incrementInterviewUsedCount(userId: string): void {
  localStorage.setItem(INTERVIEW_FREE_KEY + userId, String(getInterviewUsedCount(userId) + 1));
}

/**
 * Checks whether a user can start an AI mock interview.
 * - Not logged in: must log in first (no free guest interview)
 * - Logged in, 0 interviews used: 1 free interview
 * - Has ₹11 all-company pass (active): unlimited
 * - Has individual ₹19 purchase for THIS company: allowed
 * - Has interview credits: allowed (from ₹19 purchases)
 * - pro_monthly: still needs ₹19/₹11 for interviews (separate billing)
 * - Otherwise: paywall with ₹19/₹11 options
 */
export function checkInterviewAccess(
  userId: string | null,
  premium: PremiumStatus | null,
  companyName?: string,
): AccessResult {
  if (!userId) {
    return {
      allowed: false,
      needsLogin: true,
      needsPayment: false,
      reason: 'Please log in to start your free mock interview.',
    };
  }

  // ₹11 all-company pass active
  if (premium?.aiInterviewAll) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  // Check if this specific company was purchased (₹19)
  if (companyName && premium?.unlockedInterviews?.length) {
    const hasCompany = premium.unlockedInterviews.some(
      (c) => c.toLowerCase() === companyName.toLowerCase()
    );
    if (hasCompany) {
      return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
    }
  }

  // Has unused interview credits
  if ((premium?.interviewCredits ?? 0) > 0) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  // 1 free interview for logged-in users
  const used = getInterviewUsedCount(userId);
  if (used < 1) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  return {
    allowed: false,
    needsLogin: false,
    needsPayment: true,
    reason: '₹19 for this company\'s interview, or ₹11 for ALL 200 companies!',
  };
}

// ─── Analytics access ─────────────────────────────────────────────────────────

/**
 * Full analytics (subject-wise breakdown, AI insights, weak areas).
 * Available to ANY paid user, blurred for free users.
 */
export function checkAnalyticsAccess(
  userId: string | null,
  premium: PremiumStatus | null,
): AccessResult {
  if (!userId) {
    return {
      allowed: false,
      needsLogin: true,
      needsPayment: false,
      reason: 'Log in to see detailed analytics.',
    };
  }

  // Any active paid plan
  if (premium?.active) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  // Has test credits (bought ₹9 test) — show full analytics for that test
  if ((premium?.testCredits ?? 0) >= 0 && premium?.plan === 'single_test') {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  return {
    allowed: false,
    needsLogin: false,
    needsPayment: true,
    reason: 'Detailed analytics are for paid users. Get a test for ₹9 or subscribe from ₹29/month.',
  };
}

// ─── Recommendation access ────────────────────────────────────────────────────

/**
 * AI-powered recommendations (mock test suggestions, weak area analysis).
 * Only for ₹49/mo (single_exam) or ₹99/mo (pro_monthly).
 */
export function checkRecommendationAccess(
  userId: string | null,
  premium: PremiumStatus | null,
): AccessResult {
  if (!userId) {
    return {
      allowed: false,
      needsLogin: true,
      needsPayment: false,
      reason: 'Log in to get AI recommendations.',
    };
  }

  if (premium?.active && (premium.plan === 'single_exam' || premium.plan === 'pro_monthly')) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  return {
    allowed: false,
    needsLogin: false,
    needsPayment: true,
    reason: 'AI recommendations are available from ₹29/month. Upgrade to get personalized study plans!',
  };
}
