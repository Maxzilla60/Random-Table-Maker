import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { MAX_TABLE_LENGTH } from '../lib/constants';
import { getDiceSizesForTable } from '../lib/getDiceSizesForTable';
import { type Settings } from '../lib/types';

const tableLengthsNotMappedToAD100 = [
	{ tableLength: 0, expectedSize: [0] },
	{ tableLength: 1, expectedSize: [1] },
	{ tableLength: 2, expectedSize: [2] },
	{ tableLength: 3, expectedSize: [6] },
	{ tableLength: 4, expectedSize: [4] },
	{ tableLength: 5, expectedSize: [10] },
	{ tableLength: 6, expectedSize: [6] },
	{ tableLength: 8, expectedSize: [8] },
	{ tableLength: 9, expectedSize: [6, 6] },
	{ tableLength: 10, expectedSize: [10] },
	{ tableLength: 12, expectedSize: [12] },
	{ tableLength: 15, expectedSize: [6, 10] },
	{ tableLength: 16, expectedSize: [2, 8] },
	{ tableLength: 18, expectedSize: [6, 6] },
	{ tableLength: 20, expectedSize: [20] },
	{ tableLength: 24, expectedSize: [2, 12] },
	{ tableLength: 25, expectedSize: [100] },
	{ tableLength: 30, expectedSize: [6, 10] },
	{ tableLength: 32, expectedSize: [4, 8] },
	{ tableLength: 36, expectedSize: [6, 6] },
	{ tableLength: 40, expectedSize: [2, 20] },
	{ tableLength: 48, expectedSize: [4, 12] },
];

const defaultTestData = range(MAX_TABLE_LENGTH).map(tableLength => {
	const notMappedTo100 = tableLengthsNotMappedToAD100.find(t => t.tableLength === tableLength);
	if (notMappedTo100) {
		return notMappedTo100;
	}

	return {
		tableLength,
		expectedSize: [],
	};
});

const dccTestData = [
	{ tableLength: 3, expectedSize: [3] },
	{ tableLength: 5, expectedSize: [5] },
	{ tableLength: 7, expectedSize: [7] },
	{ tableLength: 9, expectedSize: [3, 3] },
	{ tableLength: 14, expectedSize: [14] },
	{ tableLength: 15, expectedSize: [30] },
	{ tableLength: 16, expectedSize: [16] },
	{ tableLength: 18, expectedSize: [3, 6] },
	{ tableLength: 21, expectedSize: [3, 7] },
	{ tableLength: 24, expectedSize: [24] },
	{ tableLength: 28, expectedSize: [2, 14] },
	{ tableLength: 30, expectedSize: [30] },
	{ tableLength: 32, expectedSize: [2, 16] },
	{ tableLength: 35, expectedSize: [5, 7] },
];

const noD2TestData = [
	{ tableLength: 2, expectedSize: [4] },
	{ tableLength: 16, expectedSize: [4, 4] },
];

describe('getDiceSizesForTable', () => {
	const defaultSettings: Settings = {
		enableDCCDice: false,
		enableD2: true,
		preferLargerDice: false,
	};

	const dccSettings: Settings = {
		enableDCCDice: true,
		enableD2: true,
		preferLargerDice: false,
	};

	const noD2Settings: Settings = {
		enableDCCDice: false,
		enableD2: false,
		preferLargerDice: false,
	};

	describe('with default dice sizes', () => {
		test.each(defaultTestData)('table of length $tableLength should be mapped to a d$expectedSize', ({ tableLength, expectedSize }) => {
			const table = new Array(tableLength);

			const result = getDiceSizesForTable(table, defaultSettings);

			expect(result).toStrictEqual(expectedSize);
		});
	});

	describe('with DCC dice sizes', () => {
		test.each(dccTestData)('table of length $tableLength should be mapped to a d$expectedSize', ({ tableLength, expectedSize }) => {
			const table = new Array(tableLength);

			const result = getDiceSizesForTable(table, dccSettings);

			expect(result).toStrictEqual(expectedSize);
		});
	});

	describe('disabling d2 dice size', () => {
		test.each(noD2TestData)('table of length $tableLength should be mapped to a d$expectedSize', ({ tableLength, expectedSize }) => {
			const result = getDiceSizesForTable(new Array(tableLength).fill(''), noD2Settings);
			expect(result[0]).not.toBe(2);
			expect(result[1]).not.toBe(2);
		});
	});

	describe('with preferLargerDice option', () => {
		const largerDiceTestData = [
			{ tableLength: 3, expectedSize: [12] },
			{ tableLength: 5, expectedSize: [100] },
			{ tableLength: 4, expectedSize: [4] },
			{ tableLength: 9, expectedSize: [12, 12] },
			{ tableLength: 15, expectedSize: [100, 12] },
			{ tableLength: 16, expectedSize: [100, 100] },
		];

		test.each(largerDiceTestData)('table of length $tableLength should prefer larger dice and use d$expectedSize', ({ tableLength, expectedSize }) => {
			const table = new Array(tableLength).fill('');
			const settingsWithLargerDice = { ...defaultSettings, preferLargerDice: true };

			const result = getDiceSizesForTable(table, settingsWithLargerDice);

			expect(result).toStrictEqual(expectedSize);
		});
	});
});
