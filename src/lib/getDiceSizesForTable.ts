import { chain } from 'lodash';
import { DICE_SIZES } from './constants';
import type { DiceSize, DiceSizes } from './types';

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

	return doubleFit ?? [];
}
