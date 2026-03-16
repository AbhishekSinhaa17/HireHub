import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  TrendingUp,
  FileText,
  User,
  Briefcase,
  Calendar,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

type ApplicationStatus = "applied" | "shortlisted" | "interview" | "offer" | "hired" | "rejected";

interface CombinedApplication {
  id: string;
  applicant_id: string;
  job_id: string;
  status: ApplicationStatus;
  created_at: string;
  resume_url: string | null;
  cover_letter: string | null;
  job: {
    title: string;
    company_name: string;
  } | null;
  applicant: {
    full_name: string;
    email: string;
  } | null;
}

/* ─────────────────────────────────────────────────────────────
   Floating Particle
───────────────────────────────────────────────────────────── */
function Particle({ index }: { index: number }) {
  const size = Math.random() * 3 + 1;
  const duration = Math.random() * 18 + 10;
  const delay = Math.random() * 12;
  const x = Math.random() * 100;
  const colors = [
    "bg-emerald-400/30",
    "bg-teal-400/25",
    "bg-primary/30",
    "bg-cyan-400/20",
    "bg-blue-400/20",
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
   Animated Grid Lines
───────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/8 to-transparent"
          style={{ left: `${(i + 1) * (100 / 9)}%` }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/8 to-transparent"
          style={{ top: `${(i + 1) * (100 / 6)}%` }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────────────────────── */
function StatCard({
  value,
  label,
  icon,
  gradient,
  glowColor,
  delay = 0,
}: {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-5 overflow-hidden group cursor-default"
    >
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowColor} blur-2xl`}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100"
        animate={{ x: ["-200%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        style={{ skewX: "-20deg" }}
      />
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div
          className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
        >
          {icon}
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-muted-foreground/30"
        >
          <TrendingUp className="h-3 w-3" />
        </motion.div>
      </div>
      <div className="relative z-10">
        <p className="font-display text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   User Avatar
───────────────────────────────────────────────────────────── */
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600">
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Skeleton Row
───────────────────────────────────────────────────────────── */
function SkeletonRow({ index }: { index: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="border-white/5"
    >
      {[...Array(6)].map((_, i) => (
        <TableCell key={i}>
          <motion.div
            className="h-4 rounded-full bg-muted/40"
            style={{ width: `${[65, 50, 30, 25, 40, 15][i]}%` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        </TableCell>
      ))}
    </motion.tr>
  );
}

/* ─────────────────────────────────────────────────────────────
   Delete Confirm Dialog
───────────────────────────────────────────────────────────── */
function DeleteDialog({
  open,
  applicantName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  applicantName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="w-full max-w-sm rounded-2xl bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 mx-auto mb-4">
                  <Trash2 className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-center mb-1">
                  Delete Application?
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                  The application from <span className="font-semibold text-foreground">{applicantName}</span> will
                  be permanently removed.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 hover:bg-white/5"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/25"
                    onClick={onConfirm}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
export default function AdminApplications() {
  const [applications, setApplications] = useState<CombinedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CombinedApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | ApplicationStatus>("all");
  const { toast } = useToast();

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

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          applicant_id,
          job_id,
          status,
          created_at,
          resume_url,
          cover_letter,
          jobs (
            title,
            company_id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Extract unique applicant IDs and company IDs to batch fetch
      const applicantIds = Array.from(new Set(data?.map((a) => a.applicant_id) || []));
      const companyIds = Array.from(new Set(data?.map((a: any) => a.jobs?.company_id).filter(Boolean) || []));

      // Fetch all companies to map
      const { data: companies } = await supabase
        .from("companies")
        .select("id, name")
        .in("id", companyIds.length > 0 ? companyIds : ["dummy-id"]);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, resume_url")
        .in("user_id", applicantIds.length > 0 ? applicantIds : ["dummy-id"]);

      const combined: CombinedApplication[] = (data || []).map((app: any) => {
        const applicantProfile = profiles?.find((p) => p.user_id === app.applicant_id);
        const companyData = companies?.find((c) => c.id === app.jobs?.company_id);

        return {
          id: app.id,
          applicant_id: app.applicant_id,
          job_id: app.job_id,
          status: app.status || "applied",
          created_at: app.created_at,
          resume_url: applicantProfile?.resume_url || app.resume_url || null,
          cover_letter: app.cover_letter,
          job: app.jobs ? {
            title: app.jobs.title,
            company_name: companyData?.name || "Unknown Company"
          } : null,
          applicant: applicantProfile ? {
            full_name: applicantProfile.full_name || "Unknown Applicant",
            email: applicantProfile.email || "No Email"
          } : null,
        };
      });

      setApplications(combined);
    } catch (error: any) {
      toast({ title: "Failed to load applications", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const changeStatus = async (appId: string, newStatus: ApplicationStatus) => {
    setUpdatingId(appId);
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", appId);
      if (error) throw error;
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      toast({
        title: "Status updated",
        description: `Application is now marked as ${newStatus}.`,
      });
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("applications").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      toast({ title: "Application deleted", description: "The application has been permanently removed." });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  // Filtering
  const filtered = applications.filter((a) => {
    const searchLower = search.toLowerCase();
    const applicantName = a.applicant?.full_name?.toLowerCase() || "";
    const applicantEmail = a.applicant?.email?.toLowerCase() || "";
    const jobTitle = a.job?.title?.toLowerCase() || "";
    const companyName = a.job?.company_name?.toLowerCase() || "";

    const matchesSearch =
      applicantName.includes(searchLower) ||
      applicantEmail.includes(searchLower) ||
      jobTitle.includes(searchLower) ||
      companyName.includes(searchLower);

    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    hired: applications.filter((a) => a.status === "hired").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filterOptions: { key: "all" | ApplicationStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "applied", label: "Applied" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "interview", label: "Interview" },
    { key: "offer", label: "Offer" },
    { key: "hired", label: "Hired" },
    { key: "rejected", label: "Rejected" },
  ];

  const getStatusBadge = (status: ApplicationStatus) => {
    const config = {
      applied: {
        className: "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10",
        icon: <Clock className="w-3 h-3 mr-1" />,
        label: "Applied",
      },
      shortlisted: {
        className: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10",
        icon: <FileText className="w-3 h-3 mr-1" />,
        label: "Shortlisted",
      },
      interview: {
        className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/10",
        icon: <User className="w-3 h-3 mr-1" />,
        label: "Interview",
      },
      offer: {
        className: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 shadow-fuchsia-500/10",
        icon: <Briefcase className="w-3 h-3 mr-1" />,
        label: "Offer",
      },
      hired: {
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
        label: "Hired",
      },
      rejected: {
        className: "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10",
        icon: <XCircle className="w-3 h-3 mr-1" />,
        label: "Rejected",
      },
    };
    const { className, icon, label } = config[status] || config.applied;

    return (
      <Badge variant="outline" className={`font-medium border shadow-sm ${className}`}>
        {icon}
        {label}
      </Badge>
    );
  };

  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden flex flex-col"
      onMouseMove={(e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); }}
    >
      {/* ── Cursor Glow ── */}
      <motion.div
        className="fixed w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 350),
          y: useTransform(smoothY, (v) => v - 350),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-150px] left-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => <Particle key={i} index={i} />)}
      </div>

      <GridLines />

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        applicantName={deleteTarget?.applicant?.full_name ?? "Unknown"}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 relative z-10">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
            </motion.div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Application Moderation
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2 leading-tight">
            Review{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Applications
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{ originX: 0 }}
              />
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor, review, and manage job applications across the entire platform.
          </p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            value={stats.total}
            label="Total"
            icon={<FileText className="h-4 w-4 text-white" />}
            gradient="from-slate-500 to-zinc-600"
            glowColor="bg-slate-500/10"
            delay={0.1}
          />
          <StatCard
            value={stats.applied}
            label="Applied"
            icon={<Clock className="h-4 w-4 text-white" />}
            gradient="from-amber-500 to-orange-600"
            glowColor="bg-amber-500/10"
            delay={0.17}
          />
          <StatCard
            value={stats.shortlisted}
            label="Shortlist"
            icon={<FileText className="h-4 w-4 text-white" />}
            gradient="from-blue-500 to-cyan-600"
            glowColor="bg-blue-500/10"
            delay={0.24}
          />
          <StatCard
            value={stats.interview}
            label="Interview"
            icon={<User className="h-4 w-4 text-white" />}
            gradient="from-indigo-500 to-violet-600"
            glowColor="bg-indigo-500/10"
            delay={0.31}
          />
          <StatCard
            value={stats.hired}
            label="Hired"
            icon={<CheckCircle2 className="h-4 w-4 text-white" />}
            gradient="from-emerald-500 to-teal-600"
            glowColor="bg-emerald-500/10"
            delay={0.38}
          />
          <StatCard
            value={stats.rejected}
            label="Rejected"
            icon={<XCircle className="h-4 w-4 text-white" />}
            gradient="from-red-500 to-rose-600"
            glowColor="bg-red-500/10"
            delay={0.45}
          />
        </div>

        {/* ── Table Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-semibold text-sm">All Applications</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filtered.length} of {applications.length} applications
                </p>
              </div>
              {/* Status filter pills */}
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                {filterOptions.map((opt) => (
                  <motion.button
                    key={opt.key}
                    onClick={() => setFilterStatus(opt.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                      filterStatus === opt.key
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-transparent text-muted-foreground border-white/10 hover:border-white/20"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-emerald-500/40 via-teal-500/40 to-emerald-500/40 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search applicant or job..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-9 h-9 text-sm bg-muted/40 border-border/60 focus:bg-background focus-visible:ring-0 focus-visible:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  {["Applicant", "Job Applied For", "Status", "Date", "Review", "Actions"].map(
                    (h, i) => (
                      <TableHead
                        key={h}
                        className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider ${
                          i === 0 ? "pl-5" : ""
                        } ${i === 5 ? "text-right pr-5" : ""}`}
                      >
                        {h}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    [...Array(5)].map((_, i) => <SkeletonRow key={i} index={i} />)
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center py-16 gap-3"
                        >
                          <div className="h-14 w-14 rounded-2xl bg-muted/40 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {search ? "No applications match your search." : "No applications found."}
                          </p>
                          {search && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearch("")}
                              className="text-emerald-400 hover:text-emerald-300"
                            >
                              Clear search
                            </Button>
                          )}
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((app, idx) => (
                      <motion.tr
                        key={app.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className="border-white/5 hover:bg-white/4 transition-colors group"
                      >
                        {/* Applicant */}
                        <TableCell className="pl-5">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={app.applicant?.full_name || "?"} />
                            <div>
                              <p className="font-semibold text-sm leading-tight">
                                {app.applicant?.full_name || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {app.applicant?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Job */}
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-foreground/90">{app.job?.title || "Unknown Job"}</span>
                            <span className="text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {app.job?.company_name || ""}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={app.status}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              {getStatusBadge(app.status)}
                            </motion.div>
                          </AnimatePresence>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-muted-foreground text-sm">
                          <div className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                            {new Date(app.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>

                        {/* Review Assets */}
                        <TableCell>
                          {app.resume_url ? (
                             <motion.a
                             href={app.resume_url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
                             whileHover={{ scale: 1.04 }}
                             whileTap={{ scale: 0.97 }}
                           >
                             <FileText className="w-3 h-3" />
                             Resume
                             <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                           </motion.a>
                          ): (
                            <span className="text-xs text-muted-foreground/50 italic">No Resume</span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right pr-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-emerald-500/15 hover:text-emerald-400 transition-all duration-200"
                                disabled={updatingId === app.id}
                              >
                                <span className="sr-only">Open menu</span>
                                {updatingId === app.id ? (
                                  <motion.div
                                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                  />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 bg-background/95 backdrop-blur-xl border-white/10 shadow-xl rounded-xl p-1"
                            >
                              <div className="px-2 py-1.5 mb-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Mark Status As
                                </p>
                              </div>
                              <DropdownMenuSeparator className="bg-white/8 mb-1" />

                              {(["applied", "shortlisted", "interview", "offer", "hired", "rejected"] as ApplicationStatus[]).map((s) => {
                                const icons = {
                                  applied: <Clock className="h-3.5 w-3.5 text-amber-500" />,
                                  shortlisted: <FileText className="h-3.5 w-3.5 text-blue-400" />,
                                  interview: <User className="h-3.5 w-3.5 text-indigo-400" />,
                                  offer: <Briefcase className="h-3.5 w-3.5 text-fuchsia-400" />,
                                  hired: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
                                  rejected: <XCircle className="h-3.5 w-3.5 text-red-500" />,
                                };
                                return (
                                  <DropdownMenuItem
                                    key={s}
                                    onClick={() => changeStatus(app.id, s)}
                                    disabled={app.status === s || updatingId === app.id}
                                    className={`flex items-center gap-2.5 rounded-lg text-sm cursor-pointer mb-0.5 ${
                                      app.status === s ? "opacity-40 cursor-default" : "hover:bg-white/8"
                                    }`}
                                  >
                                    {icons[s]}
                                    <span className="capitalize">{s}</span>
                                    {app.status === s && (
                                       <motion.div
                                       initial={{ scale: 0 }}
                                       animate={{ scale: 1 }}
                                       className="ml-auto w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center"
                                     >
                                       <CheckCircle2 className="w-3 h-3" />
                                     </motion.div>
                                    )}
                                  </DropdownMenuItem>
                                );
                              })}

                              <DropdownMenuSeparator className="bg-white/8 my-1" />

                              <DropdownMenuItem
                                onClick={() => setDeleteTarget(app)}
                                className="flex items-center gap-2.5 rounded-lg text-sm cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between px-5 py-3 border-t border-white/8 bg-muted/10"
            >
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">{filtered.length}</span> applications
              </p>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs text-muted-foreground">Live data</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
