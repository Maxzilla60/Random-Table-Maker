<script lang="ts">
	import { derived } from 'svelte/store';
	import { mapEntriesToRandomTable } from '../lib/mapEntriesToRandomTable';
	import { entries$ } from '../state/entries';
	import { settings$, showOdds$ } from '../state/settings';

	const table$ = derived([entries$, settings$], ([entries, settings]) =>
		mapEntriesToRandomTable(entries, settings),
	);
</script>

<table>
	{#if table$}
		{@const { type, diceSize, table } = $table$}
		{@const [firstDie, secondDie] = diceSize}
		{@const showOdds = $showOdds$}
		<thead>
		<tr>
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
			{#if showOdds}
				<th>Odds</th>
			{/if}
			<th>Result ({ table.length })</th>
		</tr>
		</thead>

		<tbody>
		{#if type === 'solved-double' || type === 'reroll-double'}
			{#each table as entry}
				{@const { firstValue, secondValue, rowspan, odds, result, isReroll } = entry}
				<tr>
					{#if rowspan}
						<td rowspan={rowspan}>{ firstValue }</td>
					{/if}
					<td>{ secondValue }</td>
					{#if showOdds}
						<td>{odds.toFixed(2)}%</td>
					{/if}
					<td
						style:font-style={isReroll ? 'italic' : 'initial'}
						colspan={isReroll ? 2 : 1}
					>
						{result}
					</td>
				</tr>
			{/each}
		{:else}
			{#each table as entry}
				{@const { value, odds, result, isReroll } = entry}
				<tr>
					<td>{ value }</td>
					{#if showOdds}
						<td>{odds.toFixed(2)}%</td>
					{/if}
					<td
						style:font-style={isReroll ? 'italic' : 'initial'}
						colspan={isReroll ? 2 : 1}
					>
						{result}
					</td>
				</tr>
			{/each}
		{/if}
		</tbody>
	{/if}
</table>
