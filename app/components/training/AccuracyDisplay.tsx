"use client";

interface AccuracyDisplayProps {
  accuracy: number;
  showAccuracy: boolean;
}

export function AccuracyDisplay({
  accuracy,
  showAccuracy,
}: AccuracyDisplayProps) {
  return (
    <div className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">正答率</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          {showAccuracy ? `${accuracy}%` : "--"}
        </p>
      </div>
    </div>
  );
}
