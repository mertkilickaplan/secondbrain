"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setDisplayName(user.user_metadata?.name || user.user_metadata?.full_name || "");
      setLoading(false);
    };
    getUser();
  }, [supabase.auth, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.updateUser({
      data: { name: displayName },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Profile updated successfully!");
      // Update local user state
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();
      setUser(updatedUser);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const avatarUrl = user?.user_metadata?.avatar_url;
  const email = user?.email;
  const provider = user?.app_metadata?.provider || "email";

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-sm text-muted-foreground">Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="pt-20 max-w-lg mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          {/* Avatar & Email */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                {displayName?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{displayName || "User"}</h1>
              <p className="text-sm text-muted-foreground">{email}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground capitalize">
                {provider === "google" && (
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
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
                )}
                {provider}
              </span>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
              {success}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                type="email"
                value={email || ""}
                disabled
                className="w-full mt-1 px-3 py-2 bg-muted/30 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Password Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Password
            </h3>

            {provider === "email" ? (
              <div className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
                    {passwordSuccess}
                  </div>
                )}
                <div>
                  <label className="text-sm text-muted-foreground">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <button
                  type="button"
                  disabled={savingPassword || !newPassword || !confirmPassword}
                  onClick={async () => {
                    if (newPassword !== confirmPassword) {
                      setPasswordError("Passwords do not match");
                      return;
                    }
                    if (newPassword.length < 6) {
                      setPasswordError("Password must be at least 6 characters");
                      return;
                    }
                    setSavingPassword(true);
                    setPasswordError(null);
                    setPasswordSuccess(null);
                    const { error } = await supabase.auth.updateUser({ password: newPassword });
                    if (error) {
                      setPasswordError(error.message);
                    } else {
                      setPasswordSuccess("Password updated successfully!");
                      setNewPassword("");
                      setConfirmPassword("");
                    }
                    setSavingPassword(false);
                  }}
                  className="w-full px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
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
                  <div>
                    <p className="text-sm font-medium">Signed in with Google</p>
                    <p className="text-xs text-muted-foreground">
                      Your password is managed by Google. Visit your Google Account settings to
                      change it.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
