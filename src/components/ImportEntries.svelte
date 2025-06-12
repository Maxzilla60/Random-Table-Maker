<script lang="ts">
	import { isEmpty, negate, trim } from 'lodash';
	import { writable } from 'svelte/store';
	import { MAX_TABLE_LENGTH } from '../lib/constants.js';
	import { importEntries } from '../lib/state/entries';

	const importText$ = writable<string>('');

	function parseAndImport(text: string): void {
		const entries = text.split('\n')
			.map(trim)
			.filter(negate(isEmpty));
		if (entries.length < MAX_TABLE_LENGTH) {
			importEntries(entries);
			importText$.set('');
			document.getElementById('import-details')?.removeAttribute('open');
		}
	}
</script>

<details id="import-details">
	<summary>📥 Import</summary>
	<p>Will import each line as an entry. This will
		<b>override</b> the current table! Also, keep in mind the maximum table size is {MAX_TABLE_LENGTH}.</p>
	<textarea
		placeholder="Paste your entries here, one per line"
		bind:value={$importText$}
	></textarea>
	<button onclick={() => parseAndImport($importText$)}>
		📥 Import
	</button>
</details>

<style>
    textarea {
        width: 100%;
        height: 20em;
    }
</style>
