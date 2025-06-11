import { concat } from 'lodash';
import { mapEntriesToRandomTable } from '../mapEntriesToRandomTable';
import { getRerollEntriesLength } from '../table-util/getRerollEntriesLength';
import type { DoubleTableEntry, RandomTable, Settings, SingleTableEntry } from '../types';

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

function mapToRerollEntries<T extends SingleTableEntry[] | DoubleTableEntry[]>(table: T, rerollLength: number): T {
	return [
		...table.slice(0, table.length - rerollLength),
		...table.slice(-rerollLength).map(entry => ({ ...entry, isReroll: true })),
	] as T;
}

