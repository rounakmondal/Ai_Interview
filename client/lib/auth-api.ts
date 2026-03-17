const AUTH_API = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8000/api/auth";

async function authFetch<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${AUTH_API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data as T;
}

// ── Types ──────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  tempToken: string; // short-lived token to allow password setup
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
  token: string; // JWT session token
  user: AuthUser;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

// ── API calls ──────────────────────────────────────────────────────────

/** Step 1: Send OTP to email (for both signup & forgot-password) */
export function sendOtp(email: string) {
  return authFetch<OtpResponse>("/send-otp", { email });
}

/** Step 2: Verify the OTP entered by user */
export function verifyOtp(email: string, otp: string) {
  return authFetch<VerifyOtpResponse>("/verify-otp", { email, otp });
}

/** Step 3 (Sign-up only): Set name + password after OTP verification */
export function signUp(tempToken: string, name: string, password: string) {
  return authFetch<SetPasswordResponse>("/signup", { tempToken, name, password });
}

/** Login with email + password */
export function login(email: string, password: string) {
  return authFetch<LoginResponse>("/login", { email, password });
}

/** Reset password (forgot-password flow, after OTP verification) */
export function resetPassword(tempToken: string, newPassword: string) {
  return authFetch<SetPasswordResponse>("/reset-password", { tempToken, newPassword });
}

// ── Token helpers ──────────────────────────────────────────────────────
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function saveSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSession(): { token: string; user: AuthUser } | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  try { return { token, user: JSON.parse(raw) }; } catch { return null; }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}
