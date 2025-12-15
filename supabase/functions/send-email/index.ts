import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

// Predefined email template - attackers cannot inject arbitrary content
const WAITLIST_WELCOME_TEMPLATE = {
  subject: "Welcome to the CourseFlow Waitlist! 🎉",
  getHtml: (email: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CourseFlow! 🎉</h1>
      </div>
      <div style="background: #fefefe; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for joining our waitlist!</p>
        <p style="font-size: 16px; margin-bottom: 20px;">You're now on the exclusive list to be among the first to experience CourseFlow - the AI-powered course creation platform that transforms your ideas into professional courses.</p>
        <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <h3 style="margin: 0 0 10px 0; color: #c2410c;">What you'll get as an early supporter:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #7c2d12;">
            <li>3-day early access before public launch</li>
            <li>Lifetime access to the tool</li>
            <li>Bonus feedback credits</li>
            <li>Exclusive behind-the-scenes updates</li>
          </ul>
        </div>
        <p style="font-size: 16px; margin-bottom: 20px;">We'll notify you as soon as we're ready to launch. Stay tuned!</p>
        <p style="font-size: 16px; color: #666;">Best regards,<br><strong>The CourseFlow Team</strong></p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2024 CourseFlow. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,
};

interface WaitlistEmailRequest {
  email: string;
}

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_REGEX.test(email.trim());
}

function sanitizeEmail(email: string): string {
  // Remove control characters and trim
  return email.trim().replace(/[\x00-\x1F\x7F]/g, '').toLowerCase();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const body = await req.json();
    const { email }: WaitlistEmailRequest = body;

    // Validate email format
    if (!email || !isValidEmail(email)) {
      console.error("Invalid email format:", email ? "[provided]" : "[missing]");
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const sanitizedEmail = sanitizeEmail(email);
    console.log("Processing waitlist welcome email for:", sanitizedEmail);

    // Verify the email exists in the waitlist database before sending
    // This prevents abuse - only emails that were just added can receive emails
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if email exists in waitlist
    const { data: waitlistEntry, error: dbError } = await supabase
      .from("waitlist_emails")
      .select("id, email")
      .eq("email", sanitizedEmail)
      .single();

    if (dbError || !waitlistEntry) {
      console.error("Email not found in waitlist or DB error:", dbError?.message || "Not found");
      return new Response(
        JSON.stringify({ error: "Email not found in waitlist" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email verified in waitlist, sending welcome email");

    // Send the predefined welcome email - no arbitrary content accepted
    const emailResponse = await resend.emails.send({
      from: "CourseFlow <onboarding@resend.dev>",
      to: [sanitizedEmail],
      subject: WAITLIST_WELCOME_TEMPLATE.subject,
      html: WAITLIST_WELCOME_TEMPLATE.getHtml(sanitizedEmail),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error.message);
    // Return generic error to avoid leaking internal details
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
