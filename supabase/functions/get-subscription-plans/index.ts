
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the Admin key, as we're in a trusted environment
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    // Call the get_subscription_plans SQL function
    const { data, error } = await supabaseClient.rpc('get_subscription_plans')
    
    if (error) throw error
    
    // Return the subscription plans
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    
    // Return a fallback list of subscription plans
    const fallbackPlans = [
      {
        id: '1',
        name: 'Basic',
        description: 'Perfect for small landlords',
        monthly_price: 999,
        features: { max_properties: 3, support: 'email' }
      },
      {
        id: '2', 
        name: 'Professional',
        description: 'Great for growing property management',
        monthly_price: 2999,
        features: { max_properties: 15, support: 'priority' }
      },
      {
        id: '3',
        name: 'Enterprise',
        description: 'Complete solution for large portfolios',
        monthly_price: 4999,
        features: { max_properties: 'unlimited', support: 'dedicated' }
      }
    ]
    
    return new Response(
      JSON.stringify(fallbackPlans),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  }
})
