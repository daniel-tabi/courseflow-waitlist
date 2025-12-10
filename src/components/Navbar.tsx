import { motion } from "framer-motion";
import courseflowLogo from "@/assets/courseflow-logo.png";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
];

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 px-4 py-4"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between rounded-full border border-border/50 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-md sm:px-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src={courseflowLogo}
              alt="CourseFlow"
              className="h-8 w-8"
            />
            <span className="font-semibold text-foreground">CourseFlow</span>
          </a>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-4"
              >
                {link.label}
              </a>
            ))}
            <span className="ml-1 rounded-full bg-foreground px-3 py-1.5 text-sm font-medium text-background sm:ml-2 sm:px-4">
              Beta
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
