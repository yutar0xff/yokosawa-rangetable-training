import ScenarioSession from "./ScenarioSession";
import { loadRanges } from "@/app/utils/loadRanges";

export default async function ScenarioPage() {
  const ranges = await loadRanges();

  return <ScenarioSession ranges={ranges} />;
}
