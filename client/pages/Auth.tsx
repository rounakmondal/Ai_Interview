import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  sendOtp,
  verifyOtp,
  signUp,
  login,
  resetPassword,
  saveSession,
} from "@/lib/auth-api";

type AuthMode = "login" | "signup" | "forgot";
type Step = "email" | "otp" | "password";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);

  // form data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────

  /** Login with email + password */
  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await login(email, password);
      saveSession(res.token, res.user);
      toast({ title: "Welcome back!", description: `Logged in as ${res.user.name}` });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /** Send OTP to email (signup or forgot-password) */
  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await sendOtp(email);
      toast({ title: "OTP Sent!", description: res.message || `Check your inbox at ${email}` });
      setStep("otp");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /** Verify OTP */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      setTempToken(res.tempToken);
      toast({ title: "Verified!", description: "OTP verified successfully" });
      setStep("password");
    } catch (err: any) {
      toast({ title: "Invalid OTP", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /** Set password (signup) */
  const handleSignup = async () => {
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await signUp(tempToken, name, password);
      saveSession(res.token, res.user);
      toast({ title: "Account created!", description: `Welcome ${res.user.name}` });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /** Reset password (forgot flow) */
  const handleResetPassword = async () => {
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(tempToken, password);
      saveSession(res.token, res.user);
      toast({ title: "Password reset!", description: "You're now logged in" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Reset failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /** Switch auth mode and reset state */
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setStep(newMode === "login" ? "email" : "email");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setTempToken("");
  };

  // ── title helpers ───────────────────────────────────────────────────
  const title =
    mode === "login"
      ? "Welcome Back"
      : mode === "signup"
      ? step === "email"
        ? "Create Account"
        : step === "otp"
        ? "Verify Email"
        : "Set Up Profile"
      : step === "email"
      ? "Forgot Password"
      : step === "otp"
      ? "Verify Email"
      : "New Password";

  const subtitle =
    mode === "login"
      ? "Sign in to continue your preparation"
      : mode === "signup"
      ? step === "email"
        ? "Start your exam preparation journey"
        : step === "otp"
        ? `Enter the 6-digit code sent to ${email}`
        : "Almost there! Set your name and password"
      : step === "email"
      ? "We'll send you a code to reset your password"
      : step === "otp"
      ? `Enter the 6-digit code sent to ${email}`
      : "Choose a strong new password";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">
            {mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Reset Password"}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-6 sm:p-8 border-border/40 space-y-6">
          {/* Icon */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
              {step === "otp" ? (
                <ShieldCheck className="w-7 h-7 text-primary" />
              ) : step === "password" ? (
                <Lock className="w-7 h-7 text-primary" />
              ) : (
                <Mail className="w-7 h-7 text-primary" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground max-w-xs">{subtitle}</p>
          </div>

          {/* ─── LOGIN form ────────────────────────────────────────────── */}
          {mode === "login" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-pass">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-pass"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Button className="w-full gradient-primary" onClick={handleLogin} disabled={loading || !email || !password}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button type="button" onClick={() => switchMode("signup")} className="text-primary font-medium hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {/* ─── SIGNUP / FORGOT — Step: email ─────────────────────────── */}
          {mode !== "login" && step === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  />
                </div>
              </div>
              <Button className="w-full gradient-primary" onClick={handleSendOtp} disabled={loading || !email}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Send OTP
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchMode("login")} className="text-primary font-medium hover:underline">
                      Sign In
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => switchMode("login")} className="text-primary font-medium hover:underline">
                    Back to Sign In
                  </button>
                )}
              </p>
            </div>
          )}

          {/* ─── SIGNUP / FORGOT — Step: OTP ───────────────────────────── */}
          {mode !== "login" && step === "otp" && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button className="w-full gradient-primary" onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Verify OTP
              </Button>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <button type="button" onClick={() => setStep("email")} className="hover:text-foreground">
                  Change email
                </button>
                <button type="button" onClick={handleSendOtp} disabled={loading} className="text-primary hover:underline">
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* ─── SIGNUP — Step: password + name ────────────────────────── */}
          {mode === "signup" && step === "password" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-pass">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-pass"
                    type={showPass ? "text" : "password"}
                    placeholder="Min 6 characters"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type={showPass ? "text" : "password"}
                    placeholder="Re-enter password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  />
                </div>
              </div>
              <Button className="w-full gradient-primary" onClick={handleSignup} disabled={loading || !name || !password}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </div>
          )}

          {/* ─── FORGOT — Step: new password ───────────────────────────── */}
          {mode === "forgot" && step === "password" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-pass">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="reset-pass"
                    type={showPass ? "text" : "password"}
                    placeholder="Min 6 characters"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="reset-confirm"
                    type={showPass ? "text" : "password"}
                    placeholder="Re-enter password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  />
                </div>
              </div>
              <Button className="w-full gradient-primary" onClick={handleResetPassword} disabled={loading || !password}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Reset Password
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
