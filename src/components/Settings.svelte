<script lang="ts">
	import { enableD2$, enableDCCDice$, mode$, preferLargerDice$, showOdds$ } from '../lib/state/settings';
</script>

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

		<p style:margin-top="1rem">There's also the following mode:</p>

		<label>
			<input type="radio" bind:group={$mode$} value="bell"/>
			<b>Bell Curve:</b> Uses a bell curve distribution to spread the entries, which means that entries near the middle of the table will have higher odds than those at the edges.
			Will work similarly to the "Reroll" mode if it cannot find a fitting dice combination. Tables with 40 or more entries are not solvable.
		</label>
	</fieldset>
</details>
