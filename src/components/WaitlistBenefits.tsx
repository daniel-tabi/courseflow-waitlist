import { motion } from "framer-motion";
import { Clock, Star, MessageSquare, Mail } from "lucide-react";

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

        {/* Bento Grid */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto sm:auto-rows-[140px]">
          
          {/* 3-day Early Access - Large card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            viewport={{ once: true }}
            className="col-span-1 sm:col-span-2 sm:row-span-2 rounded-3xl bg-primary/10 border border-primary/20 p-6 sm:p-8 flex flex-col justify-between min-h-[200px] sm:min-h-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">3-day</span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2">Early Access</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Get exclusive early access before the public launch.
              </p>
            </div>
          </motion.div>

          {/* Lifetime Access - Stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="col-span-1 rounded-3xl bg-coral/10 border border-coral/20 p-5 flex flex-col justify-between min-h-[120px] sm:min-h-0"
          >
            <Star className="h-5 w-5 text-coral" />
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-foreground">Lifetime</span>
              <p className="text-xs text-muted-foreground mt-1">Full access to the tool</p>
            </div>
          </motion.div>

          {/* Bonus Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="col-span-1 sm:row-span-2 rounded-3xl bg-cream-dark border border-border p-5 flex flex-col justify-between min-h-[160px] sm:min-h-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                Bonus
              </span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Feedback Credits</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Additional credits when you share feedback to help us improve.
              </p>
            </div>
          </motion.div>

          {/* Behind the Scenes - Wide card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="col-span-1 rounded-3xl bg-background border border-border p-5 flex flex-col justify-between min-h-[120px] sm:min-h-0"
          >
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">Behind the Scenes</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Demos, tips & updates via email</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
