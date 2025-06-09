import { derived, type Readable, writable } from 'svelte/store';
import type { Settings } from '../lib/types';

const LOCAL_STORAGE_KEY = 'random-table-maker-settings';
const DEFAULT_SETTINGS: Settings = {
	enableDCCDice: false,
	enableD2: true,
	preferLargerDice: false,
	mode: 'forced',
	showOdds: false,
};

const initialSettings = getInitialSettingsFromLocalStorage();
export const enableD2$ = writable<boolean>(initialSettings.enableD2);
export const enableDCCDice$ = writable<boolean>(initialSettings.enableDCCDice);
export const preferLargerDice$ = writable<boolean>(initialSettings.preferLargerDice);
export const mode$ = writable<Settings['mode']>(initialSettings.mode);
export const showOdds$ = writable<boolean>(initialSettings.showOdds);

export const settings$: Readable<Settings> = derived([
	enableD2$,
	enableDCCDice$,
	preferLargerDice$,
	mode$,
	showOdds$,
], ([
	    enableD2,
	    enableDCCDice,
	    preferLargerDice,
	    mode,
	    showOdds,
                                                         ]): Settings => ({
	enableD2,
	enableDCCDice,
	preferLargerDice,
	mode,
	showOdds,
}));
settings$.subscribe(settings => {
	const json = JSON.stringify(settings);
	localStorage.setItem(LOCAL_STORAGE_KEY, json);
});

function getInitialSettingsFromLocalStorage(): Settings {
	const json = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (json) {
		try {
			return JSON.parse(json) as Settings;
		} catch (error) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
		}
	}
	return DEFAULT_SETTINGS;
}
