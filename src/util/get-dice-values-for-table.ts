import { chain, first, floor, isArray, last } from 'lodash';
import type { DiceSize } from './get-dice-size-for-table';

export type SingleDiceValues = {
	type: 'single';
	values: number[];
}

export type StringDiceValues = {
	type: 'string';
	values: string[];
}

export type RangeDiceValues = {
	type: 'range';
	values: [number, number][];
}

export type DiceValues = SingleDiceValues | StringDiceValues | RangeDiceValues;

export function getDiceValuesForTable({ length: tableLength }: string[], diceSize: DiceSize): DiceValues {
	if (tableLength === 2) {
		return {
			type: 'string',
			values: ['heads', 'tails'],
		};
	}

	const values = chain(diceSize)
		.range()
		.map(i => i + 1)
		.chunk(floor(diceSize / tableLength))
		.map((chunk, index, chunks) => {
			if (chunk.length === 1) {
				return first(chunk)!;
			}

			if (chunks.length > tableLength && index === tableLength - 1) {
				return [first(chunk)!, diceSize];
			}

			return [first(chunk)!, last(chunk)!];
		})
		.take(tableLength)
		.value();

	const type = isArray(values[0]) ? 'range' : 'single';

	return { type, values } as SingleDiceValues | RangeDiceValues;
}
