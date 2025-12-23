"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import type { User } from "@supabase/supabase-js";

export default function UserMenu() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const supabase = createClient();
    const { theme, toggleTheme } = useTheme();
    const { showUpgradeModal } = useSubscription();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const handleSubscriptionClick = () => {
        setIsOpen(false);
        showUpgradeModal();
    };

    if (loading) {
        return (
            <div className="p-2 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <a
                href="/login"
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
                Sign In
            </a>
        );
    }

    const displayName = user.user_metadata?.name || user.email?.split("@")[0] || "User";
    const avatarUrl = user.user_metadata?.avatar_url;

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="User menu"
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full"
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Info */}
                    <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {/* Profile Link */}
                    <a
                        href="/profile"
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span className="text-sm">Profile</span>
                    </a>

                    {/* Subscription */}
                    <button
                        onClick={handleSubscriptionClick}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <span className="text-sm">Subscription</span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            {theme === "dark" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                </svg>
                            )}
                            <span className="text-sm">
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {theme === "dark" ? "☀️" : "🌙"}
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-border my-1" />

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted transition-colors text-destructive"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    );
}
