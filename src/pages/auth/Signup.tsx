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
  Target,
  ShieldCheck,
  Star,
  Users,
  TrendingUp,
  Check,
  Rocket,
  Globe,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Animated Aurora Background
───────────────────────────────────────────────────────────── */
function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.4) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[55%] h-[55%] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -120, 60, 0],
          y: [0, 70, -40, 0],
          scale: [1, 1.3, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 80, -100, 0],
          y: [0, -60, 80, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated Mesh Grid
───────────────────────────────────────────────────────────── */
function MeshGrid() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Floating Shapes (geometric)
───────────────────────────────────────────────────────────── */
function FloatingShape({
  delay,
  duration,
  shape,
  className,
}: {
  delay: number;
  duration: number;
  shape: "circle" | "square" | "triangle";
  className: string;
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0],
        rotate: shape === "triangle" ? [0, 360] : [0, 180, 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {shape === "circle" && (
        <div className="w-full h-full rounded-full border-2 border-primary/20" />
      )}
      {shape === "square" && (
        <div className="w-full h-full rounded-lg border-2 border-emerald-400/20 rotate-45" />
      )}
      {shape === "triangle" && (
        <div
          className="w-full h-full"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.15) 100%)",
            border: "2px solid rgba(139,92,246,0.2)",
          }}
        />
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sparkle Particle (premium feel)
───────────────────────────────────────────────────────────── */
function Sparkle({ delay }: { delay: number }) {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = Math.random() * 3 + 1;
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        boxShadow: `0 0 ${size * 4}px rgba(255,255,255,0.8)`,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   3D Tilt Card
───────────────────────────────────────────────────────────── */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const sx = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const sy = useSpring(rotateY, { stiffness: 200, damping: 25 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX: sx,
        rotateY: sy,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Magnetic wrapper
───────────────────────────────────────────────────────────── */
function Magnetic({
  children,
  className,
  strength = 0.3,
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

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
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
   Animated Number Counter
───────────────────────────────────────────────────────────── */
function AnimatedCount({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Glassy Stat Card
───────────────────────────────────────────────────────────── */
function StatCard({
  value,
  suffix,
  label,
  icon,
  gradient,
}: {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <motion.div
      className="relative group p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 overflow-hidden"
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
        style={{ mixBlendMode: "overlay" }}
      />
      <div className="relative">
        <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${gradient} mb-2 shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <div className="font-display text-2xl font-bold text-foreground">
          <AnimatedCount value={value} suffix={suffix} />
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated Beam (between elements)
───────────────────────────────────────────────────────────── */
function AnimatedBeam() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 50 100 Q 200 50 350 200 T 500 400"
        stroke="url(#beam)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6 6"
        animate={{ strokeDashoffset: [0, -24] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════
   Main Signup Component
═════════════════════════════════════════════════════════════ */
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"jobseeker" | "recruiter">("jobseeker");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    let filled = 0;
    if (fullName) filled++;
    if (email.includes("@")) filled++;
    if (password.length >= 6) filled++;
    setStep(filled);
  }, [fullName, email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName, role);
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      navigate("/auth/login");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Rocket className="h-5 w-5" />,
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      glow: "shadow-orange-500/40",
      title: "Launch Your Career",
      desc: "AI-powered matching connects you with dream roles instantly.",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      glow: "shadow-emerald-500/40",
      title: "Global Opportunities",
      desc: "Access remote and on-site roles from companies worldwide.",
    },
    {
      icon: <Award className="h-5 w-5" />,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      glow: "shadow-violet-500/40",
      title: "Trusted by Leaders",
      desc: "Verified partners include Fortune 500 and top startups.",
    },
  ];

  const passwordStrength = Math.min(Math.floor(password.length / 3), 4);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "from-red-500 to-rose-500",
    "from-orange-500 to-amber-500",
    "from-yellow-500 to-lime-500",
    "from-emerald-500 to-teal-500",
  ];

  return (
    <div
      className="flex min-h-screen bg-background relative overflow-hidden"
      onMouseMove={(e) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }}
    >
      {/* ── Cursor Follower Glow ── */}
      <motion.div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 250),
          y: useTransform(smoothY, (v) => v - 250),
        }}
      />

      <Aurora />
      <MeshGrid />

      {/* Floating geometric shapes */}
      <FloatingShape
        delay={0}
        duration={8}
        shape="circle"
        className="top-[15%] left-[8%] w-12 h-12"
      />
      <FloatingShape
        delay={1}
        duration={10}
        shape="square"
        className="top-[60%] left-[5%] w-8 h-8"
      />
      <FloatingShape
        delay={2}
        duration={9}
        shape="triangle"
        className="bottom-[20%] left-[12%] w-10 h-10"
      />
      <FloatingShape
        delay={1.5}
        duration={11}
        shape="circle"
        className="top-[25%] right-[6%] w-16 h-16"
      />
      <FloatingShape
        delay={3}
        duration={12}
        shape="square"
        className="bottom-[30%] right-[10%] w-12 h-12"
      />

      {/* ════════════════════════════════════════
          LEFT — Form Panel
      ════════════════════════════════════════ */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
        <motion.div
          className="w-full max-w-[440px] space-y-6 my-auto py-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Logo with shine ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="inline-flex items-center gap-3 group">
              <motion.div
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-600 shadow-xl shadow-primary/40 overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 6 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  style={{ skewX: "-20deg" }}
                />
                <Briefcase className="h-5 w-5 text-white relative z-10" />
                {/* Sparkle on logo */}
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  style={{ boxShadow: "0 0 8px rgba(255,255,255,0.8)" }}
                />
              </motion.div>
              <span className="font-display text-xl font-bold tracking-tight">
                Hire<span className="text-primary">Hub</span>
              </span>
            </Link>
          </motion.div>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 mb-4 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 0 0 hsl(var(--primary)/0.3)",
                  "0 0 0 6px hsl(var(--primary)/0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </motion.div>
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Free • No credit card required
              </span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-[2.6rem] font-bold mb-3 leading-[1.1] tracking-tight">
              Begin your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-br from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  journey
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[4px] rounded-full bg-gradient-to-r from-primary via-emerald-500 to-teal-500 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, type: "spring" }}
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </motion.div>
              </span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Join 50,000+ professionals shaping their future with HireHub.
            </p>
          </motion.div>

          {/* ── Progress Indicator ── */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">
                Setup progress
              </span>
              <motion.span
                className="text-xs font-bold text-primary"
                key={step}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
              >
                {Math.round((step / 3) * 100)}%
              </motion.span>
            </div>
            <div className="relative h-2 rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-emerald-500 to-teal-500"
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-white/30 blur-sm"
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {/* Shimmer */}
              <motion.div
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "500%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <FormField
              id="name"
              label="Full Name"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Jane Doe"
              isValid={fullName.length > 1}
              activeField={activeField}
              setActiveField={setActiveField}
              delay={0.3}
            />

            {/* Email */}
            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              isValid={email.includes("@") && email.includes(".")}
              activeField={activeField}
              setActiveField={setActiveField}
              delay={0.37}
            />

            {/* Password */}
            <motion.div
              className="space-y-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
            >
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                Password
                <AnimatePresence>
                  {password.length >= 6 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white"
                    >
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Label>
              <div className="relative">
                <AnimatePresence>
                  {activeField === "password" && (
                    <motion.div
                      className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-primary via-emerald-500 to-primary opacity-70 blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 0.7,
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        backgroundPosition: { duration: 3, repeat: Infinity },
                      }}
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  )}
                </AnimatePresence>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField(null)}
                    placeholder="Min. 6 characters"
                    className="h-12 bg-muted/40 border-border/60 focus:bg-background transition-all focus-visible:ring-0 focus-visible:border-primary/50 pr-10 rounded-xl"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    whileTap={{ scale: 0.85 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showPassword ? "show" : "hide"}
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>

              {/* Strength Meter */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 pt-1"
                  >
                    <div className="flex gap-1.5">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 flex-1 rounded-full bg-muted/60 overflow-hidden"
                        >
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${strengthColors[passwordStrength - 1] || ""}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: i < passwordStrength ? 1 : 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            style={{ originX: 0 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    {passwordStrength > 0 && (
                      <motion.p
                        className="text-xs text-muted-foreground"
                        key={passwordStrength}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        Strength:{" "}
                        <span className="font-semibold text-foreground">
                          {strengthLabels[passwordStrength - 1]}
                        </span>
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Role Selector */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.51 }}
            >
              <Label className="text-sm font-medium">I want to</Label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: "jobseeker", title: "Find work", desc: "Discover opportunities", icon: <Target className="h-4 w-4" /> },
                  { id: "recruiter", title: "Hire talent", desc: "Build your team", icon: <Users className="h-4 w-4" /> },
                ] as const).map((r) => (
                  <motion.button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden group ${
                      role === r.id
                        ? "border-primary bg-primary/5"
                        : "border-border/60 bg-muted/20 hover:border-primary/50"
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {role === r.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/15 via-emerald-500/10 to-transparent"
                        layoutId="roleBg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {/* Sparkles when active */}
                    {role === r.id &&
                      [...Array(3)].map((_, i) => (
                        <Sparkle key={i} delay={i * 0.3} />
                      ))}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            role === r.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {r.icon}
                        </div>
                        <motion.div
                          animate={{
                            scale: role === r.id ? 1 : 0,
                            opacity: role === r.id ? 1 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/30"
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </motion.div>
                      </div>
                      <div className="text-sm font-bold text-foreground">{r.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 }}
              className="pt-1"
            >
              <Magnetic className="w-full" strength={0.2}>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold relative overflow-hidden group bg-gradient-to-r from-primary via-emerald-500 to-teal-500 border-0 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 active:scale-[0.98] transition-all duration-300 !text-white rounded-xl"
                  disabled={loading}
                  style={{ backgroundSize: "200% 100%" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-500 to-teal-500"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "200% 100%" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    style={{ skewX: "-20deg" }}
                  />
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        className="flex items-center gap-2 relative z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Creating magic...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="idle"
                        className="flex items-center gap-2 relative z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Create Account
                        <motion.div
                          className="flex items-center"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Magnetic>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            className="relative py-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-widest">
                Or
              </span>
            </div>
          </motion.div>

          {/* Google */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Magnetic strength={0.15}>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-background border-border/60 hover:bg-primary/5 hover:border-primary/50 transition-all gap-3 font-semibold group relative overflow-hidden rounded-xl"
                onClick={signInWithGoogle}
                disabled={loading}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  style={{ skewX: "-20deg" }}
                />
                <svg className="h-5 w-5 relative z-10" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0 -0.78 -0.07 -1.53 -0.2 -2.25H12v4.26h5.92c-0.26 1.37 -1.04 2.53 -2.21 3.31v2.77h3.57c2.08 -1.92 3.28 -4.74 3.28 -8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46 -0.98 7.28 -2.66l -3.57 -2.77c-0.98 0.66 -2.23 1.06 -3.71 1.06-2.86 0 -5.29 -1.93 -6.16 -4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-0.22 -0.66 -0.35 -1.36 -0.35 -2.09s0.13 -1.43 0.35 -2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s0.43 3.45 1.18 4.93l 2.85 -2.22 0.81 -0.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06 0.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c0.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="relative z-10">Continue with Google</span>
              </Button>
            </Magnetic>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-center text-sm text-muted-foreground pt-3 border-t border-border/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Already a member?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-primary hover:text-emerald-500 transition-colors relative group inline-block"
            >
              Sign in
              <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary to-emerald-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT — Showcase Panel
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex w-[45%] relative items-center justify-center p-10 overflow-hidden border-l border-border/30">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top right, hsl(var(--primary)/0.15) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at bottom left, rgba(16,185,129,0.15) 0%, transparent 60%)",
          }}
        />

        {/* Sparkles */}
        {[...Array(20)].map((_, i) => (
          <Sparkle key={i} delay={i * 0.3} />
        ))}

        {/* Animated Beam */}
        <AnimatedBeam />

        {/* Concentric rings backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/10"
              style={{ width: i * 180, height: i * 180 }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 max-w-[440px] w-full space-y-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          {/* Premium badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 via-emerald-500/15 to-primary/15 backdrop-blur-md border border-primary/30 shadow-lg shadow-primary/10"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundSize: "200% 100%" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Trusted by 50,000+ Pros
            </span>
          </motion.div>

          {/* Hero text */}
          <div>
            <motion.h2
              className="font-display text-[2.5rem] leading-[1.1] font-bold mb-3 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Where{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-br from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  ambition
                </span>
              </span>
              <br />
              meets opportunity.
            </motion.h2>
            <motion.p
              className="text-muted-foreground leading-relaxed text-[15px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Discover roles that align with your skills, values, and aspirations.
            </motion.p>
          </div>

          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <StatCard
              value={50000}
              suffix="+"
              label="Active Users"
              icon={<Users className="h-4 w-4" />}
              gradient="from-blue-500 to-cyan-500"
            />
            <StatCard
              value={92}
              suffix="%"
              label="Hire Rate"
              icon={<TrendingUp className="h-4 w-4" />}
              gradient="from-emerald-500 to-teal-500"
            />
            <StatCard
              value={4}
              suffix=".9★"
              label="Rating"
              icon={<Star className="h-4 w-4" />}
              gradient="from-amber-500 to-orange-500"
            />
          </motion.div>

          {/* Benefit cards */}
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <TiltCard key={i} className="group">
                <motion.div
                  className="relative flex gap-4 p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all duration-500 cursor-default overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${b.gradient} transition-opacity duration-500`}
                    style={{ mixBlendMode: "overlay" }}
                  />
                  {/* Shine on hover */}
                  <motion.div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000"
                    style={{ skewX: "-20deg" }}
                  />

                  <div
                    className={`relative flex-shrink-0 h-11 w-11 rounded-2xl bg-gradient-to-br ${b.gradient} shadow-xl ${b.glow} flex items-center justify-center text-white`}
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {b.icon}
                    </motion.div>
                    {/* Pulsing glow */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${b.gradient}`}
                      animate={{ opacity: [0, 0.4, 0], scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 relative">
                    <h3 className="font-bold text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>

                  <motion.div
                    className="flex-shrink-0 text-muted-foreground/30 group-hover:text-primary self-center transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              </TiltCard>
            ))}
          </div>

          {/* Live activity */}
          <motion.div
            className="relative flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            {/* Animated gradient bg */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--primary)/0.2), transparent)",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative flex -space-x-2.5">
              {[
                "from-pink-400 to-rose-600",
                "from-blue-400 to-indigo-600",
                "from-amber-400 to-orange-600",
                "from-emerald-400 to-teal-600",
              ].map((grad, i) => (
                <motion.div
                  key={i}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${grad} border-2 border-background flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.3 + i * 0.1, type: "spring" }}
                  whileHover={{ y: -3, scale: 1.1, zIndex: 10 }}
                >
                  {["A", "B", "C", "D"][i]}
                </motion.div>
              ))}
            </div>
            <div className="relative flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">+2,400 joined</p>
                <motion.div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                    animate={{
                      opacity: [1, 0.4, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(16,185,129,0.6)",
                        "0 0 0 4px rgba(16,185,129,0)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    Live
                  </span>
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground">in the last 7 days</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Reusable Form Field
───────────────────────────────────────────────────────────── */
function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  isValid,
  activeField,
  setActiveField,
  delay,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  isValid: boolean;
  activeField: string | null;
  setActiveField: (v: string | null) => void;
  delay: number;
}) {
  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Label htmlFor={id} className="text-sm font-medium flex items-center gap-2">
        {label}
        <AnimatePresence>
          {isValid && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm shadow-emerald-500/40"
            >
              <Check className="w-2.5 h-2.5" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </Label>
      <div className="relative">
        <AnimatePresence>
          {activeField === id && (
            <motion.div
              className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-primary via-emerald-500 to-primary opacity-70 blur-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.7,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              exit={{ opacity: 0 }}
              transition={{
                backgroundPosition: { duration: 3, repeat: Infinity },
              }}
              style={{ backgroundSize: "200% 100%" }}
            />
          )}
        </AnimatePresence>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setActiveField(id)}
          onBlur={() => setActiveField(null)}
          placeholder={placeholder}
          className="relative h-12 bg-muted/40 border-border/60 focus:bg-background transition-all focus-visible:ring-0 focus-visible:border-primary/50 rounded-xl"
          required
        />
      </div>
    </motion.div>
  );
}