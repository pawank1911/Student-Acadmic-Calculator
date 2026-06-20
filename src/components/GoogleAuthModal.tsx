"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { X, Sparkles, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ============================================================
   GOOGLE LOGO SVG
   ============================================================ */
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
        fill="#4285F4"
      />
      <path
        d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"
        fill="#34A853"
      />
      <path
        d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
        fill="#FBBC05"
      />
      <path
        d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* simplified modal: only real Google sign-in (redirect/popup) */

/* ============================================================
   GOOGLE AUTH MODAL
   ============================================================ */
export default function GoogleAuthModal() {
  const { isModalOpen, closeAuthModal, signInWithGoogle } = useAuth();
  const [step, setStep] = useState<"choose" | "signing-in">("choose");

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setStep("signing-in");
      await signInWithGoogle();
    } finally {
      setStep("choose");
    }
  }, [signInWithGoogle]);

  const handleClose = useCallback(() => {
    if (step === "signing-in") return;
    closeAuthModal();
    setStep("choose");
  }, [closeAuthModal, step]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden animate-slide-up"
        style={{
          background: "linear-gradient(135deg, rgba(20,20,50,0.95), rgba(10,10,30,0.98))",
          border: "1px solid rgba(99,102,241,0.2)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(99,102,241,0.15)",
        }}
      >
        {/* Header */}
        <div className="relative px-6 pt-8 pb-4">
          <button
            onClick={handleClose}
            disabled={step === "signing-in"}
            className="absolute top-5 right-5 p-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <X size={18} style={{ color: "var(--text-muted)" }} />
          </button>

          {/* Google Logo */}
          <div className="flex justify-center mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <GoogleLogo />
            </div>
          </div>

          <h2 className="text-center text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Sign in with Google
          </h2>
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Choose an account to continue to<br />
            <span style={{ color: "#818cf8", fontWeight: 600 }}>Student Academic Calculator</span>
          </p>
        </div>

        {/* Divider */}
        <div className="section-divider mx-6" />

        {/* Body */}
        <div className="px-6 py-4">
          {step === "choose" ? (
            <>
              <div className="mt-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  <GoogleLogo />
                  Sign in with Google
                </button>
              </div>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin-slow"
                  style={{ borderTopColor: "#6366f1", background: "rgba(255,255,255,0.03)" }} />
              </div>
              <div className="text-center">
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Signing in...</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <Shield size={12} />
            <span>Secured by Google Identity Services</span>
          </div>
          {/* Footer note removed demo text; only Google sign-in supported */}
        </div>
      </div>
    </div>
  );
}
