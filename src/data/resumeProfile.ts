export interface UncertainField {
  field: string;
  detectedValue: string | null;
  message: string;
}

export interface ResumeProfile {
  completionPercent: number;
  detectedSkills: string[];
  uncertainFields: UncertainField[];
}

export const resumeProfile: ResumeProfile = {
  completionPercent: 85,
  detectedSkills: ["Python", "SQL", "Machine Learning", "React"],
  uncertainFields: [
    {
      field: "Work experience",
      detectedValue: null,
      message: "We couldn't clearly determine your total years of experience from your resume.",
    },
    {
      field: "Preferred location",
      detectedValue: "Bengaluru",
      message: "Your resume mentions Bengaluru, but we're not certain if this is your current location or preferred work location.",
    },
  ],
};
