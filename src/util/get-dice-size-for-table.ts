export const DICE_SIZES = [
	2,
	4,
	6,
	8,
	10,
	12,
	20,
	100,
] as const;

export type DiceSize = 0 | 1 | typeof DICE_SIZES[number];

export function getDiceSizeForTable({ length: tableLength }: string[]): DiceSize {
	if (tableLength === 0) {
		return 0;
	}
	if (tableLength === 1) {
		return 1;
	}

	const diceSize = DICE_SIZES.find(size =>
		size % tableLength === 0,
	);

	return diceSize ?? 100;
}
