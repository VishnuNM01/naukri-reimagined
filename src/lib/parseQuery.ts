export interface ParsedQuery {
  role?: string;
  location?: string;
  experience?: "fresher" | "experienced";
  minSalary?: number;
  uncertain: boolean;
  uncertaintyReason?: string;
}

const ROLE_KEYWORDS: Record<string, string[]> = {
  "data scientist": ["data scientist", "data science"],
  "data analyst": ["data analyst", "data analysis"],
  "software engineer": ["software engineer", "software development", "developer"],
  "business analyst": ["business analyst", "business analysis"],
  "ml engineer": ["ml engineer", "machine learning engineer", "machine learning"],
  "product analyst": ["product analyst"],
  "frontend engineer": ["frontend engineer", "front-end", "frontend"],
  "quantitative analyst": ["quantitative analyst", "quant"],
  "associate software engineer": ["associate software engineer"],
};

const LOCATION_KEYWORDS: string[] = [
  "bangalore",
  "bengaluru",
  "gurugram",
  "gurgaon",
  "hyderabad",
  "pune",
  "chennai",
  "mumbai",
  "delhi",
  "noida",
];

const EXPERIENCE_KEYWORDS = {
  fresher: ["fresher", "fresh graduate", "entry level", "0-1", "0 to 1", "0–1"],
  experienced: ["experienced", "1+", "2+", "3+", "mid-level", "senior"],
};

export function parseQuery(query: string): ParsedQuery {
  const lowerQuery = query.toLowerCase();
  const result: ParsedQuery = {
    uncertain: false,
  };

  // Parse role
  for (const [role, keywords] of Object.entries(ROLE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        result.role = role;
        break;
      }
    }
    if (result.role) break;
  }

  // Parse location
  for (const location of LOCATION_KEYWORDS) {
    if (lowerQuery.includes(location)) {
      // Normalize Bangalore to Bengaluru
      result.location = location === "bangalore" ? "Bengaluru" : 
                       location === "gurgaon" ? "Gurugram" :
                       location.charAt(0).toUpperCase() + location.slice(1);
      break;
    }
  }

  // Parse experience
  if (EXPERIENCE_KEYWORDS.fresher.some(kw => lowerQuery.includes(kw))) {
    result.experience = "fresher";
  } else if (EXPERIENCE_KEYWORDS.experienced.some(kw => lowerQuery.includes(kw))) {
    result.experience = "experienced";
  }

  // Parse salary (X LPA or X lakh)
  const salaryPattern = /(\d+)\s*(?:lpa|lakh)/i;
  const salaryMatch = lowerQuery.match(salaryPattern);
  if (salaryMatch) {
    result.minSalary = parseInt(salaryMatch[1], 10);
  }

  // Check for uncertainty
  const uncertainties: string[] = [];
  if (!result.role) {
    uncertainties.push("role");
  }
  if (!result.location) {
    uncertainties.push("location");
  }

  if (uncertainties.length > 0) {
    result.uncertain = true;
    result.uncertaintyReason = `I couldn't identify the ${uncertainties.join(" or ")} from your query. Could you clarify?`;
  }

  return result;
}
