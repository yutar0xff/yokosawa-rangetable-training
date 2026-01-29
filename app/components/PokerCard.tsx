import Image from "next/image";
import { cn } from "@/lib/utils"; // Assuming shadcn setup has this, or I'll implement a simple one if missing.

// Helper to resolve SVG filename (rank + suit lowercase: As.svg, Tc.svg, Kd.svg)
const getCardSvgName = (card: string) => {
  // card format: "Ah", "Td", "2s" (Rank + Suit)
  if (card.length < 2) return null;
  const rank = card[0].toUpperCase();
  const suit = card[1].toLowerCase();
  return `${rank}${suit}.svg`;
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
