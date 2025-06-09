import { chain, concat } from 'lodash';
import { DCC_DICE_SIZES, DICE_SIZES } from './constants';
import type { DiceSize, DiceSizes, Settings } from './types';

export function getDiceSizesForTable(entries: string[], settings: Settings): DiceSizes {
	if (entries.length === 0) {
		return [0];
	}
	if (entries.length === 1) {
		return [1];
	}

	const diceSizes = getDiceSizes(settings);

	const exactFit = diceSizes
		.find(size => size === entries.length);

	if (exactFit) {
		return [exactFit];
	}

	const singleFit = diceSizes
		.find(size => size % entries.length === 0);

	if (singleFit) {
		return [singleFit];
	}

	const doubleFit = chain(diceSizes)
		.map(firstSize => diceSizes.map(secondSize => [firstSize, secondSize]))
		.flatMap()
		.find(([firstSize, secondSize]) => (firstSize * secondSize) % entries.length === 0)
		.value() as [DiceSize, DiceSize] | undefined;

	return doubleFit ?? [];
}

function getDiceSizes({ enableDCCDice, enableD2 }: Settings): readonly DiceSize[] {
	const availableDice = enableD2 ? DICE_SIZES : DICE_SIZES.filter(size => size !== 2);

	if (enableDCCDice) {
		return concat(availableDice, DCC_DICE_SIZES)
			.toSorted((a, b) => a - b);
	}

	return availableDice;
}
