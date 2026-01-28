import { RangeCategory, RANGE_TO_STAR } from "./types";

export type GameType = "ring" | "tournament";

export interface ScenarioDef {
  text: string;
  minStars: number;
  gameType: GameType;
}

// Rules defining the minimum star rating required to PLAY (Participate)
// Based on plan mapping:
// rangeA(8): 8人(強)
// rangeB(7): 8人(中)
// rangeC(6): 8人(弱)
// rangeD(5): 6~7人
// rangeE(4): 4~5人
// rangeF(3): 3人
// rangeG(2): 2人

export const SCENARIO_RULES: ScenarioDef[] = [
  // Ring Game (Based on Ring Table Image logic inferred)
  // Note: Ring table might have slightly different colors mapped to players, but using Plan's unified mapping.
  { text: "後ろの人数: 8人 (強)", minStars: 8, gameType: "ring" },
  { text: "後ろの人数: 8人 (弱)", minStars: 7, gameType: "ring" }, // Assuming Red for 8 weak in Ring? Or Yellow? Plan unified them.
  { text: "後ろの人数: 6~7人", minStars: 5, gameType: "ring" }, // Green
  { text: "後ろの人数: 4~5人", minStars: 4, gameType: "ring" }, // Cyan
  { text: "後ろの人数: 3人", minStars: 3, gameType: "ring" }, // White
  { text: "後ろの人数: 2人", minStars: 2, gameType: "ring" }, // Purple Box

  // Tournament
  { text: "後ろの人数: 8人 (強)", minStars: 8, gameType: "tournament" },
  { text: "後ろの人数: 8人 (中)", minStars: 7, gameType: "tournament" },
  { text: "後ろの人数: 8人 (弱)", minStars: 6, gameType: "tournament" },
  { text: "後ろの人数: 6~7人", minStars: 5, gameType: "tournament" },
  { text: "後ろの人数: 4~5人", minStars: 4, gameType: "tournament" },
  { text: "後ろの人数: 3人", minStars: 3, gameType: "tournament" },
  { text: "後ろの人数: 2人", minStars: 2, gameType: "tournament" },
];

export function checkAction(
  handCategory: RangeCategory,
  minStars: number,
): "play" | "fold" {
  const handStars = RANGE_TO_STAR[handCategory];
  // Play if hand strength is equal or greater than requirement
  return handStars >= minStars ? "play" : "fold";
}
