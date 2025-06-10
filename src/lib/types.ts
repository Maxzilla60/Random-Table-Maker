import type { DCC_DICE_SIZES, DEFAULT_DICE_SIZES } from './constants';

export type DiceSize = 0 | 1 | typeof DEFAULT_DICE_SIZES[number] | typeof DCC_DICE_SIZES[number];

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
export type BellSolvedRandomTable = {
	type: 'solved-bell' | 'reroll-bell' | 'unsolved-bell';
	diceSize: [DiceSize, DiceSize];
	table: SingleTableEntry[];
}
export type BellUnsolvedRandomTable = {
	type: 'unsolved-bell';
	diceSize: [];
	table: {
		value: 'x';
		odds: 0;
		result: string;
		isReroll: false;
	}[];
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

export type RandomTable = Forced100RandomTable
	| SingleRandomTable
	| DoubleRandomTable
	| BellSolvedRandomTable
	| BellUnsolvedRandomTable;

export type Settings = {
	enableD2: boolean;
	enableDCCDice: boolean;
	preferLargerDice: boolean;
	mode: 'forced' | 'reroll' | 'bell';
	showOdds: boolean;
}
