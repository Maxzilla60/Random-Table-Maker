<script lang="ts">
	import { writable } from 'svelte/store';
	import EditingTable from './components/EditingTable.svelte';
	import Settings from './components/Settings.svelte';
	import ViewOnlyTable from './components/ViewOnlyTable.svelte';

	export const editing$ = writable<boolean>(false);
</script>

<main>
	<h1>Random Table Maker</h1>

	<Settings/>

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
