import { useState, useEffect, useRef } from "react";
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
  Briefcase,
  Activity,
  Trash2,
  PowerOff,
  Power,
  Search,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface CombinedJob {
  id: string;
  title: string;
  company_name: string;
  is_active: boolean;
  applicant_count: number;
  created_at: string;
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
    "bg-blue-400/30",
    "bg-emerald-400/25",
    "bg-primary/30",
    "bg-cyan-400/20",
    "bg-violet-400/20",
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
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/8 to-transparent"
          style={{ left: `${(i + 1) * (100 / 9)}%` }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/8 to-transparent"
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
   Company Avatar
───────────────────────────────────────────────────────────── */
function CompanyAvatar({ name, isActive }: { name: string; isActive: boolean }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0 bg-gradient-to-br ${
        isActive ? "from-blue-500 to-indigo-600" : "from-muted-foreground/40 to-muted-foreground/20"
      }`}
    >
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
  jobTitle,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  jobTitle: string;
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
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 mx-auto mb-4">
                  <Trash2 className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-center mb-1">
                  Delete Job Posting?
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                  <span className="font-semibold text-foreground">"{jobTitle}"</span> will
                  be permanently removed and cannot be recovered.
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
export default function AdminJobs() {
  const [jobs, setJobs] = useState<CombinedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CombinedJob | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
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

  const fetchJobs = async () => {
    try {
      const [jobsRes, companiesRes] = await Promise.all([
        supabase.from("jobs").select("*").order("created_at", { ascending: false }),
        supabase.from("companies").select("id, name"),
      ]);
      if (jobsRes.error) throw jobsRes.error;
      if (companiesRes.error) throw companiesRes.error;

      const companiesMap = new Map();
      companiesRes.data.forEach((c) => companiesMap.set(c.id, c.name));

      const combined: CombinedJob[] = jobsRes.data.map((j) => ({
        id: j.id,
        title: j.title,
        company_name: companiesMap.get(j.company_id) || "Unknown Company",
        is_active: j.is_active,
        applicant_count: j.applicant_count,
        created_at: j.created_at,
      }));

      setJobs(combined);
    } catch (error: any) {
      toast({ title: "Failed to load jobs", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    setUpdatingId(jobId);
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ is_active: !currentStatus })
        .eq("id", jobId);
      if (error) throw error;
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_active: !currentStatus } : j))
      );
      toast({
        title: "Job updated",
        description: `Job is now ${!currentStatus ? "active" : "inactive"}.`,
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
      const { error } = await supabase.from("jobs").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast({ title: "Job deleted", description: "The job posting has been permanently removed." });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  // Filtering
  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && j.is_active) ||
      (filterStatus === "inactive" && !j.is_active);
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.is_active).length,
    inactive: jobs.filter((j) => !j.is_active).length,
    totalApplicants: jobs.reduce((sum, j) => sum + (j.applicant_count || 0), 0),
  };

  const filterOptions: { key: "all" | "active" | "inactive"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden flex flex-col"
      onMouseMove={(e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); }}
    >
      {/* ── Cursor Glow ── */}
      <motion.div
        className="fixed w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 350),
          y: useTransform(smoothY, (v) => v - 350),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-150px] left-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
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
        jobTitle={deleteTarget?.title ?? ""}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Briefcase className="h-3.5 w-3.5 text-blue-400" />
            </motion.div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Job Moderation
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2 leading-tight">
            Manage{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Postings
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-400 to-emerald-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{ originX: 0 }}
              />
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Review, deactivate, or remove job listings from the platform.
          </p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={stats.total}
            label="Total Listings"
            icon={<Briefcase className="h-4 w-4 text-white" />}
            gradient="from-blue-500 to-indigo-600"
            glowColor="bg-blue-500/10"
            delay={0.1}
          />
          <StatCard
            value={stats.active}
            label="Active Jobs"
            icon={<CheckCircle2 className="h-4 w-4 text-white" />}
            gradient="from-emerald-500 to-teal-600"
            glowColor="bg-emerald-500/10"
            delay={0.17}
          />
          <StatCard
            value={stats.inactive}
            label="Inactive Jobs"
            icon={<XCircle className="h-4 w-4 text-white" />}
            gradient="from-red-500 to-rose-600"
            glowColor="bg-red-500/10"
            delay={0.24}
          />
          <StatCard
            value={stats.totalApplicants}
            label="Total Applicants"
            icon={<Users className="h-4 w-4 text-white" />}
            gradient="from-violet-500 to-purple-600"
            glowColor="bg-violet-500/10"
            delay={0.31}
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
                <h2 className="font-semibold text-sm">All Job Postings</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filtered.length} of {jobs.length} listings
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
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
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
                    className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/40 via-emerald-500/40 to-blue-500/40 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-9 h-9 text-sm bg-muted/40 border-border/60 focus:bg-background focus-visible:ring-0 focus-visible:border-blue-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  {["Job Title", "Company", "Status", "Applicants", "Posted", "Actions"].map(
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
                            <Briefcase className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {search ? "No jobs match your search." : "No job postings found."}
                          </p>
                          {search && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearch("")}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Clear search
                            </Button>
                          )}
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((job, idx) => (
                      <motion.tr
                        key={job.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className="border-white/5 hover:bg-white/4 transition-colors group"
                      >
                        {/* Title */}
                        <TableCell className="pl-5">
                          <div className="flex items-center gap-3">
                            <CompanyAvatar name={job.company_name} isActive={job.is_active} />
                            <div>
                              <p className="font-semibold text-sm leading-tight">{job.title}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Company */}
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                            {job.company_name}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={String(job.is_active)}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              {job.is_active ? (
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-sm shadow-emerald-500/10 inline-flex items-center gap-1"
                                >
                                  <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                  Active
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="border-red-500/30 text-red-400 bg-red-500/10 shadow-sm shadow-red-500/10 inline-flex items-center gap-1"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                  Inactive
                                </Badge>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </TableCell>

                        {/* Applicants */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/50" />
                            <span className="text-sm font-semibold">{job.applicant_count}</span>
                            <span className="text-xs text-muted-foreground">applicants</span>
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(job.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right pr-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-blue-500/15 hover:text-blue-400 transition-all duration-200"
                                disabled={updatingId === job.id}
                              >
                                <span className="sr-only">Open menu</span>
                                {updatingId === job.id ? (
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
                              className="w-52 bg-background/95 backdrop-blur-xl border-white/10 shadow-xl rounded-xl p-1"
                            >
                              <div className="px-2 py-1.5 mb-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Job Actions
                                </p>
                              </div>
                              <DropdownMenuSeparator className="bg-white/8 mb-1" />

                              <DropdownMenuItem
                                onClick={() => toggleJobStatus(job.id, job.is_active)}
                                className={`flex items-center gap-2.5 rounded-lg text-sm cursor-pointer mb-0.5 ${
                                  job.is_active
                                    ? "hover:bg-orange-500/10 text-orange-400 focus:bg-orange-500/10 focus:text-orange-400"
                                    : "hover:bg-emerald-500/10 text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400"
                                }`}
                              >
                                {job.is_active ? (
                                  <>
                                    <PowerOff className="w-3.5 h-3.5" />
                                    Deactivate Job
                                  </>
                                ) : (
                                  <>
                                    <Power className="w-3.5 h-3.5" />
                                    Activate Job
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-white/8 my-1" />

                              <DropdownMenuItem
                                onClick={() => setDeleteTarget(job)}
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
                <span className="font-semibold text-foreground">{filtered.length}</span> listings
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