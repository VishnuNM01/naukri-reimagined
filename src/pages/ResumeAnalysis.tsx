import { useState } from "react";
import { ArrowLeft, Check, X, Edit2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resumeProfile } from "../data/resumeProfile";

interface FieldState {
  isConfirmed: boolean;
  isEditing: boolean;
  editedValue: string;
}

export default function ResumeAnalysis() {
  const navigate = useNavigate();
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({});

  const handleConfirm = (field: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { ...prev[field], isConfirmed: true, isEditing: false },
    }));
  };

  const handleStartEdit = (field: string, currentValue: string | null) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        isEditing: true,
        editedValue: currentValue || "",
      },
    }));
  };

  const handleSaveEdit = (field: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { ...prev[field], isEditing: false, isConfirmed: true },
    }));
  };

  const handleCancelEdit = (field: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { ...prev[field], isEditing: false },
    }));
  };

  const handleEditChange = (field: string, value: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { ...prev[field], editedValue: value },
    }));
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
        <h1 className="text-3xl font-semibold">Resume Analysis</h1>
        <p className="mt-2 text-ink-soft">
          Review what we detected from your resume and confirm or correct the information.
        </p>
      </div>

      {/* Profile completion */}
      <div className="bg-surface border border-border rounded-md p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-ink">Your profile is {resumeProfile.completionPercent}% complete</span>
        </div>
        <div className="w-full bg-bg rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${resumeProfile.completionPercent}%` }}
          />
        </div>
      </div>

      {/* Skills detected */}
      <div className="bg-surface border border-border rounded-md p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Skills detected</h2>
        <div className="flex flex-wrap gap-2">
          {resumeProfile.detectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 bg-success-soft text-success rounded px-3 py-1.5 text-sm font-medium"
            >
              <span aria-hidden="true">
                <Check size={14} />
              </span>
              {skill}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-faint">
          These skills were confidently identified from your resume.
        </p>
      </div>

      {/* Information we're uncertain about */}
      <div className="bg-surface border border-border rounded-md p-5">
        <h2 className="text-lg font-semibold mb-4">Information we're uncertain about</h2>
        <p className="text-sm text-ink-soft mb-4">
          The following information needs your confirmation. You have the final say over what's correct.
        </p>

        <div className="space-y-4">
          {resumeProfile.uncertainFields.map((uncertainField) => {
            const fieldState = fieldStates[uncertainField.field] || {
              isConfirmed: false,
              isEditing: false,
              editedValue: "",
            };

            return (
              <div
                key={uncertainField.field}
                className={`border-l-4 p-4 rounded-r ${
                  fieldState.isConfirmed
                    ? "border-l-success bg-success-soft/30"
                    : "border-l-warning bg-warning-soft/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-ink mb-1">{uncertainField.field}</h3>
                    {fieldState.isEditing ? (
                      <input
                        type="text"
                        value={fieldState.editedValue}
                        onChange={(e) => handleEditChange(uncertainField.field, e.target.value)}
                        className="w-full bg-surface border border-border rounded px-3 py-2 text-sm outline-none focus:border-border-strong"
                        placeholder="Enter the correct value"
                      />
                    ) : fieldState.isConfirmed ? (
                      <div className="flex items-center gap-2">
                        <span className="text-success">
                          <Check size={16} />
                        </span>
                        <span className="text-sm text-ink">
                          {fieldState.editedValue || uncertainField.detectedValue || "Confirmed"}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-ink-soft">{uncertainField.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {fieldState.isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(uncertainField.field)}
                          className="inline-flex items-center gap-1 bg-primary hover:bg-primary-hover text-white rounded px-3 py-1.5 text-sm font-medium"
                        >
                          <Save size={14} /> Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(uncertainField.field)}
                          className="inline-flex items-center gap-1 border border-border-strong hover:bg-primary-soft text-primary rounded px-3 py-1.5 text-sm font-medium"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </>
                    ) : fieldState.isConfirmed ? (
                      <span className="inline-flex items-center gap-1.5 bg-success-soft text-success rounded px-2 py-1 text-xs font-medium">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                        Confirmed
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleConfirm(uncertainField.field)}
                          className="inline-flex items-center gap-1 bg-success hover:opacity-90 text-white rounded px-3 py-1.5 text-sm font-medium"
                        >
                          <Check size={14} /> Yes, that's right
                        </button>
                        <button
                          onClick={() =>
                            handleStartEdit(uncertainField.field, uncertainField.detectedValue)
                          }
                          className="inline-flex items-center gap-1 border border-border-strong hover:bg-primary-soft text-primary rounded px-3 py-1.5 text-sm font-medium"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
