"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { HomeButton } from "@/app/components/common/HomeButton";
import { Question } from "@/app/data/types";

interface FlashcardFinishedProps {
  mistakes: Question[];
  totalQuestionsInSet: number;
  isRetryMode: boolean;
  onRetry: () => void;
  onNextSet: () => void;
}

export function FlashcardFinished({
  mistakes,
  totalQuestionsInSet,
  isRetryMode,
  onRetry,
  onNextSet,
}: FlashcardFinishedProps) {
  const accuracy = Math.round(
    ((totalQuestionsInSet - mistakes.length) / totalQuestionsInSet) * 100,
  );

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <Card className="text-center p-6">
        <CardHeader className="relative">
          <CardTitle className="text-3xl">セット完了!</CardTitle>
          <div className="absolute top-0 right-0">
            <HomeButton className="h-8 w-8 p-0" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xl font-bold">
            {isRetryMode ? "リトライ" : ""}正答率: {accuracy}%
          </div>

          {mistakes.length > 0 ? (
            <div className="space-y-4">
              <p className="text-red-500">誤答数: {mistakes.length}問</p>
              <Button onClick={onRetry} className="w-full gap-2">
                <RotateCcw className="w-4 h-4" />
                誤答のみ再挑戦
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600 text-lg">
                全問正解です！素晴らしい！
              </p>
              <Button onClick={onNextSet} className="w-full">
                次のセットへ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
