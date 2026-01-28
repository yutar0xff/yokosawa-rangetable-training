import path from "path";
import { promises as fs } from "fs";
import ScenarioSession from "./ScenarioSession";
import { RangeTable } from "@/app/data/types";

export default async function ScenarioPage() {
  const jsonPath = path.join(process.cwd(), "public", "data", "ranges.json");
  const fileContents = await fs.readFile(jsonPath, "utf8");
  const ranges: RangeTable = JSON.parse(fileContents);

  return <ScenarioSession ranges={ranges} />;
}
