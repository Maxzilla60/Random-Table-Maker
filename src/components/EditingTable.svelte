<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { MAX_TABLE_LENGTH } from '../lib/constants.js';
	import { addEntry, entries$, removeEntry, reorderEntries } from '../state/entries.js';

	const newEntryInput$ = writable<string>('');

	const draggingIndex$ = writable<number | null>(null);

	export function handleDragStart(event: DragEvent, index: number): void {
		draggingIndex$.set(index);
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
		const draggingIndex = get(draggingIndex$);
		if (draggingIndex !== null && draggingIndex !== targetIndex) {
			reorderEntries(draggingIndex, targetIndex);
		}
		draggingIndex$.set(null);
	}

	export function handleDragEnd(): void {
		draggingIndex$.set(null);
	}

</script>

<table>
	<thead>
	<tr>
		<th>Reorder</th>
		<th>Result ({ $entries$.length })</th>
		<th>Delete</th>
	</tr>
	</thead>

	<tbody>
	{#each $entries$ as entry, index}
		<tr
			class={$draggingIndex$ === index ? 'dragging' : ''}
			ondragover={handleDragOver}
			ondrop={e => handleDrop(e, index)}
		>
			<td
				draggable="true"
				ondragstart={e => handleDragStart(e, index)}
				ondragend={handleDragEnd}
			>
				↕️
			</td>
			<td>{entry}</td>
			<td>
				<button onclick={() => removeEntry(index)}>🗑️</button>
			</td>
		</tr>
	{/each}
	<tr>
		<td></td>
		<td>
			<input
				bind:value={$newEntryInput$}
				onkeydown={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								addEntry($newEntryInput$);
								newEntryInput$.set('');
							}
						}}
				type="text"
				placeholder="Add entry"
			/>
		</td>
		<td>
			<button
				onclick={() => {
							addEntry($newEntryInput$);
							newEntryInput$.set('');
						}}
				disabled={$entries$.length >= MAX_TABLE_LENGTH}
			>
				➕
			</button>
		</td>
	</tr>
	</tbody>
</table>

<style>
    tr.dragging {
        opacity: 0.5;
        background-color: cadetblue;
    }

    tr[draggable=true] {
        cursor: move;
    }
</style>
