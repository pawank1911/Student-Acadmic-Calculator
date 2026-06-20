"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Settings,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useAuth, type UserProfile } from "@/context/AuthContext";

function DarkModeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className="relative h-7 w-14 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-transparent"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #4338ca, #6366f1)"
          : "linear-gradient(135deg, #fbbf24, #f59e0b)",
        boxShadow: isDark
          ? "0 0 15px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 0 15px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      <span
        className="absolute left-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-500"
        style={{ transform: isDark ? "translateX(28px)" : "translateX(0)" }}
      >
        {isDark ? (
          <Moon size={13} style={{ color: "#4338ca" }} />
        ) : (
          <Sun size={13} style={{ color: "#f59e0b" }} />
        )}
      </span>
    </button>
  );
}

function Avatar({ user, size = 32 }: { user: UserProfile; size?: number }) {
  const initials = useMemo(() => {
    const source = user.name || user.email || "Student";
    return source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user.email, user.name]);

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
      aria-hidden="true"
    >
      {initials || "S"}
    </span>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200"
      style={{ color: danger ? "#fb7185" : "var(--text-secondary)" }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = danger
          ? "rgba(244,63,94,0.1)"
          : "var(--border-glass-dim)";
        event.currentTarget.style.color = danger ? "#fb7185" : "var(--text-primary)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "transparent";
        event.currentTarget.style.color = danger ? "#fb7185" : "var(--text-secondary)";
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function UserMenu({ user, onSignOut }: { user: UserProfile; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex max-w-[13rem] items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent sm:max-w-[16rem] sm:gap-2.5 sm:rounded-xl sm:px-3"
        style={{
          background: open ? "var(--bg-card-hover)" : "var(--border-glass-dim)",
          border: "1px solid var(--border-glass)",
        }}
      >
        <Avatar user={user} size={32} />
        <span
          className="hidden max-w-[7rem] truncate text-sm font-semibold sm:block md:max-w-[9rem]"
          style={{ color: "var(--text-primary)" }}
        >
          {user.name}
        </span>
        <ChevronDown
          size={15}
          className="transition-transform duration-200"
          style={{
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <div
        role="menu"
        className={`absolute right-0 mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        style={{
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border-glass)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="border-b px-4 py-4" style={{ borderColor: "var(--border-glass-dim)" }}>
          <div className="flex min-w-0 items-center gap-3">
            <Avatar user={user} size={44} />
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-xs" style={{ color: "var(--text-muted)" }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <MenuItem icon={LayoutDashboard} label="Dashboard" onClick={() => setOpen(false)} />
          <MenuItem icon={Settings} label="Settings" onClick={() => setOpen(false)} />
          <div className="mx-1 my-1 h-px" style={{ background: "var(--border-glass-dim)" }} />
          <MenuItem
            icon={LogOut}
            label="Logout"
            danger
            onClick={() => {
              onSignOut();
              setOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({ isDark, onToggleDark }: HeaderProps) {
  const { user, isLoading, openAuthModal, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? isDark
            ? "rgba(10,10,30,0.9)"
            : "rgba(255,255,255,0.88)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-glass)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
              }}
            >
              <GraduationCap size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                Student Academic
                <br />
                Calculator
              </h1>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                SAC
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />

            {isLoading ? (
              <div
                className="h-9 w-24 animate-pulse rounded-full sm:w-32 sm:rounded-xl"
                style={{ background: "var(--border-glass-dim)" }}
                aria-label="Loading authentication state"
              />
            ) : user ? (
              <UserMenu user={user} onSignOut={signOut} />
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent sm:rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-1px)";
                  event.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.45)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.35)";
                }}
              >
                <LogIn size={15} />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
