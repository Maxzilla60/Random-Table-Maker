import { describe, expect, test } from 'vitest';
import { getDiceOddsForTable } from '../util/get-dice-odds-for-table';
import type { RangeDiceValues, SingleDiceValues, StringDiceValues } from '../util/get-dice-values-for-table';

describe('getDiceOddsForTable', () => {
	test('should calculate equal odds for single dice values', () => {
		const diceValues: SingleDiceValues = {
			type: 'single',
			values: [1, 2, 3, 4],
		};

		const result = getDiceOddsForTable(diceValues, 4);

		expect(result).toEqual([25, 25, 25, 25]);
	});

	test('should calculate equal odds for string dice values', () => {
		const diceValues: StringDiceValues = {
			type: 'string',
			values: ['heads', 'tails'],
		};

		const result = getDiceOddsForTable(diceValues, 2);

		expect(result).toEqual([50, 50]);
	});

	test('should calculate proportional odds for range dice values', () => {
		const diceValues: RangeDiceValues = {
			type: 'range',
			values: [[1, 14], [15, 28], [29, 42], [43, 56], [57, 70], [71, 84], [85, 100]],
		};

		const result = getDiceOddsForTable(diceValues, 100);

		expect(result).toEqual([
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			16,
		]);
	});
});
