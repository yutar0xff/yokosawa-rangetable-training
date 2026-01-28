import path from "path";
import { promises as fs } from "fs";
import FlashcardSession from "./FlashcardSession";
import { RangeTable } from "@/app/data/types";

export default async function FlashcardPage() {
  // Load ranges from public/data/ranges.json
  const jsonPath = path.join(process.cwd(), "public", "data", "ranges.json");
  const fileContents = await fs.readFile(jsonPath, "utf8");
  const ranges: RangeTable = JSON.parse(fileContents);

  return <FlashcardSession ranges={ranges} />;
}
