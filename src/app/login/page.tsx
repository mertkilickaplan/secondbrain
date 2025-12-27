"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { parseAuthError, RateLimiter, isValidEmail, validatePassword } from "@/lib/auth-helpers";

// Rate limiter instance (5 attempts per minute)
const rateLimiter = new RateLimiter(5, 60000);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorSuggestion, setSuggestion] = useState<string | null>(null);
  const [errorAction, setErrorAction] = useState<
    "signin" | "google" | "reset-password" | "retry" | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const supabase = createClient();

  // Clear error when switching between sign in/up
  useEffect(() => {
    setError(null);
    setSuggestion(null);
    setErrorAction(null);
    setMessage(null);
    setEmailHint(null);
  }, [isSignUp]);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      const parsed = parseAuthError(error);
      setError(parsed.message);
      setSuggestion(parsed.suggestion || null);
      setErrorAction(parsed.action || null);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestion(null);
    setErrorAction(null);
    setMessage(null);

    // Validate email format
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      setSuggestion("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors[0]);
      setLoading(false);
      return;
    }

    // Check rate limit
    if (!rateLimiter.isAllowed(email)) {
      const cooldown = rateLimiter.getCooldownSeconds(email);
      setError("Too many attempts");
      setSuggestion(`Please wait ${cooldown} seconds before trying again.`);
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        const parsed = parseAuthError(error);
        setError(parsed.message);
        setSuggestion(parsed.suggestion || null);
        setErrorAction(parsed.action || null);
      } else {
        // Check if user already exists (Supabase returns success but doesn't send email)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError("This email is already registered");
          setSuggestion(
            "Try signing in instead, or use 'Continue with Google' if you registered with Google."
          );
          setErrorAction("signin");
        } else {
          setMessage("Check your email for confirmation link!");
          rateLimiter.reset(email); // Reset on success
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const parsed = parseAuthError(error);
        setError(parsed.message);
        setSuggestion(parsed.suggestion || null);
        setErrorAction(parsed.action || null);
      } else {
        rateLimiter.reset(email); // Reset on success
        window.location.href = "/app";
      }
    }

    setLoading(false);
  };

  const handleEmailBlur = async () => {
    if (!email || !isValidEmail(email)) {
      setEmailHint(null);
      return;
    }

    // Only check on sign-up to provide helpful hints
    if (!isSignUp) {
      setEmailHint(null);
      return;
    }

    setCheckingEmail(true);

    // Try a silent sign-in to detect if email exists
    // This is privacy-preserving as it doesn't expose registration status
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      // If no error, email might exist - show hint
      if (!error && data) {
        setEmailHint("This email might already be registered. Try signing in instead.");
      } else {
        setEmailHint(null);
      }
    } catch (err) {
      // Silently fail - don't expose registration status
      setEmailHint(null);
    }

    setCheckingEmail(false);
  };

  const handleActionClick = () => {
    if (errorAction === "signin") {
      setIsSignUp(false);
      setError(null);
      setSuggestion(null);
      setErrorAction(null);
    } else if (errorAction === "google") {
      signInWithGoogle();
    } else if (errorAction === "reset-password") {
      window.location.href = "/forgot-password";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            WhichNotes
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isSignUp ? "Create an account" : "Sign in to access your knowledge"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">{error}</p>
            {errorSuggestion && (
              <p className="text-xs text-destructive/80 mt-1">{errorSuggestion}</p>
            )}
            {errorAction && errorAction !== "retry" && (
              <button
                onClick={handleActionClick}
                className="mt-2 text-xs text-destructive hover:text-destructive/80 underline font-medium"
              >
                {errorAction === "signin" && "→ Switch to Sign In"}
                {errorAction === "google" && "→ Try Google Sign In"}
                {errorAction === "reset-password" && "→ Reset Password"}
              </button>
            )}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
            {message}
          </div>
        )}

        {/* Google OAuth - Primary Position */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 mb-6 font-medium shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="you@example.com"
              required
            />
            {checkingEmail && (
              <p className="text-xs text-muted-foreground mt-1 animate-pulse">Checking...</p>
            )}
            {emailHint && !checkingEmail && (
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {emailHint}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground mb-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
          {!isSignUp && (
            <div className="mt-2">
              <a
                href="/forgot-password"
                className="text-muted-foreground hover:text-primary text-xs"
              >
                Forgot your password?
              </a>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
