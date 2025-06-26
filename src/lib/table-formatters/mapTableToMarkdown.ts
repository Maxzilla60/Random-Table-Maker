import { concat } from 'lodash';
import type { DoubleTableEntry, RandomTable, SingleTableEntry } from '../types';
import { mapDiceSize } from './mapDiceSize';
import { mapLength } from './mapLength';

export function mapTableToMarkdown({ type, table, diceSize }: RandomTable, entriesLength: number): string {
	const header = `| ${mapDiceSize(type, diceSize)} | Result (${(mapLength(type, table, entriesLength))}) |`;
	const separator = '| --- | --- |';
	const entries = mapTableEntries(type, table);
	return concat(header, separator, entries).join('\n');
}

function mapTableEntries(type: RandomTable['type'], table: RandomTable['table']): string[] {
	switch (type) {
		case 'forced':
		case 'solved-single':
		case 'reroll-single':
		case 'solved-bell':
		case 'reroll-bell':
		case 'unsolved-bell':
			return (table as SingleTableEntry[])
				.map(({ value, result }) => `| ${value} | ${result} |`);
		case 'solved-double':
		case 'reroll-double':
			return (table as DoubleTableEntry[])
				.map(({ firstValue, secondValue, result }) => `| ${firstValue} & ${secondValue} | ${result} |`);
		default:
			return ['Could not map table to text'];
	}
}
