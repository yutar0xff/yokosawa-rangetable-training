import { useState, useEffect, useCallback } from "react";
import { HandStat } from "../data/types";
import { normalizeHand } from "../utils/handNormalizer";

const STORAGE_KEY = "yokosawa-training-stats";

export function useRangeStats() {
  const [stats, setStats] = useState<Record<string, HandStat>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStats(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load stats", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever stats change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats, isLoaded]);

  const recordResult = useCallback((hand: string, isCorrect: boolean) => {
    const key = normalizeHand(hand);
    setStats((prev) => {
      const current = prev[key] || {
        hand: key,
        correctCount: 0,
        totalCount: 0,
        lastReviewed: 0,
        consecutiveCorrect: 0,
      };

      const updated: HandStat = {
        ...current,
        totalCount: current.totalCount + 1,
        correctCount: current.correctCount + (isCorrect ? 1 : 0),
        lastReviewed: Date.now(),
        consecutiveCorrect: isCorrect ? current.consecutiveCorrect + 1 : 0,
      };

      return {
        ...prev,
        [key]: updated,
      };
    });
  }, []);

  const getStat = useCallback(
    (hand: string): HandStat | undefined => {
      return stats[normalizeHand(hand)];
    },
    [stats],
  );

  const getWeakHands = useCallback(
    (limit: number = 10): string[] => {
      const entries = Object.entries(stats).filter(([, s]) => s.totalCount > 0);
      const sorted = entries
        .map(([hand, s]) => ({
          hand,
          accuracy: s.correctCount / s.totalCount,
        }))
        .sort((a, b) => a.accuracy - b.accuracy);
      return sorted.slice(0, limit).map((x) => x.hand);
    },
    [stats],
  );

  const resetStats = useCallback(() => {
    if (confirm("学習データをすべてリセットしますか？")) {
      setStats({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    stats,
    isLoaded,
    recordResult,
    getStat,
    getWeakHands,
    resetStats,
  };
}
