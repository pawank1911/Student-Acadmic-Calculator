"use client";

import { useState, useCallback } from "react";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    }
  }, []);

  return { copied, copy };
}

export function useShareResult() {
  const [shared, setShared] = useState(false);

  const share = useCallback(async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return true;
      } catch {
        return false;
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${title}\n\n${text}\n\n${window.location.href}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return true;
      } catch {
        return false;
      }
    }
  }, []);

  return { shared, share };
}
