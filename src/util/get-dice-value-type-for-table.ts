export type DiceValueType = 'single' | 'string' | 'range';

export function getDiceValueTypeForTable(entries: string[], diceSize: number): DiceValueType {
	if (diceSize === 2) {
		return 'string';
	}

	if (diceSize === entries.length) {
		return 'single';
	}

	return 'range';
}
