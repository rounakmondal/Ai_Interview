import { useState, useEffect, useCallback, useRef } from 'react';
import { getSession } from '@/lib/auth-api';
import {
  checkTestAccess,
  checkPdfAccess,
  checkInterviewAccess,
  incrementGuestTestCount,
  incrementUserFreeTestCount,
  incrementInterviewUsedCount,
  PremiumStatus,
} from '@/lib/access-control';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface UseAccessGateReturn {
  /** Whether premium status has finished loading */
  ready: boolean;
  premium: PremiumStatus | null;
  /** Re-fetch premium (call after successful payment) */
  refreshPremium: () => Promise<void>;
  /**
   * Call this before starting a test.
   * Returns true if allowed (and increments counter).
   * Returns false if blocked (sets showPaywall / needsLogin).
   */
  requestTestAccess: (examType: string) => boolean;
  /**
   * Call this before PDF download.
   * Returns true if allowed.
   */
  requestPdfAccess: () => boolean;
  /**
   * Call this before starting an AI mock interview.
   * Returns true if allowed (and increments counter on first use).
   * Returns false if blocked (needsLogin → redirect to auth, else shows paywall).
   */
  requestInterviewAccess: () => boolean;
  /** Whether to show the paywall modal */
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;
  /** Whether to show a login prompt */
  needsLogin: boolean;
  /** Context for the modal (test vs pdf) */
  paywallContext: 'test' | 'pdf';
  /** The exam in focus (for single-exam plan labelling) */
  activeExamType: string;
}

export function useAccessGate(): UseAccessGateReturn {
  const [premium, setPremium] = useState<PremiumStatus | null>(null);
  const [ready, setReady] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [paywallContext, setPaywallContext] = useState<'test' | 'pdf'>('test');
  const [activeExamType, setActiveExamType] = useState('');

  const fetchedRef = useRef(false);

  const refreshPremium = useCallback(async () => {
    const session = getSession();
    if (!session) {
      setPremium(null);
      setReady(true);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/payment/status`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const json = await res.json();
      if (json.success) setPremium(json.premium);
    } catch {
      // Silently fail — treat as free user
    } finally {
      setReady(true);
    }
  }, []);

  // Fetch on first mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    refreshPremium();
  }, [refreshPremium]);

  const requestTestAccess = useCallback(
    (examType: string): boolean => {
      const session = getSession();
      const userId = session?.user?.id ?? null;
      const result = checkTestAccess(userId, examType, premium);

      if (result.allowed) {
        // Track the attempt
        if (!userId) {
          incrementGuestTestCount();
        } else if (!premium?.active) {
          incrementUserFreeTestCount(userId);
        }
        return true;
      }

      setActiveExamType(examType);
      setPaywallContext('test');

      if (result.needsLogin) {
        setNeedsLogin(true);
      } else {
        setShowPaywall(true);
      }
      return false;
    },
    [premium]
  );

  const requestPdfAccess = useCallback((): boolean => {
    const session = getSession();
    const userId = session?.user?.id ?? null;
    const result = checkPdfAccess(userId, premium);

    if (result.allowed) return true;

    setPaywallContext('pdf');
    setActiveExamType('');

    if (result.needsLogin) {
      setNeedsLogin(true);
    } else {
      setShowPaywall(true);
    }
    return false;
  }, [premium]);

  const requestInterviewAccess = useCallback((): boolean => {
    const session = getSession();
    const userId = session?.user?.id ?? null;
    const result = checkInterviewAccess(userId, premium);

    if (result.allowed) {
      // Increment only for logged-in free users (not for paid plans)
      if (userId && !premium?.active) {
        incrementInterviewUsedCount(userId);
      }
      return true;
    }

    setPaywallContext('test');
    setActiveExamType('interview');

    if (result.needsLogin) {
      setNeedsLogin(true);
    } else {
      setShowPaywall(true);
    }
    return false;
  }, [premium]);

  return {
    ready,
    premium,
    refreshPremium,
    requestTestAccess,
    requestPdfAccess,
    requestInterviewAccess,
    showPaywall,
    setShowPaywall,
    needsLogin,
    paywallContext,
    activeExamType,
  };
}
