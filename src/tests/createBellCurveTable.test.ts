import { describe, expect, test } from 'vitest';
import { createBellCurveTable } from '../lib/createBellCurveTable';
import type { SingleTableEntry } from '../lib/types';

describe('createBellCurveTable', () => {
	test('should create a bell curve table with d4+d4', () => {
		const entries = ['Very Poor', 'Poor', 'Average', 'Good', 'Very Good'];

		const result = createBellCurveTable(entries, [8, 8]);

		expect(result.diceSize).toStrictEqual([8, 8]);
		expect(result.type).toStrictEqual('solved-bell');
		expect(result.table).toHaveLength(5);

		expect((result.table[0] as SingleTableEntry).value).toBe('2-4');
		expect((result.table[1] as SingleTableEntry).value).toBe('5-7');
		expect((result.table[2] as SingleTableEntry).value).toBe('8-10');
		expect((result.table[3] as SingleTableEntry).value).toBe('11-13');
		expect((result.table[4] as SingleTableEntry).value).toBe('14-16');

		expect(result.table.map(entry => entry.result)).toEqual(entries);

		expect(result.table[0].odds).toBeLessThan(result.table[1].odds);
		expect(result.table[1].odds).toBeLessThan(result.table[2].odds);
		expect(result.table[2].odds).toBeGreaterThan(result.table[3].odds);
		expect(result.table[3].odds).toBeGreaterThan(result.table[4].odds);

		result.table.forEach(entry => expect(entry.isReroll).toBe(false));

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBeCloseTo(100, 1);
	});

	test('should create a bell curve table with d6+d6', () => {
		const entries = new Array(11).fill('Result');

		const result = createBellCurveTable(entries, [6, 6]);

		expect(result.diceSize).toStrictEqual([6, 6]);
		expect(result.type).toStrictEqual('solved-bell');
		expect(result.table).toHaveLength(11);

		expect(result.table.map(entry => entry.result)).toEqual(entries);

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBeCloseTo(100, 1);
	});

	test('should create a bell curve table with d8+d8', () => {
		const entries = ['Good', 'Neutral', 'Bad'];

		const result = createBellCurveTable(entries, [8, 8]);

		expect(result.diceSize).toStrictEqual([8, 8]);
		expect(result.type).toStrictEqual('solved-bell');
		expect(result.table).toHaveLength(3);

		expect(result.table.map(entry => entry.result)).toEqual(entries);

		result.table.forEach(entry => expect(entry.isReroll).toBe(false));

		const odds = result.table.map(entry => entry.odds);
		expect(Math.max(...odds)).toBe(result.table[Math.floor(result.table.length / 2)].odds);

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBeCloseTo(100, 1);
	});

	test('should create a bell curve table with different dice sizes (d4+d6)', () => {
		const entries = new Array(9).fill('Result');

		const result = createBellCurveTable(entries, [4, 6]);

		expect(result.diceSize).toStrictEqual([4, 6]);
		expect(result.type).toStrictEqual('solved-bell');
		expect(result.table).toHaveLength(9);

		expect(result.table.map(entry => entry.result)).toEqual(entries);

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBeCloseTo(100, 1);
	});
});
