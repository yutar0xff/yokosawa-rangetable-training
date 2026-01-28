import path from 'path';
import { promises as fs } from 'fs';
import GridSession from './GridSession';
import { RangeTable } from '@/app/data/types';

export default async function GridPage() {
  const jsonPath = path.join(process.cwd(), 'public', 'data', 'ranges.json');
  const fileContents = await fs.readFile(jsonPath, 'utf8');
  const ranges: RangeTable = JSON.parse(fileContents);

  return <GridSession correctRanges={ranges} />;
}
