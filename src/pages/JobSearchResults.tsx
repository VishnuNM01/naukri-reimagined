import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobs } from "../data/jobs";
import type { CompanyType, Job, WorkMode } from "../types";
import JobCard from "../components/JobCard";

type SortKey = "relevance" | "match" | "salary" | "date";

interface SalaryBucket {
  id: string;
  label: string;
  min: number;
  max: number;
}

interface Filters {
  locations: string[];
  experiences: string[];
  salaryBuckets: string[];
  workModes: WorkMode[];
  companyTypes: CompanyType[];
  skills: string[];
}

const EMPTY_FILTERS: Filters = {
  locations: [],
  experiences: [],
  salaryBuckets: [],
  workModes: [],
  companyTypes: [],
  skills: [],
};

const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "On-site"];
const COMPANY_TYPES: CompanyType[] = ["Product", "Startup", "Fintech", "Retail", "Services"];

const SALARY_BUCKETS: SalaryBucket[] = [
  { id: "under-10", label: "Under ₹10 LPA", min: 0, max: 10 },
  { id: "10-15", label: "₹10–15 LPA", min: 10, max: 15 },
  { id: "15-20", label: "₹15–20 LPA", min: 15, max: 20 },
  { id: "20-plus", label: "₹20 LPA and above", min: 20, max: Infinity },
];

const LOCATIONS = Array.from(new Set(jobs.map((j) => j.location))).sort();
const EXPERIENCES = Array.from(new Set(jobs.map((j) => j.experience))).sort();
const ALL_SKILLS = Array.from(new Set(jobs.flatMap((j) => j.skills))).sort();

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function overlapsSalary(job: Job, bucket: SalaryBucket): boolean {
  return job.salaryMin < bucket.max && job.salaryMax > bucket.min;
}

function applyFilters(list: Job[], filters: Filters): Job[] {
  return list.filter((job) => {
    if (filters.locations.length && !filters.locations.includes(job.location)) return false;
    if (filters.experiences.length && !filters.experiences.includes(job.experience)) return false;
    if (filters.workModes.length && !filters.workModes.includes(job.workMode)) return false;
    if (filters.companyTypes.length && !filters.companyTypes.includes(job.companyType)) return false;
    if (filters.skills.length && !filters.skills.every((s) => job.skills.includes(s))) return false;
    if (filters.salaryBuckets.length) {
      const selected = SALARY_BUCKETS.filter((b) => filters.salaryBuckets.includes(b.id));
      if (!selected.some((b) => overlapsSalary(job, b))) return false;
    }
    return true;
  });
}

function sortJobs(list: Job[], sort: SortKey): Job[] {
  const next = [...list];
  if (sort === "match") next.sort((a, b) => b.match - a.match);
  if (sort === "salary") next.sort((a, b) => b.salaryMax - a.salaryMax);
  if (sort === "date") next.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  return next;
}

function activeFilterCount(filters: Filters): number {
  return (
    filters.locations.length +
    filters.experiences.length +
    filters.salaryBuckets.length +
    filters.workModes.length +
    filters.companyTypes.length +
    filters.skills.length
  );
}

function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="mb-5">
      <legend className="text-sm font-medium mb-2">{legend}</legend>
      <div className="flex flex-col gap-1.5">{children}</div>
    </fieldset>
  );
}

function CheckOption({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft rounded cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {children}
    </label>
  );
}

function FilterPanel({
  filters,
  setFilters,
  onClear,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  onClear: () => void;
}) {
  const count = activeFilterCount(filters);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={count === 0}
          className="text-sm font-medium text-primary rounded disabled:text-ink-faint"
        >
          Clear all
        </button>
      </div>

      <FilterGroup legend="Location">
        {LOCATIONS.map((loc) => (
          <CheckOption
            key={loc}
            checked={filters.locations.includes(loc)}
            onChange={() => setFilters((f) => ({ ...f, locations: toggleValue(f.locations, loc) }))}
          >
            {loc}
          </CheckOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Experience">
        {EXPERIENCES.map((exp) => (
          <CheckOption
            key={exp}
            checked={filters.experiences.includes(exp)}
            onChange={() =>
              setFilters((f) => ({ ...f, experiences: toggleValue(f.experiences, exp) }))
            }
          >
            {exp}
          </CheckOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Salary range">
        {SALARY_BUCKETS.map((bucket) => (
          <CheckOption
            key={bucket.id}
            checked={filters.salaryBuckets.includes(bucket.id)}
            onChange={() =>
              setFilters((f) => ({
                ...f,
                salaryBuckets: toggleValue(f.salaryBuckets, bucket.id),
              }))
            }
          >
            {bucket.label}
          </CheckOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Work mode">
        {WORK_MODES.map((mode) => (
          <CheckOption
            key={mode}
            checked={filters.workModes.includes(mode)}
            onChange={() => setFilters((f) => ({ ...f, workModes: toggleValue(f.workModes, mode) }))}
          >
            {mode}
          </CheckOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Company type">
        {COMPANY_TYPES.map((type) => (
          <CheckOption
            key={type}
            checked={filters.companyTypes.includes(type)}
            onChange={() =>
              setFilters((f) => ({ ...f, companyTypes: toggleValue(f.companyTypes, type) }))
            }
          >
            {type}
          </CheckOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Skills">
        {ALL_SKILLS.map((skill) => (
          <CheckOption
            key={skill}
            checked={filters.skills.includes(skill)}
            onChange={() => setFilters((f) => ({ ...f, skills: toggleValue(f.skills, skill) }))}
          >
            {skill}
          </CheckOption>
        ))}
      </FilterGroup>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded p-5 flex flex-col gap-4" aria-hidden="true">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-5 w-2/3 bg-primary-soft rounded" />
          <div className="h-3 w-1/3 bg-primary-soft rounded mt-2" />
        </div>
        <div className="h-8 w-12 bg-primary-soft rounded" />
      </div>
      <div className="h-3 w-3/4 bg-primary-soft rounded" />
      <div className="flex gap-1.5">
        <div className="h-5 w-16 bg-primary-soft rounded" />
        <div className="h-5 w-12 bg-primary-soft rounded" />
        <div className="h-5 w-20 bg-primary-soft rounded" />
      </div>
      <div className="h-px bg-border" />
      <div className="h-5 w-28 bg-primary-soft rounded" />
    </div>
  );
}

export default function JobSearchResults() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  const results = useMemo(() => sortJobs(applyFilters(jobs, filters), sort), [filters, sort]);
  const filterCount = activeFilterCount(filters);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const highlightLowConfidenceJob = () => {
    const lowConfidenceJob = results.find((job) => job.confidence === "low");
    if (lowConfidenceJob) {
      setHighlightedJobId(lowConfidenceJob.id);
      const element = document.getElementById(`job-${lowConfidenceJob.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setTimeout(() => setHighlightedJobId(null), 1500);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Job search results</h1>
          <p className="text-sm mt-1 text-ink-soft">
            {loading
              ? "Matching openings to your search. Match scores are estimates — not guarantees of fit."
              : `${results.length} opening${results.length === 1 ? "" : "s"}${
                  filterCount > 0 ? " with current filters" : ""
                }. Match scores are estimates — not guarantees of fit.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="lg:hidden inline-flex items-center gap-1.5 border border-border-strong hover:bg-primary-soft text-primary rounded-md px-3 py-2 text-sm font-medium"
            onClick={() => setFiltersOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={16} />
            Filters{filterCount > 0 ? ` (${filterCount})` : ""}
          </button>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-border bg-surface rounded-md px-3 py-2 text-sm text-ink"
            >
              <option value="relevance">Relevance</option>
              <option value="match">Match score</option>
              <option value="salary">Salary</option>
              <option value="date">Date posted</option>
            </select>
          </label>
          <button
            onClick={() => navigate("/recommendations")}
            className="text-sm text-primary hover:underline"
          >
            How are jobs ranked?
          </button>
          <button
            onClick={highlightLowConfidenceJob}
            className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink"
          >
            <span className="bg-accent-soft text-accent rounded px-1.5 py-0.5 text-[10px] font-medium uppercase">
              Demo
            </span>
            Show a low-confidence example
          </button>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 bg-surface border border-border rounded-md p-5">
            <FilterPanel filters={filters} setFilters={setFilters} onClear={clearFilters} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading job results">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : results.length === 0 ? (
            <div className="bg-surface border border-border rounded-md p-8">
              <h2 className="text-lg font-semibold">No openings match these filters</h2>
              <p className="text-sm mt-2 text-ink-soft max-w-md">
                The combination of location, skills, salary, or company type is too narrow. Clear
                one filter — or all of them — to bring more roles back into the list.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((job) => (
                <div
                  key={job.id}
                  id={`job-${job.id}`}
                  className={`transition-all duration-1500 ease-out ${
                    highlightedJobId === job.id
                      ? "ring-2 ring-danger ring-opacity-75 scale-[1.02]"
                      : ""
                  }`}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end lg:hidden bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="bg-surface border-t border-border w-full rounded-t-lg p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="text-xs text-ink-faint">Narrow this list</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded p-1 shrink-0 text-ink-soft"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} onClear={clearFilters} />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-2 w-full bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 text-sm font-medium"
            >
              Show {results.length} {results.length === 1 ? "opening" : "openings"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
