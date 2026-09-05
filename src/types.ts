export type ConfidenceLevel = "high" | "medium" | "low";

export type CompanyType = "Product" | "Startup" | "Fintech" | "Retail" | "Services";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  salaryMin: number; // LPA, for range filters and salary sort
  salaryMax: number;
  workMode: WorkMode;
  companyType: CompanyType;
  postedDaysAgo: number;
  skills: string[];
  missingSkills: string[];
  match: number; // 0–100, illustrative only
  confidence: ConfidenceLevel;
  companyRating: number; // 1–5, illustrative only
}
