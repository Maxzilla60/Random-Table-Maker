import { ceil, chunk, concat, isNil } from 'lodash';
import { getRerollEntriesLength } from './getRerollEntriesLength';
import { mapEntriesToRandomTable } from './mapEntriesToRandomTable';
import type { BellSolvedRandomTable, BellUnsolvedRandomTable, DiceSize, Settings, SingleTableEntry } from './types';

export function createRerollBellTable(entries: string[], settings: Settings): BellSolvedRandomTable | BellUnsolvedRandomTable {
	const rerollLength = getRerollEntriesLength(entries.length, settings);

	if (rerollLength === -1) {
		return {
			type: 'unsolved-bell',
			diceSize: [],
			table: entries.map(entry => ({
				value: 'x',
				result: entry,
				odds: 0,
				isReroll: false,
			})),
		} as BellUnsolvedRandomTable;
	}

	const rerollEntries: string[] = new Array(rerollLength).fill('Reroll');
	const [rerollEntriesEnd, rerollEntriesStart] = chunk(rerollEntries, ceil(rerollLength / 2));
	const newEntries = concat(
		rerollEntriesStart ?? [],
		entries,
		rerollEntriesEnd,
	);

	const randomTable = mapEntriesToRandomTable(newEntries, settings);

	return {
		type: 'reroll-bell',
		diceSize: randomTable.diceSize as [DiceSize, DiceSize],
		table: mapToRerollEntries(randomTable.table as SingleTableEntry[], rerollEntriesEnd.length, rerollEntriesStart?.length),
	};
}

function mapToRerollEntries(table: SingleTableEntry[], rerollLengthEnd: number, rerollLengthStart?: number): SingleTableEntry[] {
	if (isNil(rerollLengthStart)) {
		return [
			...table.slice(0, table.length - rerollLengthEnd),
			...table.slice(-rerollLengthEnd).map(entry => ({ ...entry, isReroll: true })),
		] as SingleTableEntry[];
	}

	return [
		...table.slice(0, rerollLengthStart).map(entry => ({ ...entry, isReroll: true })),
		...table.slice(rerollLengthStart, table.length - rerollLengthEnd),
		...table.slice(-rerollLengthEnd).map(entry => ({ ...entry, isReroll: true })),
	] as SingleTableEntry[];
}
