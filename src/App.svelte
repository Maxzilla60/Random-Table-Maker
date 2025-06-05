<script lang="ts">
	import { concat, filter } from 'lodash';
	import { writable } from 'svelte/store';

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

	const newEntry$ = writable<string>('');

	function removeEntry(index: number): () => void {
		return () => {
			entries$.update(entries => filter(entries, (_, i) => i !== index));
		};
	}

	function addEntry(entry: string): (e: MouseEvent | KeyboardEvent) => void {
		return e => {
			e.preventDefault();
			entries$.update(entries => concat(entries, entry.trim()));
			newEntry$.set('');
		};
	}
</script>

<main>
	<h1>Random Table Maker</h1>

	<table>
		<thead>
		<tr>
			<th>1d{ $entries$.length }</th>
			<th>Result</th>
		</tr>
		</thead>
		<tbody>
		{#each $entries$ as entry, index}
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
					bind:value={$newEntry$}
					onkeydown={e => {
						if (e.key === 'Enter') {
							addEntry($newEntry$)(e);
						}
					}}
					type="text"
					placeholder="Add entry"
				/>
			</td>
			<td>
				<button onclick={addEntry($newEntry$)}>➕</button>
			</td>
		</tr>
		</tbody>
	</table>
</main>
