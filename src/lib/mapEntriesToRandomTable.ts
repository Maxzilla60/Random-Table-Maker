import { createBellCurveTable } from './table-creators/createBellCurveTable';
import { createForcedTable } from './table-creators/createForcedTable';
import { createRerollBellTable } from './table-creators/createRerollBellTable';
import { createRerollTable } from './table-creators/createRerollTable';
import { createSolvedDoubleTable } from './table-creators/createSolvedDoubleTable';
import { createSolvedSingleTable } from './table-creators/createSolvedSingleTable';
import { getDiceSizesForTable } from './table-util/getDiceSizesForTable';
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
			table: [{ value: '1', result: entries[0], odds: 100, isReroll: false }],
		};
	}
	if (settings.enableD2 && entries.length === 2) {
		return {
			type: 'solved-single',
			diceSize: [2],
			table: [
				{ value: 'heads', result: entries[0], odds: 50, isReroll: false },
				{ value: 'tails', result: entries[1], odds: 50, isReroll: false },
			],
		};
	}
	if (settings.enableDCCDice && entries.length === 3) {
		return {
			type: 'solved-single',
			diceSize: [3],
			table: [
				{ value: 'I', result: entries[0], odds: 33.33, isReroll: false },
				{ value: 'II', result: entries[1], odds: 33.33, isReroll: false },
				{ value: 'III', result: entries[2], odds: 33.33, isReroll: false },
			],
		};
	}

	const diceSizes = getDiceSizesForTable(entries.length, settings);

	switch (diceSizes.length) {
		case 0:
			switch (settings.mode) {
				case 'forced':
					return createForcedTable(entries);
				case 'reroll':
					return createRerollTable(entries, settings);
				case 'bell':
					return createRerollBellTable(entries, settings);
				default:
					throw new Error(`Cannot create random table for ${entries.length} entries with dice sizes ${diceSizes}`);
			}
		case 1:
			return createSolvedSingleTable(entries, diceSizes[0]);
		case 2:
			if (settings.mode === 'bell') {
				return createBellCurveTable(entries, diceSizes);
			}
			return createSolvedDoubleTable(entries, diceSizes);
		default:
			throw new Error(`Cannot create random table for ${entries.length} entries with dice sizes ${diceSizes}`);
	}
}
