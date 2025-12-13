import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" }),
});

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting based on IP
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    
    // Validate input server-side
    const result = emailSchema.safeParse(body);
    if (!result.success) {
      console.warn("Email validation failed");
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email } = result.data;
    
    const apiKey = Deno.env.get("KIT_API_KEY");

    if (!apiKey) {
      console.error("Missing API configuration");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing subscription request`);

    const response = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle already subscribed as success (don't reveal this to prevent enumeration)
      if (response.status === 422) {
        console.log("Subscription processed (may already exist)");
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      console.error("Subscription service error:", response.status);
      return new Response(
        JSON.stringify({ error: "Unable to process subscription. Please try again later." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Subscription successful");
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Subscription processing error");
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
