import type { DoubleTableEntry, RandomTable, SingleTableEntry } from '../types';
import { mapDiceSize } from './mapDiceSize';

export function mapTableToText({ type, table, diceSize }: RandomTable): string {
	return mapDiceSize(type, diceSize) + '\n' + mapTableEntries(type, table);
}

function mapTableEntries(type: RandomTable['type'], table: RandomTable['table']): string {
	switch (type) {
		case 'forced':
		case 'solved-single':
		case 'reroll-single':
		case 'solved-bell':
		case 'reroll-bell':
		case 'unsolved-bell':
			return (table as SingleTableEntry[])
				.map(({ value, result }) => `${value}: ${result}`)
				.join('\n');
		case 'solved-double':
		case 'reroll-double':
			return (table as DoubleTableEntry[])
				.map(({ firstValue, secondValue, result }) => `${firstValue} & ${secondValue}: ${result}`)
				.join('\n');
		default:
			return 'Could not map table to text';
	}
}
