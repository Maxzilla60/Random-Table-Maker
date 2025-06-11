import { chain, concat } from 'lodash';
import { DCC_DICE_SIZES, DEFAULT_DICE_SIZES } from '../constants';
import type { DiceSize, DiceSizes, Settings } from '../types';

export function getDiceSizesForTable(entriesLength: number, settings: Settings): DiceSizes {
	if (entriesLength === 0) {
		return [0];
	}
	if (entriesLength === 1) {
		return [1];
	}
	if (settings.mode === 'bell') {
		return getBellCurveDiceSizes(entriesLength, settings);
	}

	const diceSizes = getDiceSizes(settings);

	const exactFit = diceSizes
		.find(size => size === entriesLength);

	if (exactFit) {
		return [exactFit];
	}

	const singleFit = diceSizes
		.find(size => size % entriesLength === 0);

	if (singleFit) {
		return [singleFit];
	}

	const doubleFit = chain(diceSizes)
		.map(firstSize => diceSizes.map(secondSize => [firstSize, secondSize]))
		.flatMap()
		.find(([firstSize, secondSize]) => (firstSize * secondSize) % entriesLength === 0)
		.value() as [DiceSize, DiceSize] | undefined;

	return doubleFit ?? [];
}

function getBellCurveDiceSizes(entriesLength: number, settings: Settings): DiceSizes {
	const diceSizes = getDiceSizes({ ...settings, enableD2: false });

	const all = chain(diceSizes)
		.map(firstSize => diceSizes.map(secondSize => [firstSize, secondSize]))
		.flatMap()
		.value();

	const exactDoubleFit = chain(diceSizes)
		.map(size => [size, size])
		.unionBy(all, pair => pair.join(','))
		.find(([firstSize, secondSize]) => (firstSize + secondSize - 1) % entriesLength === 0)
		.value() as [DiceSize, DiceSize] | undefined;

	if (exactDoubleFit) {
		return exactDoubleFit;
	}

	const comboFit = chain(diceSizes)
		.map(firstSize => diceSizes.map(secondSize => [firstSize, secondSize]))
		.flatMap()
		.find(([firstSize, secondSize]) => (firstSize + secondSize - 1) % entriesLength === 0)
		.value() as [DiceSize, DiceSize] | undefined;

	return comboFit ?? [];
}

function getDiceSizes({ enableDCCDice, enableD2, preferLargerDice }: Settings): readonly DiceSize[] {
	const availableDice = enableD2 ? DEFAULT_DICE_SIZES : DEFAULT_DICE_SIZES.filter(size => size !== 2);

	if (enableDCCDice) {
		return concat(availableDice, DCC_DICE_SIZES)
			.toSorted((a, b) => a - b);
	}

	return preferLargerDice ? availableDice.toReversed() : availableDice;
}
