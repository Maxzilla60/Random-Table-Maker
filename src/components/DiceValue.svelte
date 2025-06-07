<script lang="ts">
	import { isArray } from 'lodash';

	type Props = {
		value: number | string | [number, number];
	}

	const { value }: Props = $props();
</script>

<span>
	{#if isArray(value)}
		{value[0]}-{value[1]}
	{:else }
		{value}
	{/if}
</span>
