import { MAX_TABLE_LENGTH } from './constants';
import { getDiceSizesForTable } from './getDiceSizesForTable';
import type { Settings } from './types';

export function getRerollEntriesLength(entriesLength: number, settings: Settings, rerollLength = 0): number {
	if (entriesLength + rerollLength > MAX_TABLE_LENGTH) {
		throw new Error('getDiceSizesForTable cannot handle it!');
	}

	const diceSizes = getDiceSizesForTable(entriesLength + rerollLength, settings);

	if (diceSizes.length !== 0) {
		return rerollLength;
	}

	return getRerollEntriesLength(entriesLength, settings, rerollLength + 1);
}
