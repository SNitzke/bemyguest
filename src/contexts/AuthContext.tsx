import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Role = "landlord" | "tenant";
export type Profile = Tables<"profiles">;
export type Subscription = Tables<"subscriptions">;

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  subscription: Subscription | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const loadUserData = useCallback(async (userId: string) => {
    setDataLoading(true);
    const [p, r, s] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
    ]);
    setProfile(p.data ?? null);
    const roles = (r.data ?? []).map((x) => x.role as Role);
    setRole(roles.includes("landlord") ? "landlord" : roles.includes("tenant") ? "tenant" : null);
    setSubscription(s.data ?? null);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // defer to avoid running queries inside the auth callback
        setTimeout(() => loadUserData(newSession.user.id), 0);
      } else {
        setProfile(null);
        setRole(null);
        setSubscription(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) loadUserData(s.user.id).finally(() => setSessionReady(true));
      else setSessionReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, [loadUserData]);

  const refresh = useCallback(async () => {
    if (session?.user) await loadUserData(session.user.id);
  }, [session?.user, loadUserData]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        profile,
        role,
        subscription,
        isLoading: !sessionReady || dataLoading,
        refresh,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const homePathFor = (role: Role | null) => (role === "landlord" ? "/landlord-profile" : "/dashboard");

export function trialDaysLeft(sub: Subscription | null): number {
  if (!sub) return 0;
  const ms = new Date(sub.trial_ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export function hasLandlordAccess(sub: Subscription | null): boolean {
  if (!sub) return false;
  return sub.status === "active" || (sub.status === "trialing" && trialDaysLeft(sub) > 0);
}
