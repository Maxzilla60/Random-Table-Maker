import { concat, filter, identity } from 'lodash';
import { nanoid } from 'nanoid';
import { derived, type Readable, type Writable, writable } from 'svelte/store';
import { MAX_TABLE_LENGTH } from '../constants';

const LOCAL_STORAGE_KEY = 'random-table-maker-entries';
const DEFAULT_ENTRIES: Entry[] = [
	{ value: 'Stirges (1d8 + 2)', id: nanoid() },
	{ value: 'Ghouls (1d4 + 1)', id: nanoid() },
	{ value: 'Ogre (1)', id: nanoid() },
	{ value: 'Goblins (1d6 + 3)', id: nanoid() },
	{ value: 'Hobgoblins (1d4 + 2)', id: nanoid() },
	{ value: 'Orcs (1d4 + 2)', id: nanoid() },
	{ value: 'Wolves (1d4 + 2)', id: nanoid() },
	{ value: 'Owlbear (1)', id: nanoid() },
];

type Entry = { value: string, id: string };
const entriesWritable: Writable<Entry[]> = writable<Entry[]>(getInitialEntries());
export const entries$: Readable<Entry[]> = derived(entriesWritable, identity);

entriesWritable.subscribe(entries => {
	const json = JSON.stringify(entries);
	localStorage.setItem(LOCAL_STORAGE_KEY, json);
});

export function removeEntry(index: number): void {
	entriesWritable.update(entries => filter(entries, (_, i) => i !== index));
}

export function clearEntries(): void {
	entriesWritable.set([]);
}

export function addEntry(newEntry: string): void {
	entriesWritable.update(entries => {
		if (entries.length >= MAX_TABLE_LENGTH) {
			return entries;
		}
		return concat(entries, { value: newEntry.trim(), id: nanoid() });
	});
}

export function importEntries(entriesToImport: string[]): void {
	const entries = entriesToImport.map(value => ({ value, id: nanoid() }));
	entriesWritable.set(entries);
}

export function editEntry(index: number, newValue: string): void {
	entriesWritable.update(entries => {
		if (index < 0 || index >= entries.length) {
			return entries;
		}
		const updatedEntries = [...entries];
		updatedEntries[index] = { ...updatedEntries[index], value: newValue.trim() };
		return updatedEntries;
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

function getInitialEntries(): Entry[] {
	const json = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (json) {
		try {
			return JSON.parse(json) as Entry[];
		} catch (error) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_ENTRIES));
		}
	}
	return DEFAULT_ENTRIES;
}
