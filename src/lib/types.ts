import type { DICE_SIZES } from './constants';

export type DiceSize = 0 | 1 | typeof DICE_SIZES[number];

export type DiceSizes = [] | [DiceSize] | [DiceSize, DiceSize];

export type SingleTableEntry = {
	value: string;
	odds: number;
	result: string;
};

export type Forced100RandomTable = {
	type: 'forced';
	diceSize: [100];
	table: SingleTableEntry[];
}

export type SolvedSingleRandomTable = {
	type: 'solved-single';
	diceSize: [DiceSize];
	table: SingleTableEntry[];
}

export type SolvedDoubleTableEntry = {
	firstValue: string;
	secondValue: string;
	rowspan?: number;
	odds: number;
	result: string;
};
export type SolvedDoubleRandomTable = {
	type: 'solved-double';
	diceSize: [DiceSize, DiceSize];
	table: SolvedDoubleTableEntry[];
}

export type RandomTable = Forced100RandomTable | SolvedSingleRandomTable | SolvedDoubleRandomTable;
