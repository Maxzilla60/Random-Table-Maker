<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import { map } from 'lodash';
	import { derived } from 'svelte/store';
	import { mapEntriesToRandomTable } from '../lib/mapEntriesToRandomTable';
	import { entries$ } from '../state/entries';
	import { settings$, showOdds$ } from '../state/settings';

	const table$ = derived([entries$, settings$], ([entries, settings]) =>
		mapEntriesToRandomTable(map(entries, 'value'), settings),
	);
</script>

<table>
	{#if table$}
		{@const { type, diceSize, table } = $table$}
		{@const [firstDie, secondDie] = diceSize}
		{@const showOdds = $showOdds$}

		<thead use:autoAnimate>
		<tr>
			{#if type === 'solved-double' || type === 'reroll-double'}
				<th colspan="2">
					{#if firstDie === 2}
						coin
					{:else}
						d{ firstDie }
					{/if}
					{#if secondDie === 2}
						& coin
					{:else}
						& d{ secondDie }
					{/if}
					{#if type === 'reroll-double'}
						<span title={`Warning: This table has had additional 'reroll' entries added to ensure equal odds.`}>
							(⚠️)
						</span>
					{/if}
				</th>
			{:else if type === 'solved-bell' || type === 'reroll-bell'}
				<th>
					{#if firstDie === secondDie}
						2d{ firstDie }
					{:else}
						d{ firstDie } + d{ secondDie }
					{/if}
					{#if type === 'reroll-bell'}
						<span title={`Warning: This table has had additional 'reroll' entries added to ensure good distribution.`}>
							(⚠️)
						</span>
					{/if}
				</th>
			{:else if type === 'forced'}
				<th>
					d{ firstDie }
					<span title="Warning: This d100 table is 'forced' and does not have equal odds! Entries near the top of the table will have slightly higher odds (toggle on the odds in the settings).">
						(⚠️)
					</span>
				</th>
			{:else if type === 'unsolved-bell'}
				<th>not solvable</th>
			{:else}
				<th>
					d{ firstDie }
					{#if type === 'reroll-single'}
						<span title={`Warning: This table has had additional 'reroll' entries added to ensure equal odds.`}>
							(⚠️)
						</span>
					{/if}
				</th>
			{/if}
			{#if showOdds}
				<th>Odds</th>
			{/if}
			<th>
				Result
				{#if type === 'reroll-double' || type === 'reroll-bell' || type === 'reroll-single'}
					({ $entries$.length } + { table.length - $entries$.length })
				{:else}
					({ $entries$.length })
				{/if}
			</th>
		</tr>
		</thead>

		<tbody use:autoAnimate>
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
				{@const allOdds = table.map(e => e.odds)}
				{@const isForcedResult = type === 'forced' && allOdds.some(otherOdds => odds > otherOdds)}

				{@const { value, odds, result, isReroll } = entry}
				<tr>
					<td>{ value }</td>
					{#if showOdds}
						<td>
							{odds.toFixed(2)}%
							{#if isForcedResult} ⚠️{/if}
						</td>
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
