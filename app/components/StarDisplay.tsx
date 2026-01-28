import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarDisplayProps {
  count: number; // 0-8
  max?: number;
  className?: string;
}

export function StarDisplay({ count, max = 8, className }: StarDisplayProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < count
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200",
          )}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600">{count}</span>
    </div>
  );
}
