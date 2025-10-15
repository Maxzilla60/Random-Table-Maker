<script lang="ts">
	import { derived, writable } from 'svelte/store';
	import { entries$ } from '../lib/state/entries';
	import { table$ } from '../lib/state/table';
	import { mapTableToCSV } from '../lib/table-formatters/mapTableToCSV';
	import { mapTableToHTML } from '../lib/table-formatters/mapTableToHTML';
	import { mapTableToMarkdown } from '../lib/table-formatters/mapTableToMarkdown';
	import { mapTableToSimpleText } from '../lib/table-formatters/mapTableToSimpleText';
	import { mapTableToText } from '../lib/table-formatters/mapTableToText';
	import ViewOnlyTable from './ViewOnlyTable.svelte';

	const format$ = writable<'text' | 'simple-text' | 'markdown' | 'csv' | 'html'>('simple-text');
	const formattedTable$ = derived([table$, entries$, format$], ([table, entries, format]) => {
		switch (format) {
			case 'simple-text':
				return mapTableToSimpleText(table);
			case 'text':
				return mapTableToText(table);
			case 'markdown':
				return mapTableToMarkdown(table, entries.length);
			case 'csv':
				return mapTableToCSV(table, entries.length);
			case 'html':
				const viewOnlyTable = document.getElementById('view-only-table')!;
				return mapTableToHTML(viewOnlyTable);
			default:
				return 'Error';
		}
	});

	const copied$ = writable(false);
	formattedTable$.subscribe(() => copied$.set(false));

	function copyToClipboard(formattedTable: string): void {
		navigator.clipboard.writeText(formattedTable)
			.catch(err => console.error('Failed to copy: ', err))
			.then(() => copied$.set(true));
	}
</script>

<details>
	<summary>📤 Export</summary>
	<label>
		<input type="radio" bind:group={$format$} value="text"/>
		Plain text
	</label><br/>
	<label>
		<input type="radio" bind:group={$format$} value="simple-text"/>
		Simple text (same formatting as import)
	</label><br/>
	<label>
		<input type="radio" bind:group={$format$} value="markdown"/>
		Markdown
	</label><br/>
	<label>
		<input type="radio" bind:group={$format$} value="csv"/>
		CSV
	</label><br/>
	<label>
		<input type="radio" bind:group={$format$} value="html"/>
		HTML
	</label>

	<output>{ $formattedTable$ }</output>

	<button onclick={() => copyToClipboard($formattedTable$)}>
		{#if $copied$}
			✅ Copied!
		{:else}
			📋 Copy
		{/if}
	</button>

	<div id="view-only-table">
		<ViewOnlyTable/>
	</div>
</details>

<style>
    output {
        display: block;
        font-family: var(--nc-font-mono), monospace;
        white-space: pre;
        font-size: .9rem;
        border: 1px solid var(--nc-bg-3);
        border-radius: 4px;
        padding: 1rem 1.4rem;
    }

    #view-only-table {
        display: none;
    }
</style>
