<script lang="ts">
	import { concat, filter } from 'lodash';
	import { writable } from 'svelte/store';

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

	function removeEntry(index: number): () => void {
		return () => {
			table$.update(entries => filter(entries, (_, i) => i !== index));
		};
	}

	function addEntry(newEntry: string): (e: MouseEvent | KeyboardEvent) => void {
		return e => {
			e.preventDefault();
			table$.update(entries => concat(entries, newEntry.trim()));
			newEntryInput$.set('');
		};
	}
</script>

<main>
	<h1>Random Table Maker</h1>

	<table>
		<thead>
		<tr>
			<th>1d{ $table$.length }</th>
			<th>Result</th>
		</tr>
		</thead>
		<tbody>
		{#each $table$ as entry, index}
			<tr>
				<td>{index + 1}</td>
				<td>{entry}</td>
				<td>
					<button onclick={removeEntry(index)}>🗑️</button>
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
							addEntry($newEntryInput$)(e);
						}
					}}
					type="text"
					placeholder="Add entry"
				/>
			</td>
			<td>
				<button onclick={addEntry($newEntryInput$)}>➕</button>
			</td>
		</tr>
		</tbody>
	</table>
</main>
