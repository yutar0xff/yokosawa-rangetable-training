"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PokerCard } from "@/app/components/PokerCard";
import { RangeGrid } from "@/app/components/RangeGrid";
import { RangeBadge } from "@/app/components/RangeBadge";
import {
  RangeTable,
  RangeCategory,
  RANGE_COLORS,
  RANGE_TO_STAR,
  STAR_TO_RANGE,
} from "@/app/data/types";
import { useRangeStats } from "@/app/hooks/useRangeStats";
import { cn } from "@/lib/utils";
import { Circle, X, RotateCcw, Home } from "lucide-react";

interface FlashcardSessionProps {
  ranges: RangeTable;
}

type GameState = "playing" | "feedback" | "finished";

interface Question {
  hand: string;
  correctRange: RangeCategory;
}

const QUESTIONS_PER_SET = 10;

export default function FlashcardSession({ ranges }: FlashcardSessionProps) {
  const router = useRouter();
  const { recordResult } = useRangeStats();

  const [queue, setQueue] = useState<Question[]>([]);
  const [mistakes, setMistakes] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [selectedAnswer, setSelectedAnswer] = useState<RangeCategory | null>(
    null,
  );
  const [showCorrectEffect, setShowCorrectEffect] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [totalQuestionsInSet, setTotalQuestionsInSet] =
    useState(QUESTIONS_PER_SET);

  // Initialize session
  useEffect(() => {
    startNewSet();
  }, [ranges]);

  const startNewSet = () => {
    const hands = Object.keys(ranges);
    const newQueue: Question[] = [];

    // Pick random hands
    for (let i = 0; i < QUESTIONS_PER_SET; i++) {
      const randomHand = hands[Math.floor(Math.random() * hands.length)];
      newQueue.push({
        hand: randomHand,
        correctRange: ranges[randomHand],
      });
    }

    setQueue(newQueue);
    setMistakes([]);
    setCurrentIndex(0);
    setGameState("playing");
    setIsRetryMode(false);
    setTotalQuestionsInSet(QUESTIONS_PER_SET);
  };

  const startRetry = () => {
    setQueue([...mistakes]);
    setTotalQuestionsInSet(mistakes.length);
    setMistakes([]);
    setCurrentIndex(0);
    setGameState("playing");
    setIsRetryMode(true);
  };

  const currentQuestion = queue[currentIndex];

  const handleAnswer = (answer: RangeCategory) => {
    if (gameState !== "playing" || !currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctRange;
    setSelectedAnswer(answer);

    // Record stat (only in normal mode, not retry? Or both? Let's record both for spaced repetition)
    recordResult(currentQuestion.hand, isCorrect);

    if (isCorrect) {
      setShowCorrectEffect(true);
      // Auto advance after short delay
      setTimeout(() => {
        setShowCorrectEffect(false);
        nextQuestion();
      }, 800);
    } else {
      setGameState("feedback");
      if (!isRetryMode) {
        setMistakes((prev) => [...prev, currentQuestion]);
      } else {
        // In retry mode, if wrong again, keep it for next retry?
        // For simplicity, just add to mistakes again to retry again later if we implemented infinite retry.
        // Current plan: "10问終了時、誤答リストが空でなければ... 2周目"
        setMistakes((prev) => [...prev, currentQuestion]);
      }
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setGameState("playing");

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameState("finished");
    }
  };

  if (!currentQuestion && gameState !== "finished")
    return <div>Loading...</div>;

  // Render Finished State
  if (gameState === "finished") {
    const isPerfect = mistakes.length === 0;

    return (
      <div className="container max-w-md mx-auto p-4 space-y-6">
        <Card className="text-center p-6">
          <CardHeader className="relative">
            <CardTitle className="text-3xl">セット完了!</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="absolute top-0 right-0 h-8 w-8 p-0"
            >
              <Home className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xl font-bold">
              {isRetryMode ? "リトライ" : ""}正答率:{" "}
              {Math.round(
                ((totalQuestionsInSet - mistakes.length) /
                  totalQuestionsInSet) *
                  100,
              )}
              %
            </div>

            {mistakes.length > 0 ? (
              <div className="space-y-4">
                <p className="text-red-500">誤答数: {mistakes.length}問</p>
                <Button onClick={startRetry} className="w-full gap-2">
                  <RotateCcw className="w-4 h-4" />
                  誤答のみ再挑戦
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-green-600 text-lg">
                  全問正解です！素晴らしい！
                </p>
                <Button onClick={startNewSet} className="w-full">
                  次のセットへ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Playing/Feedback State
  const cards =
    currentQuestion.hand.length === 2
      ? [currentQuestion.hand[0] + "s", currentQuestion.hand[1] + "h"] // Pair/Offsuit generic placeholder logic needed?
      : // Actually currentQuestion.hand is like "AKs" or "T9o" or "AA".
        // I need to parse "AKs" -> "As", "Kh" (suited) or "As", "Kd" (offsuit).
        parseHandToCards(currentQuestion.hand);

  return (
    <div className="container max-w-7xl mx-auto p-2 sm:p-4 space-y-4 flex flex-col min-h-screen">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{isRetryMode ? "リトライ" : "単語帳モード"}</span>
          <div className="flex items-center gap-2">
            <span>
              {currentIndex + 1} / {queue.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="h-8 w-8 p-0"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Progress value={(currentIndex / queue.length) * 100} />
      </div>

      {gameState === "feedback" ? (
        <div className="space-y-3 w-full">
          {/* 不正解時のレイアウト */}
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-start">
            {/* 左側: カードと選択・正解情報 */}
            <Card className="flex-1 w-full lg:max-w-xs">
              <CardContent className="flex flex-col items-center py-3 px-4">
                <div className="flex gap-2 mb-2">
                  <PokerCard card={cards[0]} width={60} height={84} />
                  <PokerCard card={cards[1]} width={60} height={84} />
                </div>
                <h2 className="text-lg font-bold mb-2">
                  {currentQuestion.hand}
                </h2>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col items-center gap-3 w-full">
                  <div className="flex items-center gap-1 text-red-500 font-bold text-sm">
                    <X className="w-4 h-4" /> 不正解
                  </div>

                  {/* ユーザーの選択と正解を横並びで表示 */}
                  <div className="flex flex-row gap-3 w-full justify-center">
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-xs text-gray-500 font-medium">
                        あなたの選択
                      </span>
                      <RangeBadge
                        category={
                          selectedAnswer || currentQuestion.correctRange
                        }
                        className="scale-75"
                      />
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-xs text-gray-500 font-medium">
                        正解
                      </span>
                      <RangeBadge
                        category={currentQuestion.correctRange}
                        className="scale-75"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 右側: レンジテーブル */}
            <Card className="flex-1 w-full lg:flex-[2] overflow-hidden">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">レンジテーブル</CardTitle>
              </CardHeader>
              <CardContent className="p-1 sm:p-2">
                <div className="w-full overflow-x-auto">
                  <div className="flex justify-center min-w-fit">
                    <RangeGrid
                      ranges={ranges}
                      highlightHand={currentQuestion.hand}
                      userAnswer={selectedAnswer || undefined}
                      correctAnswer={currentQuestion.correctRange}
                      showLabels={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={nextQuestion} className="w-full" size="default">
            次へ
          </Button>
        </div>
      ) : (
        <>
          <Card className="flex-1 flex flex-col justify-center items-center py-8 min-h-[300px] relative">
            <div className="flex gap-4 sm:gap-6 mb-8 px-4 sm:px-6">
              <PokerCard card={cards[0]} width={180} height={252} />
              <PokerCard card={cards[1]} width={180} height={252} />
            </div>
            <h2 className="text-4xl font-bold mb-2">{currentQuestion.hand}</h2>

            {showCorrectEffect && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-50/80 backdrop-blur-sm z-20 rounded-xl animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-green-600 font-bold text-4xl gap-4">
                  <Circle className="w-24 h-24" />
                  <span>正解!</span>
                </div>
              </div>
            )}
          </Card>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
            {Object.entries(STAR_TO_RANGE)
              .reverse()
              .map(([starStr, category]) => {
                const star = parseInt(starStr);
                return (
                  <Button
                    key={category}
                    onClick={() => handleAnswer(category)}
                    className={cn(
                      "h-16 sm:h-20 flex flex-col items-center justify-center gap-1",
                      RANGE_COLORS[category],
                      "hover:opacity-90 transition-opacity",
                    )}
                  >
                    <span className="text-xs sm:text-sm font-bold">
                      ☆{star}
                    </span>
                  </Button>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

// Helper to parse hand string to card array
function parseHandToCards(hand: string): [string, string] {
  // hand: "AA", "AKs", "T9o"
  const rank1 = hand[0];
  const rank2 = hand[1];
  const type = hand.length > 2 ? hand[2] : ""; // 's' or 'o' or empty (pair)

  // Assign suits for display
  // Pair: different suits (e.g. s, h)
  // Suited: same suit (e.g. s, s)
  // Offsuit: different suits (e.g. s, h)

  let s1 = "s";
  let s2 = "h";

  if (type === "s") {
    s2 = "s";
  } else if (type === "") {
    // Pair
    s2 = "h";
  } else {
    // Offsuit
    s2 = "h";
  }

  return [`${rank1}${s1}`, `${rank2}${s2}`];
}
