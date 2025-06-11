import { describe, expect, test } from 'vitest';
import { DCC_DICE_SIZES } from '../lib/constants';
import { createRerollBellTable } from '../lib/table-creators/createRerollBellTable';
import type { Settings, SingleTableEntry } from '../lib/types';

describe('createRerollBellTable', () => {
	test('should create a bell curve table with rerolls using d4+d4', () => {
		const entries = ['Very Poor', 'Poor', 'Good', 'Very Good'];
		const settings: Settings = {
			enableD2: false,
			enableDCCDice: false,
			preferLargerDice: false,
			mode: 'bell',
			showOdds: false,
		};

		const result = createRerollBellTable(entries, settings);

		expect(result.type).toBe('reroll-bell');
		expect(result.diceSize.length).toBe(2);

		expect(result.table.length).toBeGreaterThan(entries.length);

		expect(result.table.some(entry => entry.isReroll)).toBe(true);

		entries.forEach(entry => {
			expect(result.table.some(tableEntry => tableEntry.result === entry)).toBe(true);
		});

		result.table.forEach(entry => {
			if (entry.isReroll) {
				expect(entry.result).toBe('Reroll');
			}
		});
	});

	test('should create an unsolved bell curve table when no valid dice size is found', () => {
		const entries = new Array(100).fill('Entry');
		const settings: Settings = {
			enableD2: false,
			enableDCCDice: false,
			preferLargerDice: false,
			mode: 'bell',
			showOdds: false,
		};

		const result = createRerollBellTable(entries, settings);

		expect(result.type).toBe('unsolved-bell');
		expect(result.diceSize).toEqual([]);
		expect(result.table).toHaveLength(entries.length);

		result.table.forEach((entry, index) => {
			expect((entry as SingleTableEntry).value).toBe('x');
			expect(entry.odds).toBe(0);
			expect(entry.result).toBe(entries[index]);
			expect(entry.isReroll).toBe(false);
		});
	});

	test('should distribute reroll entries at beginning and end', () => {
		const entries = ['Result 1', 'Result 2', 'Result 3', 'Result 4'];
		const settings: Settings = {
			enableD2: false,
			enableDCCDice: false,
			preferLargerDice: false,
			mode: 'bell',
			showOdds: false,
		};

		const result = createRerollBellTable(entries, settings);

		const firstEntries = result.table.slice(0, 3);
		const lastEntries = result.table.slice(-1);

		expect(firstEntries.every(entry => entry.isReroll)).toBe(false);
		expect(lastEntries.every(entry => entry.isReroll)).toBe(true);

		const nonRerollEntries = result.table.filter(entry => !entry.isReroll);
		expect(nonRerollEntries.map(entry => entry.result)).toEqual(entries);
	});

	test('should use DCC dice when enabled', () => {
		const entries = new Array(40).fill('Entry');
		const settings: Settings = {
			enableD2: false,
			enableDCCDice: true,
			preferLargerDice: false,
			mode: 'bell',
			showOdds: false,
		};

		const result = createRerollBellTable(entries, settings);

		// @ts-ignore
		expect(result.diceSize.some(size => DCC_DICE_SIZES.includes(size))).toBe(true);
	});

	test('should include d2 when enabled', () => {
		const entries = ['Fail', 'Success'];
		const settings: Settings = {
			enableD2: true,
			enableDCCDice: false,
			preferLargerDice: false,
			mode: 'bell',
			showOdds: false,
		};

		const result = createRerollBellTable(entries, settings);

		const validDice = [2, 4, 6, 8, 10, 12, 20, 100];
		expect(result.diceSize.every(size => validDice.includes(size))).toBe(true);
	});
});
