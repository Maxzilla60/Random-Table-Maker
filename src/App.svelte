<script lang="ts">
	import { writable } from 'svelte/store';
	import EditingTable from './components/EditingTable.svelte';
	import ExportTable from './components/ExportTable.svelte';
	import ImportEntries from './components/ImportEntries.svelte';
	import Settings from './components/Settings.svelte';
	import ViewOnlyTable from './components/ViewOnlyTable.svelte';
	import { MAX_TABLE_LENGTH } from './lib/constants';

	const editing$ = writable<boolean>(false);
</script>

<main>
	<h1>Random Table Maker</h1>

	<details>
		<summary>ℹ️ About</summary>

		<p>Wanna make a random table but don't wanna figure out what die would be best for it? Wanna make a table with a lot of entries and don't want to do the math? This tool is for you!</p>

		<p>
			<b>Random Table Maker</b> will take your entries and do its best to figure out which die or dice combination is best for rolling the given table length and settings!
		</p>

		<p>Maximum allowed table length is <b>{ MAX_TABLE_LENGTH }</b>.</p>
	</details>

	<Settings/>

	<ImportEntries/>

	<label>
		<input type="checkbox" bind:checked={$editing$}/>
		Edit table
	</label>

	{#if $editing$}
		<EditingTable/>
	{:else}
		<ViewOnlyTable/>
	{/if}

	<ExportTable/>
</main>
