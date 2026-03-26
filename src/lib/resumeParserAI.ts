/**
 * AI Resume Parser
 *
 * Extracts text from a PDF resume and uses Google Gemini API
 * to intelligently parse skills and generate a professional bio.
 */

export interface ParsedResume {
  skills: string[];
  bio: string;
}

/**
 * Extracts all text from a PDF file given its URL
 */
export async function extractTextFromPDF(pdfUrl: string): Promise<string> {
  // Dynamically import to prevent Node.js errors during testing
  const pdfjsLib = await import("pdfjs-dist");
  
  // Use unpkg instead of cdnjs, as cdnjs often 404s for newer versions
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

/**
 * Pure function: builds the prompt instructing the LLM to output JSON
 */
export function buildResumeParsePrompt(resumeText: string): string {
  return `You are an expert technical recruiter and AI resume parser.
I will provide you with the raw extracted text from a candidate's resume.

Your task is to extract their key skills and write a professional bio.

RESUME TEXT:
"""
${resumeText.substring(0, 10000) /* Limit text to avoid token limits */}
"""

INSTRUCTIONS:
1. Extract a COMPREHENSIVE list of ALL technical skills, programming languages, frameworks, developer tools, and databases mentioned in the resume. Do not leave any technical skills out (aim for 10-25 skills if available).
2. Write a concise, professional 3-4 sentence bio summarizing their experience, primary role, key achievements, and the main technologies they use.
3. CRITICAL: Write the bio in the FIRST PERSON ("I am a passionate...") or without pronouns ("Passionate developer with..."). DO NOT use the candidate's name or write in the third person ("Abhishek is...").
4. You MUST return your response as a valid JSON object with EXACTLY the following structure:
{
  "skills": ["React", "TypeScript", "Node.js", "MongoDB", "Git"],
  "bio": "Passionate MERN stack developer with experience in..."
}
Do not include any markdown formatting, markdown code blocks, or conversational text outside the JSON. Return ONLY the raw JSON string.`;
}

/* ── API Endpoints ── */
const GEMINI_HOST = "https://generativelanguage.googleapis.com";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Orchestrates the full flow: PDF extraction -> Gemini (Primary) -> Groq (Fallback) -> JSON parsing
 */
export async function parseResumeWithAI(pdfUrl: string): Promise<ParsedResume> {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
    throw new Error("Missing both Gemini and Groq API keys in .env file.");
  }

  // 1. Extract text from the PDF
  let resumeText = "";
  try {
    resumeText = await extractTextFromPDF(pdfUrl);
  } catch (err: any) {
    throw new Error(`Failed to read PDF file: ${err.message}`);
  }

  if (!resumeText || resumeText.length < 50) {
    throw new Error("Could not extract enough text from the resume. Please ensure it is a real text-based PDF.");
  }

  // 2. Build the prompt
  const prompt = buildResumeParsePrompt(resumeText);
  let rawText: string | null = null;

  // 3. Try Gemini API (Primary), forcing JSON output
  if (geminiKey) {
    try {
      const url = `${GEMINI_HOST}/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1, // low temp for extraction consistency
            maxOutputTokens: 1024,
            responseMimeType: "application/json", // Enforce JSON mode
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          console.log("Parsed resume using primary AI (Gemini)");
        }
      } else {
        console.warn(`Gemini API failed with status: ${response.status}. Falling back to Groq...`);
      }
    } catch (err) {
      console.warn("Gemini API request failed. Falling back to Groq...", err);
    }
  }

  // 4. Try Groq API (Fallback), forcing JSON output
  if (!rawText && groqKey) {
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
              content: "You are a helpful AI that strictly outputs valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 1024,
          response_format: { type: "json_object" }, // Enforce JSON mode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        rawText = data?.choices?.[0]?.message?.content;
        if (rawText) {
          console.log("Parsed resume using fallback AI (Groq)");
        }
      } else {
        throw new Error(`Groq API failed with status: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Groq fallback error:", err);
      throw new Error("Both primary and fallback AI parsing failed. Please try again later.");
    }
  }

  if (!rawText) {
    throw new Error("AI returned an empty response. Please configure APIs properly.");
  }

  // 5. Parse the JSON response
  try {
    const parsed = JSON.parse(rawText) as ParsedResume;
    if (!parsed.skills || !Array.isArray(parsed.skills) || !parsed.bio) {
      throw new Error("Malformed JSON from AI.");
    }
    return parsed;
  } catch (err) {
    console.error("Failed to parse AI response as JSON:", rawText);
    throw new Error("Failed to parse resume data. AI returned invalid format.");
  }
}
