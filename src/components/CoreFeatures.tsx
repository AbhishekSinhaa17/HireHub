import { Zap, ShieldCheck, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Smart AI Matching",
    desc: "Our advanced algorithm instantly connects you with roles that fit your exact skills and culture preferences.",
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(251,191,36,0.15)",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    number: "01",
  },
  {
    icon: ShieldCheck,
    title: "Verified Profiles",
    desc: "Every candidate and company on HireHub is strictly vetted for authenticity and quality.",
    gradient: "from-emerald-400 to-teal-500",
    glow: "rgba(52,211,153,0.15)",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    number: "02",
  },
  {
    icon: MousePointerClick,
    title: "1-Click Apply",
    desc: "Build your profile once and apply to jobs instantly without filling endless forms.",
    gradient: "from-violet-400 to-purple-600",
    glow: "rgba(139,92,246,0.15)",
    bg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    number: "03",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function CoreFeatures() {
  return (
    <section className="relative py-12 pb-28 max-w-6xl mx-auto px-6">
      {/* Section header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 mb-4">
          Why HireHub
        </span>
        <h2 className="font-display text-4xl font-bold text-foreground">
          Built for Modern Hiring
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden cursor-default"
            >
              {/* Number watermark */}
              <span className="absolute top-4 right-5 font-display text-5xl font-black text-muted/40 dark:text-white/5 select-none transition-all duration-500 group-hover:text-primary/10">
                {f.number}
              </span>

              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 ${f.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                <Icon size={26} strokeWidth={1.75} />
              </div>

              <h3 className="font-display font-bold text-lg mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {f.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>

              {/* Bottom glow on hover */}
              <div
                className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-2xl`}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
