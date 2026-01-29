"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RangeGrid } from "@/app/components/RangeGrid";
import { RangeTable, RangeCategory } from "@/app/data/types";
import { RangeLegend } from "@/app/components/common/RangeLegend";
import { HomeButton } from "@/app/components/common/HomeButton";
import { ColorPalette } from "@/app/components/training/ColorPalette";
import { AccuracyDisplay } from "@/app/components/training/AccuracyDisplay";
import { GridControls } from "@/app/components/training/GridControls";

interface GridSessionProps {
  correctRanges: RangeTable;
}

export default function GridSession({ correctRanges }: GridSessionProps) {
  // 初期状態：全セルをrangeI（グレー）で塗る
  const initializeRanges = useCallback((): RangeTable => {
    const initial: RangeTable = {};
    Object.keys(correctRanges).forEach((hand) => {
      initial[hand] = "rangeI";
    });
    return initial;
  }, [correctRanges]);

  const [userRanges, setUserRanges] = useState<RangeTable>(() =>
    initializeRanges(),
  );
  const [selectedTool, setSelectedTool] = useState<RangeCategory>("rangeA");
  const [isChecked, setIsChecked] = useState(false);
  const [wrongHands, setWrongHands] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  const handleCellClick = useCallback(
    (handOrHands: string | string[], options?: { isDrag?: boolean }) => {
      const hands = Array.isArray(handOrHands) ? handOrHands : [handOrHands];
      const isDrag = options?.isDrag ?? false;

      // 塗りを変更したら正答率の表示を消す
      if (showAccuracy) {
        setShowAccuracy(false);
      }

      // チェック後も編集可能（間違いを修正できる）
      setUserRanges((prev) => {
        let next: RangeTable = { ...prev };
        const handsToRemoveFromWrong = new Set<string>();

        for (const hand of hands) {
          const current = prev[hand];

          // 単一クリック時のみ：選択したツールと同じ色なら rangeI に戻す。ドラッグ時は常に選択色で塗る
          if (!isDrag && current === selectedTool) {
            next = { ...next, [hand]: "rangeI" };
            if (isChecked && wrongHands.has(hand)) {
              handsToRemoveFromWrong.add(hand);
            }
          } else {
            next = { ...next, [hand]: selectedTool };
            if (isChecked && wrongHands.has(hand)) {
              const userVal: RangeCategory = selectedTool;
              const correctVal: RangeCategory = correctRanges[hand] || "rangeI";
              if (userVal === correctVal) {
                handsToRemoveFromWrong.add(hand);
              }
            }
          }
        }

        if (handsToRemoveFromWrong.size > 0) {
          setWrongHands((prevWrong) => {
            const newWrong = new Set(prevWrong);
            handsToRemoveFromWrong.forEach((h) => newWrong.delete(h));
            return newWrong;
          });
        }

        return next;
      });
    },
    [showAccuracy, selectedTool, isChecked, wrongHands, correctRanges],
  );

  const checkAnswers = useCallback(() => {
    let correctCount = 0;
    const wrongSet = new Set<string>();
    const hands = Object.keys(correctRanges);

    if (hands.length === 0) {
      console.warn("No hands to check");
      return;
    }

    hands.forEach((hand) => {
      const userVal: RangeCategory = userRanges[hand] || "rangeI";
      const correctVal: RangeCategory = correctRanges[hand] || "rangeI";

      if (userVal === correctVal) {
        correctCount++;
      } else {
        wrongSet.add(hand);
      }
    });

    const calculatedAccuracy = Math.round((correctCount / hands.length) * 100);
    setAccuracy(calculatedAccuracy);
    setWrongHands(wrongSet);
    setIsChecked(true);
    setShowAccuracy(true);
  }, [correctRanges, userRanges]);

  const reset = useCallback(() => {
    setUserRanges(initializeRanges());
    setIsChecked(false);
    setWrongHands(new Set());
    setShowAnswer(false);
    setShowAccuracy(false);
    setAccuracy(0);
  }, [initializeRanges]);

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6 flex flex-col min-h-screen">
      {/* Header with Home button */}
      <div className="flex justify-between items-center pb-2 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          塗り絵モード
        </h1>
        <HomeButton />
      </div>

      {/* 縦長: 1カラム / 横長: 2カラム 1:2（左: 正答率・ボタン・パレット、右: レンジテーブル） */}
      <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[1fr_2fr] lg:gap-6">
        {/* 左カラム: 正答率・3ボタン・パレット */}
        <div className="space-y-4 lg:flex lg:flex-col lg:min-h-0">
          <Card className="lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
            <CardContent className="p-1 sm:p-2 space-y-3 lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
              <AccuracyDisplay
                accuracy={accuracy}
                showAccuracy={showAccuracy}
              />
              <GridControls
                onCheck={checkAnswers}
                showAnswer={showAnswer}
                onToggleAnswer={() => setShowAnswer(!showAnswer)}
                onReset={reset}
              />
              <ColorPalette
                selectedTool={selectedTool}
                onToolSelect={setSelectedTool}
              />
            </CardContent>
          </Card>
        </div>

        {/* 右カラム: レンジテーブル */}
        <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg">レンジテーブル</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-auto p-1 sm:p-2">
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
      </div>

      {/* 色と星の対応（2カラムの下に配置） */}
      <Card className="shrink-0">
        <CardHeader>
          <CardTitle className="text-lg">色と星の対応</CardTitle>
        </CardHeader>
        <CardContent>
          <RangeLegend variant="grid" />
        </CardContent>
      </Card>
    </div>
  );
}
