import type { RandomTable } from '../types';

export function mapLength(type: RandomTable['type'], table: RandomTable['table'], entriesLength: number): string {
	if (type === 'reroll-double' || type === 'reroll-bell' || type === 'reroll-single') {
		return `${entriesLength} + ${table.length - entriesLength}`;
	}

	return String(table.length);
}
