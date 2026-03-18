import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { useAuth } from "@/contexts/AuthContext";

interface Job {
  id: string;
  title: string;
  location: string | null;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  skills_required: string[] | null;
  applicant_count: number;
  created_at: string;
  companies: { name: string } | null;
}

const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "remote",
  "internship",
];

const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full Time",
  "part-time": "Part Time",
  contract: "Contract",
  remote: "Remote",
  internship: "Internship",
};

export default function Jobs() {
  const { role } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("jobs")
        .select(
          "id, title, location, job_type, salary_min, salary_max, skills_required, applicant_count, created_at, companies(name)",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setJobs((data as any) || []);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.companies?.name?.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || job.job_type === typeFilter;
      const matchLocation =
        !locationFilter ||
        job.location?.toLowerCase().includes(locationFilter.toLowerCase());
      return matchSearch && matchType && matchLocation;
    });
  }, [jobs, search, typeFilter, locationFilter]);

  const hasFilters = search || typeFilter !== "all" || locationFilter;

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setLocationFilter("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {loading ? "Loading..." : `${jobs.length} open positions`}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Find Your Next Role
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            Explore opportunities across companies and industries — your next
            career move starts here.
          </p>

          {/* Main search bar */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Job title or company..."
                className="pl-11 h-12 rounded-xl border-border bg-background shadow-sm text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location..."
                className="pl-10 h-12 w-40 rounded-xl border-border bg-background shadow-sm"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Job type filter pills */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              typeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Types
          </button>
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t === typeFilter ? "all" : t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                typeFilter === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-muted-foreground mb-5">
            {filtered.length === jobs.length
              ? `${jobs.length} jobs available`
              : `${filtered.length} of ${jobs.length} jobs match your filters`}
          </p>
        )}

        {/* Job Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5 animate-pulse"
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-muted rounded-full w-16" />
                  <div className="h-6 bg-muted rounded-full w-20" />
                </div>
                <div className="flex gap-1.5">
                  <div className="h-5 bg-muted rounded-md w-14" />
                  <div className="h-5 bg-muted rounded-md w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No jobs found</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                companyName={job.companies?.name || "Unknown Company"}
                location={job.location}
                jobType={job.job_type}
                salaryMin={job.salary_min}
                salaryMax={job.salary_max}
                skills={job.skills_required}
                applicantCount={job.applicant_count}
                createdAt={job.created_at}
                showApplicantCount={role === "recruiter"}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
