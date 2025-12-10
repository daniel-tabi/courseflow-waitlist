import { motion } from "framer-motion";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FeatureCard } from "@/components/FeatureCard";
import { Sparkles, FileText, Pen, Presentation } from "lucide-react";
import courseflowLogo from "@/assets/courseflow-logo.png";

const features = [
  {
    icon: Sparkles,
    title: "Title Generator",
    description: "Generate catchy, professional course titles. Get multiple variations tailored to your niche and audience.",
  },
  {
    icon: FileText,
    title: "Outline Generator",
    description: "Turn your core ideas into structured course outlines. Set your preferred length and let AI organize it.",
  },
  {
    icon: Pen,
    title: "Script Generator",
    description: "Auto-generate full lesson scripts based on your outline. Choose your tone—friendly, expert, or casual.",
  },
  {
    icon: Presentation,
    title: "Slide Generator",
    description: "Transform scripts into clean, ready-to-use slides. Choose from modern templates that match your style.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex justify-center"
            >
              <img
                src={courseflowLogo}
                alt="CourseFlow"
                className="h-20 w-auto sm:h-24"
              />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                AI-Powered Course Creation
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Turn Your Ideas Into
              <span className="block text-gradient">Complete Courses</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl"
            >
              Stop spending weeks on planning. Generate titles, outlines, scripts, 
              and slides in minutes—not months.
            </motion.p>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex justify-center"
            >
              <WaitlistForm />
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Join <span className="font-semibold text-foreground">500+</span> course creators already on the waitlist
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-cream-dark/50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Everything You Need to Create
            </h2>
            <p className="mt-3 text-muted-foreground">
              From idea to complete course—powered by AI
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Why CourseFlow?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Most people never finish creating their course because the planning 
              stage is overwhelming. CourseFlow eliminates that friction by turning 
              a rough idea into a full course structure in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <span className="rounded-full bg-secondary px-4 py-2 font-medium text-secondary-foreground">
                No complex setup
              </span>
              <span className="rounded-full bg-secondary px-4 py-2 font-medium text-secondary-foreground">
                Minutes, not weeks
              </span>
              <span className="rounded-full bg-secondary px-4 py-2 font-medium text-secondary-foreground">
                Idea → Course workflow
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 CourseFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
