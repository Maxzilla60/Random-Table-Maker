import { chain } from 'lodash';
import { mapRangesToValues } from './mapRangesToValues';
import type { DiceSize, DoubleRandomTable, DoubleTableEntry } from './types';

export function createSolvedDoubleTable(entries: string[], diceSizes: [DiceSize, DiceSize]): DoubleRandomTable {
	const [firstDie, secondDie] = diceSizes;
	const gdc = greatestCommonDivisor(entries.length, firstDie);

	const firstFaces = getSpecialFaces(firstDie) ?? createOneOfDoubleValues(gdc, firstDie / gdc);
	const secondFaces = getSpecialFaces(secondDie) ?? createOneOfDoubleValues(entries.length / gdc, secondDie / (entries.length / gdc));

	const table: DoubleTableEntry[] = firstFaces
		.map(firstValue => secondFaces.map((secondValue, index) => ({
			firstValue,
			secondValue,
			rowspan: index === 0 ? secondFaces.length : undefined,
		})))
		.flat()
		.map((entry, index) => ({
			...entry,
			odds: 100 / entries.length,
			result: entries[index],
			isReroll: false,
		}));

	return {
		type: 'solved-double',
		diceSize: diceSizes,
		table,
	};
}

function getSpecialFaces(firstDie: DiceSize): string[] | undefined {
	if (firstDie === 2) {
		return ['heads', 'tails'];
	} else if (firstDie === 3) {
		return ['I', 'II', 'III'];
	}
	return undefined;
}

export function createOneOfDoubleValues(rangeValue: number, fillValue: number): string[] {
	return chain(rangeValue)
		.range()
		.fill(fillValue)
		.thru(mapRangesToValues)
		.value();
}

function greatestCommonDivisor(k: number, n: number): number {
	return k ? greatestCommonDivisor(n % k, k) : n;
}
