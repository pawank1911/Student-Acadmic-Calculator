"use client";

import { auth, db } from "@/firebase";
import { useState } from "react";

export function FirebaseDebug() {
  const [showDebug, setShowDebug] = useState(false);

  const handleDebug = () => {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "NOT SET",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "NOT SET",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "NOT SET",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "NOT SET",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "NOT SET",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "NOT SET",
    };

    // expose auth state for in-browser debugging
    (window as any).__sacAuth = auth;
    (window as any).__sacDb = db;

    const debugInfo = {
      "Firebase Config": config,
      "Auth App": auth.app.options,
      "Current User": auth.currentUser?.email || "Not signed in",
      "DB": db ? "Connected" : "Not connected",
    };

    console.clear();
    console.log("=== FIREBASE DEBUG INFO ===");
    console.table(config);
    console.log("Auth initialized:", !!auth);
    console.log("Full debug:", debugInfo);
    console.log("Auth currentUser object:", auth.currentUser);
    
    alert(
      "Firebase Debug Info (check browser console):\n\n" +
      "Config loaded:\n" +
      JSON.stringify(config, null, 2) +
      "\n\nIf any value shows 'NOT SET', check your .env.local file"
    );
  };

  return (
    <button
      onClick={handleDebug}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 15px",
        background: "#6366f1",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        zIndex: 9999,
        fontSize: "14px",
        fontWeight: "bold",
      }}
      title="Click to see Firebase configuration debug info"
    >
      🐛 Firebase Debug
    </button>
  );
}
