"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DeletionStatus {
  scheduled: boolean;
  scheduledFor?: string;
  daysRemaining?: number;
}

export default function DeletionBanner() {
  const [status, setStatus] = useState<DeletionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkDeletionStatus();
  }, []);

  const checkDeletionStatus = async () => {
    try {
      const res = await fetch("/api/account/deletion-status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Failed to check deletion status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (!confirm("Are you sure you want to cancel the account deletion?")) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch("/api/account/cancel-deletion", {
        method: "POST",
      });

      if (res.ok) {
        setStatus({ scheduled: false });
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel deletion");
      }
    } catch (error) {
      alert("Failed to cancel deletion");
    } finally {
      setCancelling(false);
    }
  };

  if (loading || !status?.scheduled || dismissed) {
    return null;
  }

  const deletionDate = status.scheduledFor
    ? new Date(status.scheduledFor).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-500 flex-shrink-0"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <div>
            <p className="text-sm font-medium">
              Your account is scheduled for deletion on {deletionDate}
              {status.daysRemaining !== undefined && (
                <span className="text-muted-foreground ml-1">
                  ({status.daysRemaining} {status.daysRemaining === 1 ? "day" : "days"} remaining)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCancelDeletion}
            disabled={cancelling}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Deletion"}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 hover:bg-muted rounded transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
      </div>
    </div>
  );
}
