import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Floating Particle
───────────────────────────────────────────────────────────── */
function Particle({ index }: { index: number }) {
  const size = Math.random() * 4 + 1;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 10;
  const x = Math.random() * 100;
  const colors = [
    "bg-primary/40",
    "bg-emerald-400/40",
    "bg-violet-400/30",
    "bg-amber-400/30",
    "bg-cyan-400/30",
  ];
  const color = colors[index % colors.length];

  return (
    <motion.div
      className={`absolute rounded-full ${color} blur-[1px]`}
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10px" }}
      animate={{ y: [0, -window.innerHeight - 100], opacity: [0, 1, 1, 0] }}
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
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent"
          style={{ left: `${(i + 1) * (100 / 7)}%` }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"
          style={{ top: `${(i + 1) * (100 / 5)}%` }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Magnetic Button wrapper
───────────────────────────────────────────────────────────── */
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Orbiting Ring
───────────────────────────────────────────────────────────── */
function OrbitingRing({ radius, duration, color, dotSize = 6 }: {
  radius: number; duration: number; color: string; dotSize?: number;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute rounded-full border border-dashed opacity-20"
        style={{ width: radius * 2, height: radius * 2, borderColor: color }}
      />
      <div
        className="absolute rounded-full shadow-lg"
        style={{
          width: dotSize,
          height: dotSize,
          background: color,
          top: `calc(50% - ${radius}px)`,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stats Counter
───────────────────────────────────────────────────────────── */
function StatCounter({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-background/30 backdrop-blur-md border border-white/10"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-primary/80 mb-1">{icon}</div>
      <span className="font-display text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Glowing Input wrapper
───────────────────────────────────────────────────────────── */
function GlowInput({ children, focused }: { children: React.ReactNode; focused: boolean }) {
  return (
    <div className="relative">
      <AnimatePresence>
        {focused && (
          <motion.div
            className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/50 via-emerald-500/50 to-primary/50 blur-sm"
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
   Main Signup Component
───────────────────────────────────────────────────────────── */
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"jobseeker" | "recruiter">("jobseeker");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [step, setStep] = useState(0); // Track form completion
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Track cursor for interactive background
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

  // Update progress step
  useEffect(() => {
    let filled = 0;
    if (fullName) filled++;
    if (email) filled++;
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
      icon: <Zap className="h-5 w-5" />,
      color: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/30",
      title: "Lightning Fast Matching",
      desc: "Get connected with relevant opportunities in seconds.",
    },
    {
      icon: <Target className="h-5 w-5" />,
      color: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/30",
      title: "Precision AI Targeting",
      desc: "Our AI understands exactly what you're looking for.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "from-blue-500 to-violet-500",
      glow: "shadow-blue-500/30",
      title: "Verified Ecosystem",
      desc: "A trusted network of verified professionals and companies.",
    },
  ];

  const progressSegments = 3;

  return (
    <div
      className="flex min-h-screen bg-background relative overflow-hidden"
      onMouseMove={(e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); }}
    >
      {/* ── Cursor Glow ── */}
      <motion.div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.06) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 300),
          y: useTransform(smoothY, (v) => v - 300),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(18)].map((_, i) => <Particle key={i} index={i} />)}
      </div>

      {/* ════════════════════════════════════════
          LEFT PANEL — Form
      ════════════════════════════════════════ */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
        <motion.div
          className="w-full max-w-[420px] space-y-7 my-auto py-8"
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
            <Link to="/" className="inline-flex items-center gap-3 mb-2 group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-600 shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110 overflow-hidden">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </motion.div>
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Free forever to get started
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Create your{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  account
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary to-emerald-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  style={{ originX: 0 }}
                />
              </span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Join 50,000+ professionals accelerating their career journey.
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Profile completion</span>
              <span className="text-xs font-semibold text-primary">
                {Math.round((step / progressSegments) * 100)}%
              </span>
            </div>
            <div className="flex gap-1.5">
              {[...Array(progressSegments)].map((_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full bg-muted/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
                    animate={{ width: step > i ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <motion.div
              className="space-y-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                Full Name
                <AnimatePresence>
                  {fullName && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white"
                    >
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-current fill-none stroke-2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Label>
              <GlowInput focused={activeField === "name"}>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  placeholder="John Doe"
                  className="h-11 bg-muted/40 border-border/60 focus:bg-background transition-all focus-visible:ring-0 focus-visible:border-primary/50"
                  required
                />
              </GlowInput>
            </motion.div>

            {/* Email */}
            <motion.div
              className="space-y-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.37 }}
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
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-current fill-none stroke-2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Label>
              <GlowInput focused={activeField === "email"}>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  placeholder="you@example.com"
                  className="h-11 bg-muted/40 border-border/60 focus:bg-background transition-all focus-visible:ring-0 focus-visible:border-primary/50"
                  required
                />
              </GlowInput>
            </motion.div>

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
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-current fill-none stroke-2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Label>
              <GlowInput focused={activeField === "password"}>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField(null)}
                    placeholder="Min. 6 characters"
                    className="h-11 bg-muted/40 border-border/60 focus:bg-background transition-all focus-visible:ring-0 focus-visible:border-primary/50 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </GlowInput>
              {/* Strength meter */}
              {password.length > 0 && (
                <motion.div
                  className="flex gap-1 mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {[...Array(4)].map((_, i) => {
                    const strength = Math.min(Math.floor(password.length / 3), 4);
                    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
                    return (
                      <motion.div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i < strength ? colors[strength - 1] : "bg-muted"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: i * 0.05 }}
                      />
                    );
                  })}
                </motion.div>
              )}
            </motion.div>

            {/* Role */}
            <motion.div
              className="space-y-1.5 pb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.51 }}
            >
              <Label className="text-sm font-medium">I am looking to</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["jobseeker", "recruiter"] as const).map((r) => (
                  <motion.button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative p-3.5 rounded-xl border-2 text-left transition-all overflow-hidden ${
                      role === r
                        ? "border-primary bg-primary/8"
                        : "border-border/60 bg-muted/30 hover:border-border"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {role === r && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-500/10"
                        layoutId="roleHighlight"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold">
                          {r === "jobseeker" ? "Find a job" : "Hire talent"}
                        </span>
                        <motion.div
                          animate={{ scale: role === r ? 1 : 0, opacity: role === r ? 1 : 0 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                        >
                          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-white fill-none stroke-2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      </div>
                      <span className="text-xs text-muted-foreground leading-tight">
                        {r === "jobseeker" ? "Apply for opportunities" : "Recruit for your team"}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 }}
            >
              <MagneticButton className="w-full">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold relative overflow-hidden group bg-gradient-to-r from-primary via-primary to-emerald-600 border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:shadow-xl transition-all duration-300"
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
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Creating account...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="idle"
                        className="flex items-center gap-2 relative z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Get Started
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

          {/* Footer */}
          <motion.p
            className="text-center lg:text-left text-sm text-muted-foreground pt-3 border-t border-border/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-primary hover:underline underline-offset-2 transition-all"
            >
              Sign in here
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT PANEL — Visual / Value Prop
      ════════════════════════════════════════ */}
      <div className="hidden lg:flex w-[48%] relative items-center justify-center p-12 overflow-hidden border-l border-border/30">
        {/* Dark panel base */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

        <GridLines />

        {/* Orbiting Rings behind content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <OrbitingRing radius={180} duration={20} color="#10b981" />
          <OrbitingRing radius={240} duration={28} color="hsl(var(--primary))" dotSize={8} />
          <OrbitingRing radius={310} duration={38} color="#8b5cf6" dotSize={5} />
        </div>

        <motion.div
          className="relative z-10 max-w-[460px] w-full space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
            animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary)/0)", "0 0 0 8px hsl(var(--primary)/0.05)", "0 0 0 0 hsl(var(--primary)/0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Your next chapter</span>
          </motion.div>

          {/* Headline */}
          <div>
            <h2 className="font-display text-4xl leading-[1.15] font-bold mb-3">
              A better way to{" "}
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                navigate
              </span>{" "}
              your career.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Thousands of professionals find their perfect match every month.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <StatCounter value="50K+" label="Active Users" icon={<Users className="h-4 w-4" />} />
            <StatCounter value="4.9★" label="User Rating" icon={<Star className="h-4 w-4" />} />
            <StatCounter value="92%" label="Hire Rate" icon={<TrendingUp className="h-4 w-4" />} />
          </div>

          {/* Benefit cards */}
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                className="group flex gap-4 p-4 rounded-2xl bg-background/30 backdrop-blur-md border border-white/8 hover:border-white/20 transition-all duration-300 cursor-default"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12 }}
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <div className={`flex-shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-br ${b.color} shadow-lg ${b.glow} flex items-center justify-center text-white`}>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {b.icon}
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
                <motion.div
                  className="flex-shrink-0 text-muted-foreground/30 group-hover:text-primary/50 mt-3 transition-colors"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Social proof avatars */}
          <motion.div
            className="flex items-center gap-3 p-4 rounded-2xl bg-background/20 backdrop-blur-sm border border-white/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex -space-x-2.5">
              {["bg-gradient-to-br from-pink-400 to-rose-600",
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
              <p className="text-xs font-semibold text-foreground">Joined this week</p>
              <p className="text-xs text-muted-foreground">+2,400 new members</p>
            </div>
            <div className="ml-auto">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}