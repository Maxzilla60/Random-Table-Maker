<script lang="ts">
	import { derived, get, writable } from 'svelte/store';
	import DiceValue from './components/DiceValue.svelte';
	import { addEntry, entries$, removeEntry, reorderEntries } from './state/entries';
	import { MAX_TABLE_LENGTH } from './util/constants';
	import { mapEntriesToRandomTable } from './util/map-entries-to-random-table';

	const table$ = derived(entries$, mapEntriesToRandomTable);
	const newEntryInput$ = writable<string>('');
	const draggingIndex$ = writable<number | null>(null);

	function handleDragStart(event: DragEvent, index: number): void {
		draggingIndex$.set(index);
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', index.toString());
		}
	}

	function handleDragOver(event: DragEvent): void {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDrop(event: DragEvent, targetIndex: number): void {
		event.preventDefault();
		const draggingIndex = get(draggingIndex$);
		if (draggingIndex !== null && draggingIndex !== targetIndex) {
			reorderEntries(draggingIndex, targetIndex);
		}
		draggingIndex$.set(null);
	}

	function handleDragEnd(): void {
		draggingIndex$.set(null);
	}
</script>

<main>
	<h1>Random Table Maker</h1>

	{#if $table$}
		{@const { diceSize, table } = $table$}
		{@const [firstDie, secondDie] = diceSize}
		<table>
			<thead>
			<tr>
				<th>Reorder</th>
				<th colspan={secondDie ? 2 : 1}>
					{#if firstDie === 2}
						coin
					{:else}
						d{ firstDie }
					{/if}
					{#if secondDie}
						{#if secondDie === 2}
							& coin
						{:else}
							& d{ secondDie }
						{/if}
					{/if}
				</th>
				<th>Odds</th>
				<th>Result ({ $entries$.length })</th>
			</tr>
			</thead>
			<tbody>
			{#each table as entry, index}
				{@const { value, secondValue, odds, result } = entry}
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
					<td>
						<DiceValue value={value}/>
					</td>
					{#if secondValue}
						<td>
							<DiceValue value={secondValue}/>
						</td>
					{/if}
					<td>{odds.toFixed(2)}%</td>
					<td>{result}</td>
					<td>
						<button onclick={() => removeEntry(index)}>🗑️</button>
					</td>
				</tr>
			{/each}
			<tr>
				<td></td>
				<td></td>
				{#if secondDie}
					<td></td>
				{/if}
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
					>➕
					</button>
				</td>
			</tr>
			</tbody>
		</table>
	{/if}
</main>

<style>
    tr.dragging {
        opacity: 0.5;
        background-color: cadetblue;
    }

    tr[draggable="true"] {
        cursor: move;
    }
</style>
