import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe product id -> plan id
const PRODUCTS: Record<string, string> = {
  prod_TqSL2kzvgCM3Nh: "basic",
  prod_TqSLdRAmujp1F8: "pro",
  prod_TqSMI3sGbfMOZz: "premium",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Pagos no configurados");
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user?.email) return json({ error: "No autenticado" }, 401);
    const user = userData.user;

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (!customers.data.length) return json({ subscribed: false });

    const customerId = customers.data[0].id;
    const subs = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    if (!subs.data.length) {
      await admin.from("subscriptions").update({ stripe_customer_id: customerId }).eq("user_id", user.id);
      return json({ subscribed: false });
    }

    const sub = subs.data[0];
    const plan = PRODUCTS[sub.items.data[0].price.product as string] ?? "basic";
    const end = new Date(sub.current_period_end * 1000).toISOString();
    await admin
      .from("subscriptions")
      .update({ plan, status: "active", current_period_end: end, stripe_customer_id: customerId })
      .eq("user_id", user.id);

    return json({ subscribed: true, plan, subscription_end: end });
  } catch (e) {
    console.error("[check-subscription]", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
