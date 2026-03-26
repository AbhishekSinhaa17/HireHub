import { describe, it, expect } from "vitest";
import { buildJobDescriptionPrompt } from "@/lib/jobDescriptionAI";

describe("buildJobDescriptionPrompt", () => {
  const baseJob = {
    title: "Senior Product Designer",
    company_name: "Acme Design Co",
    location: "Remote",
    job_type: "full-time",
    experience_level: "Senior",
    skills: "Figma, UX Research, Prototyping",
  };

  it("includes all provided job details", () => {
    const prompt = buildJobDescriptionPrompt(baseJob);
    expect(prompt).toContain("Senior Product Designer");
    expect(prompt).toContain("Acme Design Co");
    expect(prompt).toContain("Remote");
    expect(prompt).toContain("full-time");
    expect(prompt).toContain("Senior");
    expect(prompt).toContain("Figma, UX Research, Prototyping");
  });

  it("handles empty/missing fields gracefully", () => {
    const emptyJob = {
      title: "",
      company_name: "",
      location: "",
      job_type: "",
      experience_level: "",
      skills: "",
    };
    const prompt = buildJobDescriptionPrompt(emptyJob);
    expect(prompt).toContain("an unspecified role");
    expect(prompt).toContain("our company");
    expect(prompt).toContain("not specified");
  });

  it("instructs the AI on formatting and content", () => {
    const prompt = buildJobDescriptionPrompt(baseJob);
    expect(prompt).toContain("About the Role");
    expect(prompt).toContain("What You'll Do");
    expect(prompt).toContain("What We're Looking For");
    expect(prompt).toContain("Why Join Us");
    expect(prompt).toContain("DO NOT include placeholders");
  });
});
