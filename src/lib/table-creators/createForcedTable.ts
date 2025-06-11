import { chain, curry, floor } from 'lodash';
import { mapRangesToValues } from '../table-util/mapRangesToValues';
import type { Forced100RandomTable, SingleTableEntry } from '../types';

export function createForcedTable(entries: string[]): Forced100RandomTable {
	const diceSize: [100] = [100];
	const valueRange = floor(100 / entries.length);
	const remainder = 100 % entries.length;
	const spreadRemainder = curry(spreadRemainderFn)(remainder);

	const ranges = chain(entries.length)
		.range()
		.fill(valueRange)
		.thru(spreadRemainder);

	const table = ranges
		.thru(mapRangesToValues)
		.zip(entries)
		.map(([value, result]) => ({
			value,
			result,
		}))
		.zip(ranges.value())
		.map(([valueAndResult, odds]) => ({
			...valueAndResult,
			odds,
			isReroll: false,
		}))
		.value() as SingleTableEntry[];

	return {
		type: 'forced',
		diceSize,
		table,
	};
}

function spreadRemainderFn(remainder: number, values: number[], index = 0): number[] {
	if (remainder === 0) {
		return values;
	}

	const newValues = values.with(index, values[index] + 1);
	const newRemainder = remainder - 1;
	const newIndex = index === values.length - 1 ? 0 : index + 1;
	return spreadRemainderFn(newRemainder, newValues, newIndex);
}
