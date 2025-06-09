import { range } from 'lodash';
import { describe, expect, test } from 'vitest';
import { createRerollTable } from '../lib/createRerollTable';
import type { Settings } from '../lib/types';

describe('createRerollTable', () => {
	const defaultSettings: Settings = {
		enableDCCDice: false,
		enableD2: true,
		preferLargerDice: false,
		mode: 'reroll',
	};

	test('should create a reroll table for 7 entries', () => {
		const entries = range(7).map(i => `Result ${i + 1}`);

		const result = createRerollTable(entries, defaultSettings);

		expect(result.type).toStrictEqual('reroll-single');
		expect(result.table.length).toBeLessThanOrEqual(10);

		const usedEntries = result.table.filter(entry => !entry.isReroll);
		expect(usedEntries.length).toBe(entries.length);

		const resultEntries = usedEntries.map(entry => entry.result);
		expect(resultEntries).toEqual(entries);

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBe(100);
	});

	test('should create a reroll table for 11 entries', () => {
		const entries = range(11).map(i => `Result ${i + 1}`);

		const result = createRerollTable(entries, defaultSettings);

		expect(result.type).toStrictEqual('reroll-single');

		const usedEntries = result.table.filter(entry => !entry.isReroll);
		expect(usedEntries.length).toBe(entries.length);

		const resultEntries = usedEntries.map(entry => entry.result);
		expect(resultEntries).toEqual(entries);

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBeCloseTo(100);

		const rerollEntries = result.table.filter(entry => entry.isReroll);
		rerollEntries.forEach(entry => {
			expect(entry.isReroll).toBe(true);
		});
	});

	test('should create a reroll table for 13 entries', () => {
		const entries = range(13).map(i => `Result ${i + 1}`);

		const result = createRerollTable(entries, defaultSettings);

		expect(result.type).toStrictEqual('reroll-double');

		const usedEntries = result.table.filter(entry => !entry.isReroll);
		expect(usedEntries.length).toBe(entries.length);

		const resultEntries = usedEntries.map(entry => entry.result);
		expect(resultEntries).toEqual(entries);

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBeCloseTo(100);
	});

	test('should create a reroll table for 17 entries with DCC dice', () => {
		const dccSettings: Settings = {
			enableDCCDice: true,
			enableD2: true,
			preferLargerDice: false,
			mode: 'reroll',
		};
		const entries = range(17).map(i => `Result ${i + 1}`);

		const result = createRerollTable(entries, dccSettings);

		expect(result.type).toStrictEqual('reroll-double');

		const usedEntries = result.table.filter(entry => !entry.isReroll);
		expect(usedEntries.length).toBe(entries.length);

		const resultEntries = usedEntries.map(entry => entry.result);
		expect(resultEntries).toEqual(entries);

		const totalOdds = result.table.reduce((sum, entry) => sum + entry.odds, 0);
		expect(totalOdds).toBeCloseTo(100);
	});
});
