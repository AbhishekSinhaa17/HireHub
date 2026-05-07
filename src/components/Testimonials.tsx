import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Quote, Star, Sparkles, TrendingUp, Users, Award } from "lucide-react";
import { useRef, useState } from "react";

const testimonials = [
  {
    name: "John Carter",
    role: "Engineering Manager",
    company: "TechCorp India",
    avatar: "JC",
    color: "from-violet-500 to-purple-600",
    glow: "violet",
    text: "HireHub helped us hire 4 senior engineers in just one week. The ATS pipeline gave us complete visibility at every stage — we'll never go back to spreadsheets.",
    stars: 5,
    featured: true,
    metric: "4 hires / 1 week",
  },
  {
    name: "Sarah Williams",
    role: "Product Designer",
    company: "StartupXYZ",
    avatar: "SW",
    color: "from-blue-500 to-cyan-600",
    glow: "blue",
    text: "The platform made job searching extremely smooth. I applied to 5 companies in under an hour and got real-time status updates. Landed my dream job through HireHub!",
    stars: 5,
    metric: "Hired in 12 days",
  },
  {
    name: "David Lee",
    role: "Startup Founder",
    company: "InnovateLabs",
    avatar: "DL",
    color: "from-emerald-500 to-green-600",
    glow: "emerald",
    text: "HireHub simplified our entire hiring pipeline. As a small team we couldn't afford a dedicated HR tool — HireHub gave us enterprise-level ATS at zero cost.",
    stars: 5,
    metric: "$0 hiring cost",
  },
  {
    name: "Priya Sharma",
    role: "HR Manager",
    company: "Razorpay",
    avatar: "PS",
    color: "from-amber-500 to-orange-600",
    glow: "amber",
    text: "The kanban pipeline view is a game changer. Moving candidates between stages, adding notes, reviewing resumes — it's all so intuitive. Our team loves it.",
    stars: 5,
    metric: "60% faster screening",
  },
  {
    name: "Arjun Mehta",
    role: "Full Stack Developer",
    company: "Freelancer",
    avatar: "AM",
    color: "from-rose-500 to-pink-600",
    glow: "rose",
    text: "I was skeptical at first but HireHub's job matching is genuinely impressive. Got shortlisted by 3 companies in my first week. The apply flow is super clean.",
    stars: 5,
    metric: "3 shortlists / week",
  },
  {
    name: "Neha Gupta",
    role: "Talent Acquisition Lead",
    company: "Flipkart",
    avatar: "NG",
    color: "from-indigo-500 to-blue-600",
    glow: "indigo",
    text: "We scaled our hiring 3x this quarter using HireHub. The recruiter dashboard is clean, powerful, and the team was up and running in minutes — no training needed.",
    stars: 5,
    metric: "3x hiring scale",
  },
];

const stats = [
  { icon: Users, value: "2,000+", label: "Happy users", color: "text-violet-500" },
  { icon: Star, value: "4.9/5", label: "Average rating", color: "text-amber-500" },
  { icon: TrendingUp, value: "94%", label: "Hire success", color: "text-emerald-500" },
  { icon: Award, value: "150+", label: "Top companies", color: "text-blue-500" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Marquee logos
  const companies = ["Razorpay", "Flipkart", "TechCorp", "InnovateLabs", "StartupXYZ", "Zomato", "Swiggy", "PhonePe"];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden border-y border-border/60"
    >
      {/* Animated mesh background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-violet-500/5" />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Testimonials
            <Sparkles className="h-3.5 w-3.5" />
          </motion.span>

          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
            Loved by Recruiters &{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                Job Seekers
              </span>
              <motion.svg
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <motion.path
                  d="M2 9C75 3 150 3 298 9"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="rgb(139 92 246)" />
                    <stop offset="50%" stopColor="rgb(16 185 129)" />
                    <stop offset="100%" stopColor="rgb(59 130 246)" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </h2>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Real stories from people who transformed their hiring and job search with HireHub.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto"
        >
          {stats.map(({ icon: Icon, value, label, color }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="relative group rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-4 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
              <div className="font-display text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              onHoverStart={() => setHoveredCard(i)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -8 }}
              className={`relative group ${t.featured ? "lg:col-span-1 lg:row-span-1" : ""}`}
            >
              {/* Animated glow border */}
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500`}
              />

              <div className="relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 h-full overflow-hidden transition-all duration-300 group-hover:border-transparent group-hover:shadow-2xl">
                {/* Hover gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                />

                {/* Decorative quote */}
                <Quote
                  className={`absolute -top-2 -right-2 h-24 w-24 text-foreground/[0.03] group-hover:text-foreground/[0.06] rotate-12 transition-colors duration-500`}
                />

                {/* Top accent bar */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredCard === i ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${t.color} origin-left`}
                />

                {/* Header row: Quote icon + metric pill */}
                <div className="relative flex items-start justify-between gap-2">
                  <motion.div
                    whileHover={{ rotate: -10, scale: 1.1 }}
                    className={`inline-flex w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} items-center justify-center text-white shadow-lg shrink-0`}
                  >
                    <Quote className="h-5 w-5" />
                  </motion.div>

                  {t.metric && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 border border-border/60 px-2.5 py-1 rounded-full">
                      {t.metric}
                    </span>
                  )}
                </div>

                {/* Stars with stagger */}
                <div className="relative flex gap-0.5">
                  {[...Array(t.stars)].map((_, s) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + s * 0.05 }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]" />
                    </motion.div>
                  ))}
                </div>

                {/* Text */}
                <p className="relative text-sm text-foreground/80 leading-relaxed flex-1">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="relative flex items-center gap-3 pt-4 border-t border-border/60">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${t.color} blur-md opacity-50 group-hover:opacity-80 transition-opacity`} />
                    <div className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-background`}>
                      {t.avatar}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {t.role} · <span className="text-primary font-medium">{t.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Marquee company logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 relative"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Trusted by teams at
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 whitespace-nowrap"
            >
              {[...companies, ...companies, ...companies].map((company, i) => (
                <span
                  key={i}
                  className="font-display text-2xl font-bold text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {company}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom trust bar */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-violet-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative inline-flex items-center gap-4 bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl px-6 py-3.5">
              <div className="flex -space-x-2.5">
                {testimonials.slice(0, 4).map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ y: -3, zIndex: 10 }}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} border-2 border-background flex items-center justify-center text-white text-[10px] font-bold shadow-md cursor-pointer`}
                  >
                    {t.avatar}
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">4.9/5</span> from{" "}
                <span className="font-bold text-foreground">2,000+</span> reviews
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
