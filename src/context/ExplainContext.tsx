import React, { createContext, useContext, useMemo, useState } from "react";
import type { Job } from "../types";

interface ExplainContextValue {
  job: Job | null;
  open: (job: Job) => void;
  close: () => void;
}

const ExplainContext = createContext<ExplainContextValue | null>(null);

export function ExplainProvider({ children }: { children: React.ReactNode }) {
  const [job, setJob] = useState<Job | null>(null);

  const value = useMemo(
    () => ({
      job,
      open: (j: Job) => setJob(j),
      close: () => setJob(null),
    }),
    [job]
  );

  return <ExplainContext.Provider value={value}>{children}</ExplainContext.Provider>;
}

export function useExplain() {
  const ctx = useContext(ExplainContext);
  if (!ctx) throw new Error("useExplain must be used inside ExplainProvider");
  return ctx;
}
