/**
 * Access Control Rules
 * --------------------
 * Guest (not logged in) : 1 free test
 * Free user (logged in) : 1 extra free test (2 total)
 * single_exam (₹9)      : unlimited tests for ONE specific exam, no PDF
 * monthly_pass (₹29/mo) : unlimited tests for ALL exams, no PDF
 * pro_monthly (₹99/mo)  : unlimited tests for ALL exams + PDF download
 */

const GUEST_KEY = 'mh_guest_tests';
const USER_FREE_KEY = 'mh_free_tests_';

export interface PremiumStatus {
  active: boolean;
  plan?: 'single_exam' | 'monthly_pass' | 'pro_monthly';
  expiresAt?: string;
  unlockedExams?: string[]; // for single_exam plan
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

    if (plan === 'pro_monthly' || plan === 'monthly_pass') {
      return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
    }

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
        reason: `This exam is not in your Single Exam Pass. Unlock it for ₹9 or upgrade to All Exams Pass.`,
      };
    }
  }

  // Also check unlockedExams even if active flag is missing (defensive)
  if (premium?.unlockedExams?.length) {
    const examKey = examType.toLowerCase();
    const hasExam = premium.unlockedExams.some((e) => e.toLowerCase() === examKey);
    if (hasExam) {
      return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
    }
  }

  // Logged-in free user — 1 free test
  const used = getUserFreeTestCount(userId);
  if (used < 1) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  return {
    allowed: false,
    needsLogin: false,
    needsPayment: true,
    reason: 'You\'ve used your free test. Choose a plan to continue practicing.',
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
 * - Logged in, 1+ interviews used without active plan: paywall
 * - Any active paid plan: unlimited
 */
export function checkInterviewAccess(
  userId: string | null,
  premium: PremiumStatus | null,
): AccessResult {
  if (!userId) {
    return {
      allowed: false,
      needsLogin: true,
      needsPayment: false,
      reason: 'Please log in to start your free mock interview.',
    };
  }

  if (premium?.active) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  const used = getInterviewUsedCount(userId);
  if (used < 1) {
    return { allowed: true, needsLogin: false, needsPayment: false, reason: '' };
  }

  return {
    allowed: false,
    needsLogin: false,
    needsPayment: true,
    reason: 'You\'ve used your 1 free interview. Upgrade to continue!',
  };
}
