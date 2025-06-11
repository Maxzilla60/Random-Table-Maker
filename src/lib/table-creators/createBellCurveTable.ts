import { chain, range, sum } from 'lodash';
import { mapRangesToValues } from '../table-util/mapRangesToValues';
import type { BellSolvedRandomTable, DiceSize, SingleTableEntry } from '../types';

export function createBellCurveTable(entries: string[], diceSizes: [DiceSize, DiceSize]): BellSolvedRandomTable {
	const [firstDie, secondDie] = diceSizes;

	const firstDieFaces = range(firstDie).map(i => i + 1);
	const secondDieFaces = range(secondDie).map(i => i + 1);

	const odds = chain(firstDieFaces)
		.flatMap(firstFace => secondDieFaces.map(secondFace => firstFace + secondFace))
		.flatten()
		.countBy()
		.values()
		.map(count => count / (firstDieFaces.length * secondDieFaces.length) * 100)
		.chunk((firstDie + secondDie - 1) / entries.length)
		.map(chunk => sum(chunk))
		.value();

	const table = chain(entries.length)
		.range()
		.fill((firstDie + secondDie - 1) / entries.length)
		.thru(ranges => mapRangesToValues(ranges, 1))
		.zip(entries)
		.map(([value, result]) => ({
			value,
			result,
		}))
		.zip(odds)
		.map(([entry, odds]) => ({
			...entry,
			odds,
			isReroll: false,
		}))
		.value() as SingleTableEntry[];

	return {
		type: 'solved-bell',
		diceSize: diceSizes,
		table,
	};
}
