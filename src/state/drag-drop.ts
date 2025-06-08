import { identity } from 'lodash';
import { derived, get, writable } from 'svelte/store';
import { reorderEntries } from './entries';

const draggingIndexWritable = writable<number | null>(null);
export const draggingIndex$ = derived(draggingIndexWritable, identity);

export function handleDragStart(event: DragEvent, index: number): void {
	draggingIndexWritable.set(index);
	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', index.toString());
	}
}

export function handleDragOver(event: DragEvent): void {
	event.preventDefault();
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = 'move';
	}
}

export function handleDrop(event: DragEvent, targetIndex: number): void {
	event.preventDefault();
	const draggingIndex = get(draggingIndexWritable);
	if (draggingIndex !== null && draggingIndex !== targetIndex) {
		reorderEntries(draggingIndex, targetIndex);
	}
	draggingIndexWritable.set(null);
}

export function handleDragEnd(): void {
	draggingIndexWritable.set(null);
}
