import path from "path";
import { promises as fs } from "fs";
import { RangeTable } from "@/app/data/types";

/**
 * ranges.jsonファイルを読み込んでRangeTableを返す
 */
export async function loadRanges(): Promise<RangeTable> {
  const jsonPath = path.join(process.cwd(), "public", "data", "ranges.json");
  const fileContents = await fs.readFile(jsonPath, "utf8");
  return JSON.parse(fileContents);
}
