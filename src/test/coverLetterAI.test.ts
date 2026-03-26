import { describe, it, expect } from "vitest";
import { buildCoverLetterPrompt } from "@/lib/coverLetterAI";

describe("buildCoverLetterPrompt", () => {
  const baseProfile = {
    full_name: "John Doe",
    bio: "Full-stack developer with 3 years experience",
    skills: ["React", "TypeScript", "Node.js"],
  };

  const baseJob = {
    title: "Senior Frontend Developer",
    description: "We are looking for an experienced frontend developer.",
    skills_required: ["React", "CSS", "JavaScript"],
    companies: { name: "Acme Corp", industry: "Technology" },
  };

  it("includes the candidate name", () => {
    const prompt = buildCoverLetterPrompt(baseProfile, baseJob);
    expect(prompt).toContain("John Doe");
  });

  it("includes candidate skills", () => {
    const prompt = buildCoverLetterPrompt(baseProfile, baseJob);
    expect(prompt).toContain("React");
    expect(prompt).toContain("TypeScript");
    expect(prompt).toContain("Node.js");
  });

  it("includes job title and company", () => {
    const prompt = buildCoverLetterPrompt(baseProfile, baseJob);
    expect(prompt).toContain("Senior Frontend Developer");
    expect(prompt).toContain("Acme Corp");
  });

  it("includes the job required skills", () => {
    const prompt = buildCoverLetterPrompt(baseProfile, baseJob);
    expect(prompt).toContain("React, CSS, JavaScript");
  });

  it("includes the candidate bio", () => {
    const prompt = buildCoverLetterPrompt(baseProfile, baseJob);
    expect(prompt).toContain("Full-stack developer with 3 years experience");
  });

  it("handles null/empty profile fields gracefully", () => {
    const emptyProfile = { full_name: null, bio: null, skills: null };
    const prompt = buildCoverLetterPrompt(emptyProfile, baseJob);
    expect(prompt).toContain("the candidate");
    expect(prompt).toContain("not specified");
    expect(prompt).toContain("No bio provided.");
  });

  it("handles null/empty job fields gracefully", () => {
    const emptyJob = {
      title: "Developer",
      description: null,
      skills_required: null,
      companies: null,
    };
    const prompt = buildCoverLetterPrompt(baseProfile, emptyJob);
    expect(prompt).toContain("the company");
    expect(prompt).toContain("No description provided.");
  });
});
