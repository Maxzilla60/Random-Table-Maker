import { chain } from 'lodash';
import type { RandomTable } from '../types';

export function mapTableToSimpleText({ table }: RandomTable): string {
	return chain(table)
		.map('result')
		.join('\n')
		.value();
}
