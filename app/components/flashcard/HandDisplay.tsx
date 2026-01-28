"use client";

import { Card } from "@/components/ui/card";
import { PokerCard } from "@/app/components/PokerCard";
import { CARD_SIZES } from "@/app/data/constants";
import { Circle } from "lucide-react";

interface HandDisplayProps {
  hand: string;
  cards: [string, string];
  showCorrectEffect: boolean;
}

export function HandDisplay({
  hand,
  cards,
  showCorrectEffect,
}: HandDisplayProps) {
  return (
    <Card className="flex-1 flex flex-col justify-center items-center py-8 min-h-[300px] relative">
      <div className="flex gap-4 sm:gap-6 mb-8 px-4 sm:px-6">
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
      <h2 className="text-4xl font-bold mb-2">{hand}</h2>

      {showCorrectEffect && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-50/80 backdrop-blur-sm z-20 rounded-xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-green-600 font-bold text-4xl gap-4">
            <Circle className="w-24 h-24" />
            <span>正解!</span>
          </div>
        </div>
      )}
    </Card>
  );
}
