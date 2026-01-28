"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PokerCard } from "@/app/components/PokerCard";
import { RangeTable, RangeCategory } from "@/app/data/types";
import { SCENARIO_RULES, checkAction, GameType } from "@/app/data/rules";
import { Check, X, Play, XCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioSessionProps {
  ranges: RangeTable;
}

export default function ScenarioSession({ ranges }: ScenarioSessionProps) {
  const router = useRouter();
  const [gameType, setGameType] = useState<GameType>("ring");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [currentHand, setCurrentHand] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [streak, setStreak] = useState(0);

  // Helper to generate new question
  const generateQuestion = () => {
    // Pick random scenario rule for current game type
    const rules = SCENARIO_RULES.filter((r) => r.gameType === gameType);
    const rule = rules[Math.floor(Math.random() * rules.length)];

    // Pick random hand
    const hands = Object.keys(ranges);
    const hand = hands[Math.floor(Math.random() * hands.length)];

    return { rule, hand };
  };

  const [question, setQuestion] = useState(generateQuestion());

  // Regenerate when gameType changes
  useEffect(() => {
    nextQuestion();
  }, [gameType]);

  const nextQuestion = () => {
    setFeedback(null);
    setQuestion(generateQuestion());
  };

  const handleAction = (action: "play" | "fold") => {
    if (feedback) return;

    const handCategory = ranges[question.hand];
    const correctAnswer = checkAction(handCategory, question.rule.minStars);

    const isCorrect = action === correctAnswer;
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) setStreak((s) => s + 1);
    else setStreak(0);

    // Auto advance if correct? Or manual?
    // User plan: "正解/不正解のフィードバックを表示" -> manual advance implies better learning.
    // Let's do auto for correct after short delay, manual for incorrect.
    if (isCorrect) {
      setTimeout(nextQuestion, 800);
    }
  };

  const cards = parseHandToCards(question.hand);

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6 flex flex-col min-h-screen">
      {/* Settings / Status */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={gameType === "ring" ? "default" : "outline"}
            onClick={() => setGameType("ring")}
            size="sm"
          >
            リング
          </Button>
          <Button
            variant={gameType === "tournament" ? "default" : "outline"}
            onClick={() => setGameType("tournament")}
            size="sm"
          >
            トーナメント
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Streak: {streak}</Badge>
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

      {/* Scenario Card */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
        <Card className="flex-1 w-full lg:max-w-md flex flex-col justify-center items-center py-8 relative">
          {feedback && (
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10 rounded-lg animate-in fade-in",
              )}
            >
              <div
                className={cn(
                  "p-6 rounded-xl border-4 text-4xl font-bold flex flex-col items-center shadow-lg bg-white",
                  feedback === "correct"
                    ? "border-green-500 text-green-600"
                    : "border-red-500 text-red-600",
                )}
              >
                {feedback === "correct" ? (
                  <Check className="w-16 h-16" />
                ) : (
                  <X className="w-16 h-16" />
                )}
                {feedback === "correct" ? "正解!" : "不正解..."}

                {feedback === "incorrect" && (
                  <div className="mt-4">
                    <Button onClick={nextQuestion}>次へ</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-xl font-bold mb-8 text-center text-gray-700">
            {question.rule.text}
          </div>

          <div className="flex gap-6 mb-8">
            <PokerCard card={cards[0]} width={180} height={252} />
            <PokerCard card={cards[1]} width={180} height={252} />
          </div>
          <h2 className="text-4xl font-bold">{question.hand}</h2>
        </Card>

        {/* Actions */}
        <div className="w-full lg:w-auto lg:min-w-[200px]">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-24 lg:h-auto lg:space-y-4">
            <Button
              onClick={() => handleAction("fold")}
              className="h-full lg:h-16 text-xl bg-gray-500 hover:bg-gray-600"
            >
              <XCircle className="mr-2 w-6 h-6" /> Fold
            </Button>
            <Button
              onClick={() => handleAction("play")}
              className="h-full lg:h-16 text-xl bg-red-600 hover:bg-red-700"
            >
              <Play className="mr-2 w-6 h-6" /> Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reuse helper (should extract to utils)
function parseHandToCards(hand: string): [string, string] {
  const rank1 = hand[0];
  const rank2 = hand[1];
  const type = hand.length > 2 ? hand[2] : "";
  let s1 = "s",
    s2 = "h";
  if (type === "s") s2 = "s";
  else s2 = "h";
  return [`${rank1}${s1}`, `${rank2}${s2}`];
}
