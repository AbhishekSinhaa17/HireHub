import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Mail,
  Command,
  Globe2,
  Rocket,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Aurora — multi-blob animated gradient background
───────────────────────────────────────────────────────────── */
function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -left-40 w-[55rem] h-[55rem] rounded-full opacity-50 dark:opacity-60 mix-blend-multiply dark:mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #6366f1 0%, transparent 60%)",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[55rem] h-[55rem] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, #a855f7 0%, transparent 60%)",
        }}
        animate={{
          x: [0, -100, 50, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen blur-3xl"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 60%)",
          x: "-50%",
          y: "-50%",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Noise texture
───────────────────────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-[1]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Dot grid with radial mask
───────────────────────────────────────────────────────────── */
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.12] dark:opacity-[0.25]"
      style={{
        backgroundImage:
          "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Floating orbs (premium ambience)
───────────────────────────────────────────────────────────── */
function FloatingOrb({
  delay,
  duration,
  className,
  color,
}: {
  delay: number;
  duration: number;
  className: string;
  color: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-2xl pointer-events-none ${className}`}
      style={{ background: color }}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Sparkles (twinkling)
───────────────────────────────────────────────────────────── */
function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  const size = Math.random() * 2 + 1;
  return (
    <motion.div
      className="absolute rounded-full bg-white pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        boxShadow: `0 0 ${size * 5}px rgba(255,255,255,0.9)`,
      }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
      transition={{
        duration: 2 + Math.random() * 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   3D Tilt Card
───────────────────────────────────────────────────────────── */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 20,
  });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Spotlight Field — cursor-following glow + animated border
───────────────────────────────────────────────────────────── */
function SpotlightField({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const background = useMotionTemplate`radial-gradient(200px circle at ${x}px ${y}px, rgba(168,85,247,0.18), transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className="relative group rounded-xl"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.7,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            exit={{ opacity: 0 }}
            transition={{
              backgroundPosition: { duration: 3, repeat: Infinity },
              opacity: { duration: 0.3 },
            }}
            className="absolute -inset-[2px] rounded-xl blur-sm"
            style={{
              background:
                "linear-gradient(110deg, #6366f1, #a855f7, #06b6d4, #6366f1)",
              backgroundSize: "200% 100%",
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Magnetic wrapper
───────────────────────────────────────────────────────────── */
function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Live Activity Ticker
───────────────────────────────────────────────────────────── */
const liveActivity = [
  { who: "Priya S.", action: "joined as Senior PM at", co: "Stripe", c: "from-pink-500 to-rose-500" },
  { who: "Marcus K.", action: "got hired at", co: "Linear", c: "from-blue-500 to-indigo-500" },
  { who: "Aiko T.", action: "interviewed with", co: "Figma", c: "from-emerald-500 to-teal-500" },
  { who: "David R.", action: "received offer from", co: "Vercel", c: "from-amber-500 to-orange-500" },
  { who: "Lena M.", action: "matched with", co: "Notion", c: "from-violet-500 to-purple-500" },
];

function LiveTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % liveActivity.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-14 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={i}
          initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center gap-3"
        >
          <div className="relative flex-shrink-0">
            <motion.div
              className={`h-9 w-9 rounded-full bg-gradient-to-br ${liveActivity[i].c} flex items-center justify-center text-[11px] font-bold text-white shadow-lg`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {liveActivity[i].who[0]}
            </motion.div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background">
              <motion.span
                className="absolute inset-0 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </span>
          </div>
          <div className="text-sm leading-tight">
            <span className="font-semibold text-foreground">{liveActivity[i].who}</span>{" "}
            <span className="text-muted-foreground">{liveActivity[i].action}</span>{" "}
            <span className="font-semibold text-foreground">{liveActivity[i].co}</span>
            <div className="text-[10px] text-emerald-500 font-semibold tracking-wide uppercase mt-0.5 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Live · just now
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Marquee
───────────────────────────────────────────────────────────── */
function CompanyMarquee() {
  const items = ["Stripe", "Linear", "Figma", "Vercel", "Notion", "Anthropic", "OpenAI", "Shopify"];
  return (
    <div
      className="relative overflow-hidden py-1"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((name, i) => (
          <span
            key={i}
            className="font-display text-lg font-semibold text-muted-foreground/50 tracking-tight hover:text-foreground transition-colors"
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero Card Stack — premium product preview
───────────────────────────────────────────────────────────── */
function HeroCardStack() {
  return (
    <TiltCard className="relative w-full h-[420px]">
      {/* Glow behind */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-primary/10 to-cyan-500/20 blur-3xl rounded-full" />

      {/* Back card */}
      <motion.div
        className="absolute top-6 right-0 w-[78%] h-full rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-border dark:border-white/10 backdrop-blur-xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateZ(-30px)" }}
      />
      {/* Middle card */}
      <motion.div
        className="absolute top-3 right-6 w-[85%] h-[95%] rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-border dark:border-white/15 backdrop-blur-xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        style={{ transform: "translateZ(-15px)" }}
      />

      {/* Front card */}
      <motion.div
        className="absolute top-0 left-0 w-[88%] h-[90%] rounded-3xl bg-card/80 dark:bg-background/80 border border-border dark:border-white/20 backdrop-blur-2xl shadow-2xl shadow-foreground/10 dark:shadow-black/50 overflow-hidden"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border dark:border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <div className="ml-3 flex-1 h-5 rounded bg-muted/50 dark:bg-white/5 px-2 flex items-center">
            <Lock className="h-2.5 w-2.5 text-muted-foreground mr-1.5" />
            <span className="text-[10px] text-muted-foreground font-mono">
              hirehub.app/dashboard
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Match Score
              </div>
              <div className="font-display text-4xl font-black bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                98%
              </div>
            </div>
            <motion.div
              className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Rocket className="h-6 w-6 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Job rows */}
          {[
            { co: "Linear", role: "Senior Frontend Engineer", pct: 96, c: "from-indigo-500 to-violet-500" },
            { co: "Figma", role: "Staff Product Designer", pct: 91, c: "from-pink-500 to-rose-500" },
            { co: "Vercel", role: "Platform Engineer", pct: 88, c: "from-cyan-500 to-blue-500" },
          ].map((job, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 dark:bg-white/[0.03] border border-border dark:border-white/5 hover:border-primary/30 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              whileHover={{ x: 4 }}
            >
              <div
                className={`h-9 w-9 rounded-lg bg-gradient-to-br ${job.c} flex items-center justify-center text-white text-xs font-bold shadow-md`}
              >
                {job.co[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{job.role}</div>
                <div className="text-[11px] text-muted-foreground">{job.co} · Remote</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-400">{job.pct}%</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  match
                </div>
              </div>
            </motion.div>
          ))}

          {/* Progress bar */}
          <div className="pt-1">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5 font-medium">
              <span>Profile strength</span>
              <span className="text-emerald-400 font-semibold">Strong</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-muted dark:bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-violet-400 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "800%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 2 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating notification */}
      <motion.div
        className="absolute -bottom-4 -right-2 px-3.5 py-2.5 rounded-2xl bg-card/90 dark:bg-background/90 backdrop-blur-xl border border-border dark:border-white/15 shadow-xl flex items-center gap-2.5"
        initial={{ opacity: 0, y: 20, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 4 }}
        transition={{ delay: 1.2 }}
        whileHover={{ rotate: 0, scale: 1.05 }}
        style={{ transform: "translateZ(40px)" }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </motion.div>
        <div>
          <div className="text-xs font-semibold">New offer received</div>
          <div className="text-[10px] text-muted-foreground">$185k base · Stripe</div>
        </div>
      </motion.div>

      {/* Floating stat badge */}
      <motion.div
        className="absolute top-8 -left-4 px-3 py-2 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl shadow-violet-500/40"
        initial={{ opacity: 0, x: -20, rotate: -10 }}
        animate={{ opacity: 1, x: 0, rotate: -6 }}
        transition={{ delay: 0.8 }}
        whileHover={{ rotate: 0, scale: 1.05 }}
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <div>
            <div className="text-[9px] uppercase tracking-widest opacity-80">This week</div>
            <div className="text-xs font-bold">+12 matches</div>
          </div>
        </div>
      </motion.div>

      {/* Floating star badge */}
      <motion.div
        className="absolute top-1/2 -right-3 h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ rotate: 360 }}
        style={{ transform: "translateZ(40px)" }}
      >
        <Star className="h-5 w-5 text-white fill-white" />
      </motion.div>
    </TiltCard>
  );
}

/* ═════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════ */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [capsLock, setCapsLock] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { signIn, signInWithGoogle, role, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cursor follow glow
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

  useEffect(() => {
    if (user && role) {
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/seeker/dashboard");
    }
  }, [user, role, navigate]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Burning the midnight oil";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Working late";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back!" });
    } catch (err: any) {
      toast({
        title: "Sign-in failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Sparkle positions (memo'd to avoid jitter)
  const sparkles = useMemo(
    () =>
      Array.from({ length: 25 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <div className="relative flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Cursor follower glow */}
      <motion.div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 250),
          y: useTransform(smoothY, (v) => v - 250),
        }}
      />

      <Aurora />
      <DotGrid />
      <NoiseOverlay />

      {/* Floating orbs */}
      <FloatingOrb
        delay={0}
        duration={10}
        className="top-[20%] left-[10%] w-32 h-32"
        color="radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)"
      />
      <FloatingOrb
        delay={2}
        duration={12}
        className="bottom-[20%] left-[5%] w-24 h-24"
        color="radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)"
      />
      <FloatingOrb
        delay={1}
        duration={11}
        className="top-[10%] right-[8%] w-28 h-28"
        color="radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)"
      />

      {/* Sparkles on right side */}
      <div className="absolute right-0 top-0 w-[45%] h-full pointer-events-none">
        {sparkles.map((s, i) => (
          <Sparkle key={i} delay={s.delay} x={s.x} y={s.y} />
        ))}
      </div>

      {/* ════════════════════════════════════════
          LEFT — Visual / Brand Panel
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-14 z-10">
        <div className="relative w-full max-w-[560px] space-y-10">
          {/* Logo + status */}
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.08 }}
                className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-indigo-600 shadow-lg shadow-primary/40 flex items-center justify-center overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  style={{ skewX: "-20deg" }}
                />
                <Briefcase className="h-5 w-5 text-white relative z-10" />
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  style={{ boxShadow: "0 0 8px rgba(255,255,255,0.9)" }}
                />
              </motion.div>
              <span className="font-display text-2xl font-bold tracking-tight">
                Hire
                <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                  Hub
                </span>
              </span>
            </Link>

            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 dark:bg-white/[0.04] border border-border dark:border-white/10 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(16,185,129,0)",
                  "0 0 0 4px rgba(16,185,129,0.05)",
                  "0 0 0 0 rgba(16,185,129,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                All systems operational
              </span>
            </motion.div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-primary/10 to-cyan-500/10 border border-violet-500/30 text-violet-300 backdrop-blur-sm"
              whileHover={{ scale: 1.03 }}
            >
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </motion.div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
                AI-Powered Career Platform
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.5rem,4vw,3.75rem)] font-black leading-[0.95] tracking-tight">
              Where careers
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  ignite.
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                >
                  <motion.path
                    d="M2 8 Q 75 2, 150 6 T 298 4"
                    fill="none"
                    stroke="url(#g1)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                  />
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </motion.svg>
                <motion.div
                  className="absolute -top-3 -right-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, type: "spring" }}
                >
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </motion.div>
              </span>
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Match with elite companies in seconds. Land interviews in days.
              Built for the next generation of ambitious talent.
            </p>
          </div>

          {/* Hero card stack */}
          <HeroCardStack />

          {/* Live ticker */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
              <Globe2 className="h-3.5 w-3.5" />
              Live activity
            </div>
            <LiveTicker />
          </div>

          {/* Companies marquee */}
          <div className="pt-2">
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-3">
              Trusted by hiring teams at
            </div>
            <CompanyMarquee />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT — Form Panel (glass card)
      ════════════════════════════════════════ */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[440px]"
        >
          {/* Animated rotating gradient ring */}
          <motion.div
            className="absolute -inset-[2px] rounded-3xl opacity-60"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, #6366f1, #a855f7, #06b6d4, transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative rounded-3xl bg-card/85 dark:bg-[#0d0d18]/85 backdrop-blur-2xl border border-border dark:border-white/10 p-8 lg:p-10 shadow-2xl shadow-foreground/5 dark:shadow-black/50 space-y-6 overflow-hidden">
            {/* Decorative top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-violet-500/20 blur-3xl rounded-full pointer-events-none" />

            {/* Mobile logo */}
            <Link to="/" className="lg:hidden inline-flex items-center gap-2.5 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                Hire<span className="text-primary">Hub</span>
              </span>
            </Link>

            {/* Greeting */}
            <div className="space-y-2 relative">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Command className="h-3 w-3" />
                </motion.div>
                {greeting}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl font-bold tracking-tight"
              >
                Welcome{" "}
                <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  back
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground"
              >
                Pick up exactly where you left off.
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative">
              {/* Email */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-muted-foreground flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    EMAIL
                  </span>
                  <AnimatePresence>
                    {emailValid && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="flex items-center gap-1 text-emerald-400 normal-case tracking-normal"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-[10px] font-medium">Looks good</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Label>
                <SpotlightField active={activeField === "email"}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setActiveField("email")}
                    onBlur={() => setActiveField(null)}
                    placeholder="you@company.com"
                    className="h-12 bg-muted/30 dark:bg-white/[0.03] border-border dark:border-white/10 hover:border-primary/30 dark:hover:border-white/20 focus:border-violet-400/50 focus-visible:ring-0 transition-all rounded-xl pl-4"
                    required
                  />
                </SpotlightField>
              </motion.div>

              {/* Password */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-muted-foreground flex items-center gap-2"
                  >
                    <Lock className="h-3 w-3" />
                    PASSWORD
                    <AnimatePresence>
                      {capsLock && activeField === "password" && (
                        <motion.span
                          initial={{ opacity: 0, x: -5, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -5, scale: 0.9 }}
                          className="text-[10px] font-medium text-amber-400 normal-case tracking-normal flex items-center gap-1"
                        >
                          <motion.span
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                          >
                            ⚠
                          </motion.span>
                          Caps Lock is on
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Label>
                  <Link
                    to="#"
                    className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors relative group"
                  >
                    Forgot?
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-violet-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                </div>
                <SpotlightField active={activeField === "password"}>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
                      onFocus={() => setActiveField("password")}
                      onBlur={() => setActiveField(null)}
                      placeholder="Enter your password"
                      className="h-12 bg-muted/30 dark:bg-white/[0.03] border-border dark:border-white/10 hover:border-primary/30 dark:hover:border-white/20 focus:border-violet-400/50 focus-visible:ring-0 transition-all rounded-xl pl-4 pr-11"
                      required
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                      whileTap={{ scale: 0.85 }}
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.div
                            key="off"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <EyeOff className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="on"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Eye className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </SpotlightField>

                {/* Strength bar */}
                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-1 pt-1"
                    >
                      {[0, 1, 2, 3].map((bar) => {
                        const filled =
                          (password.length >= 4 && bar === 0) ||
                          (password.length >= 6 && bar === 1) ||
                          (password.length >= 9 && bar === 2) ||
                          (password.length >= 12 && bar === 3);
                        const colors = [
                          "from-rose-500 to-red-500",
                          "from-amber-500 to-orange-500",
                          "from-yellow-400 to-lime-500",
                          "from-emerald-500 to-teal-500",
                        ];
                        return (
                          <motion.div
                            key={bar}
                            className="h-1 flex-1 rounded-full overflow-hidden bg-muted dark:bg-white/10"
                          >
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${colors[bar]}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: filled ? 1 : 0 }}
                              transition={{ delay: bar * 0.05, duration: 0.3 }}
                              style={{ originX: 0 }}
                            />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Remember me */}
              <motion.div
                className="flex items-center justify-between pt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 group"
                >
                  <div
                    className={`relative w-4 h-4 rounded border-2 transition-all ${
                      rememberMe
                        ? "bg-gradient-to-br from-primary to-violet-500 border-violet-500"
                        : "border-border dark:border-white/20 group-hover:border-violet-400"
                    }`}
                  >
                    <AnimatePresence>
                      {rememberMe && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-3 h-3 stroke-white fill-none"
                            strokeWidth={3}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    Keep me signed in
                  </span>
                </button>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <span>Secure session</span>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-2"
              >
                <Magnetic strength={0.2}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full h-12 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {/* Animated gradient bg */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(110deg, #6366f1 0%, #a855f7 35%, #06b6d4 70%, #6366f1 100%)",
                        backgroundSize: "200% 100%",
                      }}
                      animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Shine */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                      style={{ skewX: "-20deg" }}
                    />
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.45)] opacity-70 group-hover:opacity-100 transition-opacity" />

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span
                            key="l"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-2"
                          >
                            <motion.span
                              className="block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            Authenticating
                          </motion.span>
                        ) : (
                          <motion.span
                            key="i"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-2"
                          >
                            <Zap className="h-4 w-4" />
                            Sign in securely
                            <motion.span
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </motion.button>
                </Magnetic>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border dark:border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card dark:bg-[#0d0d18] px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  or
                </span>
              </div>
            </motion.div>

            {/* Google */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <Magnetic strength={0.15}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="w-full h-12 bg-muted/30 dark:bg-white/[0.03] hover:bg-muted/50 dark:hover:bg-white/[0.06] border-border dark:border-white/10 hover:border-primary/30 dark:hover:border-white/20 rounded-xl font-semibold gap-3 transition-all group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    style={{ skewX: "-20deg" }}
                  />
                  <svg className="h-4 w-4 relative z-10" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="relative z-10">Continue with Google</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all relative z-10" />
                </Button>
              </Magnetic>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="text-center pt-2 border-t border-border dark:border-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <p className="text-sm text-muted-foreground pt-4">
                New to HireHub?{" "}
                <Link
                  to="/auth/signup"
                  className="font-semibold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent hover:underline underline-offset-4 inline-flex items-center gap-1 group"
                >
                  Create your account
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </p>
              <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground/70">
                <span className="flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5" />
                  256-bit encrypted
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span>SOC 2 Type II</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span>GDPR ready</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}