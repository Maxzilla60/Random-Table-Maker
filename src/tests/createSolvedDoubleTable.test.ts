import { concat, range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { createSolvedDoubleTable } from '../lib/createSolvedDoubleTable';
import type { DiceSizes } from '../lib/types';

describe('createSolvedDoubleTable', () => {
	test('should create a table with d6 & d6', () => {
		const entries = range(9).map(i => `Result ${i + 1}`);
		const diceSizes: DiceSizes = [6, 6];

		const result = createSolvedDoubleTable(entries, diceSizes);

		expect(result.diceSize).toStrictEqual([6, 6]);
		expect(result.type).toBe('solved-double');
		expect(result.table).toHaveLength(9);

		const table = result.table;
		expect(table.map(({ firstValue }) => firstValue)).toStrictEqual([
			'1-2', '1-2', '1-2',
			'3-4', '3-4', '3-4',
			'5-6', '5-6', '5-6',
		]);
		expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
			'1-2', '3-4', '5-6',
			'1-2', '3-4', '5-6',
			'1-2', '3-4', '5-6',
		]);
		expect(table.map(({ rowspan }) => rowspan)).toEqual([
			3, undefined, undefined,
			3, undefined, undefined,
			3, undefined, undefined,
		]);
		table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 9));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d6 & d10', () => {
		const entries = range(15).map(i => `Result ${i + 1}`);
		const diceSizes: DiceSizes = [6, 10];

		const result = createSolvedDoubleTable(entries, diceSizes);

		expect(result.diceSize).toStrictEqual([6, 10]);
		expect(result.type).toBe('solved-double');
		expect(result.table).toHaveLength(15);

		const table = result.table;
		expect(table.map(({ firstValue }) => firstValue)).toStrictEqual([
			'1-2', '1-2', '1-2', '1-2', '1-2',
			'3-4', '3-4', '3-4', '3-4', '3-4',
			'5-6', '5-6', '5-6', '5-6', '5-6',
		]);
		expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
			'1-2', '3-4', '5-6', '7-8', '9-10',
			'1-2', '3-4', '5-6', '7-8', '9-10',
			'1-2', '3-4', '5-6', '7-8', '9-10',
		]);
		expect(table.map(({ rowspan }) => rowspan)).toEqual([
			5, undefined, undefined, undefined, undefined,
			5, undefined, undefined, undefined, undefined,
			5, undefined, undefined, undefined, undefined,
		]);
		table.forEach(({ odds }) => expect(odds).toEqual(100 / 15));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d2 & d8', () => {
		const entries = range(16).map(i => `Result ${i + 1}`);
		const diceSizes: DiceSizes = [2, 8];

		const result = createSolvedDoubleTable(entries, diceSizes);

		expect(result.diceSize).toStrictEqual([2, 8]);
		expect(result.type).toBe('solved-double');
		expect(result.table).toHaveLength(16);

		const table = result.table;
		expect(table.map(({ firstValue }) => firstValue)).toStrictEqual(concat(
			new Array(8).fill('heads'),
			new Array(8).fill('tails'),
		));
		expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
			'1', '2', '3', '4', '5', '6', '7', '8',
			'1', '2', '3', '4', '5', '6', '7', '8',
		]);
		expect(table.map(({ rowspan }) => rowspan)).toEqual([
			8, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
			8, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
		]);
		table.forEach(({ odds }) => expect(odds).toEqual(100 / 16));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d6 & d6 with single values', () => {
		const entries = range(18).map(i => `Result ${i + 1}`);
		const diceSizes: DiceSizes = [6, 6];

		const result = createSolvedDoubleTable(entries, diceSizes);

		expect(result.diceSize).toStrictEqual([6, 6]);
		expect(result.type).toBe('solved-double');
		expect(result.table).toHaveLength(18);

		const table = result.table;
		expect(table.map(({ firstValue }) => firstValue)).toStrictEqual(concat(
			'1', '1', '1',
			'2', '2', '2',
			'3', '3', '3',
			'4', '4', '4',
			'5', '5', '5',
			'6', '6', '6',
		));
		expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
			'1-2', '3-4', '5-6',
			'1-2', '3-4', '5-6',
			'1-2', '3-4', '5-6',
			'1-2', '3-4', '5-6',
			'1-2', '3-4', '5-6',
			'1-2', '3-4', '5-6',
		]);
		expect(table.map(({ rowspan }) => rowspan)).toEqual([
			3, undefined, undefined,
			3, undefined, undefined,
			3, undefined, undefined,
			3, undefined, undefined,
			3, undefined, undefined,
			3, undefined, undefined,
		]);
		table.forEach(({ odds }) => expect(odds).toEqual(100 / 18));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d3 & d7', () => {
		const entries = range(21).map(i => `Result ${i + 1}`);
		const diceSizes: DiceSizes = [3, 7];

		const result = createSolvedDoubleTable(entries, diceSizes);

		expect(result.diceSize).toStrictEqual([3, 7]);
		expect(result.type).toBe('solved-double');
		expect(result.table).toHaveLength(21);

		const table = result.table;
		expect(table.map(({ firstValue }) => firstValue)).toStrictEqual(concat(
			new Array(7).fill('1'),
			new Array(7).fill('2'),
			new Array(7).fill('3'),
		));
		expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
			'1', '2', '3', '4', '5', '6', '7',
			'1', '2', '3', '4', '5', '6', '7',
			'1', '2', '3', '4', '5', '6', '7',
		]);
		expect(table.map(({ rowspan }) => rowspan)).toEqual([
			7, undefined, undefined, undefined, undefined, undefined, undefined,
			7, undefined, undefined, undefined, undefined, undefined, undefined,
			7, undefined, undefined, undefined, undefined, undefined, undefined,
		]);
		table.forEach(({ odds }) => expect(odds).toEqual(100 / 21));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});
});
