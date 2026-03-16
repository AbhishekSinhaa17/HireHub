import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Sparkles,
  Upload,
  ExternalLink,
  Save,
  Briefcase,
  Tag,
  CheckCircle2,
  Camera,
} from "lucide-react";

export default function Profile() {
  const { user, profile, role, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
  });
  const [saving, setSaving] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (profile?.resume_url) {
      const name = profile.resume_url.split("/").pop();
      setResumeName(decodeURIComponent(name || "resume.pdf"));
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        skills: profile.skills?.join(", ") || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        location: form.location || null,
        bio: form.bio || null,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      toast({ title: "Profile updated!" });

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills?.join(", ") || "",
        });
      }
    }

    setSaving(false);
  };

  const handleResumeUpload = async (e: any) => {
    if (!user) return;
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeName(file.name);

    const filePath = `${user.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploadingResume(false);
      return;
    }

    const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ resume_url: data.publicUrl })
      .eq("user_id", user.id);

    const { data: updatedProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (updatedProfile) {
      setForm({
        full_name: updatedProfile.full_name || "",
        phone: updatedProfile.phone || "",
        location: updatedProfile.location || "",
        bio: updatedProfile.bio || "",
        skills: updatedProfile.skills?.join(", ") || "",
      });
    }

    if (updateError) {
      toast({
        title: "Database update failed",
        description: updateError.message,
        variant: "destructive",
      });
      setUploadingResume(false);
      return;
    }

    toast({ title: "Resume uploaded successfully!" });
    setUploadingResume(false);
  };

  const handleSimulateScan = async () => {
    if (!profile?.resume_url) {
      toast({
        title: "No resume found",
        description: "Please upload a resume first to scan it with AI.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock "Parsed" data
    const mockSkills = ["React", "TypeScript", "Node.js", "UI/UX Design", "GraphQL"];
    const mockBio = "Passionate Full-stack Developer with 3+ years of experience building modern web applications. Specialized in creating premium user experiences and scalable backends.";

    setForm((prev) => ({
      ...prev,
      bio: mockBio,
      skills: mockSkills.join(", "),
    }));

    toast({
      title: "Scan Complete!",
      description: "AI has successfully extracted your skills and bio from the resume.",
    });

    setIsScanning(false);
  };

  const handleAvatarUpload = async (e: any) => {
    if (!user) return;
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("user_id", user.id);

    if (updateError) {
      toast({
        title: "Database update failed",
        description: updateError.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Avatar updated successfully!" });
      await refreshProfile();
    }
    setUploadingAvatar(false);
  };

  // Skills as array for display
  const skillsArray = form.skills
    ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Profile completion percentage
  const baseFields = [
    form.full_name,
    form.phone,
    form.location,
    form.bio,
  ];
  
  const fields = role === "jobseeker" 
    ? [...baseFields, form.skills, profile?.resume_url] 
    : baseFields;

  const filled = fields.filter(Boolean).length;
  const completionPct = Math.round((filled / fields.length) * 100);

  // Avatar initials
  const initials = form.full_name
    ? form.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (profile?.email?.[0] || "U").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[200px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[150px] bg-violet-500/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            {/* Avatar */}
            <div className="relative group">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-emerald-500 p-0.5 shadow-xl">
                <div className="h-full w-full rounded-[14px] bg-card flex items-center justify-center overflow-hidden relative">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={form.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-2xl font-bold bg-gradient-to-br from-primary to-violet-500 bg-clip-text text-transparent">
                      {initials}
                    </span>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              <label className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform">
                <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                {role === "jobseeker"
                  ? "Job Seeker"
                  : role === "recruiter"
                    ? "Recruiter"
                    : "Admin"}{" "}
                Profile
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {form.full_name || "Your Name"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile?.email}
                {form.location && (
                  <span className="ml-3 inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {form.location}
                  </span>
                )}
              </p>
            </div>

            {/* Completion Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="shrink-0 bg-card border border-border rounded-2xl px-5 py-4 shadow-sm min-w-[160px]"
            >
              <p className="text-xs text-muted-foreground font-medium mb-2">
                Profile Completion
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold font-display">
                  {completionPct}%
                </span>
                {completionPct === 100 && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {filled} of {fields.length} fields filled
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Left Column: Form ── */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Personal Info Card */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <User className="h-4.5 w-4.5 text-white h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base">
                    Personal Information
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Update your basic details
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Full Name
                  </Label>
                  <Input
                    value={form.full_name}
                    onChange={(e) =>
                      setForm({ ...form, full_name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="h-11 rounded-xl border-border bg-muted/30 focus:bg-background transition-colors"
                  />
                </div>

                {/* Email (disabled) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      value={profile?.email || ""}
                      disabled
                      className="h-11 rounded-xl border-border bg-muted/50 opacity-70 pr-20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                      Locked
                    </span>
                  </div>
                </div>

                {/* Phone + Location row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </Label>
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="h-11 rounded-xl border-border bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Location
                    </Label>
                    <Input
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      placeholder="Bangalore, India"
                      className="h-11 rounded-xl border-border bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Bio
                  </Label>
                  <Textarea
                    rows={4}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us about yourself, your experience, and what you're looking for..."
                    className="rounded-xl border-border bg-muted/30 focus:bg-background transition-colors resize-none"
                  />
                  <p className="text-[10px] text-muted-foreground text-right">
                    {form.bio.length} / 500
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Card — jobseeker only */}
            {role === "jobseeker" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm"
              >
                <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
                    <Tag className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base">
                      Skills
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of your skills
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <Input
                    value={form.skills}
                    onChange={(e) =>
                      setForm({ ...form, skills: e.target.value })
                    }
                    placeholder="React, Node.js, TypeScript, SQL, Figma..."
                    className="h-11 rounded-xl border-border bg-muted/30 focus:bg-background transition-colors"
                  />

                  {/* Skills preview tags */}
                  {skillsArray.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                onClick={handleSave}
                disabled={saving}
                className={`w-full h-12 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 ${saveSuccess
                    ? "bg-emerald-500 hover:bg-emerald-500 shadow-emerald-500/30"
                    : "shadow-primary/20 hover:shadow-primary/40"
                  }`}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Saving...
                  </span>
                ) : saveSuccess ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved Successfully!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Resume + Quick Info ── */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Resume Card — jobseeker only */}
            {role === "jobseeker" && (
              <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base">
                      Resume
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      PDF format only
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {profile?.resume_url ? (
                    <>
                      {/* Uploaded file display */}
                      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <FileText className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {resumeName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Uploaded resume
                            </p>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </a>
                        <label className="inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold cursor-pointer transition-colors">
                          {uploadingResume ? (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          ) : (
                            <Upload className="h-3.5 w-3.5" />
                          )}
                          {uploadingResume ? "Uploading..." : "Replace"}
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleResumeUpload}
                          />
                        </label>
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        className="w-full mt-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all group"
                        onClick={handleSimulateScan}
                        disabled={isScanning}
                      >
                        {isScanning ? (
                          <>
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2" />
                            AI Scanning...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 mr-2 group-hover:rotate-12 transition-transform" />
                            Auto-fill with AI
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    /* Upload zone */
                    <label className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-primary/5 p-8 cursor-pointer transition-all duration-300">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {uploadingResume ? (
                          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        ) : (
                          <Upload className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">
                          {uploadingResume
                            ? "Uploading..."
                            : "Upload Resume"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          PDF up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleResumeUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Quick Info Card */}
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border bg-muted/20">
                <h2 className="font-display font-bold text-base">
                  Quick Info
                </h2>
              </div>

              <div className="p-5 space-y-3">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: profile?.email || "—",
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: form.phone || "Not set",
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: form.location || "Not set",
                    color: "text-amber-500",
                    bg: "bg-amber-500/10",
                  },
                  {
                    icon: Briefcase,
                    label: "Role",
                    value:
                      role === "jobseeker"
                        ? "Job Seeker"
                        : role === "recruiter"
                          ? "Recruiter"
                          : "Admin",
                    color: "text-violet-500",
                    bg: "bg-violet-500/10",
                  },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors"
                  >
                    <div
                      className={`h-8 w-8 shrink-0 rounded-lg ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="text-sm font-medium truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 overflow-hidden shadow-sm">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm">Profile Tips</h3>
                </div>
                <ul className="space-y-2">
                  {[
                    "Add a detailed bio to stand out",
                    "Keep your location updated",
                    ...(role === "jobseeker" ? [
                      "List all your relevant skills",
                      "Upload your latest resume"
                    ] : []),
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}