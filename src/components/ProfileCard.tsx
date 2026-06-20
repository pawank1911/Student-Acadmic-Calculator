"use client";

import React from "react";
import Image from "next/image";

export default function ProfileCard({
  name,
  email,
  avatar,
  onSignOut,
}: {
  name: string;
  email: string;
  avatar?: string;
  onSignOut?: () => void;
}) {
  return (
    <div className="glass-panel p-4 rounded-2xl inline-flex items-center gap-4">
      <Image src={avatar || "/avatar-placeholder.png"} alt={name} width={48} height={48} className="rounded-full" unoptimized />
      <div className="text-left">
        <p className="font-bold" style={{ color: "var(--text-primary)" }}>{name}</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{email}</p>
      </div>
      {onSignOut && (
        <div className="ml-4">
          <button onClick={onSignOut} className="text-sm text-red-500">Sign Out</button>
        </div>
      )}
    </div>
  );
}
