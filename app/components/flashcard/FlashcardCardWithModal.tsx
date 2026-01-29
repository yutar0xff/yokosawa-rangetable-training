"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlashcardModeSelector } from "./FlashcardModeSelector";
import type { FlashcardMode } from "@/app/data/types";

export function FlashcardCardWithModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (mode: FlashcardMode) => {
    setModalOpen(false);
    router.push(`/training/flashcard?mode=${mode}`);
  };

  return (
    <>
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => setModalOpen(true)}
      >
        <Card className="hover:border-black transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">単語帳モード</CardTitle>
            <Brain className="w-6 h-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              ハンドを見て、その強さ（色・星）を即座に答えるトレーニング。
            </p>
          </CardContent>
        </Card>
      </button>
      <FlashcardModeSelector
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
