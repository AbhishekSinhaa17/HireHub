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
  ShieldAlert,
  User,
  Briefcase,
  Activity,
  Users,
  Search,
  TrendingUp,
  Crown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect as useEffectRef, useRef } from "react";

type AppRole = "admin" | "recruiter" | "jobseeker";

interface CombinedUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: AppRole;
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
    "bg-primary/30",
    "bg-violet-400/30",
    "bg-emerald-400/20",
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
   Animated Grid Lines
───────────────────────────────────────────────────────────── */
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/8 to-transparent"
          style={{ left: `${(i + 1) * (100 / 9)}%` }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/8 to-transparent"
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
  color,
  delay = 0,
}: {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative rounded-2xl bg-background/40 backdrop-blur-xl border border-white/10 p-5 overflow-hidden group"
    >
      {/* Hover glow */}
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${color} blur-2xl`}
      />
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100"
        animate={{ x: ["-200%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        style={{ skewX: "-20deg" }}
      />
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${color.replace("bg-", "from-").split(" ")[0]} to-transparent border border-white/10 flex items-center justify-center`}>
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
   Role Badge
───────────────────────────────────────────────────────────── */
function RoleBadge({ role }: { role: AppRole }) {
  const config = {
    admin: {
      className: "bg-primary/15 text-primary border-primary/30 shadow-sm shadow-primary/20",
      icon: <ShieldAlert className="w-3 h-3 mr-1" />,
      label: "Admin",
    },
    recruiter: {
      className: "bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-sm shadow-blue-500/20",
      icon: <Briefcase className="w-3 h-3 mr-1" />,
      label: "Recruiter",
    },
    jobseeker: {
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/20",
      icon: <User className="w-3 h-3 mr-1" />,
      label: "Seeker",
    },
  };
  const { className, icon, label } = config[role];
  return (
    <Badge variant="outline" className={`inline-flex items-center font-semibold border ${className}`}>
      {icon}
      {label}
    </Badge>
  );
}

/* ─────────────────────────────────────────────────────────────
   Avatar
───────────────────────────────────────────────────────────── */
function UserAvatar({ name, role }: { name: string; role: AppRole }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const gradients: Record<AppRole, string> = {
    admin: "from-primary to-violet-600",
    recruiter: "from-blue-500 to-indigo-600",
    jobseeker: "from-emerald-500 to-teal-600",
  };

  return (
    <div
      className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradients[role]} flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0`}
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
      {[...Array(5)].map((_, i) => (
        <TableCell key={i}>
          <motion.div
            className="h-4 rounded-full bg-muted/40"
            style={{ width: `${[70, 80, 40, 50, 20][i]}%` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        </TableCell>
      ))}
    </motion.tr>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
export default function AdminUsers() {
  const [users, setUsers] = useState<CombinedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Cursor tracking
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(cursorY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const fetchUsers = async () => {
    try {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const rolesMap = new Map();
      rolesRes.data.forEach((r) => rolesMap.set(r.user_id, r.role));

      const combined: CombinedUser[] = profilesRes.data.map((p) => ({
        id: p.id,
        user_id: p.user_id,
        full_name: p.full_name,
        email: p.email,
        created_at: p.created_at,
        role: rolesMap.get(p.user_id) || "jobseeker",
      }));

      setUsers(combined);
    } catch (error: any) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    setUpdatingId(userId);
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );
      toast({ title: "Role updated", description: `User role changed to ${newRole}.` });
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    recruiters: users.filter((u) => u.role === "recruiter").length,
    seekers: users.filter((u) => u.role === "jobseeker").length,
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
          background: "radial-gradient(circle, hsl(var(--primary)/0.05) 0%, transparent 70%)",
          x: useTransform(smoothX, (v) => v - 350),
          y: useTransform(smoothY, (v) => v - 350),
        }}
      />

      {/* ── Ambient Orbs ── */}
      <motion.div
        className="absolute top-[-150px] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => <Particle key={i} index={i} />)}
      </div>

      <GridLines />

      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 relative z-10">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Activity className="h-3.5 w-3.5 text-primary" />
            </motion.div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Admin Controls
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2 leading-tight">
            User{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Management
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary to-violet-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{ originX: 0 }}
              />
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            View, modify roles, and oversee all platform access in one place.
          </p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={stats.total}
            label="Total Users"
            icon={<Users className="h-4 w-4 text-primary" />}
            color="bg-primary/10"
            delay={0.1}
          />
          <StatCard
            value={stats.admins}
            label="Admins"
            icon={<Crown className="h-4 w-4 text-violet-400" />}
            color="bg-violet-500/10"
            delay={0.17}
          />
          <StatCard
            value={stats.recruiters}
            label="Recruiters"
            icon={<Briefcase className="h-4 w-4 text-blue-400" />}
            color="bg-blue-500/10"
            delay={0.24}
          />
          <StatCard
            value={stats.seekers}
            label="Job Seekers"
            icon={<User className="h-4 w-4 text-emerald-400" />}
            color="bg-emerald-500/10"
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
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-white/8">
            <div>
              <h2 className="font-semibold text-sm">All Users</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filtered.length} of {users.length} users
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/40 via-violet-500/40 to-primary/40 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-9 h-9 text-sm bg-muted/40 border-border/60 focus:bg-background focus-visible:ring-0 focus-visible:border-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/8 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-5">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Joined
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right pr-5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    [...Array(5)].map((_, i) => <SkeletonRow key={i} index={i} />)
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center py-16 gap-3"
                        >
                          <div className="h-14 w-14 rounded-2xl bg-muted/40 flex items-center justify-center">
                            <Users className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {search ? "No users match your search." : "No users found."}
                          </p>
                          {search && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearch("")}
                              className="text-primary hover:text-primary/80"
                            >
                              Clear search
                            </Button>
                          )}
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((user, idx) => (
                      <motion.tr
                        key={user.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className="border-white/5 hover:bg-white/4 transition-colors group relative"
                      >
                        {/* Hover left accent */}
                        <TableCell className="pl-5">
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={updatingId === user.user_id ? { rotate: 360 } : {}}
                              transition={{ duration: 0.8, repeat: updatingId === user.user_id ? Infinity : 0, ease: "linear" }}
                            >
                              <UserAvatar name={user.full_name || "?"} role={user.role} />
                            </motion.div>
                            <span className="font-medium text-sm">{user.full_name}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground text-sm">
                          {user.email}
                        </TableCell>

                        <TableCell>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={user.role}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <RoleBadge role={user.role} />
                            </motion.div>
                          </AnimatePresence>
                        </TableCell>

                        <TableCell className="text-muted-foreground text-sm">
                          <div className="flex flex-col">
                            <span>{new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right pr-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-primary/15 hover:text-primary transition-all duration-200"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 bg-background/95 backdrop-blur-xl border-white/10 shadow-xl rounded-xl p-1"
                            >
                              <div className="px-2 py-1.5 mb-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Change Role
                                </p>
                              </div>
                              <DropdownMenuSeparator className="bg-white/8 mb-1" />

                              {(["admin", "recruiter", "jobseeker"] as AppRole[]).map((r) => {
                                const icons: Record<AppRole, React.ReactNode> = {
                                  admin: <ShieldAlert className="h-3.5 w-3.5 text-primary" />,
                                  recruiter: <Briefcase className="h-3.5 w-3.5 text-blue-400" />,
                                  jobseeker: <User className="h-3.5 w-3.5 text-emerald-400" />,
                                };
                                const labels: Record<AppRole, string> = {
                                  admin: "Make Admin",
                                  recruiter: "Make Recruiter",
                                  jobseeker: "Make Seeker",
                                };
                                return (
                                  <DropdownMenuItem
                                    key={r}
                                    onClick={() => handleRoleChange(user.user_id, r)}
                                    disabled={user.role === r || updatingId === user.user_id}
                                    className={`flex items-center gap-2.5 rounded-lg text-sm cursor-pointer transition-colors mb-0.5 ${
                                      user.role === r
                                        ? "opacity-40 cursor-default"
                                        : "hover:bg-white/8"
                                    }`}
                                  >
                                    {icons[r]}
                                    <span>{labels[r]}</span>
                                    {user.role === r && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-auto w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
                                      >
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-white fill-none stroke-2">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                      </motion.div>
                                    )}
                                  </DropdownMenuItem>
                                );
                              })}
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

          {/* Table footer */}
          {!loading && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between px-5 py-3 border-t border-white/8 bg-muted/10"
            >
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> users
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