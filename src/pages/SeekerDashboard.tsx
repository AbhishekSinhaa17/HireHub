import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  TrendingUp,
  Calendar,
  Building2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsModal, setStatsModal] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(
    null
  );

  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      const { data } = await supabase
        .from("applications")
        .select("*, jobs(title, companies(name))")
        .eq("applicant_id", user.id)
        .order("created_at", { ascending: false });
      setApplications(data || []);
      setLoading(false);
    };
    fetchApplications();
  }, [user]);

  const stats = {
    total: applications.length,
    active: applications.filter(
      (a) => !["hired", "rejected"].includes(a.status)
    ).length,
    hired: applications.filter((a) => a.status === "hired").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const successRate =
    stats.total > 0 ? Math.round((stats.hired / stats.total) * 100) : 0;

  const getFilteredApps = () => {
    if (statsModal === "all") return applications;
    if (statsModal === "active")
      return applications.filter(
        (a) => !["hired", "rejected"].includes(a.status)
      );
    if (statsModal === "hired")
      return applications.filter((a) => a.status === "hired");
    if (statsModal === "rejected")
      return applications.filter((a) => a.status === "rejected");
    return [];
  };

  const filteredApps = getFilteredApps();

  const statCards = [
    {
      icon: FileText,
      label: "Total Applied",
      value: stats.total,
      key: "all",
      gradient: "from-blue-500 to-cyan-500",
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "hover:border-blue-500/40",
      glow: "group-hover:shadow-blue-500/20",
      description: "All time applications",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: stats.active,
      key: "active",
      gradient: "from-amber-500 to-orange-500",
      bg: "from-amber-500/10 to-orange-500/10",
      border: "hover:border-amber-500/40",
      glow: "group-hover:shadow-amber-500/20",
      description: "Awaiting response",
    },
    {
      icon: CheckCircle2,
      label: "Hired",
      value: stats.hired,
      key: "hired",
      gradient: "from-emerald-500 to-green-500",
      bg: "from-emerald-500/10 to-green-500/10",
      border: "hover:border-emerald-500/40",
      glow: "group-hover:shadow-emerald-500/20",
      description: "Successful placements",
    },
    {
      icon: XCircle,
      label: "Rejected",
      value: stats.rejected,
      key: "rejected",
      gradient: "from-rose-500 to-red-500",
      bg: "from-rose-500/10 to-red-500/10",
      border: "hover:border-rose-500/40",
      glow: "group-hover:shadow-rose-500/20",
      description: "Not selected",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border bg-card/30">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[150px] bg-violet-500/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="container mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            {/* Left: Title */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Job Seeker Dashboard
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                My Applications
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Track and manage all your job applications in one place.
              </p>
            </div>

            {/* Right: Success Rate Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl px-6 py-4 shadow-sm"
            >
              {/* Circular progress */}
              <div className="relative w-14 h-14">
                <svg
                  className="w-14 h-14 -rotate-90"
                  viewBox="0 0 56 56"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted/30"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="url(#successGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - successRate / 100)
                      }`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient
                      id="successGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{successRate}%</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-base">Success Rate</p>
                <p className="text-xs text-muted-foreground">
                  {stats.hired} hired of {stats.total} applied
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 font-medium">
                    Keep applying!
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Stats Cards */}
        <motion.div
          className="grid gap-4 grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {statCards.map((s) => (
            <motion.div
              key={s.key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setStatsModal(s.key)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 cursor-pointer transition-all duration-300 hover:shadow-xl ${s.border}`}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Corner glow */}
              <div
                className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <s.icon className="h-5 w-5" />
                </div>

                {/* Value */}
                <p className="text-3xl font-extrabold font-display text-foreground mb-0.5">
                  {s.value}
                </p>

                {/* Label */}
                <p className="text-sm font-semibold text-foreground/80">
                  {s.label}
                </p>

                {/* Description */}
                <p className="text-xs text-muted-foreground mt-1">
                  {s.description}
                </p>

                {/* Arrow */}
                <ArrowUpRight
                  className={`absolute top-0 right-0 h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Applications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Loading your applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet-500/5" />
            <div className="relative z-10">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                No Applications Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Start your journey by applying to jobs that match your skills
                and interests.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Browse Jobs <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm"
          >
            {/* Table Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="font-display text-lg font-bold">
                  Application History
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {applications.length} total application
                  {applications.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background border border-border px-3 py-1.5 rounded-full">
                <FileText className="h-3.5 w-3.5" />
                Click any row for details
              </div>
            </div>

            {/* Applications */}
            <div className="divide-y divide-border">
              <AnimatePresence>
                {applications.map((app, i) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedApplication(app)}
                    className="group flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/40 transition-all duration-200"
                  >
                    {/* Left: Job info */}
                    <div className="flex items-center gap-4">
                      {/* Company Avatar */}
                      <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-border text-primary font-bold text-sm group-hover:scale-105 transition-transform duration-200">
                        {(app.jobs?.companies?.name || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {app.jobs?.title || "Unknown Job"}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            {app.jobs?.companies?.name || "Unknown Company"}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(app.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status + Arrow */}
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 hidden sm:block" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Application Detail Modal ── */}
      <Dialog
        open={selectedApplication !== null}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-md rounded-3xl border-border p-0 overflow-hidden">
          {/* Modal Header with gradient */}
          <div className="relative bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent px-6 pt-6 pb-5 border-b border-border">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-border flex items-center justify-center text-primary font-bold text-sm">
                  {(
                    selectedApplication?.jobs?.companies?.name || "?"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {selectedApplication?.jobs?.companies?.name}
                  </p>
                  <DialogTitle className="font-display text-lg leading-tight">
                    {selectedApplication?.jobs?.title}
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Modal Body */}
          {selectedApplication && (
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Company
                  </p>
                  <p className="font-semibold text-sm">
                    {selectedApplication.jobs?.companies?.name}
                  </p>
                </div>

                <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Applied On
                  </p>
                  <p className="font-semibold text-sm">
                    {new Date(
                      selectedApplication.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  Application Status
                </p>
                <StatusBadge status={selectedApplication.status} />
              </div>

              {/* Status timeline */}
              <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                <p className="text-xs text-muted-foreground font-medium mb-3">
                  Progress
                </p>
                <div className="flex items-center gap-0">
                  {["applied", "reviewing", "interview", "hired"].map(
                    (step, i, arr) => {
                      const statusOrder = [
                        "applied",
                        "reviewing",
                        "interview",
                        "hired",
                      ];
                      const currentIndex = statusOrder.indexOf(
                        selectedApplication.status
                      );
                      const stepIndex = statusOrder.indexOf(step);
                      const isRejected =
                        selectedApplication.status === "rejected";
                      const isActive =
                        !isRejected && stepIndex <= currentIndex;

                      return (
                        <div
                          key={step}
                          className="flex items-center flex-1 last:flex-none"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors ${isRejected && step === "applied"
                                  ? "border-rose-500 bg-rose-500 text-white"
                                  : isActive
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-muted-foreground"
                                }`}
                            >
                              {isRejected && step === "applied" ? (
                                "✕"
                              ) : isActive ? (
                                "✓"
                              ) : (
                                i + 1
                              )}
                            </div>
                            <span className="text-[9px] text-muted-foreground capitalize whitespace-nowrap">
                              {step}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mb-4 mx-1 transition-colors ${!isRejected && stepIndex < currentIndex
                                  ? "bg-primary"
                                  : "bg-border"
                                }`}
                            />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Stats Modal ── */}
      <Dialog
        open={statsModal !== null}
        onOpenChange={() => setStatsModal(null)}
      >
        <DialogContent className="max-w-lg rounded-3xl border-border p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/10 to-transparent px-6 pt-6 pb-5 border-b border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {statsModal === "all" && "All Applications"}
                {statsModal === "active" && "Applications In Progress"}
                {statsModal === "hired" && "🎉 Hired Applications"}
                {statsModal === "rejected" && "Rejected Applications"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredApps.length} application
                {filteredApps.length !== 1 ? "s" : ""}
              </p>
            </DialogHeader>
          </div>

          {/* List */}
          <div className="px-6 py-4 space-y-3 max-h-[380px] overflow-y-auto">
            {filteredApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  No applications found.
                </p>
              </div>
            ) : (
              filteredApps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-primary font-bold text-sm border border-border">
                      {(app.jobs?.companies?.name || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {app.jobs?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.jobs?.companies?.name}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </motion.div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}