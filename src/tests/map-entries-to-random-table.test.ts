import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { mapEntriesToRandomTable } from '../util/map-entries-to-random-table';

describe('mapEntriesToRandomTable', () => {
	test('should map empty entries', () => {
		const entries: string[] = [];

		const result = mapEntriesToRandomTable(entries);

		expect(result).toEqual({
			diceSize: [0],
			type: 'single',
			table: [],
		});
	});

	test('should map single entry', () => {
		const entries = ['Orcs Attack!'];

		const result = mapEntriesToRandomTable(entries);

		expect(result).toEqual({
			diceSize: [1],
			type: 'single',
			table: [{
				value: 1,
				odds: 100,
				result: 'Orcs Attack!',
			}],
		});
	});

	test('should map 2 entries as a coin flip', () => {
		const entries = ['Yes', 'No'];

		const result = mapEntriesToRandomTable(entries);

		expect(result).toEqual({
			diceSize: [2],
			type: 'single',
			table: [
				{
					value: 'heads',
					odds: 50,
					result: 'Yes',
				},
				{
					value: 'tails',
					odds: 50,
					result: 'No',
				},
			],
		});
	});

	test('should map 3 entries to a d6 table', () => {
		const entries = ['Cyan', 'Magenta', 'Yellow'];

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([6]);
		expect(result.type).toStrictEqual('range');
		expect(result.table).toHaveLength(3);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			[1, 2],
			[3, 4],
			[5, 6],
		]);
		expect(table.map(({ odds }) => odds)).toEqual(range(3).map(() => 33.33333333333333));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 4 entries to a d4 table', () => {
		const entries = ['Summer', 'Autumn', 'Winter', 'Spring'];

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([4]);
		expect(result.type).toStrictEqual('single');
		expect(result.table).toHaveLength(4);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(4).map(i => i + 1));
		table.forEach(({ odds }) => expect(odds).toBeCloseTo(25, 2));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 5 entries to a d10 table', () => {
		const entries = ['Result 1', 'Result 2', 'Result 3', 'Result 4', 'Result 5'];

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([10]);
		expect(result.type).toStrictEqual('range');
		expect(result.table).toHaveLength(5);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			[1, 2],
			[3, 4],
			[5, 6],
			[7, 8],
			[9, 10],
		]);
		table.forEach(({ odds }) => expect(odds).toBeCloseTo(20, 2));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 6 entries to a d6 table', () => {
		const entries = ['+', '+', ' ', ' ', '-', '-'];

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([6]);
		expect(result.type).toStrictEqual('single');
		expect(result.table).toHaveLength(6);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([1, 2, 3, 4, 5, 6]);
		expect(table.map(({ odds }) => odds)).toEqual(range(6).map(() => 16.666666666666668));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 7 entries to a d100 table', () => {
		const entries = range(7).map(i => `Result ${i + 1}`);

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('range');
		expect(result.table).toHaveLength(7);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			[1, 14],
			[15, 28],
			[29, 42],
			[43, 56],
			[57, 70],
			[71, 84],
			[85, 100],
		]);
		expect(table.map(({ odds }) => odds)).toEqual([
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			14.000000000000002,
			16,
		]);
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 8 entries to a d8 table', () => {
		const entries = range(8).map(i => `Result ${i + 1}`);

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([8]);
		expect(result.type).toStrictEqual('single');
		expect(result.table).toHaveLength(8);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(8).map(i => i + 1));
		expect(table.map(({ odds }) => odds)).toEqual(range(8).map(() => 12.5));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 9 entries to a d6 & d6 table', () => {
		const entries = range(9).map(i => `Result ${i + 1}`);

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([6, 6]);
		expect(result.type).toBe('range-range');
		expect(result.table).toHaveLength(9);

		const table = result.table;
		expect(table.map(({ value }) => value)).toStrictEqual([
			[1, 2],
			[1, 2],
			[1, 2],
			[3, 4],
			[3, 4],
			[3, 4],
			[5, 6],
			[5, 6],
			[5, 6],
		]);
		expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
			[1, 2],
			[3, 4],
			[5, 6],
			[1, 2],
			[3, 4],
			[5, 6],
			[1, 2],
			[3, 4],
			[5, 6],
		]);
		expect(table.map(({ odds }) => odds)).toEqual(range(9).map(() => 11.11111111111111));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 11 entries to a d100 table', () => {
		const entries = Array(11).fill(0).map((_, i) => `Result ${i + 1}`);

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('range');
		expect(result.table).toHaveLength(11);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			[1, 9],
			[10, 18],
			[19, 27],
			[28, 36],
			[37, 45],
			[46, 54],
			[55, 63],
			[64, 72],
			[73, 81],
			[82, 90],
			[91, 100],
		]);
		expect(table.map(({ odds }) => odds)).toEqual([
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
			10,
		]);
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 13 entries to a d100 table', () => {
		const entries = range(13).map(i => `Result ${i + 1}`);

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('range');
		expect(result.table).toHaveLength(13);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			[1, 7],
			[8, 14],
			[15, 21],
			[22, 28],
			[29, 35],
			[36, 42],
			[43, 49],
			[50, 56],
			[57, 63],
			[64, 70],
			[71, 77],
			[78, 84],
			[85, 100],
		]);
		expect(table.map(({ odds }) => odds)).toEqual([
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			7.000000000000001,
			16,
		]);
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 50 entries to a d100 table', () => {
		const entries = range(50).map(i => `Result ${i + 1}`);

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('range');
		expect(result.table).toHaveLength(50);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(
			range(50).map(i => [(i * 2) + 1, (i * 2) + 2]),
		);
		expect(table.map(({ odds }) => odds)).toEqual(range(50).map(() => 2));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should map 100 entries to a d100 table', () => {
		const entries = range(100).map(i => `Result ${i + 1}`);

		const result = mapEntriesToRandomTable(entries);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('single');
		expect(result.table).toHaveLength(100);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(1, 101));
		table.forEach(({ odds }) => expect(odds).toBeCloseTo(1, 2));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});
});
