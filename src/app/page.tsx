"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AttendanceCalculator from "@/components/AttendanceCalculator";
import CgpaCalculator from "@/components/CgpaCalculator";
import DigitalHeroesButton from "@/components/DigitalHeroesButton";
import Footer from "@/components/Footer";
import GoogleAuthModal from "@/components/GoogleAuthModal";

/* ============================================================
   SECTION LABEL
   ============================================================ */
function SectionLabel({
  number,
  title,
  subtitle,
  color = "#6366f1",
}: {
  number: string;
  title: string;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}bb)`,
          boxShadow: `0 8px 20px ${color}40`,
        }}
      >
        {number}
      </div>
      <div>
        <h2
          className="text-2xl font-black"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<"attendance" | "cgpa">("attendance");

  /* ── Sync dark mode with html class & localStorage ── */
  useEffect(() => {
    const stored = localStorage.getItem("sac_theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("sac_theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <>
      {/* Mesh background */}
      <div className="mesh-bg" aria-hidden="true" />

      {/* Auth Modal */}
      <GoogleAuthModal />

      {/* Header */}
      <Header isDark={isDark} onToggleDark={toggleDark} />

      <main className="min-h-screen">
        {/* Hero */}
        <HeroSection onSelectTab={(tab) => setActiveTab(tab)} />

        {/* ── Calculators Section ── */}
        <section
          id="calculators-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        >
          {/* Divider */}
          <div className="section-divider mb-10" />

          {/* Premium Tab Buttons */}
          <div className="flex justify-center mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div 
              className="glass-panel p-1.5 flex gap-2 w-full max-w-md" 
              style={{ 
                borderRadius: "1.25rem",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <button
                onClick={() => setActiveTab("attendance")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "attendance"
                    ? "text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
                style={{
                  background: activeTab === "attendance" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : undefined,
                }}
              >
                <span>📅</span> Attendance Tracker
              </button>
              <button
                onClick={() => setActiveTab("cgpa")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === "cgpa"
                    ? "text-white shadow-lg shadow-emerald-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
                style={{
                  background: activeTab === "cgpa" ? "linear-gradient(135deg, #10b981, #059669)" : undefined,
                }}
              >
                <span>🎓</span> CGPA Target
              </button>
            </div>
          </div>

          {/* Conditional Rendering */}
          <div className="min-h-[500px]">
            {activeTab === "attendance" ? (
              <div className="animate-fade-in max-w-4xl mx-auto">
                <SectionLabel
                  number="1"
                  title="Semester Attendance Dashboard"
                  subtitle="Track up to 10 subjects individually, log daily presence, and see your internal assessment marks."
                  color="#6366f1"
                />
                <AttendanceCalculator />
              </div>
            ) : (
              <div className="animate-fade-in max-w-4xl mx-auto">
                <SectionLabel
                  number="2"
                  title="CGPA Target Calculator"
                  subtitle="Find the average SGPA you need each semester to hit your graduation goal."
                  color="#10b981"
                />
                <CgpaCalculator />
              </div>
            )}
          </div>

          {/* ── Tip box ── */}
          <div
            className="mt-12 p-6 rounded-2xl animate-slide-up"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))",
              border: "1px solid rgba(99,102,241,0.15)",
              animationDelay: "0.4s",
            }}
          >
            <h3
              className="text-base font-bold mb-3 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <span>💡</span> Quick Tips for Students
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  emoji: "📅",
                  tip: "Most universities require a minimum of 75% attendance. Always aim higher for safety.",
                },
                {
                  emoji: "🎯",
                  tip: "To improve your CGPA significantly, focus on the semesters with higher credit counts.",
                },
                {
                  emoji: "📊",
                  tip: "Track your progress monthly — small consistent efforts compound into big results.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(0,0,0,0.06)" }}
                >
                  <span className="text-xl flex-shrink-0">{item.emoji}</span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Digital Heroes Button ── */}
          <DigitalHeroesButton />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
