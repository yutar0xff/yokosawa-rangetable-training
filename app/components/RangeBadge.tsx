import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RangeCategory, RANGE_COLORS, RANGE_TO_STAR } from "../data/types";
import { StarDisplay } from "./StarDisplay";

interface RangeBadgeProps {
  category: RangeCategory;
  className?: string;
  showStars?: boolean;
}

export function RangeBadge({
  category,
  className,
  showStars = true,
}: RangeBadgeProps) {
  const colorClass = RANGE_COLORS[category];
  const starCount = RANGE_TO_STAR[category];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <Badge
        className={cn(
          "px-4 py-2 text-lg font-bold pointer-events-none flex items-center gap-2",
          colorClass,
        )}
      >
        <span>☆{starCount}</span>
        <span>{category}</span>
      </Badge>
    </div>
  );
}
