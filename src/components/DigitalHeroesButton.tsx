"use client";

import React from "react";
import { Rocket, ExternalLink } from "lucide-react";

export default function DigitalHeroesButton() {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      {/* Decorative text */}
      <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
        Proudly
      </p>

      {/* The Button */}
      <a
        href="https://digitalheroesco.com"
        target="_blank"
        rel="noopener noreferrer"
        id="digital-heroes-link"
        className="digital-heroes-btn group"
      >
        <Rocket
          size={20}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
        />
        <span className="text-base sm:text-lg font-extrabold tracking-wide">
          Built for Digital Heroes
        </span>
        <ExternalLink
          size={16}
          className="opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>

      {/* Decorative sparkle dots */}
      <div className="flex gap-2 mt-1">
        {["#ff6b6b", "#ffd32a", "#6bcbff", "#a78bfa"].map((color, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              background: color,
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
