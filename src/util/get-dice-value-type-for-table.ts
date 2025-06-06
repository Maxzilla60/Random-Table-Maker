export type DiceValueType = 'single' | 'range';

export function getDiceValueTypeForTable(entries: string[], diceSize: number): DiceValueType {
	if (diceSize === entries.length) {
		return 'single';
	}

	return 'range';
}
