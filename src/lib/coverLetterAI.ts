/**
 * AI Cover Letter Generator
 *
 * Uses Google Gemini API (2.0 Flash) to generate tailored cover letters
 * based on the candidate's profile and the target job posting.
 */

/* ── Types ── */
export interface CoverLetterProfile {
  full_name: string | null;
  bio: string | null;
  skills: string[] | null;
}

export interface CoverLetterJob {
  title: string;
  description: string | null;
  skills_required: string[] | null;
  companies?: { name: string; industry?: string | null } | null;
}

/* ── Prompt Builder (pure, testable) ── */
export function buildCoverLetterPrompt(
  profile: CoverLetterProfile,
  job: CoverLetterJob,
): string {
  const candidateName = profile.full_name || "the candidate";
  const candidateSkills =
    profile.skills?.length ? profile.skills.join(", ") : "not specified";
  const candidateBio = profile.bio || "No bio provided.";

  const jobTitle = job.title;
  const companyName = job.companies?.name || "the company";
  const jobSkills =
    job.skills_required?.length
      ? job.skills_required.join(", ")
      : "not specified";
  const jobDescription = job.description || "No description provided.";

  return `You are an expert career coach. Write a professional, compelling cover letter for the following job application.

CANDIDATE INFORMATION:
- Name: ${candidateName}
- Skills: ${candidateSkills}
- About: ${candidateBio}

JOB DETAILS:
- Title: ${jobTitle}
- Company: ${companyName}
- Required Skills: ${jobSkills}
- Description: ${jobDescription}

INSTRUCTIONS:
1. Write a 3-4 paragraph cover letter (200-300 words).
2. Highlight how the candidate's skills match the job requirements.
3. Sound enthusiastic but professional — avoid being overly generic.
4. Do NOT include any subject line, headers, date, or address block — just the letter body.
5. Start with "Dear Hiring Manager," and end with "Sincerely, ${candidateName}".
6. Return ONLY the cover letter text, nothing else.`;
}

/* ── API Endpoints ── */
const GEMINI_HOST = "https://generativelanguage.googleapis.com";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateCoverLetter(
  profile: CoverLetterProfile,
  job: CoverLetterJob,
): Promise<string> {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
    throw new Error("Missing both Gemini and Groq API keys in .env file.");
  }

  const prompt = buildCoverLetterPrompt(profile, job);

  // 1. Try Gemini (Primary)
  if (geminiKey) {
    try {
      const url = `${GEMINI_HOST}/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{ text: "You are an expert career coach who writes professional cover letters." }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log("Generated cover letter using primary AI (Gemini)");
          return text.trim();
        }
      }
      console.warn(`Gemini API failed with status: ${response.status}. Falling back to Groq...`);
    } catch (err) {
      console.warn("Gemini API request failed. Falling back to Groq...", err);
    }
  }

  // 2. Fallback to Groq
  if (groqKey) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert career coach who writes professional cover letters.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          console.log("Generated cover letter using fallback AI (Groq)");
          return text.trim();
        }
      }
      throw new Error(`Groq API failed with status: ${response.status}`);
    } catch (err: any) {
      console.error("Groq fallback error:", err);
      throw new Error("Both primary and fallback AI generation failed. Please try again later.");
    }
  }

  throw new Error("AI generation failed. Please configure your API keys.");
}
