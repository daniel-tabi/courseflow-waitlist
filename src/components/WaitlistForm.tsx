import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" }),
});

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse({ email });
    
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid email";
      toast({
        title: "Invalid email",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("kit-subscribe", {
        body: { email: result.data.email },
      });

      if (error) {
        throw new Error(error.message || "Failed to subscribe");
      }

      // Send welcome email via Resend
      await supabase.functions.invoke("send-email", {
        body: {
          to: result.data.email,
          subject: "Welcome to the CourseFlow Waitlist! 🎉",
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 20px;">Welcome to CourseFlow!</h1>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                You're officially on the waitlist! We're thrilled to have you join us on this journey.
              </p>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                As an early supporter, you'll get:
              </p>
              <ul style="color: #4a4a4a; font-size: 16px; line-height: 1.8;">
                <li>🚀 3-day early access before public launch</li>
                <li>🎁 Lifetime access to the tool</li>
                <li>💰 Bonus feedback credits</li>
                <li>🎬 Exclusive behind-the-scenes updates</li>
              </ul>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                We'll keep you posted on our progress. Stay tuned!
              </p>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                Best,<br>
                <strong>The CourseFlow Team</strong>
              </p>
            </div>
          `,
        },
      });

      setIsSuccess(true);
      toast({
        title: "You're on the list! 🎉",
        description: "Check your inbox for a welcome email.",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-card"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <Check className="h-6 w-6 text-primary-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground">You're on the waitlist!</p>
        <p className="text-sm text-muted-foreground">Check your inbox for confirmation.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 rounded-xl border-border bg-card px-4 text-base shadow-card placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
        />
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={isLoading}
          className="h-12 rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground sm:text-left">
        Be the first to know when we launch. No spam, ever.
      </p>
    </form>
  );
}
