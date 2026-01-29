"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PokerCard } from "@/app/components/PokerCard";
import { RangeGrid } from "@/app/components/RangeGrid";
import { RangeBadge } from "@/app/components/RangeBadge";
import { RangeTable, RangeCategory, Question } from "@/app/data/types";
import { CARD_SIZES } from "@/app/data/constants";
import { X } from "lucide-react";

interface FlashcardFeedbackProps {
  question: Question;
  selectedAnswer: RangeCategory | null;
  ranges: RangeTable;
  cards: [string, string];
  onNext: () => void;
}

export function FlashcardFeedback({
  question,
  selectedAnswer,
  ranges,
  cards,
  onNext,
}: FlashcardFeedbackProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full gap-3">
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-stretch flex-1 min-h-0 lg:overflow-hidden">
        {/* 左側: カードと選択・正解情報 */}
        <Card className="flex-1 w-full lg:max-w-xs lg:min-h-0 flex flex-col">
          <CardContent className="flex flex-col items-center py-3 px-4 shrink-0">
            <div className="flex gap-2 mb-2">
              <PokerCard
                card={cards[0]}
                width={CARD_SIZES.SMALL.width}
                height={CARD_SIZES.SMALL.height}
              />
              <PokerCard
                card={cards[1]}
                width={CARD_SIZES.SMALL.width}
                height={CARD_SIZES.SMALL.height}
              />
            </div>
            <h2 className="text-lg font-bold mb-2">{question.hand}</h2>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col items-center gap-3 w-full">
              <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
                <X className="w-4 h-4" /> 不正解
              </div>

              <div className="flex flex-row gap-3 w-full justify-center">
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    あなたの選択
                  </span>
                  <RangeBadge
                    category={selectedAnswer || question.correctRange}
                    className="scale-75"
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    正解
                  </span>
                  <RangeBadge
                    category={question.correctRange}
                    className="scale-75"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右側: レンジテーブル（横長でスクロール可能） */}
        <Card className="flex-1 w-full lg:flex-2 flex flex-col min-h-0 overflow-hidden">
          <CardHeader className="py-2 px-3 shrink-0">
            <CardTitle className="text-sm">レンジテーブル</CardTitle>
          </CardHeader>
          <CardContent className="p-1 sm:p-2 flex-1 min-h-0 overflow-auto">
            <div className="w-full overflow-x-auto">
              <div className="flex justify-center min-w-fit">
                <RangeGrid
                  ranges={ranges}
                  highlightHand={question.hand}
                  userAnswer={selectedAnswer || undefined}
                  correctAnswer={question.correctRange}
                  showLabels={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={onNext} className="w-full shrink-0" size="default">
        次へ
      </Button>
    </div>
  );
}
