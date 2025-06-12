import { isEmpty } from 'lodash';
import type { RandomTable } from '../types';

export function mapDiceSize(type: RandomTable['type'], diceSize: RandomTable['diceSize']): string {
	if (isEmpty(diceSize)) {
		return 'unsolved';
	}

	if (type === 'solved-bell' || type === 'reroll-bell') {
		if (diceSize[0] === diceSize[1]) {
			return `2d${diceSize[0]}`;
		}
		return diceSize
			.map(size => `d${size}`)
			.join(' + ');
	}

	return diceSize
		.map(size => `d${size}`)
		.join(' & ');
}
