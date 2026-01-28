"use client";

import { Button } from "@/components/ui/button";
import { Play, XCircle } from "lucide-react";

interface ActionButtonsProps {
  onAction: (action: "play" | "fold") => void;
}

export function ActionButtons({ onAction }: ActionButtonsProps) {
  return (
    <div className="w-full lg:w-auto lg:min-w-[200px]">
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-24 lg:h-auto lg:space-y-4">
        <Button
          onClick={() => onAction("fold")}
          className="h-full lg:h-16 text-xl bg-gray-500 hover:bg-gray-600"
        >
          <XCircle className="mr-2 w-6 h-6" /> Fold
        </Button>
        <Button
          onClick={() => onAction("play")}
          className="h-full lg:h-16 text-xl bg-red-600 hover:bg-red-700"
        >
          <Play className="mr-2 w-6 h-6" /> Play
        </Button>
      </div>
    </div>
  );
}
