"use client";

import { RangeCategory, RANGE_COLORS, STAR_TO_RANGE } from "@/app/data/types";
import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  selectedTool: RangeCategory;
  onToolSelect: (tool: RangeCategory) => void;
}

export function ColorPalette({
  selectedTool,
  onToolSelect,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <p className="text-sm font-semibold text-gray-700">色を選択</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-fit">
        {Object.entries(STAR_TO_RANGE)
          .reverse()
          .map(([starStr, category]) => {
            const isRangeG = category === "rangeG";
            const isSelected = selectedTool === category;

            return (
              <button
                key={category}
                onClick={() => onToolSelect(category)}
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg transition-all shadow-sm",
                  RANGE_COLORS[category],
                  // rangeGの場合は常に紫の枠線を表示（選択中も含む）
                  isRangeG && "border-2 border-violet-500",
                  // 選択中の色のスタイル（rangeG以外）
                  isSelected &&
                    !isRangeG &&
                    "border-2 border-gray-900 ring-4 ring-blue-400 ring-offset-2 scale-105 shadow-lg",
                  // 選択中でない場合（rangeG以外）
                  !isSelected &&
                    !isRangeG &&
                    "border-2 border-gray-300 hover:border-gray-500 hover:scale-105 hover:shadow-md",
                  // rangeGで選択中の場合の追加スタイル
                  isRangeG &&
                    isSelected &&
                    "ring-4 ring-blue-400 ring-offset-2 scale-105 shadow-lg",
                )}
                title={`☆${starStr} ${category}`}
                aria-label={`Select ${category} (${starStr} stars)`}
              />
            );
          })}
      </div>
    </div>
  );
}
