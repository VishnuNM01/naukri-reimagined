import { useState } from "react";
import { X } from "lucide-react";
import { useExplain } from "../context/ExplainContext";
import ConfidenceBadge from "./ConfidenceBadge";
import type { Job } from "../types";

const RANKING_FACTORS = [
  { name: "Skills match", weight: 40 },
  { name: "Experience match", weight: 25 },
  { name: "Location", weight: 20 },
  { name: "Salary preference", weight: 10 },
  { name: "Other preferences", weight: 5 },
];

function calculateFactorContribution(job: Job, factor: { name: string; weight: number }): { satisfied: boolean; contribution: number } {
  // Deterministic illustrative calculation based on job properties
  // This shows whether this job satisfied the factor and its relative contribution
  
  switch (factor.name) {
    case "Skills match":
      // Higher contribution if more skills match and fewer missing
      const skillRatio = job.skills.length / (job.skills.length + job.missingSkills.length);
      return { satisfied: skillRatio > 0.5, contribution: Math.round(factor.weight * skillRatio) };
    case "Experience match":
      // Assume most jobs match experience for this prototype
      return { satisfied: true, contribution: Math.round(factor.weight * 0.9) };
    case "Location":
      // Assume location matches for this prototype
      return { satisfied: true, contribution: Math.round(factor.weight * 0.85) };
    case "Salary preference":
      // Mid-range salary gets higher contribution
      const salaryMid = (job.salaryMin + job.salaryMax) / 2;
      const salaryScore = salaryMid >= 8 && salaryMid <= 15 ? 0.8 : 0.6;
      return { satisfied: salaryScore > 0.5, contribution: Math.round(factor.weight * salaryScore) };
    case "Other preferences":
      // Small contribution based on company type/work mode
      return { satisfied: true, contribution: Math.round(factor.weight * 0.7) };
    default:
      return { satisfied: true, contribution: factor.weight };
  }
}

export default function ExplainSheet() {
  const { job, close } = useExplain();
  const [view, setView] = useState<"simple" | "detailed">("simple");
  
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Why you're seeing ${job.title}`}
      onClick={close}
    >
      <div
        className="bg-surface border border-border w-full sm:max-w-md rounded-t-lg sm:rounded-md p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-ink-faint">Why are you seeing this job?</p>
            <h3 className="text-lg font-semibold mt-0.5">
              {job.title} · {job.company}
            </h3>
          </div>
          <button
            onClick={close}
            className="rounded p-1 shrink-0 text-ink-soft"
            aria-label="Close explanation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5 rounded-md p-3 bg-bg">
          <div className="text-2xl font-semibold font-serif text-primary">{job.match}%</div>
          <div>
            <ConfidenceBadge level={job.confidence} />
            <p className="text-xs mt-1 text-ink-faint">
              A match score is an estimate, not a guarantee — it reflects how closely your profile
              lines up with this role.
            </p>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("simple")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              view === "simple"
                ? "bg-primary-soft text-primary"
                : "bg-bg text-ink-soft hover:text-ink"
            }`}
          >
            Simple explanation
          </button>
          <button
            onClick={() => setView("detailed")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              view === "detailed"
                ? "bg-primary-soft text-primary"
                : "bg-bg text-ink-soft hover:text-ink"
            }`}
          >
            Detailed breakdown
          </button>
        </div>

        {view === "simple" ? (
          <>
            <p className="text-sm font-medium mb-2">Your match is based on:</p>
        <ul className="space-y-2.5 text-sm mb-4">
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-success">
              ✓
            </span>
            <span>
              <strong>Skills</strong> — {job.skills.join(", ")} appear in your profile.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-success">
              ✓
            </span>
            <span>
              <strong>Experience</strong> — your profile is consistent with {job.experience}.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="text-success">
              ✓
            </span>
            <span>
              <strong>Location</strong> — {job.location} matches one of your saved preferences.
            </span>
          </li>
          {job.missingSkills.length > 0 && (
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-warning">
                ⚠
              </span>
              <span>
                <strong>Missing skill</strong> — {job.missingSkills.join(", ")}{" "}
                {job.missingSkills.length > 1 ? "aren't" : "isn't"} clearly listed on your profile.
              </span>
            </li>
          )}
        </ul>
          </>
        ) : (
          <>
            <p className="text-sm font-medium mb-2">Score breakdown by factor:</p>
            <div className="space-y-2 text-sm mb-4">
              {RANKING_FACTORS.map((factor) => {
                const { satisfied, contribution } = calculateFactorContribution(job, factor);
                return (
                  <div key={factor.name} className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className={satisfied ? "text-success" : "text-warning"}>
                        {satisfied ? "✓" : "⚠"}
                      </span>
                      <div>
                        <span className="font-medium text-ink">{factor.name}</span>
                        <span className="text-xs text-ink-faint ml-2">({factor.weight}% weight)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-primary">{contribution}%</span>
                      <span className="text-xs text-ink-faint ml-1">contribution</span>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center py-2 font-medium">
                <span>Total match score</span>
                <span className="text-primary">{job.match}%</span>
              </div>
            </div>
          </>
        )}

        <details className="text-sm mb-5">
          <summary className="cursor-pointer font-medium text-primary rounded">
            How is this score calculated?
          </summary>
          <p className="mt-2 leading-relaxed text-ink-soft">
            In this redesign, a job's match score is a weighted combination of skills overlap,
            experience fit, location preference, salary preference, and other saved preferences.
            It is a simplified, illustrative model built for this prototype — not a claim about
            how any real platform ranks jobs.
          </p>
        </details>

        <div className="flex gap-2 pt-3 border-t border-border">
          <button className="bg-primary hover:bg-primary-hover text-white flex-1 rounded-md px-3 py-2 text-sm font-medium">
            View full job
          </button>
          <button className="border border-border-strong hover:bg-primary-soft text-primary flex-1 rounded-md px-3 py-2 text-sm font-medium">
            Update my profile
          </button>
        </div>
      </div>
    </div>
  );
}
