"use client";

import { Button } from "@/components/ui/button";
import { RangeCategory, RANGE_COLORS, STAR_TO_RANGE } from "@/app/data/types";
import { cn } from "@/lib/utils";

interface AnswerGridProps {
  onAnswer: (answer: RangeCategory) => void;
}

export function AnswerGrid({ onAnswer }: AnswerGridProps) {
  return (
    <div className="w-full max-w-full grid grid-cols-3 gap-2 lg:gap-3">
      {Object.entries(STAR_TO_RANGE)
        .reverse()
        .map(([starStr, category]) => {
          const star = parseInt(starStr);
          return (
            <Button
              key={category}
              onClick={() => onAnswer(category)}
              className={cn(
                "h-16 sm:h-20 lg:h-24 flex flex-col items-center justify-center gap-1 min-w-0",
                RANGE_COLORS[category],
                "hover:opacity-90 transition-opacity",
              )}
            >
              <span className="text-xs sm:text-sm font-bold">☆{star}</span>
            </Button>
          );
        })}
    </div>
  );
}
