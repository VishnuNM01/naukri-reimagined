import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Sparkles, ArrowLeft } from "lucide-react";
import { jobs } from "../data/jobs";
import JobCard from "../components/JobCard";
import { parseQuery, type ParsedQuery } from "../lib/parseQuery";

type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  parsed?: ParsedQuery;
  showJobs?: boolean;
  jobResults?: typeof jobs;
  originalUserQuery?: string;
};

export default function AiSearch() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processSubmission(input);
  };

  const processSubmission = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessageId = Date.now().toString();
    const aiMessageId = (Date.now() + 1).toString();
    const currentInput = queryText;

    const userMessage: Message = {
      id: userMessageId,
      type: "user",
      content: currentInput,
    };

    const parsed = parseQuery(currentInput);
    const aiMessage: Message = {
      id: aiMessageId,
      type: "ai",
      content: parsed.uncertain 
        ? parsed.uncertaintyReason || "I couldn't understand some parts of your query."
        : "I understood your preferences. Is this correct?",
      parsed,
      showJobs: false,
      originalUserQuery: currentInput,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
    setIsEditing(false);
  };

  const handleConfirmSearch = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.parsed) {
          const filteredJobs = filterJobs(msg.parsed);
          return {
            ...msg,
            showJobs: true,
            jobResults: filteredJobs,
          };
        }
        return msg;
      })
    );
  };

  const handleEdit = (originalContent: string) => {
    setInput(originalContent);
    setIsEditing(true);
  };

  const filterJobs = (parsed: ParsedQuery) => {
    return jobs.filter((job) => {
      let matches = true;

      if (parsed.role) {
        const roleMatch = job.title.toLowerCase().includes(parsed.role.toLowerCase());
        matches = matches && roleMatch;
      }

      if (parsed.location) {
        const locationMatch = job.location.toLowerCase() === parsed.location.toLowerCase();
        matches = matches && locationMatch;
      }

      if (parsed.experience === "fresher") {
        const expMatch = job.experience.includes("0") || job.experience.includes("1");
        matches = matches && expMatch;
      } else if (parsed.experience === "experienced") {
        const expMatch = job.experience.includes("2") || job.experience.includes("3") || 
                        job.experience.includes("4") || job.experience.includes("5");
        matches = matches && expMatch;
      }

      if (parsed.minSalary) {
        const salaryMatch = job.salaryMin >= parsed.minSalary;
        matches = matches && salaryMatch;
      }

      return matches;
    });
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-primary mb-4"
        >
          <ArrowLeft size={16} /> Back to home
        </button>
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Sparkles className="text-accent" size={28} />
          Naukri AI
        </h1>
        <p className="mt-2 text-ink-soft">
          Describe what you're looking for in your own words, and I'll help you find matching jobs.
        </p>
      </div>

      {/* Persistent note about manual search */}
      <div className="mb-6 p-3 bg-bg border border-border rounded text-sm text-ink-soft">
        <span className="font-medium text-ink">Note:</span> Conversational search is optional. 
        You can also use{" "}
        <button onClick={() => navigate("/jobs")} className="text-primary font-medium hover:underline">
          manual search with exact filters
        </button>{" "}
        if you prefer.
      </div>

      {/* Chat messages */}
      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === "user" ? (
              <div className="flex justify-end">
                <div className="bg-primary text-white rounded-lg px-4 py-2.5 max-w-[80%]">
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="max-w-[90%]">
                  <div className="bg-surface border border-border rounded-lg px-4 py-2.5">
                    <p className="text-sm text-ink">{message.content}</p>
                  </div>

                  {message.parsed && !message.parsed.uncertain && !message.showJobs && (
                    <div className="mt-3 p-4 bg-accent-soft border border-accent rounded-md">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-accent uppercase tracking-wide">
                          AI-interpreted
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {message.parsed.role && (
                          <div>
                            <span className="text-ink-faint">Role:</span>{" "}
                            <span className="font-medium text-ink capitalize">{message.parsed.role}</span>
                          </div>
                        )}
                        {message.parsed.location && (
                          <div>
                            <span className="text-ink-faint">Location:</span>{" "}
                            <span className="font-medium text-ink">{message.parsed.location}</span>
                          </div>
                        )}
                        {message.parsed.experience && (
                          <div>
                            <span className="text-ink-faint">Experience:</span>{" "}
                            <span className="font-medium text-ink capitalize">{message.parsed.experience}</span>
                          </div>
                        )}
                        {message.parsed.minSalary && (
                          <div>
                            <span className="text-ink-faint">Minimum Salary:</span>{" "}
                            <span className="font-medium text-ink">₹{message.parsed.minSalary} LPA</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleConfirmSearch(message.id)}
                          className="bg-primary hover:bg-primary-hover text-white rounded-md px-3 py-1.5 text-sm font-medium"
                        >
                          Yes, find jobs
                        </button>
                        <button
                          onClick={() => handleEdit(message.originalUserQuery || "")}
                          className="border border-border-strong hover:bg-primary-soft text-primary rounded-md px-3 py-1.5 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}

                  {message.showJobs && message.jobResults && (
                    <div className="mt-4 space-y-3">
                      {message.jobResults.length > 0 ? (
                        <>
                          <p className="text-sm text-ink-soft">
                            Found {message.jobResults.length} matching job{message.jobResults.length !== 1 ? "s" : ""}:
                          </p>
                          {message.jobResults.map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                        </>
                      ) : (
                        <div className="bg-surface border border-border rounded-md p-4">
                          <p className="text-sm text-ink-soft mb-2">
                            I couldn't find any close matches with those criteria.
                          </p>
                          <button
                            onClick={() => navigate("/jobs")}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Search manually with exact filters →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 bg-bg border-t border-border pt-4">
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="ai-query">
            Describe what you're looking for
          </label>
          <input
            id="ai-query"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEditing ? "Edit your query..." : "Describe what you're looking for..."}
            className="flex-1 bg-surface border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-border-strong"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-primary hover:bg-primary-hover disabled:bg-border disabled:cursor-not-allowed text-white rounded-md px-4 py-2.5 flex items-center gap-1.5 text-sm font-medium"
          >
            <Send size={16} />
            {isEditing ? "Update" : "Send"}
          </button>
        </div>
        
        {/* Demo affordance */}
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => {
              const vagueQuery = "find me something good";
              setInput(vagueQuery);
              processSubmission(vagueQuery);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink"
          >
            <span className="bg-accent-soft text-accent rounded px-1.5 py-0.5 text-[10px] font-medium uppercase">
              Demo
            </span>
            Try a vague example
          </button>
        </div>
      </form>
    </main>
  );
}
