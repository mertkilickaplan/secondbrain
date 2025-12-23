"use client";

import { useSubscription } from '@/contexts/SubscriptionContext';

export default function UsageIndicator() {
    const { subscription, loading } = useSubscription();

    if (loading || !subscription) {
        return null;
    }

    // Only show for free tier users
    if (subscription.tier !== 'free' || subscription.maxNotes === null) {
        return null;
    }

    const { noteCount, maxNotes, percentUsed } = subscription;
    const percent = percentUsed || 0;

    // Color coding based on usage
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
        <div className="w-full max-w-xs mx-auto px-2">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Notes Used</span>
                    <span className={`text-xs font-bold ${textColorClass}`}>
                        {noteCount} / {maxNotes}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-full ${colorClass} transition-all duration-300 ease-out`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                </div>

                {percent >= 80 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        {percent >= 100 ? 'Limit reached! Upgrade for unlimited notes.' : 'Almost at your limit!'}
                    </p>
                )}
            </div>
        </div>
    );
}
