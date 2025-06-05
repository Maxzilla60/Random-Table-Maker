import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
});
