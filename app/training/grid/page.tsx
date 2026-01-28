import GridSession from "./GridSession";
import { loadRanges } from "@/app/utils/loadRanges";

export default async function GridPage() {
  const ranges = await loadRanges();

  return <GridSession correctRanges={ranges} />;
}
