import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { MAX_TABLE_LENGTH } from '../util/constants';
import { getDiceSizesForTable } from '../util/getDiceSizesForTable';

const tableLengthsNotMappedToAD100 = [
	{
		tableLength: 0,
		expectedSize: [0],
	},
	{
		tableLength: 1,
		expectedSize: [1],
	},
	{
		tableLength: 2,
		expectedSize: [2],
	},
	{
		tableLength: 3,
		expectedSize: [6],
	},
	{
		tableLength: 4,
		expectedSize: [4],
	},
	{
		tableLength: 5,
		expectedSize: [10],
	},
	{
		tableLength: 6,
		expectedSize: [6],
	},
	{
		tableLength: 8,
		expectedSize: [8],
	},
	{
		tableLength: 9,
		expectedSize: [6, 6],
	},
	{
		tableLength: 10,
		expectedSize: [10],
	},
	{
		tableLength: 12,
		expectedSize: [12],
	},
	{
		tableLength: 15,
		expectedSize: [6, 10],
	},
	{
		tableLength: 16,
		expectedSize: [2, 8],
	},
	{
		tableLength: 18,
		expectedSize: [6, 6],
	},
	{
		tableLength: 20,
		expectedSize: [20],
	},
	{
		tableLength: 24,
		expectedSize: [2, 12],
	},
	{
		tableLength: 25,
		expectedSize: [100],
	},
	{
		tableLength: 30,
		expectedSize: [6, 10],
	},
	{
		tableLength: 32,
		expectedSize: [4, 8],
	},
	{
		tableLength: 36,
		expectedSize: [6, 6],
	},
	{
		tableLength: 40,
		expectedSize: [2, 20],
	},
	{
		tableLength: 48,
		expectedSize: [4, 12],
	},
];

const testData = range(MAX_TABLE_LENGTH).map(tableLength => {
	const notMappedTo100 = tableLengthsNotMappedToAD100.find(t => t.tableLength === tableLength);
	if (notMappedTo100) {
		return notMappedTo100;
	}

	return {
		tableLength,
		expectedSize: [],
	};
});

describe('getDiceSizesForTable', () => {
	test.each(testData)('table of length $tableLength should be mapped to a d$expectedSize', ({ tableLength, expectedSize }) => {
		const table = new Array(tableLength);

		const result = getDiceSizesForTable(table);

		expect(result).toStrictEqual(expectedSize);
	});
});
