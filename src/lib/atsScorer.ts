/**
 * ATS Score Calculator
 *
 * Calculates a 0–100 ATS (Applicant Tracking System) score for a candidate
 * based on how well they match a job posting.
 *
 * Scoring breakdown:
 *   - Skills Match     60% — how many required skills the candidate has
 *   - Profile Quality  25% — completeness of profile (resume, skills count, bio)
 *   - Content Signals  15% — experience keywords found in cover letter
 */

export interface ATSInput {
  /** Skills the job requires (from jobs.skills_required) */
  jobSkills: string[];
  /** Job title, used for keyword context */
  jobTitle: string;
  /** Job description text */
  jobDescription: string;
  /** Candidate's skills array (from profiles.skills) */
  candidateSkills: string[];
  /** Candidate's cover letter text */
  coverLetter?: string | null;
  /** Whether the candidate has uploaded a resume */
  hasResume: boolean;
  /** Bio text */
  bio?: string | null;
}

export interface ATSResult {
  score: number;         // 0–100
  breakdown: {
    skillsScore: number;   // 0–60
    profileScore: number;  // 0–25
    contentScore: number;  // 0–15
  };
  matchedSkills: string[];
  missingSkills: string[];
}

const EXPERIENCE_KEYWORDS = [
  "year", "years", "experience", "worked", "developed", "built",
  "designed", "led", "managed", "delivered", "implemented", "professional",
  "senior", "junior", "mid", "intern", "expert", "proficient",
];

function normalise(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9#.+]/g, " ").trim();
}

function skillMatch(jobSkill: string, candidateSkills: string[]): boolean {
  const jn = normalise(jobSkill);
  return candidateSkills.some((cs) => {
    const cn = normalise(cs);
    return cn === jn || cn.includes(jn) || jn.includes(cn);
  });
}

export function calculateATSScore(input: ATSInput): ATSResult {
  const { jobSkills, candidateSkills, coverLetter, hasResume, bio } = input;

  /* ── Skills Score (60 pts) ── */
  let matchedSkills: string[] = [];
  let missingSkills: string[] = [];

  if (jobSkills.length === 0) {
    // No requirements listed — everyone gets partial credit
    matchedSkills = [];
    missingSkills = [];
  } else {
    jobSkills.forEach((js) => {
      if (skillMatch(js, candidateSkills)) {
        matchedSkills.push(js);
      } else {
        missingSkills.push(js);
      }
    });
  }

  const skillsRatio = jobSkills.length === 0
    ? 0.5 // 50% base when no requirements specified
    : matchedSkills.length / jobSkills.length;

  const skillsScore = Math.round(skillsRatio * 60);

  /* ── Profile Quality Score (25 pts) ── */
  let profileScore = 0;
  if (hasResume) profileScore += 12;          // resume uploaded
  if (candidateSkills.length >= 3) profileScore += 8;   // skills profile filled
  if (candidateSkills.length >= 6) profileScore += 3;   // rich skills list bonus
  if (bio && bio.length > 50) profileScore += 2;        // bio written
  profileScore = Math.min(25, profileScore);

  /* ── Content / Keywords Score (15 pts) ── */
  let contentScore = 0;
  const textToSearch = `${coverLetter ?? ""} ${bio ?? ""}`.toLowerCase();
  if (textToSearch.trim().length > 20) {
    const found = EXPERIENCE_KEYWORDS.filter((kw) => textToSearch.includes(kw));
    // up to 15 pts scaled across keyword hits
    contentScore = Math.min(15, Math.round((found.length / 5) * 15));
  }

  const score = Math.min(100, skillsScore + profileScore + contentScore);

  return {
    score,
    breakdown: { skillsScore, profileScore, contentScore },
    matchedSkills,
    missingSkills,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 70) return "text-green-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/15 border-emerald-500/30";
  if (score >= 70) return "bg-green-500/15 border-green-500/30";
  if (score >= 50) return "bg-amber-500/15 border-amber-500/30";
  return "bg-red-500/15 border-red-500/30";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good Fit";
  if (score >= 50) return "Partial";
  return "Low Match";
}
