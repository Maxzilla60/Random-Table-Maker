import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as forcedTableModule from '../lib/createForcedTable';
import * as rerollTableModule from '../lib/createRerollTable';
import * as solvedDoubleTableModule from '../lib/createSolvedDoubleTable';
import * as solvedSingleTableModule from '../lib/createSolvedSingleTable';
import { mapEntriesToRandomTable } from '../lib/mapEntriesToRandomTable';
import type { Settings } from '../lib/types';

describe('mapEntriesToRandomTable', () => {
	const defaultSettings: Settings = {
		enableDCCDice: false,
		enableD2: true,
		preferLargerDice: false,
		mode: 'forced',
	};

	const rerollSettings: Settings = {
		enableDCCDice: false,
		enableD2: true,
		preferLargerDice: false,
		mode: 'reroll',
	};

	beforeEach(() => {
		vi.spyOn(forcedTableModule, 'createForcedTable').mockReturnValue({
			type: 'forced',
			diceSize: [100],
			table: [],
		});

		vi.spyOn(rerollTableModule, 'createRerollTable').mockReturnValue({
			type: 'reroll-single',
			diceSize: [10],
			table: [],
		});

		vi.spyOn(solvedSingleTableModule, 'createSolvedSingleTable').mockReturnValue({
			type: 'solved-single',
			diceSize: [6],
			table: [],
		});

		vi.spyOn(solvedDoubleTableModule, 'createSolvedDoubleTable').mockReturnValue({
			type: 'solved-double',
			diceSize: [6, 6],
			table: [],
		});
	});

	afterEach(() => vi.restoreAllMocks());

	test('should handle empty entries', () => {
		const entries: string[] = [];
		const result = mapEntriesToRandomTable(entries, defaultSettings);

		expect(result).toEqual({
			type: 'solved-single',
			diceSize: [0],
			table: [],
		});

		expect(forcedTableModule.createForcedTable).not.toHaveBeenCalled();
		expect(rerollTableModule.createRerollTable).not.toHaveBeenCalled();
		expect(solvedSingleTableModule.createSolvedSingleTable).not.toHaveBeenCalled();
		expect(solvedDoubleTableModule.createSolvedDoubleTable).not.toHaveBeenCalled();
	});

	test('should handle single entry', () => {
		const entries = ['Single Result'];
		const result = mapEntriesToRandomTable(entries, defaultSettings);

		expect(result).toEqual({
			type: 'solved-single',
			diceSize: [1],
			table: [{ value: '1', result: 'Single Result', odds: 100, isReroll: false }],
		});

		expect(forcedTableModule.createForcedTable).not.toHaveBeenCalled();
		expect(rerollTableModule.createRerollTable).not.toHaveBeenCalled();
		expect(solvedSingleTableModule.createSolvedSingleTable).not.toHaveBeenCalled();
		expect(solvedDoubleTableModule.createSolvedDoubleTable).not.toHaveBeenCalled();
	});

	test('should handle coin flip for two entries with d2 enabled', () => {
		const entries = ['Yes', 'No'];
		const result = mapEntriesToRandomTable(entries, defaultSettings);

		expect(result).toEqual({
			type: 'solved-single',
			diceSize: [2],
			table: [
				{ value: 'heads', result: 'Yes', odds: 50, isReroll: false },
				{ value: 'tails', result: 'No', odds: 50, isReroll: false },
			],
		});

		expect(forcedTableModule.createForcedTable).not.toHaveBeenCalled();
		expect(rerollTableModule.createRerollTable).not.toHaveBeenCalled();
		expect(solvedSingleTableModule.createSolvedSingleTable).not.toHaveBeenCalled();
		expect(solvedDoubleTableModule.createSolvedDoubleTable).not.toHaveBeenCalled();
	});

	test('should call createSolvedSingleTable when entries fit in a single die', () => {
		const entries = ['A', 'B', 'C', 'D'];

		mapEntriesToRandomTable(entries, defaultSettings);

		expect(solvedSingleTableModule.createSolvedSingleTable).toHaveBeenCalledWith(entries, 4);
		expect(forcedTableModule.createForcedTable).not.toHaveBeenCalled();
		expect(rerollTableModule.createRerollTable).not.toHaveBeenCalled();
		expect(solvedDoubleTableModule.createSolvedDoubleTable).not.toHaveBeenCalled();
	});

	test('should call createSolvedDoubleTable when entries fit in two dice', () => {
		const entries = Array.from({ length: 36 }, (_, i) => `Entry ${i + 1}`);

		mapEntriesToRandomTable(entries, defaultSettings);

		expect(solvedDoubleTableModule.createSolvedDoubleTable).toHaveBeenCalledWith(entries, [6, 6]);
		expect(forcedTableModule.createForcedTable).not.toHaveBeenCalled();
		expect(rerollTableModule.createRerollTable).not.toHaveBeenCalled();
		expect(solvedSingleTableModule.createSolvedSingleTable).not.toHaveBeenCalled();
	});

	test('should call createForcedTable when mode is forced and entries don\'t fit neatly', () => {
		const entries = Array.from({ length: 7 }, (_, i) => `Entry ${i + 1}`);

		mapEntriesToRandomTable(entries, defaultSettings);

		expect(forcedTableModule.createForcedTable).toHaveBeenCalledWith(entries);
		expect(rerollTableModule.createRerollTable).not.toHaveBeenCalled();
		expect(solvedSingleTableModule.createSolvedSingleTable).not.toHaveBeenCalled();
		expect(solvedDoubleTableModule.createSolvedDoubleTable).not.toHaveBeenCalled();
	});

	test('should call createRerollTable when mode is reroll and entries don\'t fit neatly', () => {
		const entries = Array.from({ length: 7 }, (_, i) => `Entry ${i + 1}`);

		mapEntriesToRandomTable(entries, rerollSettings);

		expect(rerollTableModule.createRerollTable).toHaveBeenCalledWith(entries, rerollSettings);
		expect(forcedTableModule.createForcedTable).not.toHaveBeenCalled();
		expect(solvedSingleTableModule.createSolvedSingleTable).not.toHaveBeenCalled();
	});
});
