import { concat, filter, identity } from 'lodash';
import { derived, type Readable, type Writable, writable } from 'svelte/store';
import { MAX_TABLE_LENGTH } from '../util/constants';

const LOCAL_STORAGE_KEY = 'random-table-maker-entries';
const DEFAULT_ENTRIES = [
	'Stirges (1d8 + 2)',
	'Ghouls (1d4 + 1)',
	'Ogre (1)',
	'Goblins (1d6 + 3)',
	'Hobgoblins (1d4 + 2)',
	'Orcs (1d4 + 2)',
	'Wolves (1d4 + 2)',
	'Owlbear (1)',
];

const entriesWritable: Writable<string[]> = writable<string[]>(getInitialEntries());
export const entries$: Readable<string[]> = derived(entriesWritable, identity);

entriesWritable.subscribe(entries => {
	const json = JSON.stringify(entries);
	localStorage.setItem(LOCAL_STORAGE_KEY, json);
});

export function removeEntry(index: number): void {
	entriesWritable.update(entries => filter(entries, (_, i) => i !== index));
}

export function addEntry(newEntry: string): void {
	entriesWritable.update(entries => {
		if (entries.length >= MAX_TABLE_LENGTH) {
			return entries;
		}
		return concat(entries, newEntry.trim());
	});
}

export function reorderEntries(fromIndex: number, toIndex: number): void {
	entriesWritable.update(entries => {
		const result = [...entries];
		const [removed] = result.splice(fromIndex, 1);
		result.splice(toIndex, 0, removed);
		return result;
	});
}

function getInitialEntries(): string[] {
	const json = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (json) {
		try {
			return JSON.parse(json) as string[];
		} catch (error) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_ENTRIES));
			return DEFAULT_ENTRIES;
		}
	}
	return DEFAULT_ENTRIES;
}
