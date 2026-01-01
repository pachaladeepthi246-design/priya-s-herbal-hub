import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create Supabase client with user's token to verify authentication
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();

    // Use service role client for database operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the order exists and belongs to this user
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, total_amount, payment_status")
      .eq("id", order_id)
      .single();

    if (orderError || !orderData) {
      console.error("Order not found:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the order belongs to the authenticated user
    if (orderData.user_id && orderData.user_id !== user.id) {
      console.error(`User ${user.id} attempted to verify order belonging to ${orderData.user_id}`);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Order does not belong to user" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prevent double payment processing
    if (orderData.payment_status === "paid") {
      console.log("Order already paid:", order_id);
      return new Response(
        JSON.stringify({ success: true, message: "Order already processed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    // If Razorpay secret is not configured, skip signature verification (demo mode)
    if (!RAZORPAY_KEY_SECRET) {
      console.log("Razorpay secret not configured, skipping verification (demo mode)");
      
      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          razorpay_order_id,
          razorpay_payment_id,
        })
        .eq("id", order_id);

      if (updateError) {
        throw updateError;
      }

      return new Response(
        JSON.stringify({ success: true, demo: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(RAZORPAY_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      console.error("Invalid signature for order:", order_id);
      return new Response(
        JSON.stringify({ error: "Invalid payment signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "processing",
        razorpay_order_id,
        razorpay_payment_id,
      })
      .eq("id", order_id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Payment verified for order ${order_id} by user ${user.id}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
