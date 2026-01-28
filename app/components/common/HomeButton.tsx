"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface HomeButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function HomeButton({
  className = "h-8 w-8 p-0",
  size = "sm",
}: HomeButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => router.push("/")}
      className={className}
    >
      <Home className="h-5 w-5" />
    </Button>
  );
}
