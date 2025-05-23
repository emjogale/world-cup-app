import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()], // ✅ Enables JSX support
	test: {
		setupFiles: './setupTests.js',
		globals: true,
		environment: 'jsdom' // ✅ Allows testing JSX components
	}
});
