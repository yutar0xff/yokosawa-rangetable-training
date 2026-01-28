"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import {
  RangeTable,
  RangeCategory,
  GameState,
  Question,
} from "@/app/data/types";
import { useRangeStats } from "@/app/hooks/useRangeStats";
import { parseHandToCards } from "@/app/utils/handParser";
import { HomeButton } from "@/app/components/common/HomeButton";
import { QUESTIONS_PER_SET, FEEDBACK_DELAY_MS } from "@/app/data/constants";
import { pickRandomMultiple } from "@/app/utils/randomUtils";
import { FlashcardFinished } from "@/app/components/flashcard/FlashcardFinished";
import { FlashcardFeedback } from "@/app/components/flashcard/FlashcardFeedback";
import { HandDisplay } from "@/app/components/flashcard/HandDisplay";
import { AnswerGrid } from "@/app/components/flashcard/AnswerGrid";

interface FlashcardSessionProps {
  ranges: RangeTable;
}

export default function FlashcardSession({ ranges }: FlashcardSessionProps) {
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

  const startNewSet = useCallback(() => {
    const hands = Object.keys(ranges);
    if (hands.length === 0) {
      console.error("No hands available in ranges");
      return;
    }
    const randomHands = pickRandomMultiple(hands, QUESTIONS_PER_SET);
    const newQueue: Question[] = randomHands
      .map((hand) => {
        const correctRange = ranges[hand];
        if (!correctRange) {
          console.warn(`No range found for hand: ${hand}`);
          return null;
        }
        return { hand, correctRange };
      })
      .filter((q): q is Question => q !== null);

    if (newQueue.length === 0) {
      console.error("No valid questions generated");
      return;
    }

    setQueue(newQueue);
    setMistakes([]);
    setCurrentIndex(0);
    setGameState("playing");
    setIsRetryMode(false);
    setTotalQuestionsInSet(QUESTIONS_PER_SET);
  }, [ranges]);

  // セッション初期化
  useEffect(() => {
    startNewSet();
  }, [startNewSet]);

  const startRetry = useCallback(() => {
    if (mistakes.length === 0) {
      console.warn("No mistakes to retry");
      return;
    }
    setQueue([...mistakes]);
    setTotalQuestionsInSet(mistakes.length);
    setMistakes([]);
    setCurrentIndex(0);
    setGameState("playing");
    setIsRetryMode(true);
  }, [mistakes]);

  const currentQuestion = queue[currentIndex];

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setGameState("playing");

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameState("finished");
    }
  }, [currentIndex, queue.length]);

  const handleAnswer = useCallback(
    (answer: RangeCategory) => {
      if (gameState !== "playing" || !currentQuestion) return;

      const isCorrect = answer === currentQuestion.correctRange;
      setSelectedAnswer(answer);

      // 成績を記録
      recordResult(currentQuestion.hand, isCorrect);

      if (isCorrect) {
        setShowCorrectEffect(true);
        // 正解時は自動で次へ
        setTimeout(() => {
          setShowCorrectEffect(false);
          nextQuestion();
        }, FEEDBACK_DELAY_MS);
      } else {
        setGameState("feedback");
        setMistakes((prev) => [...prev, currentQuestion]);
      }
    },
    [gameState, currentQuestion, recordResult, nextQuestion],
  );

  // すべてのフックは早期リターンの前に呼ばれる必要がある
  const cards: [string, string] = useMemo(() => {
    if (!currentQuestion) {
      return ["As", "Ah"] as [string, string]; // デフォルト値
    }
    try {
      return currentQuestion.hand.length === 2
        ? ([currentQuestion.hand[0] + "s", currentQuestion.hand[1] + "h"] as [
            string,
            string,
          ])
        : parseHandToCards(currentQuestion.hand);
    } catch (error) {
      console.error("Failed to parse hand to cards:", error);
      return ["As", "Ah"] as [string, string]; // フォールバック
    }
  }, [currentQuestion]);

  // 早期リターンはすべてのフックの後に配置
  if (!currentQuestion && gameState !== "finished")
    return <div>Loading...</div>;

  // Render Finished State
  if (gameState === "finished") {
    return (
      <FlashcardFinished
        mistakes={mistakes}
        totalQuestionsInSet={totalQuestionsInSet}
        isRetryMode={isRetryMode}
        onRetry={startRetry}
        onNextSet={startNewSet}
      />
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-2 sm:p-4 space-y-4 flex flex-col min-h-screen">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{isRetryMode ? "リトライ" : "単語帳モード"}</span>
          <div className="flex items-center gap-2">
            <span>
              {currentIndex + 1} / {queue.length}
            </span>
            <HomeButton />
          </div>
        </div>
        <Progress value={(currentIndex / queue.length) * 100} />
      </div>

      {gameState === "feedback" ? (
        <FlashcardFeedback
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          ranges={ranges}
          cards={cards}
          onNext={nextQuestion}
        />
      ) : (
        <>
          <HandDisplay
            hand={currentQuestion.hand}
            cards={cards}
            showCorrectEffect={showCorrectEffect}
          />
          <AnswerGrid onAnswer={handleAnswer} />
        </>
      )}
    </div>
  );
}
