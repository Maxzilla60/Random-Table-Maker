import { chain } from 'lodash';

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

export type DiceSizes = [] | [DiceSize] | [DiceSize, DiceSize];

export function getDiceSizesForTable(entries: string[]): DiceSizes {
	if (entries.length === 0) {
		return [0];
	}
	if (entries.length === 1) {
		return [1];
	}

	const singleFit = DICE_SIZES
		.find(size => size % entries.length === 0);

	if (singleFit) {
		return [singleFit];
	}

	const doubleFit = chain(DICE_SIZES)
		.map(firstSize => DICE_SIZES.map(secondSize => [firstSize, secondSize]))
		.flatMap()
		.find(([firstSize, secondSize]) => (firstSize * secondSize) % entries.length === 0)
		.value() as [DiceSize, DiceSize] | undefined;

	if (doubleFit) {
		return doubleFit;
	}

	return [100];
}
