import { useCallback, useRef } from 'react';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface UseRazorpayOptions {
  authToken: string | null;
  userEmail?: string;
  userName?: string;
  onSuccess?: (plan: string) => void;
  onError?: (message: string) => void;
}

export function useRazorpay({
  authToken,
  userEmail,
  userName,
  onSuccess,
  onError,
}: UseRazorpayOptions) {
  const rzInstanceRef = useRef<RazorpayInstance | null>(null);

  const initiatePayment = useCallback(
    async (plan: 'pro_monthly' | 'pro_yearly' | 'monthly_pass' | 'single_exam', examType?: string) => {
      if (!authToken) {
        onError?.('Please log in to continue.');
        return;
      }

      // 1. Load Razorpay checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        onError?.('Failed to load Razorpay. Check your internet connection.');
        return;
      }

      // 2. Create order on backend
      let orderData: { orderId: string; amount: number; currency: string; keyId: string };
      try {
        const body: Record<string, string> = { plan };
        if (plan === 'single_exam' && examType) body.examType = examType;

        const res = await fetch(`${API_BASE}/api/payment/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Order creation failed.');
        orderData = json;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Could not create payment order.';
        onError?.(message);
        return;
      }

      // Plan labels for display
      const PLAN_LABELS: Record<string, string> = {
        single_exam: examType ? `Single Exam Pass – ${examType}` : 'Single Exam Pass',
        monthly_pass: 'All Exams Pass – Monthly',
        pro_monthly: 'Pro Plan – Monthly',
        pro_yearly: 'Pro Plan – Yearly',
      };

      // 3. Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MedhaHub',
        description: PLAN_LABELS[plan] ?? plan,
        order_id: orderData.orderId,
        image: '/favicon.ico',
        prefill: { email: userEmail, name: userName },
        theme: { color: '#f97316' }, // orange-500
        handler: async (response: RazorpayPaymentResponse) => {
          // 4. Verify payment on backend
          try {
            const verifyBody: Record<string, string> = { ...response, plan };
            if (plan === 'single_exam' && examType) verifyBody.examType = examType;

            const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(verifyBody),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyJson.success) throw new Error(verifyJson.message);
            onSuccess?.(plan);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Payment verification failed.';
            onError?.(message);
          }
        },
        modal: {
          ondismiss: () => {
            rzInstanceRef.current = null;
          },
        },
      };

      const rzInstance = new window.Razorpay(options);
      rzInstanceRef.current = rzInstance;
      rzInstance.open();
    },
    [authToken, userEmail, userName, onSuccess, onError]
  );

  return { initiatePayment };
}
