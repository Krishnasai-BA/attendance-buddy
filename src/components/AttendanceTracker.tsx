import { useState } from "react";
import { Plus, Trash2, GraduationCap, Calculator } from "lucide-react";

interface Subject {
  id: number;
  name: string;
  present: string;
  total: string;
}

const getStatusColor = (percentage: number) => {
  if (percentage >= 75) return "text-success";
  if (percentage >= 60) return "text-warning";
  return "text-destructive";
};

const getStatusBg = (percentage: number) => {
  if (percentage >= 75) return "bg-success/10";
  if (percentage >= 60) return "bg-warning/10";
  return "bg-destructive/10";
};

const getBarColor = (percentage: number) => {
  if (percentage >= 75) return "bg-success";
  if (percentage >= 60) return "bg-warning";
  return "bg-destructive";
};

let nextId = 1;

const AttendanceTracker = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: "Mathematics", present: "", total: "" },
    { id: nextId++, name: "Physics", present: "", total: "" },
    { id: nextId++, name: "Chemistry", present: "", total: "" },
    { id: nextId++, name: "Programming", present: "", total: "" },
  ]);

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      { id: nextId++, name: "", present: "", total: "" },
    ]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = (id: number, field: keyof Subject, value: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calcPercentage = (present: string, total: string) => {
    const p = parseInt(present);
    const t = parseInt(total);
    if (isNaN(p) || isNaN(t) || t === 0) return null;
    return Math.min((p / t) * 100, 100);
  };

  const overallStats = subjects.reduce(
    (acc, s) => {
      const p = parseInt(s.present);
      const t = parseInt(s.total);
      if (!isNaN(p) && !isNaN(t) && t > 0) {
        acc.present += p;
        acc.total += t;
        acc.valid++;
      }
      return acc;
    },
    { present: 0, total: 0, valid: 0 }
  );

  const overallPercentage =
    overallStats.total > 0
      ? (overallStats.present / overallStats.total) * 100
      : null;

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Attendance Tracker
          </h1>
          <p className="mt-2 text-muted-foreground">
            B.Tech • Track your subject-wise attendance
          </p>
        </div>

        {/* Overall Card */}
        {overallPercentage !== null && (
          <div
            className={`mb-6 rounded-2xl border p-5 ${getStatusBg(overallPercentage)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overall Attendance
                </p>
                <p
                  className={`mt-1 font-mono text-3xl font-bold ${getStatusColor(overallPercentage)}`}
                >
                  {overallPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {overallStats.present} / {overallStats.total} classes
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {overallStats.valid} subject{overallStats.valid !== 1 && "s"}{" "}
                  tracked
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(overallPercentage)}`}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Subject List */}
        <div className="space-y-3">
          {subjects.map((subject) => {
            const pct = calcPercentage(subject.present, subject.total);
            return (
              <div
                key={subject.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {/* Subject Name */}
                  <input
                    type="text"
                    placeholder="Subject name"
                    value={subject.name}
                    onChange={(e) =>
                      updateSubject(subject.id, "name", e.target.value)
                    }
                    className="flex-1 border-none bg-transparent text-sm font-semibold text-card-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {/* Present */}
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Present
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={subject.present}
                      onChange={(e) =>
                        updateSubject(subject.id, "present", e.target.value)
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Total */}
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Total Classes
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={subject.total}
                      onChange={(e) =>
                        updateSubject(subject.id, "total", e.target.value)
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Percentage */}
                  <div className="w-20 text-center">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      %
                    </label>
                    <div
                      className={`rounded-lg px-2 py-2 font-mono text-sm font-bold ${
                        pct !== null
                          ? `${getStatusBg(pct)} ${getStatusColor(pct)}`
                          : "text-muted-foreground"
                      }`}
                    >
                      {pct !== null ? `${pct.toFixed(1)}` : "—"}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {pct !== null && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct)}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Subject Button */}
        <button
          onClick={addSubject}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </button>

        {/* Info */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Calculator className="mr-1 inline h-3 w-3" />
          75% attendance is required to be eligible for exams
        </p>
      </div>
    </div>
  );
};

export default AttendanceTracker;
