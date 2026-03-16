import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Users,
  Plus,
  Building2,
  TrendingUp,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUpRight,
  Globe,
  DollarSign,
  Tag,
  AlignLeft,
  GripVertical,
  Mail,
  FileText,
  Star,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   KANBAN PIPELINE — Types & Config
═══════════════════════════════════════════════════════════════ */
interface Application {
  id: string;
  status: string;
  created_at: string;
  cover_letter?: string;
  profiles?: {
    full_name?: string;
    email?: string;
    skills?: string[];
    resume_url?: string;
    user_id?: string;
  } | null;
}

const COLUMNS = [
  {
    key: "applied",
    label: "Applied",
    icon: Clock,
    gradient: "from-slate-500 to-slate-600",
    glowRgb: "100,116,139",
    lightBg: "bg-slate-500/8",
    border: "border-slate-500/20",
    dotColor: "bg-slate-400",
    accentText: "text-slate-400",
    countBg: "bg-slate-500/15 text-slate-400",
  },
  {
    key: "reviewed",
    label: "Reviewing",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-500",
    glowRgb: "245,158,11",
    lightBg: "bg-amber-500/8",
    border: "border-amber-500/20",
    dotColor: "bg-amber-400",
    accentText: "text-amber-400",
    countBg: "bg-amber-500/15 text-amber-400",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
    icon: Star,
    gradient: "from-blue-500 to-indigo-600",
    glowRgb: "59,130,246",
    lightBg: "bg-blue-500/8",
    border: "border-blue-500/20",
    dotColor: "bg-blue-400",
    accentText: "text-blue-400",
    countBg: "bg-blue-500/15 text-blue-400",
  },
  {
    key: "accepted",
    label: "Accepted",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-500",
    glowRgb: "16,185,129",
    lightBg: "bg-emerald-500/8",
    border: "border-emerald-500/20",
    dotColor: "bg-emerald-400",
    accentText: "text-emerald-400",
    countBg: "bg-emerald-500/15 text-emerald-400",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    gradient: "from-red-500 to-rose-600",
    glowRgb: "239,68,68",
    lightBg: "bg-red-500/8",
    border: "border-red-500/20",
    dotColor: "bg-red-400",
    accentText: "text-red-400",
    countBg: "bg-red-500/15 text-red-400",
  },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

/* ═══════════════════════════════════════════════════════════════
   KANBAN — Helpers
═══════════════════════════════════════════════════════════════ */
function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-sky-600",
];

function avatarGradient(name = "") {
  return AVATAR_GRADIENTS[name.length % AVATAR_GRADIENTS.length];
}

/* ═══════════════════════════════════════════════════════════════
   KANBAN — Application Card
═══════════════════════════════════════════════════════════════ */
function ApplicationCard({
  app,
  col,
  onStatusChange,
  index,
}: {
  app: Application;
  col: (typeof COLUMNS)[number];
  onStatusChange: (id: string, status: string) => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const name = app.profiles?.full_name || "Unknown Applicant";
  
  const handleMessageApplicant = async () => {
    if (!user || !app.profiles?.user_id) {
      toast({ title: "Error", description: "Could not find applicant details", variant: "destructive" });
      return;
    }

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .contains("participant_ids", [user.id, app.profiles.user_id])
      .maybeSingle();

    if (existing) {
      navigate("/chat");
      return;
    }

    // Create new conversation
    const { error } = await supabase
      .from("conversations")
      .insert({
        participant_ids: [user.id, app.profiles.user_id]
      });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Conversation started!" });
    navigate("/chat");
  };
  const email = app.profiles?.email || "";
  const skills = app.profiles?.skills?.slice(0, 3) || [];
  const hasResume = !!app.profiles?.resume_url;

  const transitions: Record<string, ColumnKey[]> = {
    applied: ["reviewed", "rejected"],
    reviewed: ["shortlisted", "rejected"],
    shortlisted: ["accepted", "rejected"],
    accepted: [],
    rejected: [],
  };
  const nextStatuses = transitions[app.status] ?? [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      className="group relative"
    >
      <div
        className={`relative rounded-2xl border bg-background/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 ${col.border} hover:border-opacity-60`}
      >
        {/* Top accent bar */}
        <motion.div
          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${col.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, rgba(${col.glowRgb},0.06) 0%, transparent 60%)`,
          }}
        />

        <div className="relative p-3.5">
          {/* Top Row */}
          <div className="flex items-start gap-2.5 mb-2.5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className={`h-9 w-9 rounded-xl bg-gradient-to-br ${avatarGradient(name)} flex items-center justify-center text-white text-xs font-bold shadow-md`}
              >
                {getInitials(name)}
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${col.dotColor} border-2 border-background shadow-sm`}
              />
            </div>

            {/* Name + email */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate leading-tight">
                {name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {email}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 transition-opacity">
              {/* Message */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageApplicant();
                }}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all shadow-sm"
                title="Message Applicant"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </motion.button>

              {/* Resume */}
              {hasResume && (
                <motion.a
                  href={app.profiles!.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all shadow-sm"
                  title="View Resume"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText className="h-3.5 w-3.5" />
                </motion.a>
              )}

              {/* Cover Letter Toggle */}
              {app.cover_letter && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((p) => !p);
                  }}
                  className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all shadow-sm border ${
                    expanded 
                      ? "text-white bg-primary border-primary" 
                      : "text-violet-500 bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20"
                  }`}
                  title="View Cover Letter"
                >
                  <Mail className="h-3.5 w-3.5" />
                </motion.button>
              )}

              {/* Dropdown for Status */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all border border-transparent hover:border-border">
                    <GripVertical className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-background/95 backdrop-blur-xl border-white/10 shadow-xl rounded-xl p-1"
                >
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Move to
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/8" />
                  {COLUMNS.filter(
                    (c) => c.key !== col.key && nextStatuses.includes(c.key)
                  ).map((c) => (
                    <DropdownMenuItem
                      key={c.key}
                      onClick={() => onStatusChange(app.id, c.key)}
                      className="flex items-center gap-2 rounded-lg text-sm cursor-pointer hover:bg-white/5"
                    >
                      <c.icon className={`h-3.5 w-3.5 ${c.accentText}`} />
                      {c.label}
                      <ArrowRight className="h-3 w-3 ml-auto opacity-40" />
                    </DropdownMenuItem>
                  ))}
                  {nextStatuses.length === 0 && (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      No further actions
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {skills.map((sk) => (
                <span
                  key={sk}
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${col.lightBg} ${col.accentText} border ${col.border}`}
                >
                  {sk}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp only */}
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeAgo(app.created_at)}
          </div>



          {/* Cover letter */}
          <AnimatePresence>
            {expanded && app.cover_letter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-2.5 pt-2.5 border-t border-white/8">
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-4">
                    {app.cover_letter}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick-move buttons */}
        {nextStatuses.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-2.5 bg-background/90 backdrop-blur-sm border-t border-white/8 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
            {nextStatuses.map((status) => {
              const targetCol = COLUMNS.find((c) => c.key === status)!;
              return (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onStatusChange(app.id, status)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold bg-gradient-to-r ${targetCol.gradient} text-white shadow-sm`}
                >
                  <targetCol.icon className="h-3 w-3" />
                  {targetCol.label}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KANBAN — Pipeline Column
═══════════════════════════════════════════════════════════════ */
function PipelineColumn({
  col,
  apps,
  onStatusChange,
  colIndex,
}: {
  col: (typeof COLUMNS)[number];
  apps: Application[];
  onStatusChange: (id: string, status: string) => void;
  colIndex: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: colIndex * 0.08, duration: 0.45 }}
      className="flex flex-col min-w-[220px] w-[220px] flex-shrink-0 rounded-2xl border border-white/8 bg-background/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div
            className={`h-7 w-7 rounded-lg bg-gradient-to-br ${col.gradient} flex items-center justify-center shadow-sm`}
            style={{ boxShadow: `0 2px 10px rgba(${col.glowRgb},0.3)` }}
          >
            <col.icon className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-xs font-bold text-foreground">{col.label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.countBg}`}>
          {apps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-muted/30 mx-3.5 relative overflow-hidden rounded-full">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${col.gradient} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: apps.length > 0 ? "100%" : "0%" }}
          transition={{ delay: colIndex * 0.1 + 0.3, duration: 0.6, ease: "easeOut" }}
          style={{ opacity: 0.6 }}
        />
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[120px] max-h-[440px]">
        <AnimatePresence mode="popLayout">
          {apps.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 gap-2"
            >
              <div
                className={`h-10 w-10 rounded-xl ${col.lightBg} border ${col.border} flex items-center justify-center`}
              >
                <col.icon className={`h-5 w-5 ${col.accentText} opacity-50`} />
              </div>
              <p className="text-[11px] text-muted-foreground/60 text-center leading-tight">
                No applicants here
              </p>
            </motion.div>
          ) : (
            apps.map((app, i) => (
              <ApplicationCard
                key={app.id}
                app={app}
                col={col}
                onStatusChange={onStatusChange}
                index={i}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KANBAN — Summary Bar
═══════════════════════════════════════════════════════════════ */
function SummaryBar({ applications }: { applications: Application[] }) {
  const total = applications.length;
  if (total === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 px-1 pb-3 border-b border-white/8 mb-1 flex-wrap"
    >
      <div className="flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">{total} total</span>
      </div>

      {/* Segmented bar */}
      <div className="flex-1 flex h-2 rounded-full overflow-hidden min-w-[80px] gap-px bg-muted/30">
        {COLUMNS.map((col) => {
          const count = applications.filter((a) => a.status === col.key).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <motion.div
              key={col.key}
              className={`h-full bg-gradient-to-r ${col.gradient}`}
              style={{ width: `${pct}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              title={`${col.label}: ${count}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {COLUMNS.map((col) => {
          const count = applications.filter((a) => a.status === col.key).length;
          if (count === 0) return null;
          return (
            <div key={col.key} className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />
              <span className="text-[11px] text-muted-foreground font-medium">
                {col.label} {count}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KANBAN — Empty State
═══════════════════════════════════════════════════════════════ */
function EmptyState({ jobSelected }: { jobSelected: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 gap-5 w-full"
    >
      <div className="relative">
        <motion.div
          className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-primary/20 border border-violet-500/20 flex items-center justify-center"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {jobSelected ? (
            <Users className="h-9 w-9 text-violet-400/60" />
          ) : (
            <Zap className="h-9 w-9 text-primary/60" />
          )}
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute w-3 h-3 rounded-full bg-primary/60 shadow-sm shadow-primary/40"
            style={{ top: -4, left: "50%", transform: "translateX(-50%)" }}
          />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm text-foreground mb-1">
          {jobSelected ? "No applicants yet" : "Select a job to begin"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
          {jobSelected
            ? "Share your job posting to start receiving applications."
            : "Click any job from the list to view its hiring pipeline."}
        </p>
      </div>
      {!jobSelected && (
        <div className="flex items-center gap-1.5 text-xs text-primary/70 font-medium">
          <ChevronRight className="h-3.5 w-3.5" />
          Choose a job on the left
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KANBAN — Loading State
═══════════════════════════════════════════════════════════════ */
function PipelineLoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-16 w-full gap-4"
    >
      <div className="relative">
        <motion.div
          className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        </motion.div>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Loading pipeline</p>
        <div className="flex gap-1 mt-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/50"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KANBAN — Main Pipeline Component
═══════════════════════════════════════════════════════════════ */
function KanbanPipeline({
  applications,
  onStatusChange,
  jobSelected,
  isLoading,
}: {
  applications: Application[];
  onStatusChange: (appId: string, status: string) => void;
  jobSelected: boolean;
  isLoading: boolean;
}) {
  const showEmpty = !isLoading && (!jobSelected || applications.length === 0);
  const showPipeline = !isLoading && jobSelected && applications.length > 0;
  const appsByStatus = (status: string) =>
    applications.filter((a) => a.status === status);

  return (
    <div className="flex flex-col gap-3 w-full">
      {showPipeline && <SummaryBar applications={applications} />}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" exit={{ opacity: 0 }}>
            <PipelineLoadingState />
          </motion.div>
        ) : showEmpty ? (
          <motion.div key="empty" exit={{ opacity: 0 }}>
            <EmptyState jobSelected={jobSelected} />
          </motion.div>
        ) : (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1"
            style={{ scrollbarWidth: "thin" }}
          >
            {COLUMNS.map((col, i) => (
              <PipelineColumn
                key={col.key}
                col={col}
                apps={appsByStatus(col.key)}
                onStatusChange={onStatusChange}
                colIndex={i}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RECRUITER DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [uniqueApplicants, setUniqueApplicants] = useState(0);
  const [allApplicants, setAllApplicants] = useState<
    { id: string; full_name: string; email: string }[]
  >([]);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [statsModal, setStatsModal] = useState<string | null>(null);
  const [jobModal, setJobModal] = useState<any | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    company_id: "",
    location: "",
    job_type: "full-time",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    skills: "",
  });

  const [companyForm, setCompanyForm] = useState({
    name: "",
    description: "",
    location: "",
    industry: "",
    size: "",
    website: "",
  });

  /* ── Data Fetching ── */
  const fetchData = async () => {
    if (!user) return;
    const [{ data: j }, { data: c }] = await Promise.all([
      supabase
        .from("jobs")
        .select("*, companies(name)")
        .eq("recruiter_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("companies").select("*").eq("owner_id", user.id),
    ]);
    setJobs(j || []);
    setCompanies(c || []);

    if (j && j.length > 0) {
      const jobIds = j.map((job: any) => job.id);
      const { data: appRows } = await supabase
        .from("applications")
        .select("applicant_id")
        .in("job_id", jobIds);
      const uniqueIds = [
        ...new Set((appRows || []).map((a: any) => a.applicant_id)),
      ];
      setUniqueApplicants(uniqueIds.length);

      if (uniqueIds.length > 0) {
        const { data: profileRows } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", uniqueIds);
        setAllApplicants(
          (profileRows || []).map((p: any) => ({
            id: p.user_id,
            full_name: p.full_name || "Unknown",
            email: p.email || "",
          }))
        );
      } else {
        setAllApplicants([]);
      }
    } else {
      setUniqueApplicants(0);
      setAllApplicants([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  useEffect(() => {
    if (!selectedJob || !user) { setApplications([]); return; }
    const fetchApps = async () => {
      setAppsLoading(true);
      const { data: appData, error } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", selectedJob)
        .order("created_at", { ascending: false });

      if (error || !appData) { setApplications([]); setAppsLoading(false); return; }

      if (appData.length > 0) {
        const applicantIds = appData.map((a) => a.applicant_id);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_id, full_name, email, skills, resume_url")
          .in("user_id", applicantIds);

        const profileMap: Record<string, any> = {};
        (profileData || []).forEach((p) => { profileMap[p.user_id] = p; });

        setApplications(
          appData.map((app) => ({
            ...app,
            profiles: profileMap[app.applicant_id] ?? null,
          }))
        );
      } else {
        setApplications([]);
      }
      setAppsLoading(false);
    };
    fetchApps();
  }, [selectedJob, user]);

  /* ── Actions ── */
  const createCompany = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("companies")
      .insert({ ...companyForm, owner_id: user.id });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Company created!" });
    setShowCompanyDialog(false);
    setCompanyForm({ name: "", description: "", location: "", industry: "", size: "", website: "" });
    fetchData();
  };

  const createJob = async () => {
    if (!user || !jobForm.company_id) return;
    const jobData = {
      title: jobForm.title,
      description: jobForm.description,
      company_id: jobForm.company_id,
      recruiter_id: user.id,
      location: jobForm.location || null,
      job_type: jobForm.job_type,
      experience_level: jobForm.experience_level || null,
      salary_min: jobForm.salary_min ? parseInt(jobForm.salary_min) : null,
      salary_max: jobForm.salary_max ? parseInt(jobForm.salary_max) : null,
      skills_required: jobForm.skills
        ? jobForm.skills.split(",").map((s) => s.trim())
        : null,
    };

    let error;
    if (editingJobId) {
      const res = await supabase.from("jobs").update(jobData).eq("id", editingJobId);
      error = res.error;
    } else {
      const res = await supabase.from("jobs").insert(jobData);
      error = res.error;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingJobId ? "Job updated!" : "Job posted!" });
    setEditingJobId(null);
    setShowJobDialog(false);
    setJobForm({
      title: "", description: "", company_id: "", location: "",
      job_type: "full-time", experience_level: "", salary_min: "", salary_max: "", skills: "",
    });
    fetchData();
  };

  const updateStatus = async (appId: string, status: string) => {
    await supabase.from("applications").update({ status: status as any }).eq("id", appId);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    toast({ title: `Status updated to ${status}` });
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Job deleted" });
    setJobModal(null);
    fetchData();
  };

  const editJob = (job: any) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title || "",
      description: job.description || "",
      company_id: job.company_id || "",
      location: job.location || "",
      job_type: job.job_type || "full-time",
      experience_level: job.experience_level || "",
      salary_min: job.salary_min?.toString() || "",
      salary_max: job.salary_max?.toString() || "",
      skills: job.skills_required?.join(", ") || "",
    });
    setShowJobDialog(true);
    setJobModal(null);
  };

  /* ── Stat Cards Config ── */
  const statCards = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: jobs.filter((j) => j.is_active).length,
      key: "jobs",
      gradient: "from-blue-500 to-cyan-500",
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "hover:border-blue-500/40",
      description: "Currently hiring",
    },
    {
      icon: Users,
      label: "Total Applicants",
      value: uniqueApplicants,
      key: "applicants",
      gradient: "from-violet-500 to-purple-500",
      bg: "from-violet-500/10 to-purple-500/10",
      border: "hover:border-violet-500/40",
      description: "Unique candidates",
    },
    {
      icon: Building2,
      label: "Companies",
      value: companies.length,
      key: "companies",
      gradient: "from-emerald-500 to-green-500",
      bg: "from-emerald-500/10 to-green-500/10",
      border: "hover:border-emerald-500/40",
      description: "Under management",
    },
  ];

  const selectedJobData = jobs.find((j) => j.id === selectedJob);

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[250px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[150px] bg-violet-500/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="container mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Recruiter Dashboard
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Hiring Command Center
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage jobs, track applicants, and streamline your hiring pipeline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Add Company Dialog */}
              <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-border hover:border-primary/40 font-semibold text-sm gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl border-border p-0 overflow-hidden">
                  <div className="bg-gradient-to-br from-primary/10 to-transparent px-6 pt-6 pb-5 border-b border-border">
                    <DialogHeader>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <DialogTitle className="font-display text-xl">
                          Add Company
                        </DialogTitle>
                      </div>
                    </DialogHeader>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: "Company Name*", field: "name", placeholder: "Acme Corp", icon: Building2 },
                      { label: "Industry", field: "industry", placeholder: "Technology", icon: Tag },
                      { label: "Location", field: "location", placeholder: "Bangalore, India", icon: MapPin },
                      { label: "Size", field: "size", placeholder: "50-200 employees", icon: Users },
                      { label: "Website", field: "website", placeholder: "https://acme.com", icon: Globe },
                    ].map(({ label, field, placeholder, icon: Icon }) => (
                      <div key={field} className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </Label>
                        <Input
                          value={(companyForm as any)[field]}
                          onChange={(e) =>
                            setCompanyForm({ ...companyForm, [field]: e.target.value })
                          }
                          placeholder={placeholder}
                          className="h-11 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                        />
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <AlignLeft className="h-3.5 w-3.5" /> Description
                      </Label>
                      <Textarea
                        value={companyForm.description}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, description: e.target.value })
                        }
                        className="rounded-xl bg-muted/30 border-border focus:bg-background resize-none transition-colors"
                        rows={3}
                      />
                    </div>
                    <Button
                      className="w-full h-11 rounded-xl font-semibold mt-2"
                      onClick={createCompany}
                      disabled={!companyForm.name}
                    >
                      Create Company
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Post Job Dialog */}
              <Dialog
                open={showJobDialog}
                onOpenChange={(open) => {
                  setShowJobDialog(open);
                  if (!open) {
                    setEditingJobId(null);
                    setJobForm({
                      title: "", description: "", company_id: "", location: "",
                      job_type: "full-time", experience_level: "", salary_min: "", salary_max: "", skills: "",
                    });
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="h-10 rounded-xl font-semibold text-sm gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    Post Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-border p-0">
                  <div className="bg-gradient-to-br from-primary/10 to-transparent px-6 pt-6 pb-5 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    <DialogHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <DialogTitle className="font-display text-xl">
                          {editingJobId ? "Edit Job" : "Post a Job"}
                        </DialogTitle>
                      </div>
                    </DialogHeader>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Company */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> Company*
                      </Label>
                      <Select
                        value={jobForm.company_id}
                        onValueChange={(v) => setJobForm({ ...jobForm, company_id: v })}
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {companies.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {companies.length === 0 && (
                        <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                          ⚠️ Create a company first before posting a job
                        </p>
                      )}
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" /> Job Title*
                      </Label>
                      <Input
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        placeholder="Senior Frontend Engineer"
                        className="h-11 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <AlignLeft className="h-3.5 w-3.5" /> Description*
                      </Label>
                      <Textarea
                        rows={4}
                        value={jobForm.description}
                        onChange={(e) =>
                          setJobForm({ ...jobForm, description: e.target.value })
                        }
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className="rounded-xl bg-muted/30 border-border focus:bg-background resize-none transition-colors"
                      />
                    </div>

                    {/* Location + Job Type */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> Location
                        </Label>
                        <Input
                          value={jobForm.location}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, location: e.target.value })
                          }
                          placeholder="Bangalore / Remote"
                          className="h-11 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> Job Type
                        </Label>
                        <Select
                          value={jobForm.job_type}
                          onValueChange={(v) => setJobForm({ ...jobForm, job_type: v })}
                        >
                          <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {["full-time", "part-time", "contract", "remote", "internship"].map(
                              (t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" /> Min Salary
                        </Label>
                        <Input
                          type="number"
                          value={jobForm.salary_min}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, salary_min: e.target.value })
                          }
                          placeholder="500000"
                          className="h-11 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5" /> Max Salary
                        </Label>
                        <Input
                          type="number"
                          value={jobForm.salary_max}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, salary_max: e.target.value })
                          }
                          placeholder="1200000"
                          className="h-11 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" /> Skills Required
                      </Label>
                      <Input
                        placeholder="React, TypeScript, Node.js, SQL"
                        value={jobForm.skills}
                        onChange={(e) =>
                          setJobForm({ ...jobForm, skills: e.target.value })
                        }
                        className="h-11 rounded-xl bg-muted/30 border-border focus:bg-background transition-colors"
                      />
                      {jobForm.skills && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {jobForm.skills
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 mt-2"
                      onClick={createJob}
                      disabled={!jobForm.title || !jobForm.description || !jobForm.company_id}
                    >
                      {editingJobId ? "Update Job" : "Post Job"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* ── Stat Cards ── */}
        <motion.div
          className="grid gap-4 md:grid-cols-3"
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
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setStatsModal(s.key)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 cursor-pointer transition-all duration-300 hover:shadow-xl ${s.border}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div
                className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 group-hover:opacity-20 blur-xl transition-opacity`}
              />
              <div className="relative z-10">
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-extrabold font-display text-foreground mb-0.5">
                  {s.value}
                </p>
                <p className="text-sm font-semibold text-foreground/80">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                <ArrowUpRight className="absolute top-0 right-0 h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* ── Jobs List ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm"
          >
            <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base">Your Jobs</h2>
                  <p className="text-xs text-muted-foreground">
                    {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground bg-background border border-border px-3 py-1.5 rounded-full">
                Click to view pipeline
              </span>
            </div>

            <div className="divide-y divide-border">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">No Jobs Posted Yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click "Post Job" to get started
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {jobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() =>
                        setSelectedJob(job.id === selectedJob ? null : job.id)
                      }
                      className={`group flex items-center justify-between px-5 py-4 cursor-pointer transition-all duration-200 ${
                        selectedJob === job.id
                          ? "bg-primary/5 border-l-2 border-l-primary"
                          : "hover:bg-muted/40 border-l-2 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm border transition-all duration-200 ${
                            selectedJob === job.id
                              ? "bg-primary/20 border-primary/30 text-primary"
                              : "bg-muted border-border text-muted-foreground group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary"
                          }`}
                        >
                          {(job.companies?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`font-semibold text-sm truncate transition-colors ${
                              selectedJob === job.id
                                ? "text-primary"
                                : "group-hover:text-primary"
                            }`}
                          >
                            {job.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground truncate">
                              {job.companies?.name}
                            </span>
                            {job.location && (
                              <>
                                <span className="text-muted-foreground/40">·</span>
                                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                  <MapPin className="h-2.5 w-2.5" />
                                  {job.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium bg-muted border border-border text-muted-foreground px-2 py-1 rounded-full">
                          <Users className="h-3 w-3" />
                          {job.applicant_count ?? 0}
                        </span>
                        <span className="hidden md:inline-flex text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full capitalize">
                          {job.job_type}
                        </span>
                        <button
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setJobModal(job);
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* ── Pipeline Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm"
          >
            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base">
                    Applications Pipeline
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedJobData
                      ? `${selectedJobData.title} · ${applications.length} applicant${
                          applications.length !== 1 ? "s" : ""
                        }`
                      : "Select a job to view pipeline"}
                  </p>
                </div>
              </div>
              {selectedJob && (
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-xs text-muted-foreground hover:text-foreground bg-background border border-border px-3 py-1.5 rounded-full transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Pipeline */}
            <div className="p-4">
              <KanbanPipeline
                applications={applications}
                onStatusChange={updateStatus}
                jobSelected={!!selectedJob}
                isLoading={appsLoading}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS MODAL
      ════════════════════════════════════════ */}
      <Dialog open={statsModal !== null} onOpenChange={() => setStatsModal(null)}>
        <DialogContent className="max-w-lg rounded-3xl border-border p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 to-transparent px-6 pt-6 pb-5 border-b border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {statsModal === "jobs" && "Active Jobs"}
                {statsModal === "applicants" && "All Applicants"}
                {statsModal === "companies" && "Your Companies"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {statsModal === "jobs" && `${jobs.length} jobs total`}
                {statsModal === "applicants" &&
                  `${allApplicants.length} unique candidates`}
                {statsModal === "companies" && `${companies.length} companies`}
              </p>
            </DialogHeader>
          </div>

          <div className="px-6 py-4 space-y-3 max-h-[380px] overflow-y-auto">
            {statsModal === "jobs" &&
              (jobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No jobs posted yet.
                </p>
              ) : (
                jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-500 font-bold text-sm border border-blue-500/20">
                        {(job.companies?.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.companies?.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full capitalize">
                      {job.job_type}
                    </span>
                  </motion.div>
                ))
              ))}

            {statsModal === "applicants" &&
              (allApplicants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No applicants yet.
                </p>
              ) : (
                allApplicants.map((person, i) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-violet-500 font-bold text-sm border border-violet-500/20">
                      {(person.full_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{person.full_name}</p>
                      <p className="text-xs text-muted-foreground">{person.email}</p>
                    </div>
                  </motion.div>
                ))
              ))}

            {statsModal === "companies" &&
              (companies.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No companies added yet.
                </p>
              ) : (
                companies.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center text-emerald-500 font-bold text-sm border border-emerald-500/20">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.industry && `${c.industry} · `}
                        {c.location || "No location"}
                      </p>
                    </div>
                  </motion.div>
                ))
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════
          JOB DETAIL MODAL
      ════════════════════════════════════════ */}
      <Dialog open={jobModal !== null} onOpenChange={() => setJobModal(null)}>
        <DialogContent className="max-w-md rounded-3xl border-border p-0 overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent px-6 pt-6 pb-5 border-b border-border">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <DialogHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {(jobModal?.companies?.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {jobModal?.companies?.name}
                  </p>
                  <DialogTitle className="font-display text-lg leading-tight">
                    {jobModal?.title}
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>
          </div>

          {jobModal && (
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Location",
                    value: jobModal.location || "Not specified",
                    icon: MapPin,
                    color: "text-amber-500",
                    bg: "bg-amber-500/10",
                  },
                  {
                    label: "Job Type",
                    value: jobModal.job_type,
                    icon: Clock,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="rounded-2xl border border-border bg-muted/30 p-3">
                    <div
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${bg} mb-2`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${color}`} />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="font-semibold text-sm capitalize">{value}</p>
                  </div>
                ))}
              </div>

              {(jobModal.salary_min || jobModal.salary_max) && (
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                    Salary Range
                  </p>
                  <p className="font-bold text-base text-emerald-500">
                    ₹{jobModal.salary_min?.toLocaleString()} —{" "}
                    ₹{jobModal.salary_max?.toLocaleString()}
                  </p>
                </div>
              )}

              {jobModal.description && (
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {jobModal.description}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl font-semibold gap-2"
                  onClick={() => editJob(jobModal)}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 h-11 rounded-xl font-semibold gap-2"
                  onClick={() => deleteJob(jobModal.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}