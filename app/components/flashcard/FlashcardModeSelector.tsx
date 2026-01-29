"use client";

import { createPortal } from "react-dom";
import { useRangeStats } from "@/app/hooks/useRangeStats";
import { useMounted } from "@/app/hooks/useMounted";
import type { FlashcardMode } from "@/app/data/types";
import { QUESTIONS_PER_SET } from "@/app/data/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shuffle, Target, X } from "lucide-react";

interface FlashcardModeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mode: FlashcardMode) => void;
}

export function FlashcardModeSelector({
  open,
  onClose,
  onSelect,
}: FlashcardModeSelectorProps) {
  const { getWeakHands, isLoaded } = useRangeStats();
  const weakHands = isLoaded ? getWeakHands(QUESTIONS_PER_SET) : [];
  const weakAvailable = weakHands.length > 0;
  const mounted = useMounted();

  if (!open) return null;

  const overlay = (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flashcard-mode-title"
      onClick={onClose}
    >
      <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle id="flashcard-mode-title">出題モード</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start gap-2"
            variant="default"
            onClick={() => onSelect("random")}
          >
            <Shuffle className="h-5 w-5" />
            ランダム
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant={weakAvailable ? "outline" : "ghost"}
            disabled={!weakAvailable}
            onClick={() => weakAvailable && onSelect("weak")}
          >
            <Target className="h-5 w-5" />
            <span className="flex flex-col items-start">
              <span>苦手問題</span>
              <span className="text-xs font-normal opacity-90">
                低正答率をピックアップ
              </span>
            </span>
            {!weakAvailable && (
              <span className="ml-1 text-xs text-gray-500">
                （履歴がありません）
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return mounted && typeof document !== "undefined"
    ? createPortal(overlay, document.body)
    : null;
}
