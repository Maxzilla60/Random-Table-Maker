import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { createForcedTable } from '../lib/table-creators/createForcedTable';

describe('createForcedTable', () => {
	test('should create a forced d100 table for 7 entries', () => {
		const entries = range(7).map(i => `Result ${i + 1}`);

		const result = createForcedTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('forced');
		expect(result.table).toHaveLength(7);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			'1-15',
			'16-30',
			'31-44',
			'45-58',
			'59-72',
			'73-86',
			'87-100',
		]);
		expect(table.map(({ odds }) => odds)).toEqual([
			15,
			15,
			14,
			14,
			14,
			14,
			14,
		]);
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a forced d100 table for 11 entries', () => {
		const entries = range(11).map(i => `Result ${i + 1}`);

		const result = createForcedTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('forced');
		expect(result.table).toHaveLength(11);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			'1-10',
			'11-19',
			'20-28',
			'29-37',
			'38-46',
			'47-55',
			'56-64',
			'65-73',
			'74-82',
			'83-91',
			'92-100',
		]);
		expect(table.map(({ odds }) => odds)).toEqual([
			10,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
		]);
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a forced d100 table for 13 entries', () => {
		const entries = range(13).map(i => `Result ${i + 1}`);

		const result = createForcedTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('forced');
		expect(result.table).toHaveLength(13);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			'1-8',
			'9-16',
			'17-24',
			'25-32',
			'33-40',
			'41-48',
			'49-56',
			'57-64',
			'65-72',
			'73-79',
			'80-86',
			'87-93',
			'94-100',
		]);
		expect(table.map(({ odds }) => odds)).toEqual([
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			8,
			7,
			7,
			7,
			7,
		]);
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should handle entries with varying distribution needs', () => {
		const entries = range(19).map(i => `Result ${i + 1}`);

		const result = createForcedTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('forced');

		expect(result.table).toHaveLength(entries.length);

		result.table.forEach(entry => {
			const [start, end] = entry.value.split('-').map(Number);
			expect(start).toBeGreaterThanOrEqual(1);
			expect(end).toBeLessThanOrEqual(100);
			expect(end).toBeGreaterThanOrEqual(start);
		});

		const ranges = result.table.map(entry => {
			const [start, end] = entry.value.split('-').map(Number);
			return { start, end };
		});

		ranges.sort((a, b) => a.start - b.start);
		expect(ranges[0].start).toBe(1);
		expect(ranges[ranges.length - 1].end).toBe(100);

		for (let i = 0; i < ranges.length - 1; i++) {
			expect(ranges[i].end + 1).toBe(ranges[i + 1].start);
		}

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBe(100);

		expect(result.table.map(({ result }) => result)).toEqual(entries);
	});
});
