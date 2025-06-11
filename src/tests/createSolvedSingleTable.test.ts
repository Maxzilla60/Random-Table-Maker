import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { createSolvedSingleTable } from '../lib/table-creators/createSolvedSingleTable';

describe('createSolvedSingleTable', () => {
	test('should create a table with d4', () => {
		const entries = ['Summer', 'Autumn', 'Winter', 'Spring'];

		const result = createSolvedSingleTable(entries, 4);

		expect(result.diceSize).toStrictEqual([4]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(4);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(4).map(i => String(i + 1)));
		table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 4));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d6', () => {
		const entries = ['+', '+', ' ', ' ', '-', '-'];

		const result = createSolvedSingleTable(entries, 6);

		expect(result.diceSize).toStrictEqual([6]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(6);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(6).map(i => String(i + 1)));
		table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 6));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d8', () => {
		const entries = range(8).map(i => `Result ${i + 1}`);

		const result = createSolvedSingleTable(entries, 8);

		expect(result.diceSize).toStrictEqual([8]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(8);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(8).map(i => String(i + 1)));
		table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 8));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d20', () => {
		const entries = range(20).map(i => `Result ${i + 1}`);

		const result = createSolvedSingleTable(entries, 20);

		expect(result.diceSize).toStrictEqual([20]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(20);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(20).map(i => String(i + 1)));
		table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 20));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d100 properly distributing ranges', () => {
		const entries = range(50).map(i => `Result ${i + 1}`);

		const result = createSolvedSingleTable(entries, 100);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(50);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual([
			'1-2', '3-4', '5-6', '7-8', '9-10',
			'11-12', '13-14', '15-16', '17-18', '19-20',
			'21-22', '23-24', '25-26', '27-28', '29-30',
			'31-32', '33-34', '35-36', '37-38', '39-40',
			'41-42', '43-44', '45-46', '47-48', '49-50',
			'51-52', '53-54', '55-56', '57-58', '59-60',
			'61-62', '63-64', '65-66', '67-68', '69-70',
			'71-72', '73-74', '75-76', '77-78', '79-80',
			'81-82', '83-84', '85-86', '87-88', '89-90',
			'91-92', '93-94', '95-96', '97-98', '99-100',
		]);
		expect(table.map(({ odds }) => odds)).toEqual(range(50).map(() => 2));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d100 with exact mapping', () => {
		const entries = range(100).map(i => `Result ${i + 1}`);

		const result = createSolvedSingleTable(entries, 100);

		expect(result.diceSize).toStrictEqual([100]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(100);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(100).map(i => String(i + 1)));
		table.forEach(({ odds }) => expect(odds).toEqual(1));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d3', () => {
		const entries = ['Rock', 'Paper', 'Scissors'];

		const result = createSolvedSingleTable(entries, 3);

		expect(result.diceSize).toStrictEqual([3]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(3);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(['1', '2', '3']);
		table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 3));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d30', () => {
		const entries = range(30).map(i => `Result ${i + 1}`);

		const result = createSolvedSingleTable(entries, 30);

		expect(result.diceSize).toStrictEqual([30]);
		expect(result.type).toStrictEqual('solved-single');
		expect(result.table).toHaveLength(30);

		const table = result.table;
		expect(table.map(({ value }) => value)).toEqual(range(30).map(i => String(i + 1)));
		table.forEach(({ odds }) => expect(odds).toEqual(100 / 30));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});

	test('should create a table with d30 with range values', () => {
		const entries = range(15).map(i => `Result ${i + 1}`);

		const result = createSolvedSingleTable(entries, 30);

		expect(result.diceSize).toStrictEqual([30]);
		expect(result.type).toBe('solved-single');
		expect(result.table).toHaveLength(15);

		const table = result.table;
		expect(table.map(({ value }) => value)).toStrictEqual([
			'1-2', '3-4', '5-6', '7-8', '9-10',
			'11-12', '13-14', '15-16', '17-18', '19-20',
			'21-22', '23-24', '25-26', '27-28', '29-30',
		]);
		table.forEach(({ odds }) => expect(odds).toEqual(100 / 15));
		expect(table.map(({ result }) => result)).toEqual(entries);
	});
});
