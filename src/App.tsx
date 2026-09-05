import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ExplainSheet from "./components/ExplainSheet";
import { ExplainProvider } from "./context/ExplainContext";
import Homepage from "./pages/Homepage";
import JobSearchResults from "./pages/JobSearchResults";
import ComingSoon from "./pages/ComingSoon";

export default function App() {
  return (
    <ExplainProvider>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/jobs" element={<JobSearchResults />} />
            <Route path="/jobs/:id" element={<ComingSoon label="Job Details" />} />
            <Route path="/ai-search" element={<ComingSoon label="Naukri AI — Conversational Search" />} />
            <Route path="/resume" element={<ComingSoon label="Resume Analysis" />} />
            <Route path="/compare" element={<ComingSoon label="Job Comparison" />} />
            <Route path="/recommendations" element={<ComingSoon label="Recommendation Transparency" />} />
            <Route path="*" element={<ComingSoon label="Not found" />} />
          </Routes>
        </div>
        <footer className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-ink-faint">
            Naukri Reimagined is a conceptual, academic redesign exploring Human-Centred AI
            interaction. It is not affiliated with, and makes no claims about, the real
            Naukri.com platform or its algorithms.
          </div>
        </footer>
        <ExplainSheet />
      </div>
    </ExplainProvider>
  );
}
