import { concat } from 'lodash';
import type { DoubleTableEntry, RandomTable, SingleTableEntry } from '../types';
import { mapDiceSize } from './mapDiceSize';

export function mapTableToCSV({ type, table, diceSize }: RandomTable): string {
	const header = `${mapDiceSize(type, diceSize)},Result`;
	const entries = mapTableEntries(type, table);

	return concat(header, entries).join('\n');
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
				.map(({ value, result }) => `${value},${result}`);
		case 'solved-double':
		case 'reroll-double':
			return (table as DoubleTableEntry[])
				.map(({ firstValue, secondValue, result }) => `${firstValue} & ${secondValue},${result}`);
		default:
			return ['Could not map table to text'];
	}
}
