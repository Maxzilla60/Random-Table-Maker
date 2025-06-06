<script lang="ts">
	type SingleProps = {
		type: 'single';
		value: number | string;
	}

	type RangeProps = {
		type: 'range';
		value: [number, number];
	}

	type Props = SingleProps | RangeProps;

	const { type, value }: Props = $props();
</script>

<span>
	{#if type === 'single'}
		{value}
	{:else if type === 'range'}
		{value[0]}-{value[1]}
	{/if}
</span>
