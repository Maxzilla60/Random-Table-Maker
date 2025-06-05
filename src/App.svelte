<script lang="ts">
	import { concat, filter } from 'lodash';
	import { derived, writable } from 'svelte/store';
	import DiceValue from './components/DiceValue.svelte';
	import { MAX_TABLE_LENGTH } from './util/constants';
	import { getDiceOddsForTable } from './util/get-dice-odds-for-table';
	import { getDiceSizeForTable } from './util/get-dice-size-for-table';
	import { getDiceValuesForTable } from './util/get-dice-values-for-table';

	const table$ = writable<string[]>([
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

	const diceSize$ = derived(table$, getDiceSizeForTable);
	const values$ = derived([table$, diceSize$], ([table, diceSize]) => getDiceValuesForTable(table, diceSize));
	const odds$ = derived([values$, diceSize$], ([values, diceSize]) => getDiceOddsForTable(values, diceSize));

	function removeEntry(index: number): () => void {
		return () => {
			table$.update(entries => filter(entries, (_, i) => i !== index));
		};
	}

	function addEntry(newEntry: string): (e: MouseEvent | KeyboardEvent) => void {
		return e => {
			e.preventDefault();
			table$.update(entries => {
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

	<table>
		<thead>
		<tr>
			<th>1d{ $diceSize$ }</th>
			<th>Odds</th>
			<th>Result</th>
		</tr>
		</thead>
		<tbody>
		{#each $table$ as entry, index}
			<tr>
				<td>
					<DiceValue type={$values$.type} value={$values$.values[index]}/>
				</td>
				<td>{$odds$[index].toFixed(2)}%</td>
				<td>{entry}</td>
				<td>
					<button onclick={removeEntry(index)}>🗑️</button>
				</td>
			</tr>
		{/each}
		<tr>
			<td></td>
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
					disabled={$table$.length >= MAX_TABLE_LENGTH}
				>➕
				</button>
			</td>
		</tr>
		</tbody>
	</table>
</main>
