"use client";

import { useSubscription } from '@/contexts/SubscriptionContext';
import { FEATURE_MATRIX, PRICING } from '@/lib/subscription-config';
import { useState } from 'react';

export default function UpgradeModal() {
    const { isUpgradeModalOpen, hideUpgradeModal, subscription, refetch } = useSubscription();
    const [upgrading, setUpgrading] = useState(false);

    if (!isUpgradeModalOpen) return null;

    const isPremium = subscription?.tier === 'premium';

    const handleUpgrade = async () => {
        setUpgrading(true);
        try {
            // TODO: Integrate with payment processor (Stripe/PayPal)
            // For now, this is a placeholder
            const response = await fetch('/api/subscription', {
                method: 'POST'
            });

            if (response.ok) {
                await refetch();
                hideUpgradeModal();
            } else {
                alert('Upgrade failed. Please try again.');
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('Upgrade failed. Please try again.');
        } finally {
            setUpgrading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="relative p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
                    <button
                        onClick={hideUpgradeModal}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-2xl font-bold mb-2">
                        {isPremium ? '✨ You\'re Premium!' : 'Upgrade to Premium'}
                    </h2>
                    <p className="text-muted-foreground">
                        {isPremium
                            ? 'Enjoy unlimited notes and AI-powered features!'
                            : 'Unlock unlimited notes and AI-powered insights'}
                    </p>
                </div>

                {/* Pricing */}
                {!isPremium && (
                    <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-b border-border">
                        <div className="text-center">
                            <div className="inline-flex items-baseline gap-1">
                                <span className="text-4xl font-bold">{PRICING.premium.displayPrice.split('/')[0]}</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Cancel anytime • No hidden fees
                            </p>
                        </div>
                    </div>
                )}

                {/* Feature Comparison */}
                <div className="p-6">
                    <h3 className="font-semibold mb-4">Feature Comparison</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Free Tier */}
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-medium text-muted-foreground">Free</span>
                                {!isPremium && subscription?.tier === 'free' && (
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Current</span>
                                )}
                            </div>
                            <ul className="space-y-2">
                                {FEATURE_MATRIX.free.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <svg className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Premium Tier */}
                        <div className="border-2 border-primary rounded-lg p-4 bg-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                BEST VALUE
                            </div>
                            <div className="flex items-center gap-2 mb-3 mt-2">
                                <span className="text-sm font-medium">Premium</span>
                                {isPremium && (
                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Current</span>
                                )}
                            </div>
                            <ul className="space-y-2">
                                {FEATURE_MATRIX.premium.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="p-6 border-t border-border bg-muted/30">
                    {isPremium ? (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                                You're enjoying all Premium features!
                            </p>
                            <button
                                onClick={hideUpgradeModal}
                                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Continue Using Premium
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={hideUpgradeModal}
                                className="flex-1 px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                            >
                                Maybe Later
                            </button>
                            <button
                                onClick={handleUpgrade}
                                disabled={upgrading}
                                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {upgrading ? 'Processing...' : 'Upgrade to Premium'}
                            </button>
                        </div>
                    )}

                    <p className="text-xs text-center text-muted-foreground mt-4">
                        Note: Payment integration coming soon. Contact admin for manual upgrade.
                    </p>
                </div>
            </div>
        </div>
    );
}
