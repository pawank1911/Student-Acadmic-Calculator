"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Share2,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  ArrowLeft,
  Settings,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { useCopyToClipboard, useShareResult } from "@/hooks/useClipboard";

/* ============================================================
   TYPES
   ============================================================ */
interface DailyLog {
  id: string;
  label: string;
  conducted: number;
  attended: number;
}

interface Subject {
  id: string;
  name: string;
  inputMode: "quick" | "daily";
  currentPercentage: string; // Used in quick mode
  totalClasses: string;      // Used in quick mode
  targetPercentage: string;  // Target percentage
  dailyLogs: DailyLog[];     // Used in daily mode
}

interface AttendanceResult {
  type: "can-skip" | "need-attend" | "already-at-target";
  classesCanSkip?: number;
  classesNeedAttend?: number;
  currentAttended: number;
  currentPercent: number;
  targetPercent: number;
}

/* ============================================================
   HELPERS & CALCULATIONS
   ============================================================ */
function getAttendanceMarks(percentage: number): { outOf5: number; outOf10: number } {
  if (percentage >= 95) return { outOf5: 5, outOf10: 10 };
  if (percentage >= 90) return { outOf5: 4, outOf10: 8 };
  if (percentage >= 85) return { outOf5: 3, outOf10: 6 };
  if (percentage >= 80) return { outOf5: 2, outOf10: 4 };
  if (percentage >= 75) return { outOf5: 1, outOf10: 2 };
  return { outOf5: 0, outOf10: 0 };
}

function getSubjectStats(subject: Subject) {
  let totalConducted = 0;
  let totalAttended = 0;
  let currentPercent = 0;

  if (subject.inputMode === "quick") {
    currentPercent = parseFloat(subject.currentPercentage) || 0;
    const total = parseFloat(subject.totalClasses) || 0;
    totalConducted = total;
    totalAttended = Math.round((currentPercent / 100) * total);
  } else {
    subject.dailyLogs.forEach((log) => {
      totalConducted += log.conducted;
      totalAttended += log.attended;
    });
    currentPercent = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;
  }

  const targetPercent = parseFloat(subject.targetPercentage) || 75;
  const marks = getAttendanceMarks(currentPercent);

  return {
    totalConducted,
    totalAttended,
    currentPercent,
    targetPercent,
    marks,
  };
}

function calculateAttendanceResult(subject: Subject): AttendanceResult | null {
  const { totalConducted, totalAttended, currentPercent, targetPercent } = getSubjectStats(subject);

  if (totalConducted === 0) {
    return {
      type: "already-at-target",
      currentAttended: 0,
      currentPercent: 0,
      targetPercent,
    };
  }

  if (Math.abs(currentPercent - targetPercent) < 0.01) {
    return {
      type: "already-at-target",
      currentAttended: totalAttended,
      currentPercent,
      targetPercent,
    };
  }

  if (currentPercent >= targetPercent) {
    const maxSkip = Math.floor((totalAttended * 100) / targetPercent - totalConducted);
    return {
      type: "can-skip",
      classesCanSkip: Math.max(0, maxSkip),
      currentAttended: totalAttended,
      currentPercent,
      targetPercent,
    };
  } else {
    if (targetPercent >= 100) return null;
    const needAttend = Math.ceil((targetPercent * totalConducted - 100 * totalAttended) / (100 - targetPercent));
    return {
      type: "need-attend",
      classesNeedAttend: Math.max(0, needAttend),
      currentAttended: totalAttended,
      currentPercent,
      targetPercent,
    };
  }
}

const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    name: "Mathematics",
    inputMode: "quick",
    currentPercentage: "82",
    totalClasses: "40",
    targetPercentage: "75",
    dailyLogs: [
      { id: "1", label: "Day 1", conducted: 2, attended: 2 },
      { id: "2", label: "Day 2", conducted: 2, attended: 1 },
      { id: "3", label: "Day 3", conducted: 3, attended: 2 },
    ],
  },
  {
    id: "sub-2",
    name: "Computer Science",
    inputMode: "daily",
    currentPercentage: "",
    totalClasses: "",
    targetPercentage: "75",
    dailyLogs: [
      { id: "1", label: "Day 1", conducted: 4, attended: 4 },
      { id: "2", label: "Day 2", conducted: 3, attended: 2 },
      { id: "3", label: "Day 3", conducted: 4, attended: 3 },
    ],
  },
];

/* ============================================================
   SUBCOMPONENTS
   ============================================================ */
function ProgressBar({
  value,
  max = 100,
  color = "primary",
  animated = true,
}: {
  value: number;
  max?: number;
  color?: "primary" | "emerald" | "rose" | "amber";
  animated?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  useEffect(() => {
    if (!animated) {
      setWidth(pct);
      return;
    }
    const timer = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(timer);
  }, [pct, animated]);

  const colorMap = {
    primary: "progress-fill",
    emerald: "progress-fill progress-fill-emerald",
    rose: "progress-fill progress-fill-rose",
    amber: "progress-fill",
  };

  return (
    <div className="progress-track">
      <div
        className={colorMap[color]}
        style={{
          width: `${width}%`,
          background:
            color === "amber"
              ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
              : undefined,
          boxShadow:
            color === "amber"
              ? "0 0 10px rgba(245,158,11,0.5)"
              : undefined,
        }}
      />
    </div>
  );
}

function InputField({
  id,
  label,
  placeholder,
  value,
  icon: Icon,
  error,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  icon: React.ComponentType<any>;
  error?: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        <Icon size={14} style={{ color: "#818cf8" }} />
        {label}
      </label>
      <input
        id={id}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-glass ${error ? "input-error" : ""}`}
        step="0.01"
        min="0"
      />
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs font-medium" style={{ color: "#fb7185" }}>
          <AlertCircle size={11} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>
      )}
    </div>
  );
}

function ResultCard({
  result,
  onCopy,
  onShare,
  copied,
  shared,
}: {
  result: AttendanceResult;
  onCopy: () => void;
  onShare: () => void;
  copied: boolean;
  shared: boolean;
}) {
  const isSuccess = result.currentPercent >= result.targetPercent;
  const cardClass = isSuccess ? "result-success" : "result-danger";
  const marks = getAttendanceMarks(result.currentPercent);

  return (
    <div className={`rounded-2xl p-6 mt-6 animate-slide-up ${cardClass}`}>
      {/* Icon + message */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isSuccess ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)",
          }}
        >
          {result.type === "can-skip" && <TrendingUp size={22} style={{ color: "#34d399" }} />}
          {result.type === "need-attend" && <TrendingDown size={22} style={{ color: "#fb7185" }} />}
          {result.type === "already-at-target" && <CheckCircle2 size={22} style={{ color: "#34d399" }} />}
        </div>
        <div className="flex-1">
          {result.type === "can-skip" && (
            <>
              <h3 className="text-lg font-bold mb-1" style={{ color: isSuccess ? "#34d399" : "#fb7185" }}>
                You&apos;re above target! 🎉
              </h3>
              <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                You can safely skip{" "}
                <span className="text-2xl font-black" style={{ color: "#34d399" }}>
                  {result.classesCanSkip}
                </span>{" "}
                {result.classesCanSkip === 1 ? "class" : "classes"}.
              </p>
            </>
          )}
          {result.type === "need-attend" && (
            <>
              <h3 className="text-lg font-bold mb-1" style={{ color: "#fb7185" }}>
                Below target — keep going! 💪
              </h3>
              <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                You need to attend{" "}
                <span className="text-2xl font-black" style={{ color: "#fb7185" }}>
                  {result.classesNeedAttend}
                </span>{" "}
                consecutive classes to reach your target.
              </p>
            </>
          )}
          {result.type === "already-at-target" && (
            <>
              <h3 className="text-lg font-bold mb-1" style={{ color: "#34d399" }}>
                Exactly on target! ✨
              </h3>
              <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                You are precisely at your attendance target. Don&apos;t miss a class!
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.15)" }}>
          <p className="text-[10px] sm:text-xs mb-1" style={{ color: "var(--text-muted)" }}>Attended</p>
          <p className="text-base sm:text-lg font-black" style={{ color: "var(--text-primary)" }}>
            {result.currentAttended}
          </p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.15)" }}>
          <p className="text-[10px] sm:text-xs mb-1" style={{ color: "var(--text-muted)" }}>Current %</p>
          <p className="text-base sm:text-lg font-black" style={{ color: isSuccess ? "#34d399" : "#fb7185" }}>
            {result.currentPercent.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(0,0,0,0.15)" }}>
          <p className="text-[10px] sm:text-xs mb-1" style={{ color: "var(--text-muted)" }}>Marks Scale</p>
          <p className="text-base sm:text-lg font-black text-amber-400">
            {marks.outOf5}/5
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          <span>Current: {result.currentPercent.toFixed(1)}%</span>
          <span>Target: {result.targetPercent.toFixed(1)}%</span>
        </div>
        <ProgressBar
          value={result.currentPercent}
          color={isSuccess ? "emerald" : "rose"}
        />
        {/* Target marker */}
        <div className="relative h-1 -mt-3">
          <div
            className="absolute w-0.5 h-4 rounded"
            style={{
              left: `${result.targetPercent}%`,
              background: "#fbbf24",
              boxShadow: "0 0 6px rgba(251,191,36,0.6)",
            }}
          />
        </div>
        <p className="text-[10px] mt-3 text-right" style={{ color: "var(--text-muted)" }}>
          ▲ Target mark
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: copied ? "rgba(16,185,129,0.2)" : "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: copied ? "#34d399" : "var(--text-primary)",
          }}
        >
          {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
          {copied ? "Copied!" : "Copy Result"}
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: shared ? "rgba(99,102,241,0.3)" : "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: shared ? "#818cf8" : "var(--text-primary)",
          }}
        >
          <Share2 size={15} />
          {shared ? "Shared!" : "Share"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN ATTENDANCE CALCULATOR COMPONENT
   ============================================================ */
export default function AttendanceCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<AttendanceResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const { copied, copy } = useCopyToClipboard();
  const { shared, share } = useShareResult();

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem("sac_subjects");
    if (stored) {
      try {
        setSubjects(JSON.parse(stored));
      } catch (e) {
        setSubjects(DEFAULT_SUBJECTS);
      }
    } else {
      setSubjects(DEFAULT_SUBJECTS);
    }
  }, []);

  // Sync to local storage
  const saveSubjects = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    localStorage.setItem("sac_subjects", JSON.stringify(newSubjects));
  };

  const activeSubject = subjects.find((s) => s.id === editingSubjectId) || null;

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    if (subjects.length >= 10) {
      setErrors({ addSubject: "Maximum limit of 10 subjects reached." });
      return;
    }

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: newSubjectName.trim(),
      inputMode: "quick",
      currentPercentage: "0",
      totalClasses: "0",
      targetPercentage: "75",
      dailyLogs: [{ id: `log-${Date.now()}`, label: "Day 1", conducted: 1, attended: 1 }],
    };

    const updated = [...subjects, newSub];
    saveSubjects(updated);
    setNewSubjectName("");
    setErrors({});
  };

  const handleDeleteSubject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (subjects.length <= 1) {
      alert("You need to keep at least one subject in your dashboard.");
      return;
    }
    if (confirm("Are you sure you want to delete this subject? All logs and percentages will be cleared.")) {
      const updated = subjects.filter((s) => s.id !== id);
      saveSubjects(updated);
      if (editingSubjectId === id) {
        setEditingSubjectId(null);
        setCalcResult(null);
      }
    }
  };

  // Modify active subject fields
  const updateActiveSubject = (updater: (subj: Subject) => void) => {
    if (!editingSubjectId) return;
    const updated = subjects.map((sub) => {
      if (sub.id === editingSubjectId) {
        const copy = JSON.parse(JSON.stringify(sub)) as Subject;
        updater(copy);
        return copy;
      }
      return sub;
    });
    saveSubjects(updated);
    if (calcResult) setCalcResult(null);
  };

  const handleCalculate = async () => {
    if (!activeSubject) return;

    // Validate
    const errs: Record<string, string> = {};
    if (activeSubject.inputMode === "quick") {
      const current = parseFloat(activeSubject.currentPercentage);
      const total = parseFloat(activeSubject.totalClasses);
      const target = parseFloat(activeSubject.targetPercentage);

      if (activeSubject.currentPercentage === "") {
        errs.currentPercentage = "Required.";
      } else if (isNaN(current) || current < 0 || current > 100) {
        errs.currentPercentage = "Must be between 0 and 100.";
      }

      if (activeSubject.totalClasses === "") {
        errs.totalClasses = "Required.";
      } else if (isNaN(total) || total <= 0 || !Number.isInteger(total)) {
        errs.totalClasses = "Must be positive whole number.";
      }

      if (activeSubject.targetPercentage === "") {
        errs.targetPercentage = "Required.";
      } else if (isNaN(target) || target <= 0 || target > 100) {
        errs.targetPercentage = "Must be between 1 and 100.";
      }
    } else {
      const target = parseFloat(activeSubject.targetPercentage);
      if (activeSubject.targetPercentage === "") {
        errs.targetPercentage = "Required.";
      } else if (isNaN(target) || target <= 0 || target > 100) {
        errs.targetPercentage = "Must be between 1 and 100.";
      }

      if (activeSubject.dailyLogs.length === 0) {
        errs.general = "Please add at least one daily class log.";
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsCalculating(true);
    await new Promise((r) => setTimeout(r, 500));

    const res = calculateAttendanceResult(activeSubject);
    if (!res) {
      setErrors({ general: "Target of 100% requires attending all classes. Impossible to skip." });
    } else {
      setCalcResult(res);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    }
    setIsCalculating(false);
  };

  const getResultText = () => {
    if (!calcResult || !activeSubject) return "";
    if (calcResult.type === "can-skip")
      return `📊 Attendance for ${activeSubject.name}: I can safely skip ${calcResult.classesCanSkip} classes! Current: ${calcResult.currentPercent.toFixed(1)}% | Target: ${calcResult.targetPercent.toFixed(1)}%`;
    if (calcResult.type === "need-attend")
      return `📊 Attendance for ${activeSubject.name}: I need to attend ${calcResult.classesNeedAttend} consecutive classes to reach ${calcResult.targetPercent.toFixed(1)}% target. Current: ${calcResult.currentPercent.toFixed(1)}%`;
    return `📊 Attendance for ${activeSubject.name}: I'm exactly at my target of ${calcResult.targetPercent.toFixed(1)}%!`;
  };

  // Daily log management
  const addDailyLog = () => {
    updateActiveSubject((sub) => {
      const nextNum = sub.dailyLogs.length + 1;
      sub.dailyLogs.push({
        id: `log-${Date.now()}-${nextNum}`,
        label: `Day ${nextNum}`,
        conducted: 1,
        attended: 1,
      });
    });
  };

  const removeDailyLog = (logId: string) => {
    updateActiveSubject((sub) => {
      sub.dailyLogs = sub.dailyLogs.filter((log) => log.id !== logId);
      // Re-label nicely
      sub.dailyLogs.forEach((log, i) => {
        log.label = `Day ${i + 1}`;
      });
    });
  };

  const updateDailyLog = (logId: string, field: "conducted" | "attended", val: number) => {
    updateActiveSubject((sub) => {
      const log = sub.dailyLogs.find((l) => l.id === logId);
      if (log) {
        log[field] = Math.max(0, val);
        if (field === "conducted" && log.attended > log.conducted) {
          log.attended = log.conducted;
        } else if (field === "attended" && log.attended > log.conducted) {
          log.conducted = log.attended;
        }
      }
    });
  };

  // Overall semester stats
  const overallConducted = subjects.reduce((acc, sub) => acc + getSubjectStats(sub).totalConducted, 0);
  const overallAttended = subjects.reduce((acc, sub) => acc + getSubjectStats(sub).totalAttended, 0);
  const overallPercentage = overallConducted > 0 ? (overallAttended / overallConducted) * 100 : 0;
  const overallMarks = getAttendanceMarks(overallPercentage);

  return (
    <div className="glass-panel card-shine p-6 sm:p-8">
      {/* ────────────────────────────────────────────────────────
         DASHBOARD VIEW
         ──────────────────────────────────────────────────────── */}
      {!activeSubject ? (
        <div className="space-y-8">
          {/* Semester Overview Header */}
          <div
            className="rounded-2xl p-5 border border-glass"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                  <Sparkles size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                    Semester Attendance Summary
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Average attendance tracked across {subjects.length} subjects
                  </p>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-4">
                <div className="text-center md:text-right">
                  <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Semester Avg</p>
                  <p className="text-3xl font-black text-indigo-400">
                    {overallPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Internal Marks</p>
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-2xl font-black text-amber-400">{overallMarks.outOf5}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="mt-4">
              <ProgressBar value={overallPercentage} color="primary" />
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm tracking-wide uppercase" style={{ color: "var(--text-muted)" }}>
                Subjects ({subjects.length}/10)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((sub) => {
                const stats = getSubjectStats(sub);
                const isSafe = stats.currentPercent >= stats.targetPercent;
                const statusBadge = isSafe ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Safe
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    At Risk
                  </span>
                );

                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setEditingSubjectId(sub.id);
                      setCalcResult(null);
                      setErrors({});
                    }}
                    className="glass-panel p-5 relative overflow-hidden group cursor-pointer hover:border-indigo-500/30 transition-all duration-300"
                    style={{ background: "rgba(0, 0, 0, 0.15)" }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-bold text-base group-hover:text-indigo-400 transition-colors duration-200" style={{ color: "var(--text-primary)" }}>
                          {sub.name}
                        </h5>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {sub.inputMode === "quick" ? "Quick summary" : `${sub.dailyLogs.length} daily logs`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {statusBadge}
                        <button
                          onClick={(e) => handleDeleteSubject(sub.id, e)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                          title="Delete Subject"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                      <span>Current: <strong style={{ color: isSafe ? "#34d399" : "#fb7185" }}>{stats.currentPercent.toFixed(1)}%</strong></span>
                      <span>Target: {stats.targetPercent}%</span>
                    </div>

                    <ProgressBar value={stats.currentPercent} color={isSafe ? "emerald" : "rose"} />

                    {/* Footer Row inside card */}
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                      <span>Classes: {stats.totalAttended}/{stats.totalConducted}</span>
                      <span className="font-bold text-amber-400">Marks: {stats.marks.outOf5}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Subject Inline Form */}
          <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
            <div className="flex-1 relative">
              <input
                type="text"
                maxLength={30}
                placeholder="Add new subject name (e.g. Physics Lab)..."
                value={newSubjectName}
                onChange={(e) => {
                  setNewSubjectName(e.target.value);
                  setErrors({});
                }}
                disabled={subjects.length >= 10}
                className="input-glass w-full pr-4"
              />
              {errors.addSubject && (
                <p className="text-xs mt-1 text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle size={11} /> {errors.addSubject}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={subjects.length >= 10 || !newSubjectName.trim()}
              className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              <span>Add Subject</span>
            </button>
          </form>
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────
           SUBJECT DETAILS / EDIT VIEW
           ──────────────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <button
              onClick={() => {
                setEditingSubjectId(null);
                setCalcResult(null);
                setErrors({});
              }}
              className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:text-indigo-400"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <div className="text-right">
              <p className="text-xs uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                Editing Subject
              </p>
            </div>
          </div>

          {/* Subject Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={activeSubject.name}
                onChange={(e) => updateActiveSubject((sub) => { sub.name = e.target.value; })}
                className="text-2xl font-black bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none w-full"
                style={{ color: "var(--text-primary)" }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Click text above to rename subject
              </p>
            </div>

            {/* Mode selection buttons */}
            <div className="glass-panel p-1 flex gap-1 self-start sm:self-center">
              <button
                type="button"
                onClick={() => updateActiveSubject((sub) => { sub.inputMode = "quick"; })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeSubject.inputMode === "quick"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Quick Mode
              </button>
              <button
                type="button"
                onClick={() => updateActiveSubject((sub) => { sub.inputMode = "daily"; })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeSubject.inputMode === "daily"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Daily Logs
              </button>
            </div>
          </div>

          {/* ── Mode 1: Quick Summary Inputs ── */}
          {activeSubject.inputMode === "quick" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                id="quick-current"
                label="Current Attendance (%)"
                placeholder="e.g. 82.5"
                value={activeSubject.currentPercentage}
                icon={TrendingUp}
                error={errors.currentPercentage}
                onChange={(v) => updateActiveSubject((sub) => { sub.currentPercentage = v; })}
                hint="Your percentage (supports decimals)"
              />
              <InputField
                id="quick-total"
                label="Total Classes Held"
                placeholder="e.g. 40"
                value={activeSubject.totalClasses}
                icon={BookOpen}
                error={errors.totalClasses}
                onChange={(v) => updateActiveSubject((sub) => { sub.totalClasses = v; })}
                hint="Total number of conducted classes"
              />
              <InputField
                id="quick-target"
                label="Target Attendance (%)"
                placeholder="e.g. 75"
                value={activeSubject.targetPercentage}
                icon={CalendarCheck}
                error={errors.targetPercentage}
                onChange={(v) => updateActiveSubject((sub) => { sub.targetPercentage = v; })}
                hint="Target needed (usually 75%)"
              />
            </div>
          )}

          {/* ── Mode 2: Daily Log Inputs ── */}
          {activeSubject.inputMode === "daily" && (
            <div className="space-y-4">
              {/* Daily Log Header Summary */}
              {(() => {
                const stats = getSubjectStats(activeSubject);
                const isSafe = stats.currentPercent >= stats.targetPercent;
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl" style={{ background: "rgba(0, 0, 0, 0.2)" }}>
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Calculated Attendance</p>
                      <p className="text-xl font-black" style={{ color: isSafe ? "#34d399" : "#fb7185" }}>
                        {stats.currentPercent.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0 sm:pl-4">
                      <p className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Total Attended</p>
                      <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                        {stats.totalAttended} / {stats.totalConducted}
                      </p>
                    </div>
                    <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0 sm:pl-4">
                      <p className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>Daily Attendance Marks</p>
                      <p className="text-xl font-black text-amber-400">
                        {stats.marks.outOf5} / 5 Marks
                      </p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end">
                      <InputField
                        id="daily-target"
                        label="Target %"
                        placeholder="75"
                        value={activeSubject.targetPercentage}
                        icon={CalendarCheck}
                        error={errors.targetPercentage}
                        onChange={(v) => updateActiveSubject((sub) => { sub.targetPercentage = v; })}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Logs List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {activeSubject.dailyLogs.length === 0 ? (
                  <p className="text-center py-6 text-sm" style={{ color: "var(--text-muted)" }}>
                    No daily logs added yet. Add a class log below.
                  </p>
                ) : (
                  activeSubject.dailyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl border border-glass-dim hover:border-glass transition-all duration-200"
                      style={{ background: "rgba(255, 255, 255, 0.02)" }}
                    >
                      <span className="text-sm font-bold w-16" style={{ color: "var(--text-primary)" }}>
                        {log.label}
                      </span>

                      {/* Conducted Input */}
                      <div className="flex-1 flex items-center gap-2 justify-center">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Conducted:</span>
                        <input
                          type="number"
                          value={log.conducted}
                          min={1}
                          onChange={(e) => updateDailyLog(log.id, "conducted", parseInt(e.target.value) || 1)}
                          className="input-glass !w-16 !p-1 text-center font-bold"
                        />
                      </div>

                      {/* Attended Input */}
                      <div className="flex-1 flex items-center gap-2 justify-center">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Attended:</span>
                        <input
                          type="number"
                          value={log.attended}
                          min={0}
                          max={log.conducted}
                          onChange={(e) => updateDailyLog(log.id, "attended", parseInt(e.target.value) || 0)}
                          className="input-glass !w-16 !p-1 text-center font-bold"
                        />
                      </div>

                      {/* Delete log row */}
                      <button
                        type="button"
                        onClick={() => removeDailyLog(log.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all duration-200"
                        title="Delete log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Day Button */}
              <button
                type="button"
                onClick={addDailyLog}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                style={{ color: "#818cf8" }}
              >
                <PlusCircle size={16} />
                <span>Add Daily Class Log</span>
              </button>
            </div>
          )}

          {/* General Errors */}
          {(errors.general || errors.currentPercentage || errors.totalClasses || errors.targetPercentage) && (
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
              <XCircle size={15} style={{ color: "#fb7185", flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: "#fb7185" }}>
                {errors.general || "Please fix input errors shown above."}
              </p>
            </div>
          )}

          {/* Calculate and reset active subject logs */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              id="att-calculate-btn"
            >
              {isCalculating ? (
                <>
                  <div className="spinner !w-4 !h-4 !border-2" style={{ borderTopColor: "white" }} />
                  <span>Calculating...</span>
                </>
              ) : (
                <span>Calculate Target Status</span>
              )}
            </button>
            <button
              onClick={() => {
                if (activeSubject.inputMode === "quick") {
                  updateActiveSubject((sub) => {
                    sub.currentPercentage = "";
                    sub.totalClasses = "";
                  });
                } else {
                  updateActiveSubject((sub) => {
                    sub.dailyLogs = [{ id: `log-${Date.now()}`, label: "Day 1", conducted: 1, attended: 1 }];
                  });
                }
                setCalcResult(null);
                setErrors({});
              }}
              className="btn-secondary flex items-center gap-2 px-4"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          {/* Calculated Output Display */}
          <div ref={resultRef}>
            {calcResult && (
              <ResultCard
                result={calcResult}
                copied={copied}
                shared={shared}
                onCopy={() => copy(getResultText())}
                onShare={() => share("My Attendance Result", getResultText())}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
