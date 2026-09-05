import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RANKING_FACTORS = [
  { name: "Skills match", weight: 40 },
  { name: "Experience match", weight: 25 },
  { name: "Location", weight: 20 },
  { name: "Salary preference", weight: 10 },
  { name: "Other preferences", weight: 5 },
];

export default function RecommendationTransparency() {
  const navigate = useNavigate();

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-primary mb-4"
        >
          <ArrowLeft size={16} /> Back to home
        </button>
        <h1 className="text-3xl font-semibold">Recommendation Transparency</h1>
        <p className="mt-2 text-ink-soft">
          Understand how job recommendations are ranked and what factors influence what you see.
        </p>
      </div>

      {/* Section 1: Why are these jobs ranked? */}
      <section className="bg-surface border border-border rounded-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Why are these jobs ranked?</h2>
        
        <div className="space-y-3 mb-4">
          {RANKING_FACTORS.map((factor) => (
            <div key={factor.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-ink">{factor.name}</span>
                <span className="text-ink-soft">{factor.weight}%</span>
              </div>
              <div className="w-full bg-bg rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${factor.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-faint mt-4">
          These percentages are illustrative UI data for this prototype — not a claim about any real
          platform's algorithm. The actual weights and factors used by any real job platform may differ
          significantly.
        </p>
      </section>

      {/* Section 2: About recommendation fairness */}
      <section className="bg-bg border border-border rounded-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">About recommendation fairness</h2>
        
        <p className="text-sm text-ink mb-4 leading-relaxed">
          Recommendation systems can inherit biases from data and design choices. This interface makes
          important ranking factors visible so users can better understand how recommendations are produced.
        </p>

        <ul className="space-y-2 text-sm text-ink-soft mb-4">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Training data may reflect past hiring patterns that include historical biases.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Interface design can nudge attention toward certain listings over others.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Incomplete profile data can skew results when the system fills in gaps with assumptions.</span>
          </li>
        </ul>

        <p className="text-xs text-ink-faint">
          This is a conceptual redesign exploring Human-Centred AI interaction. It makes no claims about
          any real platform's actual algorithm or fairness practices.
        </p>
      </section>

      {/* Section 3: Tie it back to control */}
      <section className="bg-surface border border-border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">You're in control</h2>
        
        <p className="text-sm text-ink-soft mb-4">
          You don't have to rely on AI recommendations. You can always search and view jobs using manual
          filters, giving you direct control over what you see.
        </p>

        <button
          onClick={() => navigate("/jobs")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Use manual search with exact filters <ChevronRight size={16} />
        </button>
      </section>
    </main>
  );
}
