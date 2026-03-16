import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "John Carter",
    role: "Engineering Manager",
    company: "TechCorp India",
    avatar: "JC",
    color: "from-violet-500 to-purple-600",
    text: "HireHub helped us hire 4 senior engineers in just one week. The ATS pipeline gave us complete visibility at every stage — we'll never go back to spreadsheets.",
    stars: 5,
  },
  {
    name: "Sarah Williams",
    role: "Product Designer",
    company: "StartupXYZ",
    avatar: "SW",
    color: "from-blue-500 to-cyan-600",
    text: "The platform made job searching extremely smooth. I applied to 5 companies in under an hour and got real-time status updates. Landed my dream job through HireHub!",
    stars: 5,
  },
  {
    name: "David Lee",
    role: "Startup Founder",
    company: "InnovateLabs",
    avatar: "DL",
    color: "from-emerald-500 to-green-600",
    text: "HireHub simplified our entire hiring pipeline. As a small team we couldn't afford a dedicated HR tool — HireHub gave us enterprise-level ATS at zero cost.",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    role: "HR Manager",
    company: "Razorpay",
    avatar: "PS",
    color: "from-amber-500 to-orange-600",
    text: "The kanban pipeline view is a game changer. Moving candidates between stages, adding notes, reviewing resumes — it's all so intuitive. Our team loves it.",
    stars: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Full Stack Developer",
    company: "Freelancer",
    avatar: "AM",
    color: "from-rose-500 to-pink-600",
    text: "I was skeptical at first but HireHub's job matching is genuinely impressive. Got shortlisted by 3 companies in my first week. The apply flow is super clean.",
    stars: 5,
  },
  {
    name: "Neha Gupta",
    role: "Talent Acquisition Lead",
    company: "Flipkart",
    avatar: "NG",
    color: "from-indigo-500 to-blue-600",
    text: "We scaled our hiring 3x this quarter using HireHub. The recruiter dashboard is clean, powerful, and the team was up and running in minutes — no training needed.",
    stars: 5,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden border-y border-border">
      {/* Bg glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-violet-500/5 pointer-events-none" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Loved by Recruiters &{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-emerald-500 bg-clip-text text-transparent">
              Job Seekers
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Real stories from people who transformed their hiring and job search with HireHub.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
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
              whileHover={{ y: -8, scale: 1.015 }}
              className={`relative group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300 ${
                i === 0 ? "lg:row-span-1" : ""
              }`}
            >
              {/* Gradient accent bar at top */}
              <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Quote icon */}
              <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} items-center justify-center text-white shadow-md shrink-0`}>
                <Quote className="h-5 w-5" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.stars)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.role} · <span className="text-primary font-medium">{t.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom trust bar */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 bg-muted/50 border border-border rounded-2xl px-6 py-3">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((t) => (
                <div key={t.name} className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.color} border-2 border-background flex items-center justify-center text-white text-[9px] font-bold`}>
                  {t.avatar}
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">4.9/5</span> from <span className="font-bold text-foreground">2,000+</span> reviews
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
