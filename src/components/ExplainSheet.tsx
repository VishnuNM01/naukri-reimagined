import { X } from "lucide-react";
import { useExplain } from "../context/ExplainContext";
import ConfidenceBadge from "./ConfidenceBadge";

export default function ExplainSheet() {
  const { job, close } = useExplain();
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
