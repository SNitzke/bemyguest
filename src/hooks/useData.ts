import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;
export type Tenancy = Tables<"tenancies">;
export type Invitation = Tables<"invitations">;
export type Issue = Tables<"issues">;
export type Payment = Tables<"payments">;
export type Message = Tables<"messages">;
export type Profile = Tables<"profiles">;

export type TenancyWithPeople = Tenancy & { tenant: Profile | null; landlord: Profile | null; property: Property | null };

const must = <T,>(res: { data: T | null; error: unknown }): T => {
  if (res.error) throw res.error;
  return res.data as T;
};

export function useProperties() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["properties", user?.id],
    enabled: !!user,
    queryFn: async () =>
      must(await supabase.from("properties").select("*").eq("landlord_id", user!.id).order("created_at", { ascending: false })),
  });
}

/** All tenancies visible to the user, with both parties' profiles and the property. */
export function useTenancies() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tenancies", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<TenancyWithPeople[]> => {
      const tenancies = must(await supabase.from("tenancies").select("*").order("created_at", { ascending: false }));
      if (!tenancies.length) return [];
      const ids = Array.from(new Set(tenancies.flatMap((t) => [t.tenant_id, t.landlord_id])));
      const propIds = Array.from(new Set(tenancies.map((t) => t.property_id)));
      const [profiles, properties] = await Promise.all([
        supabase.from("profiles").select("*").in("id", ids),
        supabase.from("properties").select("*").in("id", propIds),
      ]);
      const pMap = new Map((profiles.data ?? []).map((p) => [p.id, p]));
      const propMap = new Map((properties.data ?? []).map((p) => [p.id, p]));
      return tenancies.map((t) => ({
        ...t,
        tenant: pMap.get(t.tenant_id) ?? null,
        landlord: pMap.get(t.landlord_id) ?? null,
        property: propMap.get(t.property_id) ?? null,
      }));
    },
  });
}

export function useInvitations() {
  const { user, role } = useAuth();
  return useQuery({
    queryKey: ["invitations", user?.id],
    enabled: !!user && role === "landlord",
    queryFn: async () =>
      must(await supabase.from("invitations").select("*").eq("landlord_id", user!.id).order("created_at", { ascending: false })),
  });
}

export function useIssues() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["issues", user?.id],
    enabled: !!user,
    queryFn: async () => must(await supabase.from("issues").select("*").order("created_at", { ascending: false })),
  });
}

export function usePayments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["payments", user?.id],
    enabled: !!user,
    queryFn: async () => must(await supabase.from("payments").select("*").order("paid_on", { ascending: false })),
  });
}
