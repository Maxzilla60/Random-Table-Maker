type StartAndEnd = { start: number, end: number };

export function mapRangesToValues(ranges: number[]): string[] {
	return ranges
		.reduce((values, valueRange): StartAndEnd[] => {
			const start = values.at(-1)?.end ?? 0;
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
