import { useCallback, useRef, useEffect } from "react";
import { FEEDBACK_DELAY_MS } from "@/app/data/constants";

/**
 * 正解時に自動で次の問題に進むためのカスタムフック
 */
export function useAutoAdvance(
  isCorrect: boolean,
  onAdvance: () => void,
  enabled: boolean = true,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoAdvance = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled && isCorrect) {
      timeoutRef.current = setTimeout(() => {
        onAdvance();
      }, FEEDBACK_DELAY_MS);
    }

    return () => {
      clearAutoAdvance();
    };
  }, [isCorrect, onAdvance, enabled, clearAutoAdvance]);

  return { clearAutoAdvance };
}
