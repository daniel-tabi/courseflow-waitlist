import { motion } from "framer-motion";
import { Clock, Star, MessageSquare, Mail } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    label: "3-day",
    title: "Early Access",
    description: "Get exclusive 3-day early access before the public launch.",
    variant: "primary" as const,
  },
  {
    icon: Star,
    label: "Lifetime",
    title: "Full Access",
    description: "Lifetime access to the tool with all features included.",
    variant: "secondary" as const,
  },
  {
    icon: MessageSquare,
    label: "Bonus",
    title: "Feedback Credits",
    description: "Additional credits when you share feedback to help us improve.",
    variant: "accent" as const,
  },
  {
    icon: Mail,
    label: "Exclusive",
    title: "Behind the Scenes",
    description: "Get demos, tips, and behind-the-scenes updates via email as we build.",
    variant: "muted" as const,
  },
];

const variantStyles = {
  primary: "bg-primary/10 border-primary/20",
  secondary: "bg-coral/10 border-coral/20",
  accent: "bg-cream-dark border-border",
  muted: "bg-background border-border",
};

export const WaitlistBenefits = () => {
  return (
    <section className="py-16 sm:py-24 border-t border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-3">
            Waitlist Benefits
          </h2>
          <p className="text-lg text-muted-foreground">
            What you get as an early member
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl border p-6 ${variantStyles[benefit.variant]} transition-all duration-300 hover:shadow-soft`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {benefit.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
