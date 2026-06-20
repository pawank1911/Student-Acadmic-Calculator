"use client";

import React from "react";
import { Github, Mail, Heart, GraduationCap, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative mt-16 border-t"
      style={{ borderColor: "var(--border-glass-dim)" }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                }}
              >
                <GraduationCap size={18} color="white" />
              </div>
              <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                Student Academic Calculator
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Simple, powerful tools for engineering students to manage their attendance and CGPA targets effortlessly.
            </p>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Tools
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Attendance Calculator", href: "#att-calculate-btn" },
                { label: "CGPA Target Calculator", href: "#cgpa-calculate-btn" },
                { label: "Digital Heroes", href: "https://digitalheroesco.com", external: true },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-1.5 text-sm transition-colors duration-200 group"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#818cf8";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200 group-hover:w-2"
                      style={{ background: "#818cf8" }}
                    />
                    {link.label}
                    {link.external && (
                      <ExternalLink size={11} className="opacity-50 group-hover:opacity-100" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:psaw59693@gmail.com"
                className="flex items-center gap-2.5 text-sm transition-all duration-200 group"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#818cf8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <Mail size={14} style={{ color: "#818cf8" }} />
                </div>
                psaw59693@gmail.com
              </a>
              <a
                href="https://digitalheroesco.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-all duration-200 group"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#818cf8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <ExternalLink size={14} style={{ color: "#818cf8" }} />
                </div>
                digitalheroesco.com
              </a>
              <a
                href="https://github.com/pawank1911/Student-Acadmic-Calculator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-all duration-200 group"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#818cf8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <Github size={14} style={{ color: "#818cf8" }} />
                </div>
                project repository
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            Made with{" "}
            <Heart
              size={14}
              fill="#f43f5e"
              style={{ color: "#f43f5e" }}
              className="animate-pulse"
            />{" "}
            by{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Pawan Saw
            </span>
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {currentYear} Student Academic Calculator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
