import { chain, curry, floor } from 'lodash';
import { type DiceSize, getDiceSizesForTable } from './getDiceSizesForTable';
import { greatestCommonDivisor } from './greatestCommonDivisor';

type SingleTableEntry = {
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

type SolvedDoubleTableEntry = {
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

export function mapEntriesToRandomTable(entries: string[]): RandomTable {
	if (entries.length === 0) {
		return {
			type: 'solved-single',
			diceSize: [0],
			table: [],
		};
	}
	if (entries.length === 1) {
		return {
			type: 'solved-single',
			diceSize: [1],
			table: [{ value: '1', result: entries[0], odds: 100 }],
		};
	}
	if (entries.length === 2) {
		return {
			type: 'solved-single',
			diceSize: [2],
			table: [
				{ value: 'heads', result: entries[0], odds: 50 },
				{ value: 'tails', result: entries[1], odds: 50 },
			],
		};
	}

	const diceSizes = getDiceSizesForTable(entries);

	switch (diceSizes.length) {
		case 0:
			return createForcedTable(entries);
		case 1:
			return createSolvedSingleTable(entries, diceSizes[0]);
		case 2:
			return createSolvedDoubleTable(entries, diceSizes);
		default:
			throw new Error(`Cannot create random table for ${entries.length} entries with dice sizes ${diceSizes}`);
	}
}

function createForcedTable(entries: string[]): Forced100RandomTable {
	const valueRange = floor(100 / entries.length);
	const remainder = 100 % entries.length;
	const spreadRemainder = curry(spreadRemainderFn)(remainder);

	const tableEntries = chain(entries.length)
		.range()
		.fill(valueRange)
		.thru(spreadRemainder)
		.reduce((values, valueRange): { start: number, end: number, odds: number }[] => {
			const start = values.at(-1)?.end ?? 0;
			const end = start + valueRange;

			return [
				...values,
				{
					start: start + 1,
					end,
					odds: valueRange,
				},
			];
		}, [] as { start: number, end: number, odds: number }[])
		.map(({ start, end, odds }, index): SingleTableEntry => ({
			value: `${start}-${end}`,
			odds,
			result: entries[index],
		}))
		.value();

	return {
		type: 'forced',
		diceSize: [100],
		table: tableEntries,
	};
}

function spreadRemainderFn(remainder: number, values: number[], index = 0): number[] {
	if (remainder === 0) {
		return values;
	}

	const newValues = values.with(index, values[index] + 1);
	const newRemainder = remainder - 1;
	const newIndex = index === values.length - 1 ? 0 : index + 1;
	return spreadRemainderFn(newRemainder, newValues, newIndex);
}

function createSolvedSingleTable(entries: string[], diceSize: DiceSize): SolvedSingleRandomTable {
	const tableEntries = chain(entries.length)
		.range()
		.fill(diceSize / entries.length)
		.reduce((values, valueRange): { start: number, end: number }[] => {
			const start = values.at(-1)?.end ?? 0;
			const end = start + valueRange;

			return [
				...values,
				{
					start: start + 1,
					end,
				},
			];
		}, [] as { start: number, end: number }[])
		.map(({ start, end }) => start === end ? String(start) : `${start}-${end}`)
		.map((value, index): SingleTableEntry => ({
			value,
			odds: 100 / entries.length,
			result: entries[index],
		}))
		.value();

	return {
		type: 'solved-single',
		diceSize: [diceSize],
		table: tableEntries,
	};
}

function createSolvedDoubleTable(entries: string[], diceSizes: [DiceSize, DiceSize]): SolvedDoubleRandomTable {
	const [firstDie, secondDie] = diceSizes;

	const firstGDC = greatestCommonDivisor(entries.length, firstDie);
	let firstValues: string[] = [];
	if (firstDie === 2) {
		firstValues = ['heads', 'tails'];
	} else {
		firstValues = chain(firstGDC)
			.range()
			.fill(firstDie / firstGDC)
			.reduce((values, valueRange): { start: number, end: number }[] => {
				const start = values.at(-1)?.end ?? 0;
				const end = start + valueRange;

				return [
					...values,
					{
						start: start + 1,
						end,
					},
				];
			}, [] as { start: number, end: number }[])
			.map(({ start, end }) => start === end ? String(start) : `${start}-${end}`)
			.value();
	}

	const secondValues = chain(entries.length / firstGDC)
		.range()
		.fill(secondDie / (entries.length / firstGDC))
		.reduce((values, valueRange): { start: number, end: number }[] => {
			const start = values.at(-1)?.end ?? 0;
			const end = start + valueRange;

			return [
				...values,
				{
					start: start + 1,
					end,
				},
			];
		}, [] as { start: number, end: number }[])
		.map(({ start, end }) => start === end ? String(start) : `${start}-${end}`)
		.value();

	const table: SolvedDoubleTableEntry[] = firstValues
		.map(firstValue => {
			return secondValues.map((secondValue, index) => ({
				firstValue,
				secondValue,
				rowspan: index === 0 ? secondValues.length : undefined,
			}));
		})
		.flat()
		.map((entry, index) => ({
			...entry,
			odds: 100 / entries.length,
			result: entries[index],
		}));

	return {
		type: 'solved-double',
		diceSize: diceSizes,
		table,
	};
}
