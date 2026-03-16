import { Briefcase, Linkedin, Github, X, ArrowUp, Heart, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    "For Job Seekers": [
      { label: "Browse Jobs", to: "/jobs" },
      { label: "Create Account", to: "/auth/signup" },
      { label: "Seeker Dashboard", to: "/seeker/dashboard" },
    ],
    "For Recruiters": [
      { label: "Post a Job", to: "/auth/signup" },
      { label: "ATS Dashboard", to: "/auth/signup" },
      { label: "Recruiter Signup", to: "/auth/signup" },
    ],
    "Company": [
      { label: "About", to: "/#about" },
      { label: "Contact", to: "/#contact" },
      { label: "Privacy", to: "/#privacy" },
      { label: "FAQ", to: "/#faq" },
    ],
  };

  return (
    <>
      <footer className="relative overflow-hidden border-t border-border/60">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative container mx-auto px-4 py-16">
          <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">

            {/* Brand section */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 shadow-md shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
                  <Briefcase className="h-4.5 w-4.5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                  HireHub
                </span>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                The modern way to hire talent and find your dream job. Connecting top companies with talented professionals across India.
              </p>

              {/* Contact info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-primary/60" />
                  <span>contact@hirehub.com</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary/60" />
                  <span>India</span>
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-2.5">
                {[
                  { href: "https://www.linkedin.com/in/abhisheksinha17/", icon: Linkedin, label: "LinkedIn" },
                  { href: "https://github.com/AbhishekSinhaa17", icon: Github, label: "GitHub" },
                  { href: "https://x.com/Abhishe85338077", icon: X, label: "X" },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="group p-2.5 rounded-xl bg-muted/60 hover:bg-primary hover:text-primary-foreground border border-border/60 hover:border-primary transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/25"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-display font-semibold text-sm text-foreground mb-4">
                  {section}
                </h4>
                <div className="flex flex-col gap-2.5">
                  {links.map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 HireHub. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> in India
            </p>
          </div>
        </div>
      </footer>

      {/* Back To Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showButton ? 1 : 0,
          scale: showButton ? 1 : 0.8,
          pointerEvents: showButton ? "auto" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-6 right-6 p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-110 transition-all duration-300 z-50"
        aria-label="Back to top"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </>
  );
}
