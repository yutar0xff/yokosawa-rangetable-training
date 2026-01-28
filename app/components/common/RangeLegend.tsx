import { STAR_TO_RANGE, RANGE_COLORS } from "@/app/data/types";
import { cn } from "@/lib/utils";

interface RangeLegendProps {
  variant?: "list" | "grid" | "buttons";
  className?: string;
}

export function RangeLegend({ variant = "list", className }: RangeLegendProps) {
  const entries = Object.entries(STAR_TO_RANGE).reverse();

  if (variant === "grid") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2",
          className,
        )}
      >
        {entries.map(([starStr, category]) => (
          <div
            key={category}
            className={cn(
              "flex items-center justify-center gap-2 p-3 rounded-lg text-xs shadow-sm",
              RANGE_COLORS[category],
            )}
          >
            <span className="font-bold">☆{starStr}</span>
            <span className="text-[10px] hidden sm:inline">{category}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "buttons") {
    return (
      <div
        className={cn(
          "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2",
          className,
        )}
      >
        {entries.map(([starStr, category]) => {
          const star = parseInt(starStr);
          return (
            <div
              key={category}
              className={cn(
                "h-16 sm:h-20 flex flex-col items-center justify-center gap-1 rounded-md text-xs sm:text-sm font-bold",
                RANGE_COLORS[category],
                "hover:opacity-90 transition-opacity",
              )}
            >
              <span>☆{star}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Default: list variant
  return (
    <div className={cn("space-y-2", className)}>
      {entries.map(([starStr, category]) => (
        <div
          key={category}
          className={cn(
            "flex items-center gap-3 p-2 rounded text-sm",
            RANGE_COLORS[category],
          )}
        >
          <span className="font-bold w-8">☆{starStr}</span>
          <span className="font-medium">{category}</span>
        </div>
      ))}
    </div>
  );
}
