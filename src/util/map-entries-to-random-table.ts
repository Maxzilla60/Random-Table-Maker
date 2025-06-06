import { chain, first, floor, last, type List } from 'lodash';
import { type DiceSize, getDiceSizeForTable } from './get-dice-size-for-table';
import { type DiceValueType, getDiceValueTypeForTable } from './get-dice-value-type-for-table';

export type SingleRandomTable = {
	diceSize: DiceSize;
	type: 'single';
	table: {
		value: number | string;
		odds: number;
		result: string;
	}[];
}

export type RangeRandomTable = {
	diceSize: DiceSize;
	type: 'range';
	table: {
		value: [number, number];
		odds: number;
		result: string;
	}[];
}

export type RandomTable = SingleRandomTable | RangeRandomTable;

export function mapEntriesToRandomTable(entries: string[]): RandomTable {
	if (entries.length === 0) {
		return {
			diceSize: 0,
			type: 'single',
			table: [],
		};
	}
	if (entries.length === 1) {
		return {
			diceSize: 1,
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
			diceSize: 2,
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

	const diceSize = getDiceSizeForTable(entries);
	const type = getDiceValueTypeForTable(entries, diceSize);

	const table = chain(diceSize)
		.range()
		.map(i => i + 1)
		.chunk(floor(diceSize / entries.length))
		.map((chunk, index, chunks) => {
			return mapChunkToRangeTuple(chunk, chunks, entries, index, diceSize);
		})
		.take(entries.length)
		.map((value, index) => {
			return mapDiceValueToTableEntry(type, value, entries, index, diceSize);
		})
		.value();

	return { diceSize, type, table } as RandomTable;
}

function mapChunkToRangeTuple(chunk: number[], allChunks: List<number[]>, entries: string[], index: number, diceSize: DiceSize): number | [number, number] {
	if (chunk.length === 1) {
		return first(chunk)!;
	}

	if (allChunks.length > entries.length && index === entries.length - 1) {
		return [first(chunk)!, diceSize];
	}

	return [first(chunk)!, last(chunk)!];
}

function mapDiceValueToTableEntry(type: DiceValueType, value: number | [number, number], entries: string[], index: number, diceSize: DiceSize) {
	if (type === 'range') {
		const rangeValue = value as [number, number];
		return {
			value: rangeValue,
			odds: (rangeValue[1] - rangeValue[0] + 1) / diceSize * 100,
			result: entries[index],
		};
	}

	return {
		value: value as number,
		odds: 100 / entries.length,
		result: entries[index],
	};
}
