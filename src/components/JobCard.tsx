import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Building2, ArrowRight, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  location: string | null;
  jobType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  skills: string[] | null;
  applicantCount: number;
  createdAt: string;
  showApplicantCount?: boolean;
}

const JOB_TYPE_STYLES: Record<string, string> = {
  "full-time":  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "part-time":  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "contract":   "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "remote":     "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "internship": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

const COMPANY_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-green-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];

function companyGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length];
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatSalary(n: number) {
  return n >= 100000
    ? `₹${(n / 100000).toFixed(1).replace(/\.0$/, "")}L`
    : `₹${(n / 1000).toFixed(0)}k`;
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({
  id, title, companyName, location, jobType, salaryMin, salaryMax,
  skills, applicantCount, createdAt, showApplicantCount = false,
}: JobCardProps) {
  const timeAgo = getTimeAgo(createdAt);
  const salary = salaryMin && salaryMax
    ? `${formatSalary(salaryMin)} – ${formatSalary(salaryMax)} /yr`
    : salaryMin ? `From ${formatSalary(salaryMin)} /yr` : null;

  const typeStyle = JOB_TYPE_STYLES[jobType] || "bg-muted text-muted-foreground";

  return (
    <Link to={`/jobs/${id}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/30">

        {/* Subtle bg glow on hover */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

        {/* Top row: Company avatar + meta + time */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Company avatar */}
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${companyGradient(companyName)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
              {getInitials(companyName)}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{companyName}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize mt-0.5 ${typeStyle}`}>
                {jobType}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap mt-0.5">{timeAgo}</span>
        </div>

        {/* Job title */}
        <h3 className="font-display text-[17px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
          {title}
        </h3>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {location && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-1">
              <MapPin className="h-3 w-3" /> {location}
            </span>
          )}
          {salary && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-1">
              <IndianRupee className="h-3 w-3" /> {salary}
            </span>
          )}
          {showApplicantCount && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted rounded-full px-2.5 py-1">
              <Users className="h-3 w-3" /> {applicantCount} applicants
            </span>
          )}
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-[10px] font-normal px-2 py-0.5 rounded-md">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0.5 rounded-md">
                +{skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {companyName}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
            View Job <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
