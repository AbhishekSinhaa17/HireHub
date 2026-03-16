import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Briefcase, ChevronLeft, ChevronRight, Calendar, MessageSquare } from "lucide-react";

type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

interface Application {
  id: string;
  status: ApplicationStatus;
  applicant_id?: string;
  cover_letter?: string;
  resume_url?: string;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
    skills?: string[];
    resume_url?: string;
  };
}

interface KanbanPipelineProps {
  applications: Application[];
  onStatusChange: (appId: string, status: string) => void;
  jobSelected: boolean;
  isLoading?: boolean;
}

const COLUMNS: {
  key: ApplicationStatus;
  label: string;
  dot: string;
  headerBg: string;
  countBg: string;
}[] = [
    { key: "applied", label: "Applied", dot: "bg-slate-400", headerBg: "bg-slate-50 dark:bg-slate-900", countBg: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200" },
    { key: "shortlisted", label: "Shortlisted", dot: "bg-violet-500", headerBg: "bg-violet-50 dark:bg-violet-950", countBg: "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300" },
    { key: "interview", label: "Interview", dot: "bg-amber-500", headerBg: "bg-amber-50 dark:bg-amber-950", countBg: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300" },
    { key: "offer", label: "Offer", dot: "bg-blue-500", headerBg: "bg-blue-50 dark:bg-blue-950", countBg: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" },
    { key: "hired", label: "Hired", dot: "bg-emerald-500", headerBg: "bg-emerald-50 dark:bg-emerald-950", countBg: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" },
    { key: "rejected", label: "Rejected", dot: "bg-red-500", headerBg: "bg-red-50 dark:bg-red-950", countBg: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" },
  ];

const STATUS_ORDER = COLUMNS.map((c) => c.key);

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-cyan-500",
];

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function KanbanPipeline({
  applications,
  onStatusChange,
  jobSelected,
  isLoading,
}: KanbanPipelineProps) {
  const [selected, setSelected] = useState<Application | null>(null);
  const [previewResume, setPreviewResume] = useState(false);
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleMessageApplicant = async (applicantId?: string) => {
    if (!applicantId) {
      toast({ title: "Error", description: "Applicant ID not found", variant: "destructive" });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }

    // Check if conversation already exists
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("id")
      .contains("participant_ids", [user.id, applicantId])
      .maybeSingle();

    if (fetchError) {
      toast({ title: "Error", description: fetchError.message, variant: "destructive" });
      return;
    }

    if (existing) {
      navigate("/chat");
      return;
    }

    // Create new conversation
    const { error: insertError } = await supabase
      .from("conversations")
      .insert({
        participant_ids: [user.id, applicantId]
      });

    if (insertError) {
      toast({ title: "Error", description: insertError.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Conversation started!" });
    navigate("/chat");
  };

  const grouped = COLUMNS.reduce(
    (acc, col) => {
      acc[col.key] = applications.filter((a) => a.status === col.key);
      return acc;
    },
    {} as Record<ApplicationStatus, Application[]>,
  );

  const moveLeft = (e: React.MouseEvent, app: Application) => {
    e.stopPropagation();
    const idx = STATUS_ORDER.indexOf(app.status);
    if (idx > 0) onStatusChange(app.id, STATUS_ORDER[idx - 1]);
  };

  const moveRight = (e: React.MouseEvent, app: Application) => {
    e.stopPropagation();
    const idx = STATUS_ORDER.indexOf(app.status);
    if (idx < STATUS_ORDER.length - 1) onStatusChange(app.id, STATUS_ORDER[idx + 1]);
  };

  if (!jobSelected) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No job selected</p>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Click any job on the left to load its applicant pipeline.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-14">
        <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Kanban Board */}
      <div className="flex gap-2.5 overflow-x-auto pb-3 -mx-1 px-1 min-h-[280px]">
        {COLUMNS.map((col) => {
          const cards = grouped[col.key];
          return (
            <div key={col.key} className="flex-shrink-0 w-44 flex flex-col">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${col.headerBg} border border-border border-b-0`}>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-[11px] font-semibold tracking-wide text-foreground">
                    {col.label}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${col.countBg}`}>
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className={`flex-1 rounded-b-xl border border-border border-t-0 ${col.headerBg} p-1.5 space-y-1.5`}>
                {cards.length === 0 ? (
                  <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-border">
                    <span className="text-[10px] text-muted-foreground">Empty</span>
                  </div>
                ) : (
                  cards.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelected(app)}
                      className="bg-background rounded-lg border border-border p-2.5 cursor-pointer hover:border-primary/60 hover:shadow-sm transition-all group"
                    >
                      {/* Avatar + name */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColor(app.id)}`}>
                          {getInitials(app.profiles?.full_name)}
                        </div>
                        <p className="text-xs font-semibold truncate leading-tight text-foreground">
                          {app.profiles?.full_name || "Unknown"}
                        </p>
                      </div>

                      {/* Email */}
                      {app.profiles?.email && (
                        <p className="text-[10px] text-muted-foreground truncate mb-2">
                          {app.profiles.email}
                        </p>
                      )}

                      {/* Skill pills */}
                      {app.profiles?.skills && app.profiles.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {app.profiles.skills.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="text-[9px] font-medium bg-muted text-muted-foreground rounded px-1.5 py-0.5 leading-none"
                            >
                              {s}
                            </span>
                          ))}
                          {app.profiles.skills.length > 2 && (
                            <span className="text-[9px] text-muted-foreground">
                              +{app.profiles.skills.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions bar — Always visible for better discoverability */}
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageApplicant(app.applicant_id);
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20"
                          title="Message Applicant"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Message</span>
                        </button>
                        
                        <div className="flex items-center gap-0.5 text-muted-foreground">
                          <button
                            onClick={(e) => moveLeft(e, app)}
                            disabled={STATUS_ORDER.indexOf(app.status) === 0}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => moveRight(e, app)}
                            disabled={STATUS_ORDER.indexOf(app.status) === STATUS_ORDER.length - 1}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setPreviewResume(false); }}>
        <DialogContent className={previewResume ? "max-w-3xl" : "max-w-sm"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selected && (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarColor(selected.id)}`}>
                  {getInitials(selected?.profiles?.full_name)}
                </div>
              )}
              <div>
                <p className="font-semibold text-base leading-tight">
                  {selected?.profiles?.full_name || "Applicant"}
                </p>
                <p className="text-xs text-muted-foreground font-normal">
                  {selected?.profiles?.email}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 pt-1">
              {/* Applied date */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Applied {new Date(selected.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>

              {/* Skills */}
              {selected.profiles?.skills && selected.profiles.skills.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.profiles.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selected.cover_letter && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Cover Letter
                  </p>
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed line-clamp-5 border border-border">
                    {selected.cover_letter}
                  </div>
                </div>
              )}

              {/* Resume */}
              {(() => {
                const resumeUrl = selected.profiles?.resume_url || selected.resume_url;
                if (!resumeUrl) return null;
                return (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Resume
                    </p>
                    <div className="flex gap-2 mb-2">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <Briefcase className="h-3.5 w-3.5" />
                        Open
                      </a>
                      <button
                        onClick={() => setPreviewResume((p) => !p)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium border border-primary/40 text-primary rounded-lg px-3 py-2 hover:bg-primary/5 transition-colors"
                      >
                        {previewResume ? "Hide Preview" : "Preview"}
                      </button>
                    </div>
                    {previewResume && (
                      <iframe
                        src={resumeUrl}
                        className="w-full h-96 rounded-lg border border-border"
                        title="Resume Preview"
                      />
                    )}
                  </div>
                );
              })()}

              {/* Stage selector */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Pipeline Stage
                </p>
                <Select
                  value={selected.status}
                  onValueChange={(v) => {
                    onStatusChange(selected.id, v);
                    setSelected({ ...selected, status: v as ApplicationStatus });
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMNS.map((col) => (
                      <SelectItem key={col.key} value={col.key}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                          {col.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selected.applicant_id && (
                <Button
                  className="w-full h-9 text-sm gap-2"
                  onClick={() => handleMessageApplicant(selected.applicant_id)}
                >
                  <MessageSquare className="h-4 w-4" /> Message Applicant
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full h-9 text-sm"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
