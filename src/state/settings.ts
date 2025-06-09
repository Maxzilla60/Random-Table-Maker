import { derived, type Readable, writable } from 'svelte/store';
import type { Settings } from '../lib/types';

export const enableDCCDice$ = writable<boolean>(false);
export const enableD2$ = writable<boolean>(true);
export const preferLargerDice$ = writable<boolean>(false);
export const mode$ = writable<Settings['mode']>('forced');
export const showOdds$ = writable<boolean>(false);

export const settings$: Readable<Settings> = derived([
	enableDCCDice$,
	enableD2$,
	preferLargerDice$,
	mode$,
	showOdds$,
], ([
	    enableDCCDice,
	    enableD2,
	    preferLargerDice,
	    mode,
	    showOdds,
                                                         ]): Settings => ({
	enableDCCDice,
	enableD2,
	preferLargerDice,
	mode,
	showOdds,
}));
