import { MapPin, Briefcase, Info } from "lucide-react";
import type { Job } from "../types";
import ConfidenceBadge from "./ConfidenceBadge";
import { useExplain } from "../context/ExplainContext";

export default function JobCard({ job }: { job: Job }) {
  const { open } = useExplain();

  return (
    <div className="bg-surface border border-border hover:border-border-strong rounded p-5 flex flex-col gap-4 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold leading-snug">{job.title}</h3>
          <p className="text-sm mt-0.5 text-ink-soft">{job.company}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-semibold font-serif text-primary">{job.match}%</div>
          <div className="text-xs text-ink-faint">Match</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-soft">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase size={14} /> {job.experience}
        </span>
        <span>{job.salary}</span>
        <span>{job.workMode}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.skills.map((s) => (
          <span key={s} className="bg-primary-soft text-primary rounded px-2 py-0.5 text-xs font-medium">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <ConfidenceBadge level={job.confidence} />
        <button
          onClick={() => open(job)}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary rounded px-2 py-1"
        >
          <Info size={14} /> Why this job?
        </button>
      </div>
    </div>
  );
}
