import Image from "next/image";
import { cn } from "@/lib/utils"; // Assuming shadcn setup has this, or I'll implement a simple one if missing.

// Helper to resolve SVG filename
const getCardSvgName = (card: string) => {
  // card format: "Ah", "Td", "2s" (Rank + Suit)
  if (card.length < 2) return null;

  const rankChar = card[0].toUpperCase();
  const suitChar = card[1].toUpperCase();

  let rankName = rankChar;
  if (rankChar === "A") rankName = "ace";
  else if (rankChar === "K") rankName = "K";
  else if (rankChar === "Q") rankName = "Q";
  else if (rankChar === "J") rankName = "jack";
  else if (rankChar === "T") rankName = "10";

  return `${rankName}${suitChar}.svg`;
};

interface PokerCardProps {
  card: string; // e.g., "Ah"
  className?: string;
  width?: number;
  height?: number;
}

export function PokerCard({
  card,
  className,
  width = 100,
  height = 140,
}: PokerCardProps) {
  const fileName = getCardSvgName(card);

  if (!fileName) {
    return (
      <div className="w-[100px] h-[140px] bg-gray-200 flex items-center justify-center">
        ?
      </div>
    );
  }

  return (
    <div
      className={cn("relative inline-block overflow-hidden", className)}
      style={{ width, height }}
    >
      <Image
        src={`/imgs/cards/${fileName}`}
        alt={card}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
