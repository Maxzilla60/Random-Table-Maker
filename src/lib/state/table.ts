import { map } from 'lodash';
import { derived } from 'svelte/store';
import { mapEntriesToRandomTable } from '../mapEntriesToRandomTable';
import { entries$ } from './entries';
import { settings$ } from './settings';

export const table$ = derived([entries$, settings$], ([entries, settings]) =>
	mapEntriesToRandomTable(map(entries, 'value'), settings),
);
