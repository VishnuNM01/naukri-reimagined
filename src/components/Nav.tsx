import { NavLink, Link } from "react-router-dom";

const items = [
  { to: "/jobs", label: "Jobs" },
  { to: "/ai-search", label: "Naukri AI" },
  { to: "/resume", label: "Resume" },
  { to: "/compare", label: "Compare" },
];

export default function Nav() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="rounded flex items-center gap-2">
          <span className="font-serif text-lg font-semibold">Naukri Reimagined</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Primary">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `rounded ${isActive ? "text-primary font-medium" : "text-ink-soft hover:text-ink"}`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>
        <button className="bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2 text-sm font-medium hidden sm:block">
          Sign in
        </button>
      </div>
    </header>
  );
}
