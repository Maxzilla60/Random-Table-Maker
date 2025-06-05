import { chain, first, floor, last } from 'lodash';
import type { DiceSize } from './get-dice-size-for-table';

export type DiceValues = number[] | string[] | [number, number][];

export function getDiceValuesForTable(entries: string[], diceSize: DiceSize): DiceValues {
	if (diceSize === 2) {
		return ['heads', 'tails'];
	}

	return chain(diceSize)
		.range()
		.map(i => i + 1)
		.chunk(floor(diceSize / entries.length))
		.map((chunk, index, chunks) => {
			if (chunk.length === 1) {
				return first(chunk)!;
			}

			if (chunks.length > entries.length && index === entries.length - 1) {
				return [first(chunk)!, diceSize];
			}

			return [first(chunk)!, last(chunk)!];
		})
		.take(entries.length)
		.value() as DiceValues;
}
