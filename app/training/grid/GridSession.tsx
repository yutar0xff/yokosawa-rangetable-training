"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RangeGrid } from "@/app/components/RangeGrid";
import {
  RangeTable,
  RangeCategory,
  RANGE_COLORS,
  STAR_TO_RANGE,
  RANGE_TO_STAR,
} from "@/app/data/types";
import { cn } from "@/lib/utils";
import { Check, RotateCcw, Home, Eye, EyeOff } from "lucide-react";

interface GridSessionProps {
  correctRanges: RangeTable;
}

export default function GridSession({ correctRanges }: GridSessionProps) {
  const router = useRouter();

  // 初期状態：全セルをrangeI（グレー）で塗る
  const initializeRanges = (): RangeTable => {
    const initial: RangeTable = {};
    Object.keys(correctRanges).forEach((hand) => {
      initial[hand] = "rangeI";
    });
    return initial;
  };

  const [userRanges, setUserRanges] = useState<RangeTable>(initializeRanges());
  const [selectedTool, setSelectedTool] = useState<RangeCategory>("rangeA");
  const [isChecked, setIsChecked] = useState(false);
  const [wrongHands, setWrongHands] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  const handleCellClick = (hand: string) => {
    // 塗りを変更したら正答率の表示を消す
    if (showAccuracy) {
      setShowAccuracy(false);
    }

    // チェック後も編集可能（間違いを修正できる）
    setUserRanges((prev) => {
      const current = prev[hand];

      // 選択したツールと同じ色の場合はrangeIに戻す
      if (current === selectedTool) {
        const next: RangeTable = { ...prev, [hand]: "rangeI" };

        // 間違いリストからも削除（修正された場合）
        if (isChecked && wrongHands.has(hand)) {
          setWrongHands((prevWrong) => {
            const newWrong = new Set(prevWrong);
            newWrong.delete(hand);
            return newWrong;
          });
        }

        return next;
      }

      const next: RangeTable = { ...prev, [hand]: selectedTool };

      // チェック済みで、修正した場合に間違いリストから削除
      if (isChecked && wrongHands.has(hand)) {
        const userVal = selectedTool;
        const correctVal = correctRanges[hand] || "rangeI";
        if (userVal === correctVal) {
          setWrongHands((prevWrong) => {
            const newWrong = new Set(prevWrong);
            newWrong.delete(hand);
            return newWrong;
          });
        }
      }

      return next;
    });
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const wrongSet = new Set<string>();
    const hands = Object.keys(correctRanges);

    hands.forEach((hand) => {
      const userVal = userRanges[hand] || "rangeI";
      const correctVal = correctRanges[hand] || "rangeI";

      if (userVal === correctVal) {
        correctCount++;
      } else {
        wrongSet.add(hand);
      }
    });

    setAccuracy(Math.round((correctCount / hands.length) * 100));
    setWrongHands(wrongSet);
    setIsChecked(true);
    setShowAccuracy(true);
  };

  const reset = () => {
    setUserRanges(initializeRanges());
    setIsChecked(false);
    setWrongHands(new Set());
    setShowAnswer(false);
    setShowAccuracy(false);
    setAccuracy(0);
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6 flex flex-col min-h-screen">
      {/* Header with Home button */}
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          塗り絵モード
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="h-9 w-9 p-0 hover:bg-gray-100"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>

      {/* Grid Area */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="p-1 sm:p-2 space-y-3 flex-1 flex flex-col min-h-0">
          {/* 正答率表示（横長、ボタンの上） */}
          <div className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">正答率</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {showAccuracy ? `${accuracy}%` : "--"}
              </p>
            </div>
          </div>

          {/* コントロールボタン */}
          <div className="flex flex-nowrap gap-2 sm:gap-3 justify-center items-center">
            <Button
              onClick={checkAnswers}
              size="default"
              className="flex-shrink-0"
            >
              <Check className="mr-2 h-4 w-4" /> チェック
            </Button>

            <Button
              onClick={() => setShowAnswer(!showAnswer)}
              variant="outline"
              size="default"
              className="flex-shrink-0"
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
              onClick={reset}
              variant="outline"
              size="default"
              className="h-10 w-10 p-0 flex-shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* パレット - 3x3グリッド */}
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
                      onClick={() => setSelectedTool(category)}
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
                    />
                  );
                })}
            </div>
          </div>

          {/* テーブル - 単語帳モードと同じ表示 */}
          <div className="w-full overflow-x-auto">
            <div className="flex justify-center min-w-fit">
              <RangeGrid
                ranges={showAnswer ? correctRanges : userRanges}
                onCellClick={handleCellClick}
                wrongHands={isChecked ? wrongHands : undefined}
                showLabels={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 色と星の対応表（下に移動） */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">色と星の対応</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {Object.entries(STAR_TO_RANGE)
              .reverse()
              .map(([starStr, category]) => (
                <div
                  key={category}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-lg text-xs shadow-sm",
                    RANGE_COLORS[category],
                  )}
                >
                  <span className="font-bold">☆{starStr}</span>
                  <span className="text-[10px] hidden sm:inline">
                    {category}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
