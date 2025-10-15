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

	<label id="edit-table-toggle">
		<input type="checkbox" bind:checked={$editing$}/>
		✏️ Edit table
	</label>

	{#if $editing$}
		<EditingTable/>
	{:else}
		<ViewOnlyTable/>
	{/if}

	<ExportTable/>
</main>
<footer>
	💛 made by
	<a href="https://linktr.ee/HungryMaxzilla" rel="noreferrer noopener" target="_blank">Maxzilla</a>
</footer>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Averia+Serif+Libre&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap');

    * {
        font-family: "Averia Serif Libre", serif;
    }

    h1 {
        font-family: "UnifrakturCook", serif;
        text-align: center;
        font-size: 3rem;
        padding: 0;
        margin-bottom: 1rem;
    }

    #edit-table-toggle {
        display: block;
        font-weight: bold;
        padding: .6rem 1rem;
        margin-bottom: 1rem;
        background: var(--nc-bg-2);
        border: 1px solid var(--nc-bg-3);
        border-radius: 4px;
    }

    footer {
        text-align: center;
        font-size: smaller;
    }
</style>
