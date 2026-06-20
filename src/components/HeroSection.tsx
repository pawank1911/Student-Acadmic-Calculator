"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  GraduationCap,
  CalendarCheck,
  Target,
  User,
  Mail,
} from "lucide-react";
import { useAuth, type UserProfile } from "@/context/AuthContext";

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  color: string;
  delay: string;
}) {
  return (
    <div
      className="glass-panel p-5 flex items-center gap-4 animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `${color}20`,
          border: `1px solid ${color}40`,
        }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function UserAvatar({ user, size = 40 }: { user: UserProfile; size?: number }) {
  const initials = (user.name || user.email || "Student")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (user.avatar) {
    return (
      <Image
        src={user.avatar}
        alt={`${user.name}'s profile picture`}
        width={size}
        height={size}
        className="rounded-full object-cover"
        unoptimized
      />
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #6366f1, #10b981)",
      }}
    >
      {initials || "S"}
    </span>
  );
}

/* ============================================================
   HERO SECTION
   ============================================================ */
export default function HeroSection({ onSelectTab }: { onSelectTab?: (tab: "attendance" | "cgpa") => void }) {
  const { user } = useAuth();

  const handleSelectCalculator = (tab: "attendance" | "cgpa") => {
    onSelectTab?.(tab);
    setTimeout(() => {
      document.getElementById("calculators-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <section className="relative pt-12 pb-16 px-4 overflow-hidden">
      {/* Decorative orbs */}
      <div
        className="hero-gradient-orb w-80 h-80 sm:w-[500px] sm:h-[500px]"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent)",
          top: "-100px",
          left: "-100px",
          animationDelay: "0s",
        }}
      />
      <div
        className="hero-gradient-orb w-60 h-60 sm:w-96 sm:h-96"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent)",
          top: "50px",
          right: "-80px",
          animationDelay: "2s",
        }}
      />
      <div
        className="hero-gradient-orb w-48 h-48 sm:w-72 sm:h-72"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent)",
          bottom: "20px",
          left: "30%",
          animationDelay: "4s",
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fade-in"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          <Sparkles size={13} style={{ color: "#818cf8" }} />
          <span className="text-sm font-semibold" style={{ color: "#818cf8" }}>
            Free Academic Tools for Engineering Students
          </span>
        </div>

        {/* Main title */}
        <h1
          className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 leading-tight animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Student Academic
          <br />
          Calculator
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up"
          style={{ color: "var(--text-secondary)", animationDelay: "0.2s" }}
        >
          Simple tools for engineering students to manage{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            attendance
          </span>{" "}
          and{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            CGPA targets
          </span>
          .
        </p>

        {/* Author info card */}
        <div
          className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-4 rounded-2xl mb-8 animate-slide-up"
          style={{
            background: "var(--bg-card)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border-glass)",
            animationDelay: "0.3s",
          }}
        >
          {user ? (
            <>
              <UserAvatar user={user} />
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  {user.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {user.email}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <User size={15} style={{ color: "#818cf8" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Pawan Saw
                </span>
              </div>
              <div
                className="w-px h-5 hidden sm:block"
                style={{ background: "var(--border-glass)" }}
              />
              <div className="flex items-center gap-2">
                <Mail size={15} style={{ color: "#818cf8" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  psaw59693@gmail.com
                </span>
              </div>
            </>
          )}
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <button
            onClick={() => handleSelectCalculator("attendance")}
            className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
            }}
            id="hero-attendance-btn"
          >
            <CalendarCheck size={18} />
            <span>Attendance Tracker</span>
          </button>
          <button
            onClick={() => handleSelectCalculator("cgpa")}
            className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
            }}
            id="hero-cgpa-btn"
          >
            <GraduationCap size={18} />
            <span>CGPA Calculator</span>
          </button>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <StatCard
            icon={CalendarCheck}
            label="Attendance Calculator"
            value="75%+"
            color="#6366f1"
            delay="0.6s"
          />
          <StatCard
            icon={GraduationCap}
            label="CGPA Calculator"
            value="10.0"
            color="#10b981"
            delay="0.7s"
          />
          <StatCard
            icon={Target}
            label="Target Planning"
            value="Free"
            color="#8b5cf6"
            delay="0.8s"
          />
        </div>
      </div>
    </section>
  );
}
