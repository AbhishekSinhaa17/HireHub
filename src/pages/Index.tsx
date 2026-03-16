import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Briefcase, Users, TrendingUp, Shield, Search, BarChart3, Zap, Star, Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CoreFeatures from "@/components/CoreFeatures";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const features = [
  { icon: Search, title: "Smart Job Search", desc: "Filter by location, salary, type, and experience level with instant results.", color: "from-blue-500 to-cyan-500" },
  { icon: BarChart3, title: "ATS Pipeline", desc: "Track every applicant from application through hiring with visual Kanban pipelines.", color: "from-violet-500 to-purple-500" },
  { icon: Shield, title: "Role-Based Access", desc: "Separate secure dashboards for admins, recruiters, and job seekers.", color: "from-emerald-500 to-green-500" },
  { icon: Users, title: "Team Collaboration", desc: "Manage your hiring team, share candidate notes, and stay aligned.", color: "from-amber-500 to-orange-500" },
  { icon: TrendingUp, title: "Hiring Analytics", desc: "Real-time analytics to optimize your recruitment process and reduce time-to-hire.", color: "from-rose-500 to-pink-500" },
  { icon: Briefcase, title: "Resume Management", desc: "Upload, store, and access resumes with secure cloud storage.", color: "from-indigo-500 to-blue-500" },
];

const companies = [
  "Google", "Microsoft", "Amazon", "Razorpay", "Flipkart",
  "Swiggy", "Zomato", "CRED", "Meesho", "PhonePe",
  "Atlassian", "Salesforce", "Adobe", "Infosys", "TCS",
];

const floatingJobs = [
  { title: "Senior Frontend Dev", company: "Google", loc: "Remote", salary: "₹30L", badge: "bg-blue-500", dot: "from-blue-400 to-cyan-500" },
  { title: "Backend Engineer", company: "Amazon", loc: "Bangalore", salary: "₹25L", badge: "bg-amber-500", dot: "from-amber-400 to-orange-500" },
  { title: "Product Designer", company: "Swiggy", loc: "Mumbai", salary: "₹18L", badge: "bg-emerald-500", dot: "from-emerald-400 to-green-500" },
];

export default function Index() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 30,
      y: (e.clientY / window.innerHeight - 0.5) * 30,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs.send("service_82f77iv", "template_3i0ilx4", form, "Fpn8wAL-SgnUSeYgo")
      .then(() => { toast.success("Message sent!"); setForm({ name: "", email: "", message: "" }); })
      .catch(() => toast.error("Failed to send message"));
  };

  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center"
      >
        {/* Ambient Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: mouse.x, y: mouse.y }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/20 blur-[130px]"
          />
          <motion.div
            animate={{ x: -mouse.x, y: -mouse.y }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[130px]"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        {/* Floating job cards */}
        <div className="absolute inset-0 pointer-events-none hidden xl:block">
          {floatingJobs.map((job, i) => (
            <motion.div
              key={job.title}
              animate={{ y: [0, i % 2 === 0 ? -18 : 18, 0] }}
              transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute ${
                i === 0 ? "top-36 left-[6%]" :
                i === 1 ? "top-56 right-[8%]" :
                "bottom-44 left-[14%]"
              } w-64 bg-card/90 dark:bg-card/80 backdrop-blur-2xl border border-border/60 rounded-2xl p-4 shadow-2xl shadow-black/10`}
            >
              {/* Top micro gradient bar */}
              <div className={`absolute top-0 left-4 right-4 h-[1px] rounded-full bg-gradient-to-r ${job.dot}`} />
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={`w-2 h-2 rounded-full ${job.badge} shadow-sm shadow-current`} />
                <p className="text-xs text-muted-foreground font-medium">{job.company} · {job.loc}</p>
              </div>
              <p className="font-semibold text-sm text-foreground mb-2">{job.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-500 font-bold">{job.salary} /yr</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold border border-primary/20">Hiring</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Centre content */}
        <div className="container relative mx-auto px-4 py-32 md:py-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-5 py-2 text-sm text-primary font-semibold mb-8 shadow-sm shadow-primary/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              India's Modern Hiring Platform
              <Sparkles className="h-3.5 w-3.5" />
            </motion.div>

            {/* Headline */}
            <h1 className="mx-auto max-w-5xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-[5.5rem] mb-6">
              Hire Smarter.{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                  Get Hired Faster.
                </span>
                {/* Underline accent */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary via-violet-500 to-emerald-500 opacity-40"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl mb-10 leading-relaxed">
              HireHub connects India's top talent with leading companies.
              Powerful ATS for recruiters, a seamless experience for job seekers.
            </p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-14"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/auth/signup">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group"
                >
                  Get Started Free{" "}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold rounded-xl hover:scale-105 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                >
                  Browse Jobs
                </Button>
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-5 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {["⚡ AI-powered matching", "🔒 Secure & private", "🚀 Apply in 60 seconds", "📊 Real-time ATS"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 bg-muted/40 px-3.5 py-1.5 rounded-full border border-border/60 text-xs font-medium hover:border-primary/30 hover:text-foreground transition-all duration-200 cursor-default">
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── COMPANY MARQUEE ─────────────────────────────────── */}
      <section className="py-10 overflow-hidden border-b border-border/60">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">
          Trusted by teams at
        </p>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 animate-[marquee_25s_linear_infinite]" style={{ width: "max-content" }}>
            {[...companies, ...companies].map((c, i) => (
              <span
                key={i}
                className="text-sm font-bold text-muted-foreground/50 hover:text-primary whitespace-nowrap transition-colors duration-300 cursor-default tracking-wide"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CoreFeatures />
      <HowItWorks />

      {/* ── FEATURES BENTO ──────────────────────────────────── */}
      <motion.section
        className="py-24 md:py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 mb-4">
              Platform Features
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Everything You Need to Hire</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Powerful tools for recruiters, a delightful experience for candidates.
            </p>
          </div>

          <motion.div
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 auto-rows-[200px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;

              // Large featured card: ATS Pipeline
              if (i === 1) {
                return (
                  <motion.div
                    key={f.title}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                    whileHover={{ y: -8 }}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:col-span-2 md:row-span-2 shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-500/30 transition-all duration-500 flex flex-col justify-between"
                  >
                    {/* Top shimmer bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/30">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-2xl font-bold mb-3">Visual ATS Pipeline</h3>
                      <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                        Track every applicant from new application through hiring with intuitive drag-and-drop Kanban pipelines. Add notes, schedule interviews, and move candidates instantly.
                      </p>
                    </div>

                    {/* Mock Kanban UI */}
                    <div className="mt-8 relative h-48 w-full rounded-xl border border-border/50 bg-background/50 overflow-hidden shadow-inner">
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                      <div className="flex gap-4 p-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:-translate-y-2">
                        {/* Column 1 */}
                        <div className="w-1/3 bg-muted/40 rounded-lg p-3 space-y-3">
                          <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
                          <div className="h-14 bg-card rounded border border-border shadow-sm p-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full bg-blue-500/20" />
                              <div className="h-2 w-20 bg-muted-foreground/20 rounded" />
                            </div>
                            <div className="h-1.5 w-12 bg-muted-foreground/10 rounded" />
                          </div>
                          <div className="h-14 bg-card rounded border border-border shadow-sm p-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full bg-emerald-500/20" />
                              <div className="h-2 w-16 bg-muted-foreground/20 rounded" />
                            </div>
                            <div className="h-1.5 w-14 bg-muted-foreground/10 rounded" />
                          </div>
                        </div>
                        {/* Column 2 */}
                        <div className="w-1/3 bg-muted/40 rounded-lg p-3 space-y-3">
                          <div className="h-2 w-20 bg-violet-500/40 rounded" />
                          <div className="h-14 bg-card rounded border border-violet-500/30 shadow-sm p-2 ring-1 ring-violet-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full bg-amber-500/20" />
                              <div className="h-2 w-24 bg-foreground/40 rounded" />
                            </div>
                            <div className="h-1.5 w-16 bg-muted-foreground/20 rounded" />
                          </div>
                        </div>
                        {/* Column 3 */}
                        <div className="w-1/3 bg-muted/40 rounded-lg p-3 space-y-3">
                          <div className="h-2 w-12 bg-emerald-500/40 rounded" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 bg-gradient-to-br from-violet-500 to-purple-500 pointer-events-none" />
                  </motion.div>
                );
              }

              // Featured card 2: Job Search
              if (i === 0) {
                return (
                  <motion.div
                    key={f.title}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                    whileHover={{ y: -8 }}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:col-span-1 md:row-span-2 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-500 flex flex-col"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30">
                        <Search className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-xl font-bold mb-3">Smart Job Search</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        Find precisely what you're looking for with advanced filters for location, salary range, job type, and required skills.
                      </p>
                    </div>

                    {/* Mock Search UI */}
                    <div className="flex-1 rounded-xl border border-border/50 bg-background/50 p-4 space-y-3 shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                      <div className="h-8 rounded-md bg-muted/50 border border-border/50 flex items-center px-3 gap-2">
                        <Search className="w-3 h-3 text-muted-foreground" />
                        <div className="h-2 w-24 bg-muted-foreground/30 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 rounded-full bg-blue-500/10 border border-blue-500/20" />
                        <div className="h-6 w-12 rounded-full bg-muted border border-border/50" />
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="h-12 rounded-lg bg-card border border-border shadow-sm p-2 flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-emerald-500/20" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-2 w-20 bg-muted-foreground/40 rounded" />
                            <div className="h-1.5 w-12 bg-muted-foreground/20 rounded" />
                          </div>
                        </div>
                        <div className="h-12 rounded-lg bg-card border border-border shadow-sm p-2 flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-amber-500/20" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-2 w-24 bg-muted-foreground/40 rounded" />
                            <div className="h-1.5 w-16 bg-muted-foreground/20 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 bg-gradient-to-br from-blue-500 to-cyan-500 pointer-events-none" />
                  </motion.div>
                );
              }

              // Standard bento cards (remaining 4)
              return (
                <motion.div
                  key={f.title}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 cursor-default transition-all duration-300 hover:shadow-xl hover:border-primary/20 flex flex-col justify-center"
                >
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br ${f.color}`} />

                  <div className="flex items-start gap-4">
                    <div className={`relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1.5 group-hover:text-primary transition-colors">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>

                  {/* Corner glow */}
                  <div className={`absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-2xl`} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ── ABOUT ───────────────────────────────────────────── */}
      <motion.section
        id="about"
        className="py-24 md:py-32 relative overflow-hidden border-y border-border/60 scroll-mt-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-violet-500/[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="container relative mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 mb-4">
              About Us
            </span>
            <h2 className="font-display text-4xl font-bold md:text-5xl">About HireHub</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Built to solve real hiring pain points — for both companies and candidates.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 font-display">Empowering Careers & Hiring</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                HireHub provides a seamless experience for job seekers to discover opportunities and for recruiters to manage hiring efficiently. With powerful analytics, role-based dashboards, and a modern ATS, we make hiring faster and smarter.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a startup looking for talent or a candidate chasing your dream job, HireHub bridges that gap.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            >
              {[
                { icon: Users, title: "For Job Seekers", desc: "Explore jobs, track applications, and manage your career journey.", grad: "from-blue-500 to-cyan-500" },
                { icon: Briefcase, title: "For Recruiters", desc: "Post jobs, review applicants, and manage hiring pipelines effortlessly.", grad: "from-violet-500 to-purple-500" },
                { icon: Shield, title: "Secure Platform", desc: "Built with modern authentication and role-based access control.", grad: "from-emerald-500 to-green-500" },
                { icon: TrendingUp, title: "Growing Community", desc: "Thousands of companies and candidates already trust HireHub.", grad: "from-amber-500 to-orange-500" },
              ].map(({ icon: Icon, title, desc, grad }) => (
                <motion.div
                  key={title}
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-base mb-1 group-hover:text-primary transition-colors duration-200">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Testimonials />

      {/* ── PRIVACY ─────────────────────────────────────────── */}
      <motion.section
        id="privacy"
        className="py-24 md:py-32 relative overflow-hidden border-b border-border/60 scroll-mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="absolute top-0 right-0 w-3/4 h-full bg-[linear-gradient(to_right,transparent,transparent,rgba(139,92,246,0.03))] pointer-events-none" />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-emerald-500/20">
                <Shield className="h-4 w-4" /> Enterprise-Grade Security
              </div>
              <h2 className="font-display text-4xl font-bold md:text-5xl mb-6 leading-tight">
                Your Privacy Matters to Us.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                At HireHub, we prioritize the protection of your personal data. We are built with security and transparency in mind, ensuring your hiring journey remains absolutely safe.
              </p>

              <ul className="space-y-4">
                {[
                  "End-to-end data encryption",
                  "Strict role-based access control",
                  "No hidden data sharing policies",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Floating Cards */}
            <motion.div
              className="relative min-h-[500px]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            >
              {[
                {
                  icon: Shield, title: "Secure Data", desc: "Industry-standard AES encryption protocols.",
                  grad: "from-emerald-500/20 to-emerald-500/5", ring: "ring-emerald-500/20", iconCol: "text-emerald-500",
                  pos: "top-0 right-[10%] z-10", rotate: "rotate-3",
                },
                {
                  icon: Users, title: "Responsible Usage", desc: "We only use info to improve job matching.",
                  grad: "from-blue-500/20 to-blue-500/5", ring: "ring-blue-500/20", iconCol: "text-blue-500",
                  pos: "top-32 left-0 z-20", rotate: "-rotate-3",
                },
                {
                  icon: Briefcase, title: "100% Transparency", desc: "Full control over what recruiters can see.",
                  grad: "from-violet-500/20 to-violet-500/5", ring: "ring-violet-500/20", iconCol: "text-violet-500",
                  pos: "bottom-0 right-[5%] z-30", rotate: "rotate-2",
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
                  className={`absolute w-72 md:w-80 p-6 rounded-3xl bg-card border border-border shadow-xl backdrop-blur-xl ${card.pos} ${card.rotate} transition-all duration-300`}
                >
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.grad} ring-1 ${card.ring} shadow-sm`}>
                    <card.icon className={`h-6 w-6 ${card.iconCol}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <FAQ />

      {/* ── CONTACT ─────────────────────────────────────────── */}
      <motion.section
        id="contact"
        className="py-24 md:py-32 relative border-b border-border/60 scroll-mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center bg-card/60 backdrop-blur-xl border border-border/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5">

            {/* Left: Info */}
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary/20">
                  <Star className="h-4 w-4 fill-primary" /> 24/7 Support
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  Let's start a <br />
                  <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                    conversation
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                  Whether you're looking to hire top talent or find your next dream role, our team is here to help you succeed.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Users, title: "Chat with Sales", sub: "sales@hirehub.com", grad: "from-blue-500 to-cyan-500" },
                  { icon: Shield, title: "Support", sub: "help@hirehub.com", grad: "from-emerald-500 to-green-500" },
                ].map(({ icon: Icon, title, sub, grad }) => (
                  <motion.div
                    key={title}
                    whileHover={{ y: -4 }}
                    className="group p-5 rounded-2xl bg-background/60 border border-border/60 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                    <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background/80 rounded-3xl p-8 border border-border/60 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />

              <h3 className="text-2xl font-bold mb-6 relative z-10 font-display">Send us a message</h3>

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="group relative">
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder=" "
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background focus:border-primary/40 transition-all peer"
                  />
                  <label className="absolute left-4 top-4 text-xs font-semibold text-muted-foreground transition-all peer-focus:-top-0.5 peer-focus:text-[10px] peer-focus:text-primary peer-not-placeholder-shown:-top-0.5 peer-not-placeholder-shown:text-[10px]">
                    Full Name
                  </label>
                </div>

                <div className="group relative">
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder=" "
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background focus:border-primary/40 transition-all peer"
                  />
                  <label className="absolute left-4 top-4 text-xs font-semibold text-muted-foreground transition-all peer-focus:-top-0.5 peer-focus:text-[10px] peer-focus:text-primary peer-not-placeholder-shown:-top-0.5 peer-not-placeholder-shown:text-[10px]">
                    Email Address
                  </label>
                </div>

                <div className="group relative">
                  <textarea
                    name="message" value={form.message} onChange={handleChange} required rows={4}
                    placeholder=" "
                    className="w-full bg-muted/30 border border-border rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background focus:border-primary/40 transition-all resize-none peer"
                  />
                  <label className="absolute left-4 top-4 text-xs font-semibold text-muted-foreground transition-all peer-focus:-top-0.5 peer-focus:text-[10px] peer-focus:text-primary peer-not-placeholder-shown:-top-0.5 peer-not-placeholder-shown:text-[10px]">
                    Your Message
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] transition-all duration-300 group"
                >
                  Send Message{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32">
        {/* Rich gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-violet-500/10 to-emerald-500/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          {/* Glow orbs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-violet-500/20 rounded-full blur-[100px]" />
        </div>

        <motion.div
          className="container relative mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-5 py-2 rounded-full border border-primary/25 mb-6 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-primary" /> Loved by 50,000+ users
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Ready to Transform<br />
            <span className="bg-gradient-to-r from-primary via-violet-500 to-emerald-500 bg-clip-text text-transparent">
              Your Hiring?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground mb-10">
            Join thousands of companies and job seekers already using HireHub to build great teams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth/signup">
              <Button
                size="lg"
                className="h-12 px-10 text-base font-bold rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 group"
              >
                Start Hiring Today{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-10 text-base font-bold rounded-xl hover:scale-105 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
              >
                Browse All Jobs
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
