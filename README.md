# Naukri Reimagined — A Human-Centred AI Job Discovery Platform

A conceptual, academic redesign exploring Human-Centred AI (HCAI) interaction principles
through a job-search platform inspired by Naukri.com. **This is not the real Naukri.com** and
makes no claims about its actual algorithms, UI, or behaviour.

## Getting started (in Cursor or any editor)

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To type-check and build for production:

```bash
npm run build
npm run preview
```

## Project status

Built incrementally, one feature at a time, per the course brief's development rule.

| Status | Route | Feature |
|---|---|---|
| ✅ Done | `/` | Homepage — hero search, popular searches, recommended jobs, explainability sheet |
| ✅ Done | (global) | "Why this job?" explainability panel (`ExplainSheet`) |
| ✅ Done | (global) | Confidence badge system (`ConfidenceBadge`) — high / medium / low |
| ✅ Done | `/jobs` | Job Search Results — filters, sorting, low-confidence example |
| ✅ Done | `/jobs/:id` | Job Details |
| ✅ Done | `/ai-search` | Naukri AI — conversational search with confirm-before-search |
| ✅ Done | `/resume` | Resume Analysis — AI-detected skills, uncertainty, correction |
| ✅ Done | `/compare` | Job Comparison |
| ✅ Done | `/recommendations` | Recommendation Transparency / Fairness |

## Folder structure

```
src/
  components/       Reusable UI: Nav, JobCard, ConfidenceBadge, ExplainSheet
  context/          ExplainContext — lets any page open the "Why this job?" sheet
  data/             Mock job data (src/data/jobs.ts) — no backend, no real API
  pages/            One file per route
  types.ts          Shared TypeScript types (Job, ConfidenceLevel)
  App.tsx           Route table + shell (nav, footer, global explain sheet)
  main.tsx          Entry point, wraps App in BrowserRouter
```

## Design system

Defined in `tailwind.config.js` under `theme.extend.colors` — a restrained, institutional
palette (deep navy-teal primary, muted saffron accent) deliberately avoiding the generic
"AI-app" look (warm cream + terracotta, or near-black + neon accent). Typography is IBM Plex
Serif (headings) + IBM Plex Sans (body/UI) — chosen partly because Plex has Indic script
support, a small nod to the brief's "Indian AI product landscape" angle.

Confidence states (`high` / `medium` / `low`) are never color-only: every badge pairs a color
with a text label, per the accessibility requirement.

## How this demonstrates the syllabus

| Syllabus topic | Where it shows up |
|---|---|
| Probabilistic systems, trust calibration | Match % + confidence badge on every job card |
| Explainability vs transparency (XAI) | "Why this job?" panel — reasons, confidence, plain-language "how is this calculated?" |
| Communicating uncertainty | Confidence badges styled distinctly (color + label + dot), low-confidence jobs shown alongside high-confidence ones |
| Graceful degradation / recovery dialogue | AI Search uncertainty state (`src/pages/AiSearch.tsx`) asks specific follow-up questions; Job Search empty-results state offers clear filters; Resume Analysis lets users correct uncertain fields |
| When not to use conversational UI | Manual search fields on the homepage work independently of the AI-search entry point; persistent note on AI Search page emphasizes optional use |
| Human control | Every AI surface pairs with a manual alternative and an edit/correct action (AI Search → manual search link; Resume Analysis → edit/correct fields; Compare → no winner declaration) |
| Algorithmic bias & fairness | RecommendationTransparency.tsx — visible ranking-factor breakdown, fairness explainer with concrete bias examples |

## Mock AI approach

There is no real backend, database, or ML model. "AI behaviour" (match scores, confidence
levels, detected skills, conversational parsing) is simulated with static mock data
(`src/data/jobs.ts`) and deterministic frontend logic, per the assignment's constraints.

## Possible future improvements

- Persist user corrections from Resume Analysis (localStorage or backend)
- Add a real backend with actual job data and user profiles
- Implement saved jobs and application tracking
- Add more sophisticated query parsing for AI Search
- Expand the bias/fairness explainer with interactive examples
