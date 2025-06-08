export function greatestCommonDivisor(k: number, n: number): number {
	return k ? greatestCommonDivisor(n % k, k) : n;
}
