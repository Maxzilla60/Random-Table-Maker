<script lang="ts">
	import { map } from 'lodash';
	import { derived, writable } from 'svelte/store';
	import { mapEntriesToRandomTable } from '../lib/mapEntriesToRandomTable';
	import { mapTableToCSV } from '../lib/table-formatters/mapTableToCSV';
	import { mapTableToHTML } from '../lib/table-formatters/mapTableToHTML';
	import { mapTableToMarkdown } from '../lib/table-formatters/mapTableToMarkdown';
	import { mapTableToSimpleText } from '../lib/table-formatters/mapTableToSimpleText';
	import { mapTableToText } from '../lib/table-formatters/mapTableToText';
	import { entries$ } from '../state/entries';
	import { settings$ } from '../state/settings';
	import ViewOnlyTable from './ViewOnlyTable.svelte';

	const format$ = writable<'text' | 'simple-text' | 'markdown' | 'csv' | 'html'>('simple-text');
	const table$ = derived([entries$, settings$], ([entries, settings]) =>
		mapEntriesToRandomTable(map(entries, 'value'), settings),
	);
	const formattedTable$ = derived([table$, format$], ([table, format]) => {
		switch (format) {
			case 'simple-text':
				return mapTableToSimpleText(table);
			case 'text':
				return mapTableToText(table);
			case 'markdown':
				return mapTableToMarkdown(table);
			case 'csv':
				return mapTableToCSV(table);
			case 'html':
				const viewOnlyTable = document.getElementById('view-only-table')!;
				return mapTableToHTML(viewOnlyTable);
			default:
				return 'Error';
		}
	});

	function copyToClipboard(formattedTable: string): void {
		navigator.clipboard.writeText(formattedTable).catch(err => {
			console.error('Failed to copy: ', err);
		});
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

	<pre>{ $formattedTable$ }</pre>

	<button onclick={() => copyToClipboard($formattedTable$)}>📋 Copy</button>

	<div id="view-only-table">
		<ViewOnlyTable/>
	</div>
</details>

<style>
    #view-only-table {
        display: none;
    }
</style>
