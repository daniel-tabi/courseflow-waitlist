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
    
    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const listId = Deno.env.get("MAILCHIMP_LIST_ID");

    if (!apiKey || !listId) {
      console.error("Missing Mailchimp configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Extract datacenter from API key (format: key-dc)
    const datacenter = apiKey.split("-").pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`;

    console.log(`Adding ${email} to Mailchimp list ${listId}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`anystring:${apiKey}`)}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle "already subscribed" as success
      if (data.title === "Member Exists") {
        console.log(`${email} is already subscribed`);
        return new Response(
          JSON.stringify({ success: true, message: "Already subscribed" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      console.error("Mailchimp error:", data);
      return new Response(
        JSON.stringify({ error: data.detail || "Failed to subscribe" }),
        { status: response.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Successfully added ${email} to Mailchimp`);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in mailchimp-subscribe:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
