import { createForcedTable } from './createForcedTable';
import { createSolvedDoubleTable } from './createSolvedDoubleTable';
import { createSolvedSingleTable } from './createSolvedSingleTable';
import { getDiceSizesForTable } from './getDiceSizesForTable';
import type { RandomTable, Settings } from './types';

export function mapEntriesToRandomTable(entries: string[], settings: Settings): RandomTable {
	if (entries.length === 0) {
		return {
			type: 'solved-single',
			diceSize: [0],
			table: [],
		};
	}
	if (entries.length === 1) {
		return {
			type: 'solved-single',
			diceSize: [1],
			table: [{ value: '1', result: entries[0], odds: 100 }],
		};
	}
	if (settings.enableD2 && entries.length === 2) {
		return {
			type: 'solved-single',
			diceSize: [2],
			table: [
				{ value: 'heads', result: entries[0], odds: 50 },
				{ value: 'tails', result: entries[1], odds: 50 },
			],
		};
	}

	const diceSizes = getDiceSizesForTable(entries, settings);

	switch (diceSizes.length) {
		case 0:
			return createForcedTable(entries);
		case 1:
			return createSolvedSingleTable(entries, diceSizes[0]);
		case 2:
			return createSolvedDoubleTable(entries, diceSizes);
		default:
			throw new Error(`Cannot create random table for ${entries.length} entries with dice sizes ${diceSizes}`);
	}
}
