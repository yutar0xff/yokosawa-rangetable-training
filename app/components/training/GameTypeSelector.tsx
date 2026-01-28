"use client";

import { Button } from "@/components/ui/button";
import { GameType } from "@/app/data/rules";

interface GameTypeSelectorProps {
  gameType: GameType;
  onGameTypeChange: (gameType: GameType) => void;
}

export function GameTypeSelector({
  gameType,
  onGameTypeChange,
}: GameTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={gameType === "ring" ? "default" : "outline"}
        onClick={() => onGameTypeChange("ring")}
        size="sm"
      >
        リング
      </Button>
      <Button
        variant={gameType === "tournament" ? "default" : "outline"}
        onClick={() => onGameTypeChange("tournament")}
        size="sm"
      >
        トーナメント
      </Button>
    </div>
  );
}
