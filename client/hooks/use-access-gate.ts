import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession } from '@/lib/auth-api';
import {
  checkTestAccess,
  checkPdfAccess,
  checkInterviewAccess,
  checkAnalyticsAccess,
  checkRecommendationAccess,
  incrementGuestTestCount,
  incrementUserFreeTestCount,
  incrementInterviewUsedCount,
  PremiumStatus,
} from '@/lib/access-control';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/api$/, '');

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
  requestInterviewAccess: (companyName?: string) => boolean;
  /**
   * Check if full analytics should be shown (vs blurred).
   * Returns true for any paid user.
   */
  canViewAnalytics: () => boolean;
  /**
   * Check if recommendations are available.
   * Returns true for ₹49/mo or ₹99/mo users.
   * If false and showPaywall not wanted, use the boolean quietly.
   */
  requestRecommendationAccess: () => boolean;
  /** Whether to show the paywall modal */
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;
  /** Whether to show a login prompt */
  needsLogin: boolean;
  /** Context for the modal (test / pdf / interview / recommendation) */
  paywallContext: 'test' | 'pdf' | 'interview' | 'recommendation';
  /** The exam in focus (for single-exam plan labelling) */
  activeExamType: string;
}

export function useAccessGate(): UseAccessGateReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.pathname + location.search;

  const [premium, setPremium] = useState<PremiumStatus | null>(null);
  const [ready, setReady] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [paywallContext, setPaywallContext] = useState<'test' | 'pdf' | 'interview' | 'recommendation'>('test');
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
      if (json.success) {
        const p = json.premium || {};
        // Attach firstSeenAt from top-level response into premium object
        if (json.firstSeenAt) p.firstSeenAt = json.firstSeenAt;
        setPremium(p);
      }
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
        setShowPaywall(false);
        navigate('/auth', { state: { redirect: redirectPath }, replace: true });
      } else {
        setShowPaywall(true);
      }
      return false;
    },
    [premium, navigate, redirectPath]
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
      setShowPaywall(false);
      navigate('/auth', { state: { redirect: redirectPath }, replace: true });
    } else {
      setShowPaywall(true);
    }
    return false;
  }, [premium, navigate, redirectPath]);

  const requestInterviewAccess = useCallback(
    (companyName?: string): boolean => {
      const session = getSession();
      const userId = session?.user?.id ?? null;
      const result = checkInterviewAccess(userId, premium, companyName);

      if (result.allowed) {
        // Increment only for logged-in free users (not for paid plans)
        if (userId && !premium?.active && !premium?.aiInterviewAll && !(premium?.interviewCredits && premium.interviewCredits > 0)) {
          incrementInterviewUsedCount(userId);
        }
        return true;
      }

      setPaywallContext('interview');
      setActiveExamType(companyName || 'interview');

      if (result.needsLogin) {
        setNeedsLogin(true);
        setShowPaywall(false);
        navigate('/auth', { state: { redirect: redirectPath }, replace: true });
      } else {
        setShowPaywall(true);
      }
      return false;
    },
    [premium, navigate, redirectPath]
  );

  const canViewAnalytics = useCallback((): boolean => {
    const session = getSession();
    const userId = session?.user?.id ?? null;
    const result = checkAnalyticsAccess(userId, premium);
    return result.allowed;
  }, [premium]);

  const requestRecommendationAccess = useCallback((): boolean => {
    const session = getSession();
    const userId = session?.user?.id ?? null;
    const result = checkRecommendationAccess(userId, premium);

    if (result.allowed) return true;

    setPaywallContext('recommendation');
    setActiveExamType('');

    if (result.needsLogin) {
      setNeedsLogin(true);
      setShowPaywall(false);
      navigate('/auth', { state: { redirect: redirectPath }, replace: true });
    } else {
      setShowPaywall(true);
    }
    return false;
  }, [premium, navigate, redirectPath]);

  return {
    ready,
    premium,
    refreshPremium,
    requestTestAccess,
    requestPdfAccess,
    requestInterviewAccess,
    canViewAnalytics,
    requestRecommendationAccess,
    showPaywall,
    setShowPaywall,
    needsLogin,
    paywallContext,
    activeExamType,
  };
}
