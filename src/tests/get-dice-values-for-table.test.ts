import { last, merge, range, times } from 'lodash';
import { describe, expect, test } from 'vitest';
import { MAX_TABLE_LENGTH } from '../util/constants';
import { getDiceSizeForTable } from '../util/get-dice-size-for-table';
import { getDiceValuesForTable, type RangeDiceValues } from '../util/get-dice-values-for-table';

const tableLengthsNotMappedToD100 = [
	{
		tableLength: 0,
		expectedValues: [],
	},
	{
		tableLength: 1,
		expectedValues: ['1'],
	},
	{
		tableLength: 2,
		expectedValues: ['heads', 'tails'],
	},
	{
		tableLength: 3,
		expectedValues: [[1, 2], [3, 4], [5, 6]],
	},
	{
		tableLength: 4,
		expectedValues: simpleExpectedValues(4),
	},
	{
		tableLength: 5,
		expectedValues: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]],
	},
	{
		tableLength: 6,
		expectedValues: simpleExpectedValues(6),
	},
	{
		tableLength: 8,
		expectedValues: simpleExpectedValues(8),
	},
	{
		tableLength: 10,
		expectedValues: simpleExpectedValues(10),
	},
	{
		tableLength: 12,
		expectedValues: simpleExpectedValues(12),
	},
	{
		tableLength: 20,
		expectedValues: simpleExpectedValues(20),
	},
	{
		tableLength: 100,
		expectedValues: simpleExpectedValues(100),
	},
];

const sampleTableLengthsMappedToD100 = [
	{
		tableLength: 7,
		expectedValues: [[1, 14], [15, 28], [29, 42], [43, 56], [57, 70], [71, 84], [85, 100]],
	},
	{
		tableLength: 9,
		expectedValues: [[1, 11], [12, 22], [23, 33], [34, 44], [45, 55], [56, 66], [67, 77], [78, 88], [89, 100]],
	},
	{
		tableLength: 11,
		expectedValues: [[1, 9], [10, 18], [19, 27], [28, 36], [37, 45], [46, 54], [55, 63], [64, 72], [73, 81], [82, 90], [91, 100]],
	},
	{
		tableLength: 13,
		expectedValues: [[1, 7], [8, 14], [15, 21], [22, 28], [29, 35], [36, 42], [43, 49], [50, 56], [57, 63], [64, 70], [71, 77], [78, 84], [85, 100]],
	},
	{
		tableLength: 21,
		expectedValues: [[1, 4], [5, 8], [9, 12], [13, 16], [17, 20], [21, 24], [25, 28], [29, 32], [33, 36], [37, 40], [41, 44], [45, 48], [49, 52], [53, 56], [57, 60], [61, 64], [65, 68], [69, 72], [73, 76], [77, 80], [81, 100]],
	},
];

const tableLengthsMappedToD100 = range(MAX_TABLE_LENGTH)
	.filter(tableLength => !tableLengthsNotMappedToD100.some(t => t.tableLength === tableLength));

describe('getDiceValuesForTable', () => {
	test.each(merge(tableLengthsNotMappedToD100, sampleTableLengthsMappedToD100))('table of length $tableLength should be mapped to $expectedValues', ({ tableLength, expectedValues }) => {
		const table = new Array(tableLength);

		const results = getDiceValuesForTable(table, getDiceSizeForTable(table)).values;

		expect(results).toHaveLength(tableLength);
		expect(results).toStrictEqual(expectedValues);
	});

	test.each(tableLengthsMappedToD100)('table of length $0 should be mapped to d100', tableLength => {
		const table = new Array(tableLength);

		const results = (getDiceValuesForTable(table, getDiceSizeForTable(table)) as RangeDiceValues).values;

		expect(results).toHaveLength(tableLength);
		expect(last(results)![1]).toBe(100);
	});
});

function simpleExpectedValues(size: number): number[] {
	return times(size, i => i + 1);
}
