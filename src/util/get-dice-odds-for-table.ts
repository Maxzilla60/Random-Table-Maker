import { times } from 'lodash';
import type { DiceSize } from './get-dice-size-for-table';
import type { DiceValues } from './get-dice-values-for-table';

export function getDiceOddsForTable({ type, values }: DiceValues, diceSize: DiceSize): number[] {
	switch (type) {
		case 'single':
		case 'string':
			return times(values.length, () => 1 / values.length)
				.map(odds => odds * 100);
		case 'range':
			return values
				.map(([start, end]) => end - start + 1)
				.map(chunkSize => chunkSize / diceSize)
				.map(odds => odds * 100);
	}
}
