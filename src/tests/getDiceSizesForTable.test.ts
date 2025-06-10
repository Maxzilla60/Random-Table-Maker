import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { MAX_TABLE_LENGTH } from '../lib/constants';
import { getDiceSizesForTable } from '../lib/getDiceSizesForTable';
import { type Settings } from '../lib/types';

describe('getDiceSizesForTable', () => {
	describe('with default dice sizes', () => {
		const defaultSettings: Settings = {
			enableDCCDice: false,
			enableD2: true,
			preferLargerDice: false,
			mode: 'forced',
			showOdds: false,
		};

		const entriesLengthsNotMappedToAD100 = [
			{ entriesLength: 0, expectedSize: [0] },
			{ entriesLength: 1, expectedSize: [1] },
			{ entriesLength: 2, expectedSize: [2] },
			{ entriesLength: 3, expectedSize: [6] },
			{ entriesLength: 4, expectedSize: [4] },
			{ entriesLength: 5, expectedSize: [10] },
			{ entriesLength: 6, expectedSize: [6] },
			{ entriesLength: 8, expectedSize: [8] },
			{ entriesLength: 9, expectedSize: [6, 6] },
			{ entriesLength: 10, expectedSize: [10] },
			{ entriesLength: 12, expectedSize: [12] },
			{ entriesLength: 15, expectedSize: [6, 10] },
			{ entriesLength: 16, expectedSize: [2, 8] },
			{ entriesLength: 18, expectedSize: [6, 6] },
			{ entriesLength: 20, expectedSize: [20] },
			{ entriesLength: 24, expectedSize: [2, 12] },
			{ entriesLength: 25, expectedSize: [100] },
			{ entriesLength: 30, expectedSize: [6, 10] },
			{ entriesLength: 32, expectedSize: [4, 8] },
			{ entriesLength: 36, expectedSize: [6, 6] },
			{ entriesLength: 40, expectedSize: [2, 20] },
			{ entriesLength: 48, expectedSize: [4, 12] },
		];

		const defaultTestData = range(MAX_TABLE_LENGTH).map(entriesLength => {
			const notMappedTo100 = entriesLengthsNotMappedToAD100.find(t => t.entriesLength === entriesLength);
			if (notMappedTo100) {
				return notMappedTo100;
			}

			return {
				entriesLength,
				expectedSize: [],
			};
		});

		test.each(defaultTestData)('table of length $entriesLength should be mapped to a d$expectedSize', ({ entriesLength, expectedSize }) => {
			const result = getDiceSizesForTable(entriesLength, defaultSettings);

			expect(result).toStrictEqual(expectedSize);
		});

		describe('disabling d2 dice size', () => {
			const noD2Settings: Settings = {
				enableDCCDice: false,
				enableD2: false,
				preferLargerDice: false,
				mode: 'forced',
				showOdds: false,
			};

			test.each(defaultTestData)('table of length $entriesLength should be mapped to a d$expectedSize', ({ entriesLength }) => {
				const result = getDiceSizesForTable(entriesLength, noD2Settings);
				expect(result[0]).not.toBe(2);
				expect(result[1]).not.toBe(2);
			});
		});
	});

	describe('with DCC dice sizes', () => {
		const dccSettings: Settings = {
			enableDCCDice: true,
			enableD2: true,
			preferLargerDice: false,
			mode: 'forced',
			showOdds: false,
		};

		const dccTestData = [
			{ entriesLength: 3, expectedSize: [3] },
			{ entriesLength: 5, expectedSize: [5] },
			{ entriesLength: 7, expectedSize: [7] },
			{ entriesLength: 9, expectedSize: [3, 3] },
			{ entriesLength: 14, expectedSize: [14] },
			{ entriesLength: 15, expectedSize: [30] },
			{ entriesLength: 16, expectedSize: [16] },
			{ entriesLength: 18, expectedSize: [3, 6] },
			{ entriesLength: 21, expectedSize: [3, 7] },
			{ entriesLength: 24, expectedSize: [24] },
			{ entriesLength: 28, expectedSize: [2, 14] },
			{ entriesLength: 30, expectedSize: [30] },
			{ entriesLength: 32, expectedSize: [2, 16] },
			{ entriesLength: 35, expectedSize: [5, 7] },
		];

		test.each(dccTestData)('table of length $entriesLength should be mapped to a d$expectedSize', ({ entriesLength, expectedSize }) => {
			const result = getDiceSizesForTable(entriesLength, dccSettings);

			expect(result).toStrictEqual(expectedSize);
		});
	});

	describe('with preferLargerDice option', () => {
		const largerDiceSettings: Settings = {
			enableDCCDice: false,
			enableD2: true,
			preferLargerDice: true,
			mode: 'forced',
			showOdds: false,
		};

		const largerDiceTestData = [
			{ entriesLength: 3, expectedSize: [12] },
			{ entriesLength: 5, expectedSize: [100] },
			{ entriesLength: 4, expectedSize: [4] },
			{ entriesLength: 9, expectedSize: [12, 12] },
			{ entriesLength: 15, expectedSize: [100, 12] },
			{ entriesLength: 16, expectedSize: [100, 100] },
		];

		test.each(largerDiceTestData)('table of length $entriesLength should prefer larger dice and use d$expectedSize', ({ entriesLength, expectedSize }) => {
			const result = getDiceSizesForTable(entriesLength, largerDiceSettings);

			expect(result).toStrictEqual(expectedSize);
		});
	});

	describe('with bell curve mode', () => {
		const bellCurveSettings: Settings = {
			enableDCCDice: false,
			enableD2: true,
			preferLargerDice: false,
			mode: 'bell',
			showOdds: false,
		};

		const bellCurveTestData = [
			{ entriesLength: 5, expectedSize: [8, 8] },
			{ entriesLength: 7, expectedSize: [4, 4] },
			{ entriesLength: 10, expectedSize: [] },
			{ entriesLength: 12, expectedSize: [] },
			{ entriesLength: 15, expectedSize: [8, 8] },
			{ entriesLength: 20, expectedSize: [] },
		];

		test.each(bellCurveTestData)('table of length $entriesLength in bell curve mode should use d$expectedSize', ({ entriesLength, expectedSize }) => {
			const result = getDiceSizesForTable(entriesLength, bellCurveSettings);
			expect(result).toStrictEqual(expectedSize);
		});
	});
});
