import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  applied: { label: "Applied", className: "bg-info/10 text-info border-info/20" },
  shortlisted: { label: "Shortlisted", className: "bg-warning/10 text-warning border-warning/20" },
  interview: { label: "Interview", className: "bg-primary/10 text-primary border-primary/20" },
  offer: { label: "Offer", className: "bg-emerald/10 text-emerald border-emerald/20" },
  hired: { label: "Hired", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "" };
  return (
    <Badge variant="outline" className={`font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
