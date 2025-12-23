"use client";

import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState } from 'react';

export default function SubscriptionBadge() {
    const { subscription, loading, showUpgradeModal } = useSubscription();
    const [isHovered, setIsHovered] = useState(false);

    if (loading || !subscription) {
        return null;
    }

    const isPremium = subscription.tier === 'premium';
    const isFree = subscription.tier === 'free';

    // Calculate color for usage
    const percent = subscription.percentUsed || 0;
    let colorClass = 'bg-green-500';
    let textColorClass = 'text-green-600';
    if (percent >= 80) {
        colorClass = 'bg-red-500';
        textColorClass = 'text-red-600';
    } else if (percent >= 60) {
        colorClass = 'bg-yellow-500';
        textColorClass = 'text-yellow-600';
    }

    return (
        <div className="relative">
            <button
                onClick={showUpgradeModal}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
          px-2.5 py-1 rounded-full text-xs font-medium transition-all
          ${isPremium
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
        `}
                aria-label={`Current tier: ${subscription.tier}`}
            >
                {isPremium ? '✨ Premium' : 'Free'}
            </button>

            {/* Tooltip for Free tier users */}
            {isFree && isHovered && subscription.maxNotes !== null && (
                <div className="absolute top-full right-[-8px] mt-2 w-48 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground">Notes</span>
                        <span className={`text-xs font-bold ${textColorClass}`}>
                            {subscription.noteCount} / {subscription.maxNotes}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full ${colorClass} transition-all duration-300 ease-out`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                    </div>

                    {percent >= 80 && (
                        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                            {percent >= 100 ? 'Limit reached!' : 'Almost full!'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
