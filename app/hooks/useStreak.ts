import { useState, useCallback } from "react";

/**
 * ストリーク（連続正解数）を管理するカスタムフック
 */
export function useStreak() {
  const [streak, setStreak] = useState(0);

  const incrementStreak = useCallback(() => {
    setStreak((prev) => prev + 1);
  }, []);

  const resetStreak = useCallback(() => {
    setStreak(0);
  }, []);

  const updateStreak = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        incrementStreak();
      } else {
        resetStreak();
      }
    },
    [incrementStreak, resetStreak],
  );

  return {
    streak,
    incrementStreak,
    resetStreak,
    updateStreak,
  };
}
