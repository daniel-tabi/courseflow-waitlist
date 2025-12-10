import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    toast({
      title: "You're on the list! 🎉",
      description: "We'll notify you when CourseFlow launches.",
    });
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
