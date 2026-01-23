import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Mapping of product IDs to plan details
const PLANS = {
  'prod_TqSL2kzvgCM3Nh': { name: 'Basic', maxProperties: 5 },
  'prod_TqSLdRAmujp1F8': { name: 'Pro', maxProperties: 20 },
  'prod_TqSMI3sGbfMOZz': { name: 'Premium', maxProperties: 999999 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          plan_name: null,
          subscription_end: null,
          max_properties: 0
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let planName = null;
    let subscriptionEnd = null;
    let maxProperties = 0;
    let productId = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product as string;
      
      const planDetails = PLANS[productId as keyof typeof PLANS];
      if (planDetails) {
        planName = planDetails.name;
        maxProperties = planDetails.maxProperties;
      }
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        productId,
        planName,
        endDate: subscriptionEnd 
      });

      // Update landlord_details in Supabase
      const { error: updateError } = await supabaseClient
        .from('landlord_details')
        .update({
          subscription_plan: planName,
          subscription_status: 'active',
          subscription_end_date: subscriptionEnd,
          max_properties: maxProperties,
          payment_verified: true
        })
        .eq('user_id', user.id);

      if (updateError) {
        logStep("Error updating landlord_details", { error: updateError.message });
      } else {
        logStep("Updated landlord_details successfully");
      }
    } else {
      logStep("No active subscription found");
    }

    return new Response(
      JSON.stringify({
        subscribed: hasActiveSub,
        plan_name: planName,
        product_id: productId,
        subscription_end: subscriptionEnd,
        max_properties: maxProperties
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
