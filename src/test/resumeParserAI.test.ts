import { describe, it, expect } from "vitest";
import { buildResumeParsePrompt } from "@/lib/resumeParserAI";

describe("buildResumeParsePrompt", () => {
  const dummyText = "John Doe. Senior Software Engineer. Experince: 5 years at Google. Skills: React, Node.js, Python. Education: BS Computer Science.";

  it("includes the provided resume text", () => {
    const prompt = buildResumeParsePrompt(dummyText);
    expect(prompt).toContain(dummyText);
  });

  it("instructs the AI to output exactly JSON", () => {
    const prompt = buildResumeParsePrompt(dummyText);
    expect(prompt).toContain("JSON object");
    expect(prompt).toContain('"skills"');
    expect(prompt).toContain('"bio"');
    expect(prompt).toContain("Return ONLY the raw JSON string");
  });

  it("limits resume text length", () => {
    const longText = "a".repeat(15000);
    const prompt = buildResumeParsePrompt(longText);
    // The prompt cuts at 10000 characters
    expect(prompt.includes("a".repeat(10001))).toBe(false);
    expect(prompt.includes("a".repeat(10000))).toBe(true);
  });
});
