<script lang="ts">
	import { derived, writable } from 'svelte/store';
	import { MAX_TABLE_LENGTH } from './lib/constants';
	import { mapEntriesToRandomTable } from './lib/mapEntriesToRandomTable';
	import type { Settings } from './lib/types';
	import { draggingIndex$, handleDragEnd, handleDragOver, handleDragStart, handleDrop } from './state/drag-drop';
	import { addEntry, entries$, removeEntry } from './state/entries';

	const enableDCCDice$ = writable<boolean>(false);
	const enableD2$ = writable<boolean>(true);
	const preferLargerDice$ = writable<boolean>(false);
	const mode$ = writable<Settings['mode']>('forced');

	const showOdds$ = writable<boolean>(false);
	const showReorder$ = writable<boolean>(false);

	const table$ = derived([entries$, enableDCCDice$, enableD2$, preferLargerDice$, mode$], ([entries, enableDCCDice, enableD2, preferLargerDice, mode]) =>
		mapEntriesToRandomTable(entries, { enableDCCDice, enableD2, preferLargerDice, mode }),
	);
	const newEntryInput$ = writable<string>('');
</script>

<main>
	<h1>Random Table Maker</h1>

	<details>
		<summary>⚙️ Settings</summary>
		<label>
			<input type="checkbox" bind:checked={$enableD2$}/>
			Use d2 die (A.K.A. coin)
		</label><br/>
		<label>
			<input type="checkbox" bind:checked={$enableDCCDice$}/>
			Use Dungeon Crawl Classics dice (d3, d5, d7, d14, d16, d24, d30)
		</label><br/>
		<label>
			<input type="checkbox" bind:checked={$preferLargerDice$}/>
			Prefer larger dice
		</label><br/>
		<label>
			<input type="checkbox" bind:checked={$showOdds$}/>
			Show Odds
		</label><br/>
		<label>
			<input type="checkbox" bind:checked={$showReorder$}/>
			Reorder
		</label>
		<fieldset>
			<legend>Dice distribution mode</legend>

			<p>Since not all table sizes can be equally distributed to dice, this application will do its best to do so in two ways:</p>

			<label>
				<input type="radio" bind:group={$mode$} value="forced"/>
				<b>Forced:</b> Spread to a d100, causes entries near the top of the table to have slightly higher odds (toggle on the odds in the settings).
			</label><br/>

			<label>
				<input type="radio" bind:group={$mode$} value="reroll"/>
				<b>Reroll:</b> Will add "reroll" entries to the table to make it fit equally distributed dice size(s).
			</label>
		</fieldset>
	</details>

	{#if $table$}
		{@const { diceSize, type, table } = $table$}
		{@const [firstDie, secondDie] = diceSize}

		<table>
			<thead>
			<tr>
				{#if $showReorder$}
					<th>Reorder</th>
				{/if}
				{#if !$showReorder$}
					<th colspan={secondDie ? 2 : 1}>
						{#if firstDie === 2}
							coin
						{:else}
							d{ firstDie }
						{/if}
						{#if secondDie}
							{#if secondDie === 2}
								& coin
							{:else}
								& d{ secondDie }
							{/if}
						{/if}
						{#if type === 'forced'}
						<span title="Warning: This d100 table is 'forced' and does not have equal odds! Entries near the top of the table will have slightly higher odds (toggle on the odds in the settings).">
							(⚠️)
						</span>
						{/if}
						{#if type === 'reroll-single' || type === 'reroll-double'}
						<span title={`Warning: This table has had additional 'reroll' entries added to ensure equal odds.`}>
							(⚠️)
						</span>
						{/if}
					</th>
				{/if}
				{#if $showOdds$}
					<th>Odds</th>
				{/if}
				<th>Result ({ $entries$.length })</th>
				<th>Delete</th>
			</tr>
			</thead>

			<tbody>
			{#if type === 'solved-double' || type === 'reroll-double'}
				{#each table as entry, index}
					{@const { firstValue, secondValue, rowspan, odds, result, isReroll } = entry}
					{#if !(isReroll && $showReorder$)}
						<tr
							class={$draggingIndex$ === index ? 'dragging' : ''}
							ondragover={handleDragOver}
							ondrop={e => handleDrop(e, index)}
						>
							{#if $showReorder$}
								<td
									draggable="true"
									ondragstart={e => handleDragStart(e, index)}
									ondragend={handleDragEnd}
								>
									↕️
								</td>
							{/if}
							{#if !$showReorder$ && rowspan}
								<td rowspan={rowspan}>{ firstValue }</td>
							{/if}
							{#if $showReorder$}
								<td>{ secondValue }</td>
							{/if}
							{#if $showOdds$}
								<td>{odds.toFixed(2)}%</td>
							{/if}
							<td
								style:font-style={isReroll ? 'italic' : 'initial'}
								colspan={isReroll ? 2 : 1}
							>
								{result}
							</td>
							{#if !isReroll}
								<td>
									<button onclick={() => removeEntry(index)}>🗑️</button>
								</td>
							{/if}
						</tr>
					{/if}
				{/each}
			{:else}
				{#each table as entry, index}
					{@const { value, odds, result, isReroll } = entry}
					{#if !(isReroll && $showReorder$)}
						<tr
							class={$draggingIndex$ === index ? 'dragging' : ''}
							ondragover={handleDragOver}
							ondrop={e => handleDrop(e, index)}
						>
							{#if $showReorder$}
								<td
									draggable="true"
									ondragstart={e => handleDragStart(e, index)}
									ondragend={handleDragEnd}
								>
									↕️
								</td>
							{/if}
							{#if !$showReorder$}
								<td>{ value }</td>
							{/if}
							{#if $showOdds$}
								<td>{odds.toFixed(2)}%</td>
							{/if}
							<td
								style:font-style={isReroll ? 'italic' : 'initial'}
								colspan={isReroll ? 2 : 1}
							>
								{result}
							</td>
							{#if !isReroll}
								<td>
									<button onclick={() => removeEntry(index)}>🗑️</button>
								</td>
							{/if}
						</tr>
					{/if}
				{/each}
			{/if}
			<tr>
				<td></td>
				{#if secondDie}
					<td></td>
				{/if}
				{#if $showOdds$}
					<td></td>
				{/if}
				<td>
					<input
						bind:value={$newEntryInput$}
						onkeydown={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								addEntry($newEntryInput$);
								newEntryInput$.set('');
							}
						}}
						type="text"
						placeholder="Add entry"
					/>
				</td>
				<td>
					<button
						onclick={() => {
							addEntry($newEntryInput$);
							newEntryInput$.set('');
						}}
						disabled={$entries$.length >= MAX_TABLE_LENGTH}
					>
						➕
					</button>
				</td>
			</tr>
			</tbody>
		</table>
	{/if}
</main>

<style>
    tr.dragging {
        opacity: 0.5;
        background-color: cadetblue;
    }

    tr[draggable=true] {
        cursor: move;
    }
</style>
