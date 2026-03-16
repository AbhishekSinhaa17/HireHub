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
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Building2,
  Trash2,
  Globe,
  Search,
  TrendingUp,
  MapPin,
  Factory,
  ExternalLink,
  LayoutGrid,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
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
    "bg-amber-400/30",
    "bg-primary/25",
    "bg-orange-400/20",
    "bg-yellow-400/20",
    "bg-emerald-400/15",
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
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/8 to-transparent"
          style={{ left: `${(i + 1) * (100 / 9)}%` }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/8 to-transparent"
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
   Company Logo Avatar
───────────────────────────────────────────────────────────── */
function CompanyAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Pick a gradient deterministically from name length
  const gradients = [
    "from-amber-500 to-orange-600",
    "from-primary to-violet-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-sky-600",
  ];
  const gradient = gradients[name.length % gradients.length];

  return (
    <div
      className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Industry Tag
───────────────────────────────────────────────────────────── */
function IndustryTag({ industry }: { industry: string }) {
  if (!industry || industry === "N/A") {
    return <span className="text-muted-foreground/50 text-sm">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
      <Factory className="h-3 w-3" />
      {industry}
    </span>
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
        <TableCell key={i} className={i === 0 ? "pl-5" : ""}>
          <motion.div
            className="h-4 rounded-full bg-muted/40"
            style={{ width: `${[65, 45, 40, 30, 35, 15][i]}%` }}
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
  companyName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  companyName: string;
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
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-2xl bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 mx-auto mb-4">
                  <Trash2 className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-center mb-1">
                  Delete Company?
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-2 leading-relaxed">
                  <span className="font-semibold text-foreground">"{companyName}"</span> and{" "}
                  <span className="text-red-400 font-medium">all associated job listings</span>{" "}
                  will be permanently removed.
                </p>
                <p className="text-xs text-muted-foreground/70 text-center mb-6">
                  This action cannot be undone.
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
export default function AdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
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

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCompanies(data as Company[]);
    } catch (error: any) {
      toast({
        title: "Failed to load companies",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", deleteTarget.id);
      if (error) throw error;
      setCompanies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast({
        title: "Company deleted",
        description: "The company has been removed from the platform.",
      });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  // Unique industries for filter pills
  const industries = [
    "all",
    ...Array.from(
      new Set(companies.map((c) => c.industry).filter(Boolean))
    ).slice(0, 4),
  ];

  // Filtered list
  const filtered = companies.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry =
      filterIndustry === "all" || c.industry === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  // Stats
  const uniqueIndustries = new Set(companies.map((c) => c.industry).filter(Boolean)).size;
  const uniqueLocations = new Set(companies.map((c) => c.location).filter(Boolean)).size;

  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden flex flex-col"
      onMouseMove={(e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); }}
    >
      {/* ── Cursor Glow ── */}
      <motion.div
        className="fixed w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 350),
          y: useTransform(smoothY, (v) => v - 350),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-150px] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.07) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      <GridLines />

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        companyName={deleteTarget?.name ?? ""}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
            </motion.div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Company Management
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2 leading-tight">
            Registered{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Companies
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{ originX: 0 }}
              />
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Oversee all companies actively recruiting on HireHub.
          </p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={companies.length}
            label="Total Companies"
            icon={<Building2 className="h-4 w-4 text-white" />}
            gradient="from-amber-500 to-orange-600"
            glowColor="bg-amber-500/10"
            delay={0.1}
          />
          <StatCard
            value={uniqueIndustries}
            label="Industries"
            icon={<Factory className="h-4 w-4 text-white" />}
            gradient="from-primary to-violet-600"
            glowColor="bg-primary/10"
            delay={0.17}
          />
          <StatCard
            value={uniqueLocations}
            label="Locations"
            icon={<MapPin className="h-4 w-4 text-white" />}
            gradient="from-emerald-500 to-teal-600"
            glowColor="bg-emerald-500/10"
            delay={0.24}
          />
          <StatCard
            value={companies.filter((c) => c.website).length}
            label="With Website"
            icon={<Globe className="h-4 w-4 text-white" />}
            gradient="from-blue-500 to-indigo-600"
            glowColor="bg-blue-500/10"
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
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <h2 className="font-semibold text-sm">All Companies</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filtered.length} of {companies.length} registered
                </p>
              </div>

              {/* Industry filter pills */}
              {!loading && industries.length > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                  {industries.map((ind) => (
                    <motion.button
                      key={ind}
                      onClick={() => setFilterIndustry(ind)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                        filterIndustry === ind
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-transparent text-muted-foreground border-white/10 hover:border-white/20"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {ind === "all" ? "All" : ind}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-amber-500/40 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-9 h-9 text-sm bg-muted/40 border-border/60 focus:bg-background focus-visible:ring-0 focus-visible:border-amber-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  {[
                    "Company",
                    "Industry",
                    "Location",
                    "Website",
                    "Registered",
                    "Actions",
                  ].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider ${
                        i === 0 ? "pl-5" : ""
                      } ${i === 5 ? "text-right pr-5" : ""}`}
                    >
                      {h}
                    </TableHead>
                  ))}
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
                            <Building2 className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {search
                              ? "No companies match your search."
                              : "No companies found."}
                          </p>
                          {search && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearch("")}
                              className="text-amber-400 hover:text-amber-300"
                            >
                              Clear search
                            </Button>
                          )}
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((company, idx) => (
                      <motion.tr
                        key={company.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className="border-white/5 hover:bg-white/4 transition-colors group"
                      >
                        {/* Company name + avatar */}
                        <TableCell className="pl-5">
                          <div className="flex items-center gap-3">
                            <CompanyAvatar name={company.name} />
                            <span className="font-semibold text-sm">
                              {company.name}
                            </span>
                          </div>
                        </TableCell>

                        {/* Industry */}
                        <TableCell>
                          <IndustryTag industry={company.industry || ""} />
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          {company.location ? (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" />
                              {company.location}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50 text-sm">—</span>
                          )}
                        </TableCell>

                        {/* Website */}
                        <TableCell>
                          {company.website ? (
                            <motion.a
                              href={
                                company.website.startsWith("http")
                                  ? company.website
                                  : `https://${company.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Globe className="w-3 h-3" />
                              Visit
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </motion.a>
                          ) : (
                            <span className="text-muted-foreground/50 text-sm">—</span>
                          )}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(company.created_at).toLocaleDateString("en-US", {
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
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-amber-500/15 hover:text-amber-400 transition-all duration-200"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-52 bg-background/95 backdrop-blur-xl border-white/10 shadow-xl rounded-xl p-1"
                            >
                              <div className="px-2 py-1.5 mb-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Company Actions
                                </p>
                              </div>
                              <DropdownMenuSeparator className="bg-white/8 mb-1" />

                              {company.website && (
                                <>
                                  <DropdownMenuItem
                                    asChild
                                    className="flex items-center gap-2.5 rounded-lg text-sm cursor-pointer hover:bg-blue-500/10 text-blue-400 focus:bg-blue-500/10 focus:text-blue-400 mb-0.5"
                                  >
                                    <a
                                      href={
                                        company.website.startsWith("http")
                                          ? company.website
                                          : `https://${company.website}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Globe className="w-3.5 h-3.5" />
                                      Visit Website
                                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                                    </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-white/8 my-1" />
                                </>
                              )}

                              <DropdownMenuItem
                                onClick={() => setDeleteTarget(company)}
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
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                companies
              </p>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
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