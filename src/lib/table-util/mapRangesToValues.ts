type StartAndEnd = { start: number, end: number };

export function mapRangesToValues(ranges: number[], firstValue = 0): string[] {
	return ranges
		.reduce((values, valueRange): StartAndEnd[] => {
			const start = values.at(-1)?.end ?? firstValue;
			const end = start + valueRange;

			return [
				...values,
				{
					start: start + 1,
					end,
				},
			];
		}, [] as StartAndEnd[])
		.map(({ start, end }: StartAndEnd) => start === end ? `${start}` : `${start}-${end}`);
}
