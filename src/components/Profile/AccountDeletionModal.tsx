"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeletionReason =
  | "not_useful"
  | "too_expensive"
  | "missing_features"
  | "privacy_concerns"
  | "other";

type Step = "premium_warning" | "feedback" | "confirmation" | "processing";

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDeletionModal({ isOpen, onClose }: AccountDeletionModalProps) {
  const [step, setStep] = useState<Step>("feedback");
  const [reason, setReason] = useState<DeletionReason | "">("");
  const [feedback, setFeedback] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const supabase = createClient();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const initialize = async () => {
      setInitializing(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }

      // Check subscription tier from API
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          if (data.tier === "premium") {
            setIsPremium(true);
            setStep("premium_warning");
          } else {
            setStep("feedback");
          }
        } else {
          setStep("feedback");
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
        setStep("feedback");
      }

      setInitializing(false);
    };

    initialize();
  }, [isOpen, supabase.auth]);

  const handlePremiumContinue = () => {
    setStep("feedback");
  };

  const handleFeedbackContinue = () => {
    setError(null);

    // Validate: reason must be selected
    if (!reason) {
      setError("Please select a reason for leaving");
      return;
    }

    // Validate: if "other" is selected, feedback is required
    if (reason === "other" && !feedback.trim()) {
      setError("Please provide additional feedback for 'Other' reason");
      return;
    }

    setStep("confirmation");
  };

  const handleConfirmDelete = async () => {
    setError(null);

    if (confirmEmail.toLowerCase() !== userEmail.toLowerCase()) {
      setError("Email does not match");
      return;
    }

    setLoading(true);
    setStep("processing");

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reason || undefined,
          feedback: feedback || undefined,
          confirmEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule deletion");
      }

      router.push("/app?deletion_scheduled=true");
      onClose();
    } catch (err: any) {
      setError(err.message);
      setStep("confirmation");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-destructive">Delete Account</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {initializing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <>
              {step === "premium_warning" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-amber-500 flex-shrink-0 mt-0.5"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-amber-500 mb-1">
                        Active Premium Subscription
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You have an active Premium subscription. When you delete your account, your
                        subscription will remain active until the end of the current billing period,
                        then your account will be permanently deleted.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">What happens next:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Your Premium features remain active until subscription ends
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Account deletion scheduled for subscription end date
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        You can cancel the deletion anytime before then
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePremiumContinue}
                      className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === "feedback" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Help Us Improve</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We're sorry to see you go. Your feedback helps us improve WhichNotes for
                      everyone.
                    </p>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Why are you leaving?</label>
                      <div className="space-y-2">
                        {[
                          { value: "not_useful", label: "Not useful for my needs" },
                          { value: "too_expensive", label: "Too expensive" },
                          { value: "missing_features", label: "Missing features I need" },
                          { value: "privacy_concerns", label: "Privacy concerns" },
                          { value: "other", label: "Other" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name="reason"
                              value={option.value}
                              checked={reason === option.value}
                              onChange={(e) => setReason(e.target.value as DeletionReason)}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-medium">
                        Additional feedback {reason === "other" ? "(required)" : "(optional)"}
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value.substring(0, 500))}
                        placeholder="Tell us more about your experience..."
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                      />

                      {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive mt-2">
                          {error}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground text-right">
                        {feedback.length}/500
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFeedbackContinue}
                      className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === "confirmation" && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-destructive flex-shrink-0 mt-0.5"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-destructive mb-1">
                        This action cannot be undone
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your account will be scheduled for deletion in 30 days. You can cancel
                        anytime before then.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">What will be deleted:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0 text-destructive"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                        All your notes and connections
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0 text-destructive"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                        Your subscription and settings
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0 text-destructive"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                        Your account permanently
                      </li>
                    </ul>
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      To confirm, type your email:{" "}
                      <span className="text-muted-foreground">{userEmail}</span>
                    </label>
                    <input
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder={userEmail}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive/50"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={loading || !confirmEmail}
                      className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? "Deleting..." : "Delete My Account"}
                    </button>
                  </div>
                </div>
              )}

              {step === "processing" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-destructive border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">Scheduling account deletion...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
