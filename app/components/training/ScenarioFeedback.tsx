"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioFeedbackProps {
  feedback: "correct" | "incorrect";
  onNext: () => void;
}

export function ScenarioFeedback({ feedback, onNext }: ScenarioFeedbackProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10 rounded-lg animate-in fade-in",
      )}
    >
      <div
        className={cn(
          "p-6 rounded-xl border-4 text-4xl font-bold flex flex-col items-center shadow-lg bg-white",
          feedback === "correct"
            ? "border-green-500 text-green-600"
            : "border-red-500 text-red-600",
        )}
      >
        {feedback === "correct" ? (
          <Check className="w-16 h-16" />
        ) : (
          <X className="w-16 h-16" />
        )}
        {feedback === "correct" ? "正解!" : "不正解..."}

        {feedback === "incorrect" && (
          <div className="mt-4">
            <Button onClick={onNext}>次へ</Button>
          </div>
        )}
      </div>
    </div>
  );
}
