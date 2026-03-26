/**
 * AI Job Description Generator
 *
 * Uses Google Gemini API (2.0 Flash) to generate professional job descriptions
 * based on recruiter inputs.
 */

/* ── Types ── */
export interface JobDescriptionInput {
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  experience_level: string;
  skills: string;
}

/* ── Prompt Builder (pure, testable) ── */
export function buildJobDescriptionPrompt(input: JobDescriptionInput): string {
  const title = input.title || "an unspecified role";
  const company = input.company_name || "our company";
  const location = input.location || "not specified";
  const jobType = input.job_type || "not specified";
  const experience = input.experience_level || "not specified";
  const skills = input.skills || "not specified";

  return `You are an expert HR copywriter. Write a professional, engaging job description for the following open position.

JOB DETAILS:
- Title: ${title}
- Company: ${company}
- Location: ${location}
- Job Type: ${jobType}
- Experience Level: ${experience}
- Key Skills: ${skills}

INSTRUCTIONS:
1. Write a comprehensive job description (about 200-250 words).
2. Include the following sections:
   - **About the Role**: A brief, engaging hook about the position.
   - **What You'll Do**: 4-5 bullet points of key responsibilities based on the title and skills.
   - **What We're Looking For**: 4-5 bullet points of requirements (incorporate the experience level and skills).
   - **Why Join Us**: A brief closing paragraph about company culture and perks.
3. Keep the tone professional, welcoming, and clear.
4. DO NOT include placeholders like [Insert Company Name] — use the provided details or write generally if details are missing.
5. Return ONLY the job description text, properly formatted with markdown headings and bullet points.`;
}

/* ── API Endpoints ── */
const GEMINI_HOST = "https://generativelanguage.googleapis.com";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateJobDescription(
  input: JobDescriptionInput,
): Promise<string> {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
    throw new Error("Missing both Gemini and Groq API keys in .env file.");
  }

  const prompt = buildJobDescriptionPrompt(input);

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
            parts: [{ text: "You are an expert HR professional writing job postings." }]
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
          console.log("Generated job description using primary AI (Gemini)");
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
              content: "You are an expert HR professional writing job postings.",
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
          console.log("Generated job description using fallback AI (Groq)");
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
