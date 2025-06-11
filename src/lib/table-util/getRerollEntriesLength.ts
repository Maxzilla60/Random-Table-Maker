import { MAX_TABLE_LENGTH } from '../constants';
import type { Settings } from '../types';
import { getDiceSizesForTable } from './getDiceSizesForTable';

export function getRerollEntriesLength(entriesLength: number, settings: Settings, rerollLength = 0): number {
	if (entriesLength + rerollLength > MAX_TABLE_LENGTH) {
		return -1;
	}

	const diceSizes = getDiceSizesForTable(entriesLength + rerollLength, settings);

	if (diceSizes.length !== 0) {
		return rerollLength;
	}

	return getRerollEntriesLength(entriesLength, settings, rerollLength + 1);
}
