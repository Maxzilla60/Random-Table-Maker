import { concat, range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { mapEntriesToRandomTable } from '../lib/mapEntriesToRandomTable';
import type { Forced100RandomTable, Settings, SolvedDoubleRandomTable, SolvedSingleRandomTable } from '../lib/types';

describe('mapEntriesToRandomTable', () => {
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
		test('should map empty entries', () => {
			const entries: string[] = [];
			const expectedTable: SolvedSingleRandomTable = {
				type: 'solved-single',
				diceSize: [0],
				table: [],
			};

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result).toEqual(expectedTable);
		});

		test('should map single entry', () => {
			const entries = ['Orcs Attack!'];
			const expectedTable: SolvedSingleRandomTable = {
				type: 'solved-single',
				diceSize: [1],
				table: [{
					value: '1',
					odds: 100,
					result: entries[0],
				}],
			};

			const result = mapEntriesToRandomTable(entries, defaultSettings);

			expect(result).toEqual(expectedTable);
		});

		test('should map 2 entries to a solved coin flip', () => {
			const entries = ['Yes', 'No'];
			const expectedTable: SolvedSingleRandomTable = {
				type: 'solved-single',
				diceSize: [2],
				table: [
					{
						value: 'heads',
						odds: 50,
						result: entries[0],
					},
					{
						value: 'tails',
						odds: 50,
						result: entries[1],
					},
				],
			};

			const result = mapEntriesToRandomTable(entries, defaultSettings);

			expect(result).toEqual(expectedTable);
		});

		test('should map 2 entries to a d4 if d2\'s are disabled', () => {
			const entries = ['Yes', 'No'];
			const expectedTable: SolvedSingleRandomTable = {
				type: 'solved-single',
				diceSize: [4],
				table: [
					{
						value: '1-2',
						odds: 50,
						result: entries[0],
					},
					{
						value: '3-4',
						odds: 50,
						result: entries[1],
					},
				],
			};

			const result = mapEntriesToRandomTable(entries, noD2Settings);

			expect(result).toEqual(expectedTable);
		});

		test('should map 3 entries to a solved d6 table', () => {
			const entries = ['Cyan', 'Magenta', 'Yellow'];

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([6]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(3);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual([
				'1-2',
				'3-4',
				'5-6',
			]);
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toBeCloseTo(100 / 3));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 4 entries to a solved d4 table', () => {
			const entries = ['Summer', 'Autumn', 'Winter', 'Spring'];

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([4]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(4);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(4).map(i => String(i + 1)));
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 4));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 5 entries to a solved d10 table', () => {
			const entries = ['Result 1', 'Result 2', 'Result 3', 'Result 4', 'Result 5'];

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([10]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(5);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual([
				'1-2',
				'3-4',
				'5-6',
				'7-8',
				'9-10',
			]);
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 5));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 6 entries to a solved d6 table', () => {
			const entries = ['+', '+', ' ', ' ', '-', '-'];

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([6]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(6);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(6).map(i => String(i + 1)));
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 6));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 7 entries to a forced d100 table', () => {
			const entries = range(7).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as Forced100RandomTable;

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

		test('should map 8 entries to a solved d8 table', () => {
			const entries = range(8).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([8]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(8);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(8).map(i => String(i + 1)));
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 8));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 9 entries to a solved d6 & d6 table', () => {
			const entries = range(9).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedDoubleRandomTable;

			expect(result.diceSize).toStrictEqual([6, 6]);
			expect(result.type).toBe('solved-double');
			expect(result.table).toHaveLength(9);

			const table = result.table;
			expect(table.map(({ firstValue }) => firstValue)).toStrictEqual([
				'1-2',
				'1-2',
				'1-2',
				'3-4',
				'3-4',
				'3-4',
				'5-6',
				'5-6',
				'5-6',
			]);
			expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
				'1-2',
				'3-4',
				'5-6',
				'1-2',
				'3-4',
				'5-6',
				'1-2',
				'3-4',
				'5-6',
			]);
			expect(table.map(({ rowspan }) => rowspan)).toEqual([
				3,
				undefined,
				undefined,
				3,
				undefined,
				undefined,
				3,
				undefined,
				undefined,
			]);
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 9));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 11 entries to a forced d100 table', () => {
			const entries = Array(11).fill(0).map((_, i) => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as Forced100RandomTable;

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

		test('should map 13 entries to a forced d100 table', () => {
			const entries = range(13).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as Forced100RandomTable;

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

		test('should map 15 entries to a solved d6 & d10 table', () => {
			const entries = range(15).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedDoubleRandomTable;

			expect(result.diceSize).toStrictEqual([6, 10]);
			expect(result.type).toBe('solved-double');
			expect(result.table).toHaveLength(15);

			const table = result.table;
			expect(table.map(({ firstValue }) => firstValue)).toStrictEqual([
				'1-2',
				'1-2',
				'1-2',
				'1-2',
				'1-2',
				'3-4',
				'3-4',
				'3-4',
				'3-4',
				'3-4',
				'5-6',
				'5-6',
				'5-6',
				'5-6',
				'5-6',
			]);
			expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
				'1-2',
				'3-4',
				'5-6',
				'7-8',
				'9-10',
				'1-2',
				'3-4',
				'5-6',
				'7-8',
				'9-10',
				'1-2',
				'3-4',
				'5-6',
				'7-8',
				'9-10',
			]);
			expect(table.map(({ rowspan }) => rowspan)).toEqual([
				5,
				undefined,
				undefined,
				undefined,
				undefined,
				5,
				undefined,
				undefined,
				undefined,
				undefined,
				5,
				undefined,
				undefined,
				undefined,
				undefined,
			]);
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 15));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 16 entries to a solved d2 & d8 table', () => {
			const entries = range(16).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedDoubleRandomTable;

			expect(result.diceSize).toStrictEqual([2, 8]);
			expect(result.type).toBe('solved-double');
			expect(result.table).toHaveLength(16);

			const table = result.table;
			expect(table.map(({ firstValue }) => firstValue)).toStrictEqual(concat(
				new Array(8).fill('heads'),
				new Array(8).fill('tails'),
			));
			expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
			]);
			expect(table.map(({ rowspan }) => rowspan)).toEqual([
				8,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				8,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
			]);
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 16));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 18 entries to a solved d6 & d6 table', () => {
			const entries = range(18).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedDoubleRandomTable;

			expect(result.diceSize).toStrictEqual([6, 6]);
			expect(result.type).toBe('solved-double');
			expect(result.table).toHaveLength(18);

			const table = result.table;
			expect(table.map(({ firstValue }) => firstValue)).toStrictEqual(concat(
				'1',
				'1',
				'1',
				'2',
				'2',
				'2',
				'3',
				'3',
				'3',
				'4',
				'4',
				'4',
				'5',
				'5',
				'5',
				'6',
				'6',
				'6',
			));
			expect(table.map(({ secondValue }) => secondValue)).toStrictEqual([
				'1-2',
				'3-4',
				'5-6',
				'1-2',
				'3-4',
				'5-6',
				'1-2',
				'3-4',
				'5-6',
				'1-2',
				'3-4',
				'5-6',
				'1-2',
				'3-4',
				'5-6',
				'1-2',
				'3-4',
				'5-6',
			]);
			expect(table.map(({ rowspan }) => rowspan)).toEqual([
				3,
				undefined,
				undefined,
				3,
				undefined,
				undefined,
				3,
				undefined,
				undefined,
				3,
				undefined,
				undefined,
				3,
				undefined,
				undefined,
				3,
				undefined,
				undefined,
			]);
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 18));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 20 entries to a solved d20 table', () => {
			const entries = range(20).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([20]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(20);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(20).map(i => String(i + 1)));
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 20));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 50 entries to a solved d100 table', () => {
			const entries = range(50).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([100]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(50);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual([
				'1-2',
				'3-4',
				'5-6',
				'7-8',
				'9-10',
				'11-12',
				'13-14',
				'15-16',
				'17-18',
				'19-20',
				'21-22',
				'23-24',
				'25-26',
				'27-28',
				'29-30',
				'31-32',
				'33-34',
				'35-36',
				'37-38',
				'39-40',
				'41-42',
				'43-44',
				'45-46',
				'47-48',
				'49-50',
				'51-52',
				'53-54',
				'55-56',
				'57-58',
				'59-60',
				'61-62',
				'63-64',
				'65-66',
				'67-68',
				'69-70',
				'71-72',
				'73-74',
				'75-76',
				'77-78',
				'79-80',
				'81-82',
				'83-84',
				'85-86',
				'87-88',
				'89-90',
				'91-92',
				'93-94',
				'95-96',
				'97-98',
				'99-100',
			]);
			expect(table.map(({ odds }) => odds)).toEqual(range(50).map(() => 2));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 100 entries to a solved d100 table', () => {
			const entries = range(100).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, defaultSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([100]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(100);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(100).map(i => String(i + 1)));
			table.forEach(({ odds }) => expect(odds).toEqual(1));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});
	});

	describe('with DCC dice sizes', () => {
		test('should map 3 entries to a solved d3 table', () => {
			const entries = ['Rock', 'Paper', 'Scissors'];

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([3]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(3);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(['1', '2', '3']);
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 3));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 5 entries to a solved d5 table', () => {
			const entries = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'];

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([5]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(5);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(['1', '2', '3', '4', '5']);
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 5));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 7 entries to a solved d7 table', () => {
			const entries = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([7]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(7);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 7));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 14 entries to a solved d14 table', () => {
			const entries = range(14).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([14]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(14);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(14).map(i => String(i + 1)));
			table.map(({ odds }) => odds).forEach(odds => expect(odds).toEqual(100 / 14));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 16 entries to a solved d16 table', () => {
			const entries = range(16).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([16]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(16);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(16).map(i => String(i + 1)));
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 16));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 24 entries to a solved d24 table', () => {
			const entries = range(24).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([24]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(24);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(24).map(i => String(i + 1)));
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 24));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 30 entries to a solved d30 table', () => {
			const entries = range(30).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([30]);
			expect(result.type).toStrictEqual('solved-single');
			expect(result.table).toHaveLength(30);

			const table = result.table;
			expect(table.map(({ value }) => value)).toEqual(range(30).map(i => String(i + 1)));
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 30));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 15 entries to a solved d30 table', () => {
			const entries = range(15).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedSingleRandomTable;

			expect(result.diceSize).toStrictEqual([30]);
			expect(result.type).toBe('solved-single');
			expect(result.table).toHaveLength(15);

			const table = result.table;
			expect(table.map(({ value }) => value)).toStrictEqual(concat(
				'1-2',
				'3-4',
				'5-6',
				'7-8',
				'9-10',
				'11-12',
				'13-14',
				'15-16',
				'17-18',
				'19-20',
				'21-22',
				'23-24',
				'25-26',
				'27-28',
				'29-30',
			));
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 15));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});

		test('should map 21 entries to a solved d3 & d7 table', () => {
			const entries = range(21).map(i => `Result ${i + 1}`);

			const result = mapEntriesToRandomTable(entries, dccSettings) as SolvedDoubleRandomTable;

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
				7,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				7,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				7,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
			]);
			table.forEach(({ odds }) => expect(odds).toEqual(100 / 21));
			expect(table.map(({ result }) => result)).toEqual(entries);
		});
	});
});
