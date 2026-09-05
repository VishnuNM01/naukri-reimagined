export type ConfidenceLevel = "high" | "medium" | "low";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  skills: string[];
  missingSkills: string[];
  match: number; // 0–100, illustrative only
  confidence: ConfidenceLevel;
}
