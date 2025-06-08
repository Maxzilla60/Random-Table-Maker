import { chain } from 'lodash';
import { mapRangesToValues } from './mapRangesToValues';
import type { DiceSize, SolvedDoubleRandomTable, SolvedDoubleTableEntry } from './types';

export function createSolvedDoubleTable(entries: string[], diceSizes: [DiceSize, DiceSize]): SolvedDoubleRandomTable {
	const [firstDie, secondDie] = diceSizes;
	const gdc = greatestCommonDivisor(entries.length, firstDie);

	const firstValues = firstDie === 2 ? ['heads', 'tails'] : createOneOfDoubleValues(gdc, firstDie / gdc);
	const secondValues = createOneOfDoubleValues(entries.length / gdc, secondDie / (entries.length / gdc));

	const table: SolvedDoubleTableEntry[] = firstValues
		.map(firstValue => secondValues.map((secondValue, index) => ({
			firstValue,
			secondValue,
			rowspan: index === 0 ? secondValues.length : undefined,
		})))
		.flat()
		.map((entry, index) => ({
			...entry,
			odds: 100 / entries.length,
			result: entries[index],
		}));

	return {
		type: 'solved-double',
		diceSize: diceSizes,
		table,
	};
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
