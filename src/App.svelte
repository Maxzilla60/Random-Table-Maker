<script lang="ts">
	import { concat, filter } from 'lodash';
	import { derived, writable } from 'svelte/store';
	import DiceValue from './components/DiceValue.svelte';
	import { MAX_TABLE_LENGTH } from './util/constants';
	import { mapEntriesToRandomTable } from './util/map-entries-to-random-table';

	const entries$ = writable<string[]>([
		'Stirges (1d8 + 2)',
		'Ghouls (1d4 + 1)',
		'Ogre (1)',
		'Goblins (1d6 + 3)',
		'Hobgoblins (1d4 + 2)',
		'Orcs (1d4 + 2)',
		'Wolves (1d4 + 2)',
		'Owlbear (1)',
	]);

	const newEntryInput$ = writable<string>('');

	const table$ = derived(entries$, mapEntriesToRandomTable);

	function removeEntry(index: number): () => void {
		return () => {
			entries$.update(entries => filter(entries, (_, i) => i !== index));
		};
	}

	function addEntry(newEntry: string): (e: MouseEvent | KeyboardEvent) => void {
		return e => {
			e.preventDefault();
			entries$.update(entries => {
				if (entries.length >= MAX_TABLE_LENGTH) {
					return entries;
				}
				return concat(entries, newEntry.trim());
			});
			newEntryInput$.set('');
		};
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
				<tr>
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
						<button onclick={removeEntry(index)}>🗑️</button>
					</td>
				</tr>
			{/each}
			<tr>
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
							addEntry($newEntryInput$)(e);
						}
					}}
						type="text"
						placeholder="Add entry"
					/>
				</td>
				<td>
					<button
						onclick={addEntry($newEntryInput$)}
						disabled={$entries$.length >= MAX_TABLE_LENGTH}
					>➕
					</button>
				</td>
			</tr>
			</tbody>
		</table>
	{/if}
</main>
