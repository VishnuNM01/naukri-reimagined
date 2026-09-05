import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { jobs, popularSearches } from "../data/jobs";
import JobCard from "../components/JobCard";

export default function Homepage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const recommended = useMemo(() => jobs.slice(0, 6), []);

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight max-w-xl">
            Find your next opportunity
          </h1>
          <p className="mt-3 text-base max-w-lg text-ink-soft">
            Search openings directly, or let Naukri AI help you narrow things down — you decide
            which to use.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/jobs");
            }}
            className="mt-8 bg-surface border border-border rounded-md p-2 flex flex-col sm:flex-row gap-2"
          >
            <label className="sr-only" htmlFor="q">
              Job title, skills or company
            </label>
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search size={18} className="text-ink-faint" />
              <input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, skills or company"
                className="w-full py-2.5 border-0 outline-none bg-transparent"
              />
            </div>
            <div className="hidden sm:block w-px my-1 bg-border" />
            <label className="sr-only" htmlFor="loc">
              Location
            </label>
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={18} className="text-ink-faint" />
              <input
                id="loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full py-2.5 border-0 outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white rounded-md px-6 py-2.5 text-sm font-medium whitespace-nowrap"
            >
              Search jobs
            </button>
          </form>

          <button
            onClick={() => navigate("/ai-search")}
            className="mt-3 inline-flex items-center gap-1.5 text-sm rounded text-accent"
          >
            <Sparkles size={14} /> Or describe what you want in your own words →
          </button>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-faint">Popular:</span>
            {popularSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="rounded-full border border-border-strong px-3 py-1 text-ink-soft"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-1">
          <h2 className="text-2xl font-semibold">Recommended for you</h2>
          <button
            onClick={() => navigate("/jobs")}
            className="text-sm font-medium inline-flex items-center gap-1 text-primary"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink-soft">
            Based on your saved skills and preferences. Match scores are estimates — not
            guarantees of fit.
          </p>
          <button
            onClick={() => navigate("/recommendations")}
            className="text-sm text-primary hover:underline"
          >
            Why are these jobs ranked?
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </main>
  );
}
