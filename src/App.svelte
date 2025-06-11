<script lang="ts">
	import { writable } from 'svelte/store';
	import EditingTable from './components/EditingTable.svelte';
	import ImportEntries from './components/ImportEntries.svelte';
	import Settings from './components/Settings.svelte';
	import ViewOnlyTable from './components/ViewOnlyTable.svelte';

	const editing$ = writable<boolean>(false);
</script>

<main>
	<h1>Random Table Maker</h1>

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
</main>
