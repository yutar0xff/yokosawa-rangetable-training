"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Circle, X } from "lucide-react";
import {
  RangeTable,
  RANGE_COLORS,
  RangeCategory,
  RANGE_TO_STAR,
} from "../data/types";

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

interface RangeGridProps {
  ranges?: RangeTable;
  highlightHand?: string;
  userAnswer?: RangeCategory;
  correctAnswer?: RangeCategory;
  wrongHands?: Set<string>; // 間違っているハンドのセット
  onCellClick?: (
    hand: string | string[],
    options?: { isDrag?: boolean },
  ) => void;
  className?: string;
  showLabels?: boolean;
}

function findHandFromElement(el: Element | null): string | null {
  const cell = el?.closest("[data-hand]");
  return cell ? (cell as HTMLElement).getAttribute("data-hand") : null;
}

export function RangeGrid({
  ranges,
  highlightHand,
  userAnswer,
  correctAnswer,
  wrongHands,
  onCellClick,
  className,
  showLabels = true,
}: RangeGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const paintedHandsRef = useRef<Set<string>>(new Set());

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    paintedHandsRef.current = new Set();
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!onCellClick) return;
      const hand = findHandFromElement(
        document.elementFromPoint(e.clientX, e.clientY),
      );
      if (!hand || paintedHandsRef.current.has(hand)) return;
      paintedHandsRef.current.add(hand);
      onCellClick(hand, { isDrag: true });
    },
    [onCellClick],
  );

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerleave", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDragging, handlePointerUp, handlePointerMove]);

  const getHand = (
    rowRank: string,
    colRank: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    if (rowIndex === colIndex) return `${rowRank}${colRank}`; // Pair (e.g. AA)
    if (rowIndex < colIndex) return `${rowRank}${colRank}s`; // Suited (e.g. AKs)
    return `${colRank}${rowRank}o`; // Offsuit (e.g. AKo)
  };

  return (
    <div className={cn("inline-block", className)}>
      <div
        className="grid gap-0 border-2 border-gray-400"
        style={{
          gridTemplateColumns: "auto repeat(13, 1fr)",
          width: "fit-content",
          minWidth: "fit-content",
        }}
      >
        {/* 左上角の空白セル */}
        <div className="bg-gray-200 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-gray-400 flex-shrink-0"></div>

        {/* 列見出し */}
        {RANKS.map((rank) => (
          <div
            key={`col-${rank}`}
            className="bg-gray-200 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 border border-gray-400 flex-shrink-0 text-center"
          >
            {rank}
          </div>
        ))}

        {/* 行見出しとデータセル */}
        {RANKS.map((rowRank, rowIndex) => (
          <React.Fragment key={rowRank}>
            {/* 行見出し */}
            <div className="bg-gray-200 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold text-gray-700 border border-gray-400 flex-shrink-0 text-center">
              {rowRank}
            </div>

            {/* データセル */}
            {RANKS.map((colRank, colIndex) => {
              const hand = getHand(rowRank, colRank, rowIndex, colIndex);
              const category = ranges?.[hand];
              const colorClass = category ? RANGE_COLORS[category] : "bg-white";
              const isHighlighted = highlightHand === hand;

              // 不正解画面での○表示
              const isCorrectAnswer =
                correctAnswer &&
                category === correctAnswer &&
                highlightHand === hand;

              const handlePointerDown = onCellClick
                ? () => {
                    setIsDragging(true);
                    paintedHandsRef.current = new Set([hand]);
                    onCellClick(hand, { isDrag: false });
                  }
                : undefined;

              const cellProps = onCellClick
                ? {
                    "data-hand": hand,
                    onPointerDown: handlePointerDown,
                    className: cn(
                      "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer transition-colors relative border border-gray-400 flex-shrink-0 select-none touch-none",
                      colorClass,
                      isHighlighted &&
                        !isCorrectAnswer &&
                        "ring-2 ring-black z-10 scale-110",
                    ),
                  }
                : {
                    className: cn(
                      "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center cursor-default transition-colors relative border border-gray-400 flex-shrink-0",
                      colorClass,
                      isHighlighted &&
                        !isCorrectAnswer &&
                        "ring-2 ring-black z-10 scale-110",
                    ),
                  };

              const isWrong = wrongHands?.has(hand);

              return (
                <div key={hand} {...cellProps} title={hand}>
                  {isCorrectAnswer && (
                    <Circle
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 z-20 text-green-600"
                      strokeWidth={3}
                    />
                  )}
                  {isWrong && (
                    <X
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 z-20 text-red-600"
                      strokeWidth={3}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
