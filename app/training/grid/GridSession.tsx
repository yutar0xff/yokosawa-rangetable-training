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
    (hand: string) => {
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
          const userVal: RangeCategory = selectedTool;
          const correctVal: RangeCategory = correctRanges[hand] || "rangeI";
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
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          塗り絵モード
        </h1>
        <HomeButton />
      </div>

      {/* Grid Area */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="p-1 sm:p-2 space-y-3 flex-1 flex flex-col min-h-0">
          {/* 正答率表示（横長、ボタンの上） */}
          <AccuracyDisplay accuracy={accuracy} showAccuracy={showAccuracy} />

          {/* コントロールボタン */}
          <GridControls
            onCheck={checkAnswers}
            showAnswer={showAnswer}
            onToggleAnswer={() => setShowAnswer(!showAnswer)}
            onReset={reset}
          />

          {/* パレット - 3x3グリッド */}
          <ColorPalette
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />

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
          <RangeLegend variant="grid" />
        </CardContent>
      </Card>
    </div>
  );
}
