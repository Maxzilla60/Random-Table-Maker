import type { DCC_DICE_SIZES, DICE_SIZES } from './constants';

export type DiceSize = 0 | 1 | typeof DICE_SIZES[number] | typeof DCC_DICE_SIZES[number];

export type DiceSizes = [] | [DiceSize] | [DiceSize, DiceSize];

export type SingleTableEntry = {
	value: string;
	odds: number;
	result: string;
	isReroll: boolean;
};

export type Forced100RandomTable = {
	type: 'forced';
	diceSize: [100];
	table: SingleTableEntry[];
}

export type SingleRandomTable = {
	type: 'solved-single' | 'reroll-single';
	diceSize: [DiceSize];
	table: SingleTableEntry[];
}

export type DoubleTableEntry = Omit<SingleTableEntry, 'value'> & {
	firstValue: string;
	secondValue: string;
	rowspan?: number;
};
export type DoubleRandomTable = {
	type: 'solved-double' | 'reroll-double';
	diceSize: [DiceSize, DiceSize];
	table: DoubleTableEntry[];
}

export type RandomTable = Forced100RandomTable | SingleRandomTable | DoubleRandomTable;

export type Settings = {
	enableDCCDice: boolean;
	enableD2: boolean;
	preferLargerDice: boolean;
	mode: 'forced' | 'reroll';
}
