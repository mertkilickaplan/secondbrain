"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="p-2 rounded-lg bg-card/80 backdrop-blur-md border border-border min-w-[44px] min-h-[44px] flex items-center justify-center">
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

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {user.user_metadata?.avatar_url && (
        <img
          src={user.user_metadata.avatar_url}
          alt="Avatar"
          className="w-7 h-7 rounded-full hidden sm:block"
        />
      )}
      <button
        onClick={handleSignOut}
        className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm whitespace-nowrap"
      >
        Sign Out
      </button>
    </div>
  );
}
