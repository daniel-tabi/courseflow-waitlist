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

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input server-side
    const result = emailSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error.errors);
      return new Response(
        JSON.stringify({ error: result.error.errors[0]?.message || "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email } = result.data;
    
    const apiKey = Deno.env.get("KIT_API_KEY");

    if (!apiKey) {
      console.error("Missing Kit API key");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Subscribing ${email} to Kit`);

    // Kit API v4 - Subscribe to a form or add subscriber
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
      // Handle already subscribed as success
      if (response.status === 422 || data.errors?.email_address?.includes("already")) {
        console.log(`${email} is already subscribed`);
        return new Response(
          JSON.stringify({ success: true, message: "Already subscribed" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      console.error("Kit error:", data);
      return new Response(
        JSON.stringify({ error: data.message || data.errors || "Failed to subscribe" }),
        { status: response.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Successfully subscribed ${email} to Kit`);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in kit-subscribe:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
