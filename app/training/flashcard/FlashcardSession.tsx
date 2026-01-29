"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { Progress } from "@/components/ui/progress";
import {
  RangeTable,
  RangeCategory,
  GameState,
  Question,
  FlashcardMode,
} from "@/app/data/types";
import { useRangeStats } from "@/app/hooks/useRangeStats";
import { useAutoAdvance } from "@/app/hooks/useAutoAdvance";
import { handToCards } from "@/app/utils/handParser";
import { generateHandWithRandomSuits } from "@/app/utils/handNormalizer";
import { HomeButton } from "@/app/components/common/HomeButton";
import { QUESTIONS_PER_SET } from "@/app/data/constants";
import { pickRandomMultiple } from "@/app/utils/randomUtils";
import { FlashcardFinished } from "@/app/components/flashcard/FlashcardFinished";
import { FlashcardFeedback } from "@/app/components/flashcard/FlashcardFeedback";
import { HandDisplay } from "@/app/components/flashcard/HandDisplay";
import { AnswerGrid } from "@/app/components/flashcard/AnswerGrid";
import { Snackbar } from "@/app/components/common/Snackbar";

interface FlashcardSessionProps {
  ranges: RangeTable;
  mode: FlashcardMode;
}

export default function FlashcardSession({
  ranges,
  mode,
}: FlashcardSessionProps) {
  const { recordResult, getWeakHands, isLoaded } = useRangeStats();

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
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const resetSessionWithQueue = useCallback(
    (newQueue: Question[], totalCount: number) => {
      setQueue(newQueue);
      setMistakes([]);
      setCurrentIndex(0);
      setGameState("playing");
      setIsRetryMode(false);
      setTotalQuestionsInSet(totalCount);
    },
    [],
  );

  const buildWeakQueue = useCallback((): Question[] => {
    const weakHands = getWeakHands(QUESTIONS_PER_SET);
    if (weakHands.length === 0) {
      setSnackbarMessage(
        "苦手問題がありませんでした、ランダムな問題を出題します",
      );
      return [];
    }
    return weakHands
      .map((normalizedHand) => {
        const correctRange = ranges[normalizedHand];
        if (!correctRange) {
          console.warn(`No range found for hand: ${normalizedHand}`);
          return null;
        }
        const displayHand = generateHandWithRandomSuits(normalizedHand);
        return { hand: displayHand, correctRange };
      })
      .filter((q): q is Question => q !== null);
  }, [ranges, getWeakHands]);

  const buildRandomQueue = useCallback((): Question[] => {
    const hands = Object.keys(ranges);
    if (hands.length === 0) return [];
    const randomHands = pickRandomMultiple(hands, QUESTIONS_PER_SET);
    return randomHands
      .map((hand) => {
        const correctRange = ranges[hand];
        if (!correctRange) {
          console.warn(`No range found for hand: ${hand}`);
          return null;
        }
        return { hand, correctRange };
      })
      .filter((q): q is Question => q !== null);
  }, [ranges]);

  const startNewSet = useCallback(() => {
    let newQueue: Question[];
    if (mode === "weak") {
      const weakQueue = buildWeakQueue();
      newQueue = weakQueue.length > 0 ? weakQueue : buildRandomQueue();
    } else {
      newQueue = buildRandomQueue();
    }
    if (newQueue.length === 0) {
      console.error("No valid questions generated");
      return;
    }
    resetSessionWithQueue(newQueue, newQueue.length);
  }, [mode, buildWeakQueue, buildRandomQueue, resetSessionWithQueue]);

  // セッション初期化。苦手モードの場合は localStorage 読み込み完了（isLoaded）まで待つ
  useEffect(() => {
    if (mode === "weak" && !isLoaded) return;
    startNewSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startNewSet を deps に入れると回答のたびにセッションがリセットされる
  }, [mode, ranges, isLoaded]);

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

  const [justCorrect, setJustCorrect] = useState(false);
  const handleAutoAdvance = useCallback(() => {
    setShowCorrectEffect(false);
    setJustCorrect(false);
    nextQuestion();
  }, [nextQuestion]);
  useAutoAdvance(justCorrect, handleAutoAdvance, justCorrect);

  const handleAnswer = useCallback(
    (answer: RangeCategory) => {
      if (gameState !== "playing" || !currentQuestion) return;

      const isCorrect = answer === currentQuestion.correctRange;
      setSelectedAnswer(answer);

      // 成績を記録
      recordResult(currentQuestion.hand, isCorrect);

      if (isCorrect) {
        setShowCorrectEffect(true);
        setJustCorrect(true);
      } else {
        setGameState("feedback");
        setMistakes((prev) => [...prev, currentQuestion]);
      }
    },
    [gameState, currentQuestion, recordResult],
  );

  // すべてのフックは早期リターンの前に呼ばれる必要がある
  const cards: [string, string] = useMemo(() => {
    if (!currentQuestion) return handToCards("AA");
    return handToCards(currentQuestion.hand);
  }, [currentQuestion]);

  // 早期リターンはすべてのフックの後に配置。表示内容を content に分岐し、Snackbar は1箇所でレンダー
  let content: ReactNode;
  if (!currentQuestion && gameState !== "finished") {
    content = (
      <div className="container max-w-7xl mx-auto p-4 flex items-center justify-center min-h-screen">
        {mode === "weak" && !isLoaded ? (
          <p className="text-gray-500">学習データを読み込んでいます...</p>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    );
  } else if (gameState === "finished") {
    content = (
      <FlashcardFinished
        mistakes={mistakes}
        totalQuestionsInSet={totalQuestionsInSet}
        isRetryMode={isRetryMode}
        onRetry={startRetry}
        onNextSet={startNewSet}
      />
    );
  } else {
    content = (
      <div className="container max-w-7xl mx-auto p-2 sm:p-4 space-y-1 sm:space-y-2 flex flex-col min-h-screen">
        <div className="flex justify-between items-center pb-0.5 sm:pb-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isRetryMode ? "リトライ" : "単語帳モード"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {queue.length}
            </span>
            <HomeButton />
          </div>
        </div>
        <Progress
          value={(currentIndex / queue.length) * 100}
          className="mb-0.5 sm:mb-1"
        />

        {gameState === "feedback" ? (
          <FlashcardFeedback
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            ranges={ranges}
            cards={cards}
            onNext={nextQuestion}
          />
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 flex items-center justify-center">
              <HandDisplay
                hand={currentQuestion.hand}
                cards={cards}
                showCorrectEffect={showCorrectEffect}
              />
            </div>
            <div className="mt-auto">
              <AnswerGrid onAnswer={handleAnswer} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {content}
      {snackbarMessage && (
        <Snackbar
          message={snackbarMessage}
          onClose={() => setSnackbarMessage(null)}
        />
      )}
    </>
  );
}
