<script lang="ts">
	import { derived, get, writable } from 'svelte/store';
	import DiceValue from './components/DiceValue.svelte';
	import { addEntry, entries$, removeEntry, reorderEntries } from './state/entries';
	import { MAX_TABLE_LENGTH } from './util/constants';
	import { mapEntriesToRandomTable } from './util/map-entries-to-random-table';

	const table$ = derived(entries$, mapEntriesToRandomTable);
	const newEntryInput$ = writable<string>('');
	const draggingIndex$ = writable<number | null>(null);

	const showOdds$ = writable<boolean>(false);
	const showReorder$ = writable<boolean>(false);

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

	<details>
		<summary>⚙️ Settings</summary>
		<label>
			Show Odds
			<input type="checkbox" bind:checked={$showOdds$}/>
		</label><br/>
		<label>
			Reorder
			<input type="checkbox" bind:checked={$showReorder$}/>
		</label>
	</details>

	{#if $table$}
		{@const { diceSize, table } = $table$}
		{@const [firstDie, secondDie] = diceSize}
		<table>
			<thead>
			<tr>
				{#if $showReorder$}
					<th>Reorder</th>
				{/if}
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
				{#if $showOdds$}
					<th>Odds</th>
				{/if}
				<th>Result ({ $entries$.length })</th>
				<th>Delete</th>
			</tr>
			</thead>

			<tbody>
			{#each table as entry, index}
				{@const { value, secondValue, rowspan, odds, result } = entry}
				<tr
					class={$draggingIndex$ === index ? 'dragging' : ''}
					ondragover={handleDragOver}
					ondrop={e => handleDrop(e, index)}
				>
					{#if $showReorder$}
						<td
							draggable="true"
							ondragstart={e => handleDragStart(e, index)}
							ondragend={handleDragEnd}
						>
							↕️
						</td>
					{/if}
					{#if value}
						<td rowspan={rowspan}>
							<DiceValue value={value}/>
						</td>
					{/if}
					{#if secondValue}
						<td>
							<DiceValue value={secondValue}/>
						</td>
					{/if}
					{#if $showOdds$}
						<td>{odds.toFixed(2)}%</td>
					{/if}
					<td>{result}</td>
					<td>
						<button onclick={() => removeEntry(index)}>🗑️</button>
					</td>
				</tr>
			{/each}
			<tr>
				{#if $showReorder$}
					<td></td>
				{/if}
				<td></td>
				{#if secondDie}
					<td></td>
				{/if}
				{#if $showOdds$}
					<td></td>
				{/if}
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
