"use client";

import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Eye, EyeOff } from "lucide-react";

interface GridControlsProps {
  onCheck: () => void;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onReset: () => void;
}

export function GridControls({
  onCheck,
  showAnswer,
  onToggleAnswer,
  onReset,
}: GridControlsProps) {
  return (
    <div className="flex flex-nowrap gap-2 sm:gap-3 justify-center items-center">
      <Button
        onClick={onCheck}
        size="default"
        className="flex-shrink-0"
        aria-label="Check answers"
      >
        <Check className="mr-2 h-4 w-4" /> チェック
      </Button>

      <Button
        onClick={onToggleAnswer}
        variant="outline"
        size="default"
        className="flex-shrink-0"
        aria-label={showAnswer ? "Show my coloring" : "Show answer"}
      >
        {showAnswer ? (
          <>
            <EyeOff className="mr-2 h-4 w-4" /> 自分の塗り絵
          </>
        ) : (
          <>
            <Eye className="mr-2 h-4 w-4" /> 答えを見る
          </>
        )}
      </Button>

      <Button
        onClick={onReset}
        variant="outline"
        size="default"
        className="h-10 w-10 p-0 flex-shrink-0"
        aria-label="Reset"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
