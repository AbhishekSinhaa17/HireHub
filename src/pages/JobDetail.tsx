import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Users, Building2, ArrowLeft, Send, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { generateCoverLetter } from "@/lib/coverLetterAI";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role, profile } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, companies(name, location, industry, size, description)")
        .eq("id", id)
        .single();
      setJob(data);
      setLoading(false);
    };
    const checkApplication = async () => {
      if (!user || !id) return;
      const { data } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", id)
        .eq("applicant_id", user.id)
        .maybeSingle();
      if (data) setHasApplied(true);
    };
    fetchJob();
    checkApplication();
  }, [id, user]);

  const handleApply = async () => {
    if (!user || !id) return;
    setApplying(true);
    try {
      const { error } = await supabase.from("applications").insert({
        job_id: id,
        applicant_id: user.id,
        cover_letter: coverLetter || null,
      });
      if (error) throw error;

      // Increment applicant_count on the job
      await supabase
        .from("jobs")
        .update({ applicant_count: (job?.applicant_count ?? 0) + 1 })
        .eq("id", id);

      setHasApplied(true);
      toast({ title: "Application submitted!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  const handleMessageRecruiter = async () => {
    if (!user || !job?.recruiter_id) return;
    
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .contains("participant_ids", [user.id, job.recruiter_id])
      .maybeSingle();

    if (existing) {
      navigate("/chat");
      return;
    }

    // Create new conversation
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({
        participant_ids: [user.id, job.recruiter_id]
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to start conversation", variant: "destructive" });
      return;
    }

    navigate("/chat");
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Job not found</p>
        <Link to="/jobs"><Button variant="outline" className="mt-4">Back to Jobs</Button></Link>
      </div>
    </div>
  );

  const formatSalary = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1).replace(/\.0$/, "")}L` : `₹${(n / 1000).toFixed(0)}k`;

  const salary = job.salary_min && job.salary_max
    ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)} /yr`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link to="/jobs" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Jobs
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4" />
                  {job.companies?.name}
                </div>
                <h1 className="font-display text-2xl font-bold md:text-3xl">{job.title}</h1>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{job.job_type}</span>
                  {salary && <span className="flex items-center gap-1">{salary}</span>}
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{job.applicant_count} applicants</span>
                </div>
                {job.skills_required?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills_required.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Job Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {job.description}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                {!user ? (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-muted-foreground">Sign in to apply for this job</p>
                    <Link to="/auth/login"><Button className="w-full">Sign In</Button></Link>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center">
                    <div className="mb-2 text-2xl">✅</div>
                    <p className="font-medium text-foreground">Application Submitted</p>
                    <p className="mt-1 text-sm text-muted-foreground">You've already applied for this position</p>
                  </div>
                ) : role === "jobseeker" ? (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold">Apply Now</h3>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Cover Letter (optional)</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                          disabled={generating}
                          onClick={async () => {
                            if (!profile) {
                              toast({ title: "Please complete your profile first", variant: "destructive" });
                              return;
                            }
                            setGenerating(true);
                            try {
                              const letter = await generateCoverLetter(
                                { full_name: profile.full_name, bio: profile.bio, skills: profile.skills },
                                job,
                              );
                              setCoverLetter(letter);
                              toast({ title: "Cover letter generated!", description: "Feel free to edit it before submitting." });
                            } catch (err: any) {
                              toast({ title: "Generation failed", description: err.message, variant: "destructive" });
                            } finally {
                              setGenerating(false);
                            }
                          }}
                        >
                          {generating ? (
                            <><Loader2 className="h-3 w-3 animate-spin" /> Generating...</>
                          ) : (
                            <><Sparkles className="h-3 w-3" /> Generate with AI</>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        className="mt-1"
                        rows={7}
                        placeholder={generating ? "AI is writing your cover letter..." : "Why are you a great fit?"}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        disabled={generating}
                      />
                    </div>
                    <Button className="w-full" onClick={handleApply} disabled={applying || generating}>
                      <Send className="mr-2 h-4 w-4" /> {applying ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">Only job seekers can apply</p>
                )}

                {user && role === "jobseeker" && job?.recruiter_id && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 border-primary/20 hover:bg-primary/5"
                    onClick={handleMessageRecruiter}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Recruiter
                  </Button>
                )}

                {job.companies && (
                  <div className="mt-6 border-t border-border pt-4">
                    <h4 className="font-display text-sm font-semibold mb-2">About {job.companies.name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {job.companies.industry && <p>Industry: {job.companies.industry}</p>}
                      {job.companies.size && <p>Size: {job.companies.size}</p>}
                      {job.companies.location && <p>HQ: {job.companies.location}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
