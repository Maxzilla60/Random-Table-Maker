import { chain, first, floor, last, type List } from 'lodash';
import { type DiceSize, type DiceSizeContent, getDiceSizesForTable } from './get-dice-sizes-for-table';
import { type DiceValueType, getDiceValueTypeForTable } from './get-dice-value-type-for-table';
import { greatestCommonDivisor } from './greatestCommonDivisor';

export type SingleRandomTable = {
	diceSize: DiceSize;
	type: 'single';
	table: {
		value: number | string;
		secondValue?: undefined;
		rowspan?: undefined;
		odds: number;
		result: string;
	}[];
}

export type RangeRandomTable = {
	diceSize: DiceSize;
	type: 'range';
	table: {
		value: [number, number];
		secondValue?: undefined;
		rowspan?: undefined;
		odds: number;
		result: string;
	}[];
}

export type SingleSingleRandomTable = {
	diceSize: DiceSize;
	type: 'single-single';
	table: {
		value?: number;
		secondValue: number;
		rowspan?: number;
		odds: number;
		result: string;
	}[];
}

export type SingleRangeRandomTable = {
	diceSize: DiceSize;
	type: 'single-range';
	table: {
		value?: number;
		secondValue: [number, number];
		rowspan?: number;
		odds: number;
		result: string;
	}[];
}

export type RangeRangeRandomTable = {
	diceSize: DiceSize;
	type: 'range-range';
	table: {
		value?: [number, number];
		secondValue: [number, number];
		rowspan?: number;
		odds: number;
		result: string;
	}[];
}

export type RandomTable = SingleRandomTable
	| RangeRandomTable
	| SingleSingleRandomTable
	| SingleRangeRandomTable
	| RangeRangeRandomTable;

export function mapEntriesToRandomTable(entries: string[]): RandomTable {
	if (entries.length === 0) {
		return {
			diceSize: [0],
			type: 'single',
			table: [],
		};
	}
	if (entries.length === 1) {
		return {
			diceSize: [1],
			type: 'single',
			table: [{
				value: 1,
				odds: 100,
				result: entries[0],
			}],
		};
	}
	if (entries.length === 2) {
		return {
			diceSize: [2],
			type: 'single',
			table: [
				{
					value: 'heads',
					odds: 50,
					result: entries[0],
				},
				{
					value: 'tails',
					odds: 50,
					result: entries[1],
				},
			],
		};
	}

	const diceSizes = getDiceSizesForTable(entries);
	const type = getDiceValueTypeForTable(entries, diceSizes);

	if (diceSizes.length == 1) {
		const [diceSize] = diceSizes;
		const chunkSize = floor(diceSize / entries.length);

		const table = createChunks(diceSize, entries, chunkSize)
			.map((value, index) => mapToTableEntry(type, value, entries, index, diceSizes));

		return { diceSize: diceSizes, type, table } as RandomTable;
	}

	if (diceSizes.length === 2) {
		const [firstDie, secondDie] = diceSizes;
		const gcd = greatestCommonDivisor(entries.length, firstDie);

		const firstChunkSize = firstDie / gcd;
		const firstValues = firstDie === 2 ? ['heads', 'tails'] : createChunks(firstDie, entries, firstChunkSize);

		const secondChunkSize = secondDie / (entries.length / gcd);
		const secondValues = createChunks(secondDie, entries, secondChunkSize);

		const table = chain(firstValues)
			.map(firstRange => secondValues.map(secondRange => [firstRange, secondRange]))
			.flatMap()
			.map((value, index) => mapToTableEntry(type, value as Value, entries, index, diceSizes))
			.value();

		return { diceSize: diceSizes, type, table } as RandomTable;
	}

	return { diceSize: diceSizes, type, table: [] } as RandomTable;
}

function createChunks(diceSize: DiceSizeContent, entries: string[], chunkSize: number): (number | [number, number])[] {
	return chain(diceSize)
		.range()
		.map(i => i + 1)
		.chunk(chunkSize)
		.map((chunk, index, chunks) => mapChunkToRangeTuple(chunk, chunks, entries, index, diceSize))
		.take(entries.length)
		.value();
}

function mapChunkToRangeTuple(chunk: number[], allChunks: List<number[]>, entries: string[], index: number, diceSize: DiceSizeContent): number | [number, number] {
	if (chunk.length === 1) {
		return first(chunk)!;
	}

	if (allChunks.length > entries.length && index === entries.length - 1) {
		return [first(chunk)!, diceSize];
	}

	return [first(chunk)!, last(chunk)!];
}

type Value = number
	| [number, number]
	| [number, number][]
	| [number, [number, number]];

function mapToTableEntry(type: DiceValueType, value: Value, entries: string[], index: number, [firstDie, secondDie]: DiceSize) {
	if (type === 'range') {
		const rangeValue = value as [number, number];
		return {
			value: rangeValue,
			odds: (rangeValue[1] - rangeValue[0] + 1) / firstDie! * 100,
			result: entries[index],
		};
	}

	const divisor = greatestCommonDivisor(secondDie!, entries.length);
	const hasRowSpan = index % divisor === 0;

	if (type === 'single-single') {
		const [firstValue, secondValue] = value as [number, number];
		return {
			value: hasRowSpan ? firstValue : undefined,
			secondValue,
			odds: 100 / entries.length,
			rowspan: hasRowSpan ? divisor : undefined,
			result: entries[index],
		};
	}

	if (type === 'single-range') {
		const firstValue = value as number;
		const rangeValue = first(value as [number, number][]);
		return {
			value: hasRowSpan ? firstValue : undefined,
			secondValue: rangeValue,
			odds: 100 / entries.length,
			rowspan: hasRowSpan ? divisor : undefined,
			result: entries[index],
		};
	}

	if (type === 'range-range') {
		const [firstRange, secondRange] = value as [number, number][];
		return {
			value: hasRowSpan ? firstRange : undefined,
			secondValue: secondRange,
			odds: 100 / entries.length,
			rowspan: hasRowSpan ? divisor : undefined,
			result: entries[index],
		};
	}

	return {
		value,
		odds: 100 / entries.length,
		result: entries[index],
	};
}
