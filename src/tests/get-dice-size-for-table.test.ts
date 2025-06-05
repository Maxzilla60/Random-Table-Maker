import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { getDiceSizeForTable } from '../util/get-dice-size-for-table';

const tableLengthsNotMappedToAD100 = [
	{
		tableLength: 0,
		expectedSize: 0,
	},
	{
		tableLength: 1,
		expectedSize: 1,
	},
	{
		tableLength: 2,
		expectedSize: 2,
	},
	{
		tableLength: 3,
		expectedSize: 6,
	},
	{
		tableLength: 4,
		expectedSize: 4,
	},
	{
		tableLength: 5,
		expectedSize: 10,
	},
	{
		tableLength: 6,
		expectedSize: 6,
	},
	{
		tableLength: 8,
		expectedSize: 8,
	},
	{
		tableLength: 10,
		expectedSize: 10,
	},
	{
		tableLength: 12,
		expectedSize: 12,
	},
	{
		tableLength: 20,
		expectedSize: 20,
	},
];

const testData = range(100).map(tableLength => {
	const notMappedTo100 = tableLengthsNotMappedToAD100.find(t => t.tableLength === tableLength);
	if (notMappedTo100) {
		return notMappedTo100;
	}

	return {
		tableLength,
		expectedSize: 100,
	};
});

describe('getDiceSizeForTable', () => {
	test.each(testData)('table of length $tableLength should be mapped to a d$expectedSize', ({ tableLength, expectedSize }) => {
		const table = new Array(tableLength);

		const result = getDiceSizeForTable(table);

		expect(result).toBe(expectedSize);
	});
});
