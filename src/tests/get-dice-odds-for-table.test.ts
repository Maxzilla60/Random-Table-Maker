import { describe, expect, test } from 'vitest';
import { getDiceOddsForTable } from '../util/get-dice-odds-for-table';

describe('getDiceOddsForTable', () => {
	test('should calculate equal odds for single dice values', () => {
		const type = 'single';
		const values = [1, 2, 3, 4];

		const result = getDiceOddsForTable(4, type, values);

		expect(result).toEqual([25, 25, 25, 25]);
	});

	test('should calculate equal odds for string dice values', () => {
		const type = 'string';
		const values = ['heads', 'tails'];

		const result = getDiceOddsForTable(2, type, values);

		expect(result).toEqual([50, 50]);
	});

	test('should calculate proportional odds for range dice values', () => {
		const type = 'range';
		const values: [number, number][] = [[1, 14], [15, 28], [29, 42], [43, 56], [57, 70], [71, 84], [85, 100]];

		const result = getDiceOddsForTable(100, type, values);

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
