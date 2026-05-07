import { Briefcase, Linkedin, Github, X, ArrowUp, Heart, Mail, MapPin, Send, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showButton, setShowButton] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <>
      <footer className="relative overflow-hidden border-t border-border/60">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40 pointer-events-none" />
        
        {/* Animated blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

        {/* Animated top gradient line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
        />

        {/* Newsletter banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="relative container mx-auto px-4 pt-16"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 backdrop-blur-sm p-8 md:p-10">
            {/* Shimmer effect */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12"
            />
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">Stay in the loop</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  Get hired faster with weekly insights
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Curated jobs, hiring trends, and career tips — delivered fresh every Monday.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="w-full md:w-auto md:min-w-[380px]">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500" />
                  <div className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-background border border-border/60">
                    <Mail className="h-4 w-4 text-muted-foreground ml-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="flex-1 bg-transparent outline-none text-sm py-2 placeholder:text-muted-foreground/60"
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground text-sm font-medium shadow-md shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                    >
                      {subscribed ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1"
                        >
                          ✓ Subscribed
                        </motion.span>
                      ) : (
                        <>
                          Subscribe
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative container mx-auto px-4 py-16"
        >
          <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">

            {/* Brand section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/30"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-emerald-600 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                  <Briefcase className="relative h-5 w-5 text-primary-foreground" />
                </motion.div>
                <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text group-hover:from-primary group-hover:to-emerald-600 group-hover:text-transparent transition-all duration-500">
                  HireHub
                </span>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                The modern way to hire talent and find your dream job. Connecting top companies with talented professionals across India.
              </p>

              {/* Contact info with hover effects */}
              <div className="space-y-2.5 mb-6">
                <motion.a
                  href="mailto:contact@hirehub.com"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group/item w-fit"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                    <Mail className="h-3 w-3 text-primary" />
                  </div>
                  <span>contact@hirehub.com</span>
                </motion.a>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-xs text-muted-foreground group/item w-fit"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                    <MapPin className="h-3 w-3 text-primary" />
                  </div>
                  <span>India</span>
                </motion.div>
              </div>

              {/* Socials with magnetic effect */}
              <div className="flex gap-2.5">
                {[
                  { href: "https://www.linkedin.com/in/abhisheksinha17/", icon: Linkedin, label: "LinkedIn", color: "hover:bg-[#0A66C2]" },
                  { href: "https://github.com/AbhishekSinhaa17", icon: Github, label: "GitHub", color: "hover:bg-[#181717] dark:hover:bg-white dark:hover:text-black" },
                  { href: "https://x.com/Abhishe85338077", icon: X, label: "X", color: "hover:bg-black dark:hover:bg-white dark:hover:text-black" },
                ].map(({ href, icon: Icon, label, color }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative group/social p-2.5 rounded-xl bg-muted/60 border border-border/60 ${color} hover:text-white hover:border-transparent transition-colors duration-300 overflow-hidden`}
                  >
                    <Icon className="relative h-4 w-4 z-10" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links with stagger animation */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <motion.div
                key={section}
                variants={itemVariants}
                onMouseEnter={() => setHoveredSection(section)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <h4 className="font-display font-semibold text-sm text-foreground mb-4 relative inline-block">
                  {section}
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: hoveredSection === section ? "100%" : "30%" }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                  />
                </h4>
                <div className="flex flex-col gap-2.5">
                  {links.map(({ label, to }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Link
                        to={to}
                        className="group/link inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all duration-300" />
                        <span className="group-hover/link:translate-x-1 transition-transform duration-200">
                          {label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-14 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-xs text-muted-foreground">
              © 2026 <span className="font-semibold text-foreground">HireHub</span>. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              Made with{" "}
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              </motion.span>{" "}
              in India
            </p>
          </motion.div>
        </motion.div>

        {/* Giant background text */}
        <div className="relative overflow-hidden pointer-events-none select-none">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center font-display font-black text-[20vw] md:text-[15vw] leading-none tracking-tighter bg-gradient-to-b from-foreground/[0.08] to-transparent bg-clip-text text-transparent -mb-8 md:-mb-16"
          >
            HireHub
          </motion.h2>
        </div>
      </footer>

      {/* Back To Top Button with progress ring */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: showButton ? 1 : 0,
          scale: showButton ? 1 : 0.5,
          pointerEvents: showButton ? "auto" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 right-6 group z-50"
        aria-label="Back to top"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.92 }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
        <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-lg shadow-primary/40 transition-all duration-300">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.button>
    </>
  );
}
