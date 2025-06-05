import { chain, first, floor, last } from 'lodash';
import type { DiceSize } from './get-dice-size-for-table';

export function getDiceValuesForTable({ length: tableLength }: string[], diceSize: DiceSize): string[] {
	if (tableLength === 2) {
		return ['heads', 'tails'];
	}

	return chain(diceSize)
		.range()
		.map(i => i + 1)
		.chunk(floor(diceSize / tableLength))
		.map((chunk, index, chunks) => {
			if (chunk.length === 1) {
				return `${first(chunk)}`;
			}

			if (chunks.length > tableLength && index === tableLength - 1) {
				return `${first(chunk)}-${diceSize}`;
			}

			return `${first(chunk)}-${last(chunk)}`;
		})
		.take(tableLength)
		.value();
}
