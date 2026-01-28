"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PokerCard } from "@/app/components/PokerCard";
import { RangeTable } from "@/app/data/types";
import { SCENARIO_RULES, checkAction, GameType } from "@/app/data/rules";
import { parseHandToCards } from "@/app/utils/handParser";
import { HomeButton } from "@/app/components/common/HomeButton";
import { CARD_SIZES } from "@/app/data/constants";
import { pickRandom } from "@/app/utils/randomUtils";
import { useStreak } from "@/app/hooks/useStreak";
import { useAutoAdvance } from "@/app/hooks/useAutoAdvance";
import { ScenarioFeedback } from "@/app/components/training/ScenarioFeedback";
import { GameTypeSelector } from "@/app/components/training/GameTypeSelector";
import { ActionButtons } from "@/app/components/training/ActionButtons";

interface ScenarioSessionProps {
  ranges: RangeTable;
}

interface ScenarioQuestion {
  rule: {
    text: string;
    minStars: number;
    gameType: GameType;
  };
  hand: string;
}

export default function ScenarioSession({ ranges }: ScenarioSessionProps) {
  const [gameType, setGameType] = useState<GameType>("ring");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const { streak, updateStreak } = useStreak();

  // 新しい問題を生成
  const generateQuestion = useCallback((): ScenarioQuestion => {
    // 現在のゲームタイプからランダムなルールを選択
    const rules = SCENARIO_RULES.filter((r) => r.gameType === gameType);
    if (rules.length === 0) {
      throw new Error(`No rules found for gameType: ${gameType}`);
    }
    const rule = pickRandom(rules);
    if (!rule) {
      throw new Error("Failed to pick random rule");
    }

    // ランダムなハンドを選択
    const hands = Object.keys(ranges);
    if (hands.length === 0) {
      throw new Error("No hands available in ranges");
    }
    const hand = pickRandom(hands);
    if (!hand) {
      throw new Error("Failed to pick random hand");
    }

    return { rule, hand };
  }, [gameType, ranges]);

  const [question, setQuestion] = useState<ScenarioQuestion>(() => {
    try {
      return generateQuestion();
    } catch (error) {
      // 初期化時のエラーを防ぐため、デフォルト値を返す
      console.error("Failed to generate initial question:", error);
      const defaultRule = SCENARIO_RULES[0];
      if (!defaultRule) {
        throw new Error("No default rule available");
      }
      const defaultHand = Object.keys(ranges)[0] || "AA";
      return { rule: defaultRule, hand: defaultHand };
    }
  });

  const nextQuestion = useCallback(() => {
    setFeedback(null);
    try {
      setQuestion(generateQuestion());
    } catch (error) {
      console.error("Failed to generate question:", error);
    }
  }, [generateQuestion]);

  // Regenerate when gameType changes
  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleAction = useCallback(
    (action: "play" | "fold") => {
      if (feedback) return;

      const handCategory = ranges[question.hand];
      if (!handCategory) {
        console.error(`No category found for hand: ${question.hand}`);
        return;
      }

      if (!question.rule) {
        console.error("Question rule is missing");
        return;
      }

      const correctAnswer = checkAction(handCategory, question.rule.minStars);

      const isCorrect = action === correctAnswer;
      setFeedback(isCorrect ? "correct" : "incorrect");
      updateStreak(isCorrect);
    },
    [feedback, ranges, question, updateStreak],
  );

  // 正解時に自動で次へ進む
  useAutoAdvance(feedback === "correct", nextQuestion, feedback !== null);

  const cards = useMemo(() => parseHandToCards(question.hand), [question.hand]);

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6 flex flex-col min-h-screen">
      {/* Settings / Status */}
      <div className="flex justify-between items-center">
        <GameTypeSelector gameType={gameType} onGameTypeChange={setGameType} />
        <div className="flex items-center gap-2">
          <Badge variant="outline">Streak: {streak}</Badge>
          <HomeButton />
        </div>
      </div>

      {/* Scenario Card */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
        <Card className="flex-1 w-full lg:max-w-md flex flex-col justify-center items-center py-8 relative">
          {feedback && (
            <ScenarioFeedback feedback={feedback} onNext={nextQuestion} />
          )}

          <div className="text-xl font-bold mb-8 text-center text-gray-700">
            {question.rule.text}
          </div>

          <div className="flex gap-6 mb-8">
            <PokerCard
              card={cards[0]}
              width={CARD_SIZES.LARGE.width}
              height={CARD_SIZES.LARGE.height}
            />
            <PokerCard
              card={cards[1]}
              width={CARD_SIZES.LARGE.width}
              height={CARD_SIZES.LARGE.height}
            />
          </div>
          <h2 className="text-4xl font-bold">{question.hand}</h2>
        </Card>

        {/* Actions */}
        <ActionButtons onAction={handleAction} />
      </div>
    </div>
  );
}
