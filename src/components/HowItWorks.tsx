import { UserPlus, Search, MousePointerClick, BadgeCheck } from "lucide-react";
import { motion, Variants } from "framer-motion";

const steps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    desc: "Sign up and build your professional profile with your resume and skills.",
    gradient: "from-blue-500 to-cyan-500",
    glow: "bg-blue-500",
    step: "01",
  },
  {
    icon: Search,
    title: "Discover Jobs",
    desc: "Browse thousands of curated jobs from top companies worldwide.",
    gradient: "from-violet-500 to-purple-600",
    glow: "bg-violet-500",
    step: "02",
  },
  {
    icon: MousePointerClick,
    title: "Apply Instantly",
    desc: "Apply to jobs with one click using your saved profile.",
    gradient: "from-amber-500 to-orange-500",
    glow: "bg-amber-500",
    step: "03",
  },
  {
    icon: BadgeCheck,
    title: "Get Hired",
    desc: "Track applications and land your dream job faster.",
    gradient: "from-emerald-500 to-green-500",
    glow: "bg-emerald-500",
    step: "04",
  },
];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background subtle texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 mb-4">
            Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How HireHub Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A simple, powerful hiring experience for both recruiters and job seekers.
          </p>
        </motion.div>

        <motion.div
          className="relative grid md:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[2.75rem] left-[12%] right-[12%] h-[2px] z-0 rounded-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, rgba(59,130,246,0.35), rgba(139,92,246,0.45), rgba(245,158,11,0.35), rgba(16,185,129,0.35))",
              }}
            />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={item}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative group flex flex-col items-center bg-card p-7 rounded-2xl border border-border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden"
              >
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />

                {/* Step badge */}
                <div className="absolute top-4 right-4 text-[10px] font-bold text-muted-foreground/40 group-hover:text-primary/60 transition-colors font-mono">
                  {step.step}
                </div>

                {/* Icon container */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white mb-5 z-10 shadow-md`}
                >
                  <Icon size={24} strokeWidth={1.75} />
                  {/* Glow beneath icon */}
                  <div className={`absolute inset-0 rounded-2xl ${step.glow} opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500`} />
                </motion.div>

                <h3 className="font-display font-bold text-base mb-2 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector dot under icon */}
                <div className={`hidden md:flex absolute -bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
