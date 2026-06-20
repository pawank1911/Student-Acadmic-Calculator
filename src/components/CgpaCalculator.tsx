"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Share2,
  RotateCcw,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Layers,
} from "lucide-react";
import { useCopyToClipboard, useShareResult } from "@/hooks/useClipboard";

/* ============================================================
   TYPES
   ============================================================ */
interface CgpaInputs {
  currentCgpa: string;
  creditsCompleted: string;
  totalCredits: string;
  targetCgpa: string;
}

interface CgpaErrors {
  currentCgpa?: string;
  creditsCompleted?: string;
  totalCredits?: string;
  targetCgpa?: string;
  general?: string;
}

interface CgpaResult {
  requiredSgpa: number;
  isPossible: boolean;
  remainingCredits: number;
  currentCgpa: number;
  targetCgpa: number;
  gap: number;
}

/* ============================================================
   VALIDATION
   ============================================================ */
function validateInputs(inputs: CgpaInputs): CgpaErrors {
  const errors: CgpaErrors = {};
  const current = parseFloat(inputs.currentCgpa);
  const completed = parseFloat(inputs.creditsCompleted);
  const total = parseFloat(inputs.totalCredits);
  const target = parseFloat(inputs.targetCgpa);

  if (inputs.currentCgpa === "") {
    errors.currentCgpa = "Current CGPA is required.";
  } else if (isNaN(current) || current < 0 || current > 10) {
    errors.currentCgpa = "Must be between 0 and 10.";
  }

  if (inputs.creditsCompleted === "") {
    errors.creditsCompleted = "Credits completed is required.";
  } else if (isNaN(completed) || completed < 0) {
    errors.creditsCompleted = "Must be a positive number.";
  }

  if (inputs.totalCredits === "") {
    errors.totalCredits = "Total credits is required.";
  } else if (isNaN(total) || total <= 0) {
    errors.totalCredits = "Must be greater than 0.";
  } else if (!isNaN(completed) && completed >= total) {
    errors.totalCredits = "Total credits must be greater than credits completed.";
  }

  if (inputs.targetCgpa === "") {
    errors.targetCgpa = "Target CGPA is required.";
  } else if (isNaN(target) || target < 0 || target > 10) {
    errors.targetCgpa = "Must be between 0 and 10.";
  }

  return errors;
}

/* ============================================================
   CALCULATE
   ============================================================ */
function calculate(inputs: CgpaInputs): CgpaResult {
  const currentCgpa = parseFloat(inputs.currentCgpa);
  const completed = parseFloat(inputs.creditsCompleted);
  const total = parseFloat(inputs.totalCredits);
  const targetCgpa = parseFloat(inputs.targetCgpa);
  const remaining = total - completed;

  const requiredSgpa =
    (targetCgpa * total - currentCgpa * completed) / remaining;

  return {
    requiredSgpa: Math.round(requiredSgpa * 100) / 100,
    isPossible: requiredSgpa <= 10,
    remainingCredits: remaining,
    currentCgpa,
    targetCgpa,
    gap: Math.round((targetCgpa - currentCgpa) * 100) / 100,
  };
}

/* ============================================================
   SGPA DIAL
   ============================================================ */
function SgpaDial({ value, isPossible }: { value: number; isPossible: boolean }) {
  const [animValue, setAnimValue] = useState(0);
  const displayValue = Math.min(value, 10);
  const pct = (displayValue / 10) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setAnimValue(pct), 150);
    return () => clearTimeout(timer);
  }, [pct]);

  const color = !isPossible ? "#f43f5e" : value >= 9 ? "#f59e0b" : value >= 7 ? "#34d399" : "#6366f1";
  const glowColor = !isPossible
    ? "rgba(244,63,94,0.4)"
    : value >= 9
    ? "rgba(245,158,11,0.4)"
    : "rgba(16,185,129,0.4)";

  // SVG arc
  const radius = 54;
  const circumference = Math.PI * radius; // half circle
  const strokeDash = (animValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-20 overflow-hidden">
        <svg width="144" height="80" viewBox="0 0 144 80" className="absolute inset-0">
          {/* Track */}
          <path
            d="M 8 72 A 64 64 0 0 1 136 72"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d="M 8 72 A 64 64 0 0 1 136 72"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(animValue / 100) * 201} 201`}
            style={{
              transition: "stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
          />
        </svg>
        {/* Value display */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <span
            className="text-3xl font-black"
            style={{ color, textShadow: `0 0 20px ${glowColor}` }}
          >
            {isPossible ? value.toFixed(2) : "∞"}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            / 10.00
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROGRESS BAR
   ============================================================ */
function AnimatedBar({
  value,
  max = 10,
  color,
}: {
  value: number;
  max?: number;
  color: "primary" | "emerald" | "rose" | "amber";
}) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.max(0, (Math.min(value, max) / max) * 100));

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  const gradients = {
    primary: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    emerald: "linear-gradient(90deg, #10b981, #34d399)",
    rose: "linear-gradient(90deg, #f43f5e, #fb7185)",
    amber: "linear-gradient(90deg, #f59e0b, #fbbf24)",
  };
  const glows = {
    primary: "rgba(99,102,241,0.5)",
    emerald: "rgba(16,185,129,0.5)",
    rose: "rgba(244,63,94,0.5)",
    amber: "rgba(245,158,11,0.5)",
  };

  return (
    <div className="progress-track">
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: gradients[color],
          boxShadow: `0 0 10px ${glows[color]}`,
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

/* ============================================================
   INPUT FIELD
   ============================================================ */
function InputField({
  id,
  label,
  placeholder,
  value,
  icon: Icon,
  error,
  onChange,
  hint,
  max,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  icon: React.ComponentType<any>;
  error?: string;
  onChange: (v: string) => void;
  hint?: string;
  max?: number;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
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
        max={max}
      />
      {error && (
        <p
          className="flex items-center gap-1 mt-1.5 text-xs font-medium"
          style={{ color: "#fb7185" }}
        >
          <AlertCircle size={11} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   RESULT CARD
   ============================================================ */
function ResultCard({
  result,
  onCopy,
  onShare,
  copied,
  shared,
}: {
  result: CgpaResult;
  onCopy: () => void;
  onShare: () => void;
  copied: boolean;
  shared: boolean;
}) {
  const { isPossible, requiredSgpa, remainingCredits, currentCgpa, targetCgpa, gap } = result;
  const cardClass = isPossible
    ? requiredSgpa >= 9
      ? "result-warning"
      : "result-success"
    : "result-danger";

  const barColor: "primary" | "emerald" | "rose" | "amber" = !isPossible
    ? "rose"
    : requiredSgpa >= 9
    ? "amber"
    : "emerald";

  return (
    <div className={`rounded-2xl p-6 mt-6 animate-slide-up ${cardClass}`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isPossible
              ? requiredSgpa >= 9
                ? "rgba(245,158,11,0.2)"
                : "rgba(16,185,129,0.2)"
              : "rgba(244,63,94,0.2)",
          }}
        >
          {isPossible ? (
            <Award
              size={22}
              style={{
                color: requiredSgpa >= 9 ? "#fbbf24" : "#34d399",
              }}
            />
          ) : (
            <XCircle size={22} style={{ color: "#fb7185" }} />
          )}
        </div>
        <div className="flex-1">
          {isPossible ? (
            <>
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: requiredSgpa >= 9 ? "#fbbf24" : "#34d399" }}
              >
                {requiredSgpa >= 9 ? "Challenging but possible! 🔥" : "Totally achievable! 🎯"}
              </h3>
              <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                You need an average SGPA of{" "}
                <span
                  className="text-2xl font-black"
                  style={{ color: requiredSgpa >= 9 ? "#fbbf24" : "#34d399" }}
                >
                  {requiredSgpa.toFixed(2)}
                </span>{" "}
                in remaining semesters.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold mb-1" style={{ color: "#fb7185" }}>
                Mathematically Impossible 😞
              </h3>
              <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                Target CGPA is mathematically impossible. The required SGPA exceeds the maximum of 10.
              </p>
            </>
          )}
        </div>
      </div>

      {/* SGPA Dial */}
      {isPossible && (
        <div className="flex justify-center mb-5">
          <SgpaDial value={requiredSgpa} isPossible={isPossible} />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Current CGPA", value: currentCgpa.toFixed(2), color: "#818cf8" },
          { label: "Target CGPA", value: targetCgpa.toFixed(2), color: "#34d399" },
          { label: "CGPA Gap", value: (gap > 0 ? "+" : "") + gap.toFixed(2), color: gap > 0 ? "#fbbf24" : "#34d399" },
          { label: "Remaining Credits", value: remainingCredits.toString(), color: "#a78bfa" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
            <p className="text-lg font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* CGPA Progress */}
      {isPossible && (
        <div className="mb-5 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              <span>Current CGPA: {currentCgpa.toFixed(2)}</span>
              <span>Max: 10.00</span>
            </div>
            <AnimatedBar value={currentCgpa} color="primary" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              <span>Required SGPA: {requiredSgpa.toFixed(2)}</span>
              <span>Max: 10.00</span>
            </div>
            <AnimatedBar value={requiredSgpa} color={barColor} />
          </div>
        </div>
      )}

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
   MAIN COMPONENT
   ============================================================ */
export default function CgpaCalculator() {
  const [inputs, setInputs] = useState<CgpaInputs>({
    currentCgpa: "",
    creditsCompleted: "",
    totalCredits: "",
    targetCgpa: "",
  });
  const [errors, setErrors] = useState<CgpaErrors>({});
  const [result, setResult] = useState<CgpaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const { copied, copy } = useCopyToClipboard();
  const { shared, share } = useShareResult();

  const setField = (field: keyof CgpaInputs) => (value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    if (result) setResult(null);
  };

  const handleCalculate = async () => {
    const newErrors = validateInputs(inputs);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCalculating(true);
    await new Promise((r) => setTimeout(r, 600));

    const res = calculate(inputs);
    setResult(res);
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      100
    );
    setIsCalculating(false);
  };

  const handleReset = () => {
    setInputs({ currentCgpa: "", creditsCompleted: "", totalCredits: "", targetCgpa: "" });
    setErrors({});
    setResult(null);
  };

  const getResultText = () => {
    if (!result) return "";
    if (!result.isPossible)
      return `🎓 CGPA Result: My target CGPA of ${result.targetCgpa} is mathematically impossible from current CGPA ${result.currentCgpa}.`;
    return `🎓 CGPA Result: I need an average SGPA of ${result.requiredSgpa.toFixed(2)} in my remaining ${result.remainingCredits} credits to reach a CGPA of ${result.targetCgpa}!`;
  };

  return (
    <div className="glass-panel card-shine p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.2))",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <GraduationCap size={22} style={{ color: "#34d399" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            CGPA Target Calculator
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Find the SGPA you need each semester
          </p>
        </div>
        <div className="ml-auto badge badge-success hidden sm:flex">
          <Target size={10} />
          Section 2
        </div>
      </div>

      <div className="section-divider mb-6" />

      {/* Inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="cgpa-current"
            label="Current CGPA"
            placeholder="e.g. 7.8"
            value={inputs.currentCgpa}
            icon={TrendingUp}
            error={errors.currentCgpa}
            onChange={setField("currentCgpa")}
            hint="Your current cumulative GPA (0–10)"
            max={10}
          />
          <InputField
            id="cgpa-target"
            label="Target Final CGPA"
            placeholder="e.g. 9.0"
            value={inputs.targetCgpa}
            icon={Target}
            error={errors.targetCgpa}
            onChange={setField("targetCgpa")}
            hint="The CGPA you want at graduation (0–10)"
            max={10}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="cgpa-completed"
            label="Credits Completed"
            placeholder="e.g. 80"
            value={inputs.creditsCompleted}
            icon={BookOpen}
            error={errors.creditsCompleted}
            onChange={setField("creditsCompleted")}
            hint="Total credits you have completed so far"
          />
          <InputField
            id="cgpa-total"
            label="Total Degree Credits"
            placeholder="e.g. 160"
            value={inputs.totalCredits}
            icon={Layers}
            error={errors.totalCredits}
            onChange={setField("totalCredits")}
            hint="Total credits required for your degree"
          />
        </div>
      </div>

      {/* Formula hint */}
      <div
        className="mt-4 px-4 py-3 rounded-xl text-xs"
        style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.15)",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ color: "#818cf8", fontWeight: 600 }}>Formula: </span>
        Required SGPA = (Target CGPA × Total Credits − Current CGPA × Credits Completed) ÷ Remaining Credits
      </div>

      {/* General error */}
      {errors.general && (
        <div
          className="mt-4 flex items-start gap-2 p-3 rounded-xl"
          style={{
            background: "rgba(244,63,94,0.1)",
            border: "1px solid rgba(244,63,94,0.2)",
          }}
        >
          <XCircle size={15} style={{ color: "#fb7185", flexShrink: 0, marginTop: 1 }} />
          <p className="text-sm" style={{ color: "#fb7185" }}>
            {errors.general}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          id="cgpa-calculate-btn"
          style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}
        >
          {isCalculating ? (
            <>
              <div
                className="spinner !w-4 !h-4 !border-2"
                style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
              />
              <span>Calculating...</span>
            </>
          ) : (
            <span>Calculate Required SGPA</span>
          )}
        </button>
        <button
          onClick={handleReset}
          className="btn-secondary flex items-center gap-2 px-4"
          id="cgpa-reset-btn"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Result */}
      <div ref={resultRef}>
        {result && (
          <ResultCard
            result={result}
            copied={copied}
            shared={shared}
            onCopy={() => copy(getResultText())}
            onShare={() => share("My CGPA Target Result", getResultText())}
          />
        )}
      </div>
    </div>
  );
}
