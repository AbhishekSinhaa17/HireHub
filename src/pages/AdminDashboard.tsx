import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  ArrowUpRight,
  Activity,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Animated Counter
───────────────────────────────────────────────────────────── */
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) return;
    const stepTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 60));
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

/* ─────────────────────────────────────────────────────────────
   Floating Particle
───────────────────────────────────────────────────────────── */
function Particle({ index }: { index: number }) {
  const size = Math.random() * 3 + 1;
  const duration = Math.random() * 20 + 12;
  const delay = Math.random() * 14;
  const x = Math.random() * 100;
  const colors = [
    "bg-primary/35",
    "bg-violet-400/30",
    "bg-emerald-400/25",
    "bg-amber-400/25",
    "bg-blue-400/25",
    "bg-cyan-400/20",
  ];
  return (
    <motion.div
      className={`absolute rounded-full ${colors[index % colors.length]} blur-[1px]`}
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10px" }}
      animate={{ y: [0, -(window.innerHeight + 100)], opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated Grid
───────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/8 to-transparent"
          style={{ left: `${(i + 1) * (100 / 10)}%` }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/8 to-transparent"
          style={{ top: `${(i + 1) * (100 / 7)}%` }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Orbiting Ring (for hero center piece)
───────────────────────────────────────────────────────────── */
function OrbitRing({
  radius,
  duration,
  color,
  dotSize = 5,
  reverse = false,
}: {
  radius: number;
  duration: number;
  color: string;
  dotSize?: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute rounded-full border border-dashed opacity-20"
        style={{ width: radius * 2, height: radius * 2, borderColor: color }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          background: color,
          top: `calc(50% - ${radius}px)`,
          left: `calc(50% - ${dotSize / 2}px)`,
          boxShadow: `0 0 10px ${color}, 0 0 4px ${color}`,
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────────────────────── */
interface CardConfig {
  icon: React.ElementType;
  label: string;
  value: number;
  sublabel: string;
  gradient: string;
  glowRgb: string;
  borderColor: string;
  accentColor: string;
  href: string;
  ringColor: string;
}

function StatCard({ card, index }: { card: CardConfig; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-60, 60], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-60, 60], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <Link to={card.href}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
        onMouseMove={handleMouse}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        className="group relative overflow-hidden rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-2xl cursor-pointer h-full"
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
      >
        {/* Dynamic glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
          style={{ background: `radial-gradient(circle at 50% 50%, rgba(${card.glowRgb},0.15) 0%, transparent 70%)` }}
        />

        {/* Top gradient bar */}
        <motion.div
          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: index * 0.12 + 0.4, duration: 0.7 }}
          style={{ originX: 0 }}
        />

        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent opacity-0 group-hover:opacity-100"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
          style={{ skewX: "-20deg" }}
        />

        {/* Corner decoration */}
        <div
          className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
          style={{ background: `rgba(${card.glowRgb}, 0.3)` }}
        />

        <div className="p-6 relative z-10 flex flex-col h-full min-h-[180px]">
          {/* Top row */}
          <div className="flex items-start justify-between mb-6">
            {/* Icon */}
            <div className="relative">
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                style={{ boxShadow: `0 4px 20px rgba(${card.glowRgb},0.35)` }}
              >
                <card.icon className="h-5 w-5 text-white" />
              </div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: `2px solid rgba(${card.glowRgb},0.5)` }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
              />
            </div>

            {/* Arrow */}
            <motion.div
              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </motion.div>
          </div>

          {/* Value */}
          <div className="mt-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tracking-tight">
                <AnimatedCounter value={card.value} />
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              {card.sublabel}
            </p>
          </div>
        </div>

        {/* Bottom glow bar */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${card.gradient} opacity-30 group-hover:opacity-70 transition-opacity duration-500`}
        />
      </motion.div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   Quick Action Button
───────────────────────────────────────────────────────────── */
function QuickAction({
  icon: Icon,
  label,
  href,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
  delay: number;
}) {
  return (
    <Link to={href}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-3 p-3.5 rounded-xl bg-background/30 backdrop-blur-sm border border-white/8 hover:border-white/20 hover:bg-background/50 transition-all duration-200 group cursor-pointer"
      >
        <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium group-hover:text-foreground text-muted-foreground transition-colors">
          {label}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 ml-auto text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
      </motion.div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   Activity Item
───────────────────────────────────────────────────────────── */
function ActivityDot({ color }: { color: string }) {
  return (
    <motion.div
      className={`w-2 h-2 rounded-full ${color} flex-shrink-0`}
      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Loading Screen
───────────────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-32 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-24 h-24">
        <OrbitRing radius={42} duration={5} color="hsl(var(--primary))" dotSize={6} />
        <OrbitRing radius={30} duration={3} color="#10b981" dotSize={5} reverse />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Activity className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      <div className="text-center">
        <motion.p
          className="text-muted-foreground text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Fetching platform metrics...
        </motion.p>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/60"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    companies: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cursor tracking
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(cursorY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: users },
          { count: jobs },
          { count: companies },
          { count: applications },
        ] = await Promise.all([
          supabase.from("user_roles").select("*", { count: "exact", head: true }).neq("role", "admin"),
          supabase.from("jobs").select("*", { count: "exact", head: true }),
          supabase.from("companies").select("*", { count: "exact", head: true }),
          supabase.from("applications").select("*", { count: "exact", head: true }),
        ]);
        setStats({
          users: users || 0,
          jobs: jobs || 0,
          companies: companies || 0,
          applications: applications || 0,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards: CardConfig[] = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.users,
      sublabel: "Registered members",
      gradient: "from-primary to-violet-600",
      glowRgb: "139,92,246",
      borderColor: "border-primary/20",
      accentColor: "text-primary",
      ringColor: "hsl(var(--primary))",
      href: "/admin/users",
    },
    {
      icon: Briefcase,
      label: "Job Listings",
      value: stats.jobs,
      sublabel: "Active postings",
      gradient: "from-blue-500 to-indigo-600",
      glowRgb: "59,130,246",
      borderColor: "border-blue-500/20",
      accentColor: "text-blue-400",
      ringColor: "#3b82f6",
      href: "/admin/jobs",
    },
    {
      icon: Building2,
      label: "Companies",
      value: stats.companies,
      sublabel: "Registered organizations",
      gradient: "from-amber-500 to-orange-600",
      glowRgb: "245,158,11",
      borderColor: "border-amber-500/20",
      accentColor: "text-amber-400",
      ringColor: "#f59e0b",
      href: "/admin/companies",
    },
    {
      icon: FileText,
      label: "Applications",
      value: stats.applications,
      sublabel: "Submitted entries",
      gradient: "from-emerald-500 to-teal-600",
      glowRgb: "16,185,129",
      borderColor: "border-emerald-500/20",
      accentColor: "text-emerald-400",
      ringColor: "#10b981",
      href: "/admin/applications",
    },
  ];

  const quickActions = [
    { icon: Users, label: "Manage Users", href: "/admin/users", color: "bg-gradient-to-br from-primary to-violet-600", delay: 0.5 },
    { icon: Briefcase, label: "Moderate Jobs", href: "/admin/jobs", color: "bg-gradient-to-br from-blue-500 to-indigo-600", delay: 0.57 },
    { icon: Building2, label: "View Companies", href: "/admin/companies", color: "bg-gradient-to-br from-amber-500 to-orange-600", delay: 0.64 },
    { icon: FileText, label: "Applications", href: "/admin/applications", color: "bg-gradient-to-br from-emerald-500 to-teal-600", delay: 0.71 },
  ];

  const systemStatus = [
    { label: "Database", status: "Operational", color: "bg-emerald-500" },
    { label: "Auth Service", status: "Operational", color: "bg-emerald-500" },
    { label: "File Storage", status: "Operational", color: "bg-emerald-500" },
    { label: "API Gateway", status: "Operational", color: "bg-emerald-500" },
  ];

  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden flex flex-col"
      onMouseMove={(e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); }}
    >
      {/* ── Cursor Glow ── */}
      <motion.div
        className="fixed w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.05) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 400),
          y: useTransform(smoothY, (v) => v - 400),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-200px] right-[-150px] w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-250px] left-[-150px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => <Particle key={i} index={i} />)}
      </div>

      <GridLines />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 relative z-10">

        {/* ── Header ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
                animate={{
                  boxShadow: [
                    "0 0 0 0 hsl(var(--primary)/0)",
                    "0 0 0 6px hsl(var(--primary)/0.06)",
                    "0 0 0 0 hsl(var(--primary)/0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Activity className="h-3.5 w-3.5 text-primary" />
                </motion.div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  System Overview
                </span>
                <span className="flex items-center gap-1 ml-1 pl-2 border-l border-primary/20">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs text-emerald-400 font-medium">Live</span>
                </span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 leading-tight">
                Admin{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary via-violet-400 to-purple-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    style={{ originX: 0 }}
                  />
                </span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Real-time platform analytics and system controls.
              </p>
            </div>

            {/* Live Clock */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 self-start lg:self-auto"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-primary/20">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-display text-lg font-bold leading-none tabular-nums">
                  {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <LoadingScreen />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Stat Cards ── */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {cards.map((card, i) => (
                  <StatCard key={card.label} card={card} index={i} />
                ))}
              </div>

              {/* ── Bottom Row ── */}
              <div className="grid gap-5 lg:grid-cols-3">

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="lg:col-span-1 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                >
                  <div className="p-5 border-b border-white/8">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                        <Zap className="h-3.5 w-3.5 text-white" />
                      </div>
                      <h2 className="font-semibold text-sm">Quick Actions</h2>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {quickActions.map((action) => (
                      <QuickAction key={action.label} {...action} />
                    ))}
                  </div>
                </motion.div>

                {/* Platform Health */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52, duration: 0.5 }}
                  className="lg:col-span-1 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                >
                  <div className="p-5 border-b border-white/8">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Shield className="h-3.5 w-3.5 text-white" />
                      </div>
                      <h2 className="font-semibold text-sm">System Health</h2>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">
                        All Systems Go
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {systemStatus.map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <ActivityDot color={s.color} />
                          <span className="text-sm text-muted-foreground">{s.label}</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-400">{s.status}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Platform Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.59, duration: 0.5 }}
                  className="lg:col-span-1 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                >
                  <div className="p-5 border-b border-white/8">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <BarChart3 className="h-3.5 w-3.5 text-white" />
                      </div>
                      <h2 className="font-semibold text-sm">Platform Breakdown</h2>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {[
                      { label: "Users", value: stats.users, total: stats.users + stats.companies, color: "from-primary to-violet-600", rgb: "139,92,246" },
                      { label: "Jobs", value: stats.jobs, total: Math.max(stats.jobs, 1) * 1.5, color: "from-blue-500 to-indigo-600", rgb: "59,130,246" },
                      { label: "Applications", value: stats.applications, total: Math.max(stats.applications, 1) * 1.3, color: "from-emerald-500 to-teal-600", rgb: "16,185,129" },
                      { label: "Companies", value: stats.companies, total: Math.max(stats.companies, 1) * 2, color: "from-amber-500 to-orange-600", rgb: "245,158,11" },
                    ].map((item, i) => {
                      const pct = Math.min(Math.round((item.value / item.total) * 100), 100);
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.65 + i * 0.08 }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                            <span className="text-xs font-bold tabular-nums">{item.value.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                              style={{ boxShadow: `0 0 8px rgba(${item.rgb},0.5)` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.75 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}