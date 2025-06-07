export type DiceValueType = 'single' | 'range' | 'single-single' | 'single-range' | 'range-range';

export function getDiceValueTypeForTable(entries: string[], diceSize: number[]): DiceValueType {
	if (diceSize.length === 1) {
		if (diceSize[0] === entries.length) {
			return 'single';
		}
		return 'range';
	}

	if (diceSize.length === 2) {
		const [firstDie, secondDie] = diceSize;
		const totalCombinations = firstDie * secondDie;

		if (entries.length === totalCombinations) {
			return 'single-single';
		}

		if (firstDie === entries.length) {
			return 'single-range';
		}

		return 'range-range';
	}

	throw new Error(`Invalid dice size: ${diceSize}`);
}
