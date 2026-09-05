import { Link } from "react-router-dom";

export default function ComingSoon({ label }: { label: string }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-24 text-center">
      <p className="text-sm mb-2 text-ink-faint">{label}</p>
      <h2 className="text-2xl font-semibold mb-3">This page is being built next</h2>
      <p className="text-sm max-w-md mx-auto mb-6 text-ink-soft">
        This prototype is being developed one feature at a time. The homepage and
        explainability panel are ready — this view comes in the next iteration.
      </p>
      <Link
        to="/"
        className="inline-block border border-border-strong hover:bg-primary-soft text-primary rounded-md px-4 py-2 text-sm font-medium"
      >
        Back to homepage
      </Link>
    </main>
  );
}
