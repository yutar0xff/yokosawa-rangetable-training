"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface SnackbarProps {
  message: string;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function Snackbar({
  message,
  onClose,
  duration = 4000,
  className,
}: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-800 px-4 py-3 text-sm text-white shadow-lg",
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
        className,
      )}
    >
      {message}
    </div>
  );
}
