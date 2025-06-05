import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		silent: true,
		reporters: [
			[
				'default',
				{
					summary: false
				}
			]
		],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['tests/setup.js'],
		include: ['src/**/*.test.{js,jsx}'],
		passWithNoTests: false,
		snapshotFormat: {
			printBasicPrototype: false
		},
		snapshotOptions: {
			dir: '__snapshots__' // default
		},
		update: false,
		coverage: {
			reporter: ['text', 'html'],
			all: true,
			include: ['src'],
			exclude: [
				'node_modules/',
				'src/assets/',
				'**/*.test.{js,jsx}',
				'src/test-utils/**',
				'src/main.jsx'
			]
		},
		logHeapUsage: false
	}
});
