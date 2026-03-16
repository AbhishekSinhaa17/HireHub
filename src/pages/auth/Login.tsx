import { useState, useEffect, useRef } from "react";
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
  Zap,
  Star,
  TrendingUp,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Floating Particle
───────────────────────────────────────────────────────────── */
function Particle({ index }: { index: number }) {
  const size = Math.random() * 3 + 1;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 10;
  const x = Math.random() * 100;
  const colors = [
    "bg-primary/40",
    "bg-violet-400/40",
    "bg-emerald-400/30",
    "bg-cyan-400/30",
    "bg-pink-400/20",
  ];
  const color = colors[index % colors.length];

  return (
    <motion.div
      className={`absolute rounded-full ${color} blur-[1px]`}
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10px" }}
      animate={{ y: [0, -(window.innerHeight + 100)], opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated Grid Lines
───────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/10 to-transparent"
          style={{ left: `${(i + 1) * (100 / 7)}%` }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          style={{ top: `${(i + 1) * (100 / 5)}%` }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Magnetic Button
───────────────────────────────────────────────────────────── */
function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
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
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
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
   Glow Input
───────────────────────────────────────────────────────────── */
function GlowInput({
  children,
  focused,
  color = "primary",
}: {
  children: React.ReactNode;
  focused: boolean;
  color?: "primary" | "violet";
}) {
  const gradient =
    color === "violet"
      ? "from-violet-500/50 via-primary/50 to-violet-500/50"
      : "from-primary/50 via-violet-500/50 to-primary/50";

  return (
    <div className="relative">
      <AnimatePresence>
        {focused && (
          <motion.div
            className={`absolute -inset-0.5 rounded-lg bg-gradient-to-r ${gradient} blur-sm`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Orbiting Ring
───────────────────────────────────────────────────────────── */
function OrbitingRing({
  radius,
  duration,
  color,
  dotSize = 6,
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
          boxShadow: `0 0 12px ${color}, 0 0 4px ${color}`,
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stat Counter Card
───────────────────────────────────────────────────────────── */
function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-background/30 backdrop-blur-md border border-white/10"
      whileHover={{ scale: 1.06, backgroundColor: "rgba(255,255,255,0.07)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-violet-400/80 mb-0.5">{icon}</div>
      <span className="font-display text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated Success Card (right panel mockup)
───────────────────────────────────────────────────────────── */
const successStories = [
  {
    initials: "JD",
    name: "Jane Doe",
    role: "Product Designer",
    company: "Visionary Co.",
    gradient: "from-pink-500 to-rose-600",
    tag: "Hired in 3 days",
  },
  {
    initials: "MK",
    name: "Marcus Kim",
    role: "Senior Engineer",
    company: "NovaTech",
    gradient: "from-blue-500 to-indigo-600",
    tag: "2x salary increase",
  },
  {
    initials: "SR",
    name: "Sara Reyes",
    role: "Data Scientist",
    company: "Pulse Analytics",
    gradient: "from-emerald-500 to-teal-600",
    tag: "Dream job found",
  },
];

function RotatingSuccessCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % successStories.length),
      3500
    );
    return () => clearInterval(timer);
  }, []);

  const story = successStories[index];

  return (
    <div className="relative h-[120px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-5 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Subtle inner gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
            >
              <span className="font-bold text-white text-sm">{story.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{story.name}</div>
              <div className="text-xs text-muted-foreground">
                {story.role} · {story.company}
              </div>
            </div>
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-500 whitespace-nowrap">
                {story.tag}
              </span>
            </motion.div>
          </div>
          {/* Skeleton lines */}
          <div className="flex gap-2 mt-4">
            {[100, 75, 55].map((w, i) => (
              <motion.div
                key={i}
                className="h-1.5 rounded-full bg-muted/50"
                style={{ width: `${w}px` }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {successStories.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full bg-muted-foreground/30"
            animate={{
              width: i === index ? 20 : 6,
              backgroundColor:
                i === index ? "hsl(var(--primary))" : "hsl(var(--muted-foreground)/0.3)",
            }}
            style={{ height: 6 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Login Component
───────────────────────────────────────────────────────────── */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const { signIn, role, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect based on role
  useEffect(() => {
    if (user && role) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/seeker/dashboard");
      }
    }
  }, [user, role, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back!" });
      // Redirect handled by useEffect above when role loads
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Zap className="h-4 w-4" />,
      color: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/30",
      text: "Instant job matching powered by AI",
    },
    {
      icon: <Building2 className="h-4 w-4" />,
      color: "from-violet-500 to-purple-500",
      glow: "shadow-violet-500/30",
      text: "10,000+ verified companies hiring now",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      color: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/30",
      text: "92% of users land interviews within 2 weeks",
    },
  ];

  return (
    <div
      className="flex min-h-screen bg-background relative overflow-hidden"
      onMouseMove={(e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }}
    >
      {/* ── Cursor Glow ── */}
      <motion.div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.06) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 300),
          y: useTransform(smoothY, (v) => v - 300),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-200px] left-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.07) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, -12, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(18)].map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* ════════════════════════════════════════
          LEFT PANEL — Form
      ════════════════════════════════════════ */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          className="w-full max-w-[420px] space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-violet-600 shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110 overflow-hidden">
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  style={{ skewX: "-20deg" }}
                />
                <Briefcase className="h-5 w-5 text-white relative z-10" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Hire<span className="text-primary">Hub</span>
              </span>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              </motion.div>
              <span className="text-xs font-semibold text-violet-400 tracking-wide uppercase">
                50,000+ professionals trust us
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Welcome{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  back
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary to-violet-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  style={{ originX: 0 }}
                />
              </span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in to pick up right where you left off.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div
              className="space-y-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                Email address
                <AnimatePresence>
                  {email.includes("@") && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-2.5 h-2.5 stroke-current fill-none stroke-2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Label>
              <GlowInput focused={activeField === "email"} color="violet">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  placeholder="you@example.com"
                  className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all focus-visible:ring-0 focus-visible:border-primary/50"
                  required
                />
              </GlowInput>
            </motion.div>

            {/* Password */}
            <motion.div
              className="space-y-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.37 }}
            >
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Password
                  <AnimatePresence>
                    {password.length >= 6 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-2.5 h-2.5 stroke-current fill-none stroke-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Label>
                <Link
                  to="#"
                  className="text-xs font-medium text-primary hover:underline underline-offset-2 transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <GlowInput focused={activeField === "password"} color="violet">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField(null)}
                    placeholder="••••••••"
                    className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all focus-visible:ring-0 focus-visible:border-primary/50 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  </button>
                </div>
              </GlowInput>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="pt-1"
            >
              <MagneticButton className="w-full">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold relative overflow-hidden group bg-gradient-to-r from-primary via-primary to-violet-600 border-0 shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                    style={{ skewX: "-20deg" }}
                  />
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        className="flex items-center gap-2 relative z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Signing in...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="idle"
                        className="flex items-center gap-2 relative z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Sign In
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </MagneticButton>
            </motion.div>
          </form>

          {/* Feature pills */}
          <motion.div
            className="space-y-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div
                  className={`flex-shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br ${f.color} shadow-md ${f.glow} flex items-center justify-center text-white`}
                >
                  {f.icon}
                </div>
                <span className="text-xs text-muted-foreground">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-sm text-muted-foreground pt-3 border-t border-border/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="font-semibold text-primary hover:underline underline-offset-2 transition-all"
            >
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT PANEL — Visual / Value Prop
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex w-[48%] relative items-center justify-center p-12 overflow-hidden border-l border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

        <GridLines />

        {/* Orbiting rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <OrbitingRing radius={170} duration={18} color="#8b5cf6" />
          <OrbitingRing
            radius={230}
            duration={26}
            color="hsl(var(--primary))"
            dotSize={8}
            reverse
          />
          <OrbitingRing radius={300} duration={36} color="#10b981" dotSize={5} />
        </div>

        <motion.div
          className="relative z-10 max-w-[460px] w-full space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(139,92,246,0)",
                "0 0 0 8px rgba(139,92,246,0.05)",
                "0 0 0 0 rgba(139,92,246,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Your dashboard awaits
            </span>
          </motion.div>

          {/* Headline */}
          <div>
            <h2 className="font-display text-4xl leading-[1.15] font-bold mb-3">
              Hire smarter.{" "}
              <span className="bg-gradient-to-r from-primary via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Get hired faster.
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The intelligent platform connecting ambitious talent with
              forward-thinking companies.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              value="50K+"
              label="Active Users"
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard
              value="4.9★"
              label="User Rating"
              icon={<Star className="h-4 w-4" />}
            />
            <StatCard
              value="10K+"
              label="Companies"
              icon={<Building2 className="h-4 w-4" />}
            />
          </div>

          {/* Rotating success card */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Recent success stories
            </p>
            <RotatingSuccessCard />
          </div>

          {/* Social proof avatars */}
          <motion.div
            className="flex items-center gap-3 p-4 rounded-2xl bg-background/20 backdrop-blur-sm border border-white/8 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex -space-x-2.5">
              {[
                "bg-gradient-to-br from-pink-400 to-rose-600",
                "bg-gradient-to-br from-blue-400 to-indigo-600",
                "bg-gradient-to-br from-amber-400 to-orange-600",
                "bg-gradient-to-br from-emerald-400 to-teal-600",
              ].map((grad, i) => (
                <motion.div
                  key={i}
                  className={`w-8 h-8 rounded-full ${grad} border-2 border-background flex items-center justify-center text-white text-xs font-bold`}
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1, type: "spring" }}
                >
                  {["A", "B", "C", "D"][i]}
                </motion.div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Joined this week
              </p>
              <p className="text-xs text-muted-foreground">+2,400 new members</p>
            </div>
            <div className="ml-auto">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}