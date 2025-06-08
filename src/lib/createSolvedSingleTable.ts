import { chain } from 'lodash';
import { mapRangesToValues } from './mapRangesToValues';
import type { DiceSize, SingleTableEntry, SolvedSingleRandomTable } from './types';

export function createSolvedSingleTable(entries: string[], diceSize: DiceSize): SolvedSingleRandomTable {
	const table = chain(entries.length)
		.range()
		.fill(diceSize / entries.length)
		.thru(mapRangesToValues)
		.zip(entries)
		.map(([value, result]) => ({
			value,
			odds: 100 / entries.length,
			result,
		}))
		.value() as SingleTableEntry[];

	return {
		type: 'solved-single',
		diceSize: [diceSize],
		table,
	};
}
