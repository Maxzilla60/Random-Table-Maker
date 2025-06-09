import { concat } from 'lodash';
import { MAX_TABLE_LENGTH } from './constants';
import { getDiceSizesForTable } from './getDiceSizesForTable';
import { mapEntriesToRandomTable } from './mapEntriesToRandomTable';
import type { DoubleTableEntry, RandomTable, Settings, SingleTableEntry } from './types';

export function createRerollTable(entries: string[], settings: Settings): RandomTable {
	const rerollLength = getRerollEntriesLength(entries.length, settings);
	const newEntries = concat(
		entries,
		new Array(rerollLength).fill('Reroll'),
	);

	const randomTable = mapEntriesToRandomTable(newEntries, settings);

	return {
		...randomTable,
		type: randomTable.type === 'solved-single' ? 'reroll-single' : 'reroll-double',
		table: mapToRerollEntries(randomTable.table, rerollLength),
	} as RandomTable;
}

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

function mapToRerollEntries<T extends SingleTableEntry[] | DoubleTableEntry[]>(table: T, rerollLength: number): T {
	return [
		...table.slice(0, table.length - rerollLength),
		...table.slice(-rerollLength).map(entry => ({ ...entry, isReroll: true })),
	] as T;
}

