import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, ChevronRight } from "lucide-react";
import { jobs } from "../data/jobs";
import ConfidenceBadge from "../components/ConfidenceBadge";
import { useExplain } from "../context/ExplainContext";

export default function Compare() {
  const navigate = useNavigate();
  const { open } = useExplain();
  const [jobAId, setJobAId] = useState(jobs[0].id);
  const [jobBId, setJobBId] = useState(jobs[1].id);

  const jobA = jobs.find((j) => j.id === jobAId);
  const jobB = jobs.find((j) => j.id === jobBId);

  const getBetterValue = (valueA: number, valueB: number) => {
    if (valueA > valueB) return "A";
    if (valueB > valueA) return "B";
    return "equal";
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="text-warning">
        {"★".repeat(fullStars)}
        {hasHalfStar && "½"}
        {"☆".repeat(emptyStars)}
        <span className="text-ink-soft ml-1">{rating.toFixed(1)}</span>
      </span>
    );
  };

  if (!jobA || !jobB) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-primary mb-4"
        >
          <ArrowLeft size={16} /> Back to home
        </button>
        <h1 className="text-3xl font-semibold">Compare jobs</h1>
        <p className="mt-2 text-ink-soft">Compare the factors that matter to you</p>
      </div>

      {/* Job selection */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="jobA" className="block text-sm font-medium text-ink mb-2">
            Job A
          </label>
          <select
            id="jobA"
            value={jobAId}
            onChange={(e) => setJobAId(e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-border-strong"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} · {job.company}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="jobB" className="block text-sm font-medium text-ink mb-2">
            Job B
          </label>
          <select
            id="jobB"
            value={jobBId}
            onChange={(e) => setJobBId(e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-border-strong"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} · {job.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-ink-soft w-48">Factor</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink">
                {jobA.title}
                <div className="text-xs text-ink-soft font-normal">{jobA.company}</div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-ink">
                {jobB.title}
                <div className="text-xs text-ink-soft font-normal">{jobB.company}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4 text-sm text-ink-soft">Salary</td>
              <td className={`py-3 px-4 text-sm ${getBetterValue(jobA.salaryMin, jobB.salaryMin) === "A" ? "font-semibold" : ""}`}>
                {jobA.salary}
              </td>
              <td className={`py-3 px-4 text-sm ${getBetterValue(jobA.salaryMin, jobB.salaryMin) === "B" ? "font-semibold" : ""}`}>
                {jobB.salary}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 text-sm text-ink-soft">Location</td>
              <td className="py-3 px-4 text-sm">{jobA.location}</td>
              <td className="py-3 px-4 text-sm">{jobB.location}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 text-sm text-ink-soft">Experience required</td>
              <td className="py-3 px-4 text-sm">{jobA.experience}</td>
              <td className="py-3 px-4 text-sm">{jobB.experience}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 text-sm text-ink-soft">Skills match</td>
              <td className="py-3 px-4">
                <div className={`text-sm ${getBetterValue(jobA.match, jobB.match) === "A" ? "font-semibold" : ""}`}>
                  {jobA.match}%
                </div>
                <ConfidenceBadge level={jobA.confidence} />
              </td>
              <td className="py-3 px-4">
                <div className={`text-sm ${getBetterValue(jobA.match, jobB.match) === "B" ? "font-semibold" : ""}`}>
                  {jobB.match}%
                </div>
                <ConfidenceBadge level={jobB.confidence} />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 text-sm text-ink-soft">Work mode</td>
              <td className="py-3 px-4 text-sm">{jobA.workMode}</td>
              <td className="py-3 px-4 text-sm">{jobB.workMode}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 text-sm text-ink-soft">Missing skills</td>
              <td className="py-3 px-4 text-sm">
                {jobA.missingSkills.length > 0 ? (
                  <>
                    <div className="font-medium">{jobA.missingSkills.length} missing</div>
                    <div className="text-xs text-ink-soft">{jobA.missingSkills.join(", ")}</div>
                  </>
                ) : (
                  <span className="text-success">None</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm">
                {jobB.missingSkills.length > 0 ? (
                  <>
                    <div className="font-medium">{jobB.missingSkills.length} missing</div>
                    <div className="text-xs text-ink-soft">{jobB.missingSkills.join(", ")}</div>
                  </>
                ) : (
                  <span className="text-success">None</span>
                )}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4 text-sm text-ink-soft">Company rating</td>
              <td className={`py-3 px-4 text-sm ${getBetterValue(jobA.companyRating, jobB.companyRating) === "A" ? "font-semibold" : ""}`}>
                {renderStars(jobA.companyRating)}
              </td>
              <td className={`py-3 px-4 text-sm ${getBetterValue(jobA.companyRating, jobB.companyRating) === "B" ? "font-semibold" : ""}`}>
                {renderStars(jobB.companyRating)}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm text-ink-soft">Actions</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => open(jobA)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary rounded px-2 py-1"
                  >
                    <Info size={14} /> Why this job?
                  </button>
                  <button
                    onClick={() => navigate(`/jobs/${jobA.id}`)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary rounded px-2 py-1"
                  >
                    View details <ChevronRight size={14} />
                  </button>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => open(jobB)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary rounded px-2 py-1"
                  >
                    <Info size={14} /> Why this job?
                  </button>
                  <button
                    onClick={() => navigate(`/jobs/${jobB.id}`)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary rounded px-2 py-1"
                  >
                    View details <ChevronRight size={14} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-ink-faint">
        This comparison shows the factors for each job side by side. Match scores and company ratings are
        estimates — not guarantees of fit or quality.
      </p>
    </main>
  );
}
