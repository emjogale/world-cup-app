import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../src/App';

// 👇 Mock fetch before each test
beforeEach(() => {
	globalThis.fetch = vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () =>
				Promise.resolve([
					{ name: 'Argentina', flag: '🇦🇷' },
					{ name: 'Brazil', flag: '🇧🇷' },
					{ name: 'Canada', flag: '🇨🇦' },
					{ name: 'Germany', flag: '🇩🇪' },
					{ name: 'France', flag: '🇫🇷' },
					{ name: 'Japan', flag: '🇯🇵' },
					{ name: 'Morocco', flag: '🇲🇦' },
					{ name: 'Spain', flag: '🇪🇸' }
				])
		})
	);
});

describe('App component', () => {
	it('shows qualifiers before the tournament starts', async () => {
		render(<App />);

		expect(
			await screen.findByRole('button', { name: /start tournament/i })
		).toBeInTheDocument();
	});

	it('shows the group stage after clicking start', async () => {
		render(<App />);
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		fireEvent.click(startBtn);

		// ✅ Wait for Group A heading to appear
		await waitFor(() => {
			expect(screen.getByText(/Group A/i)).toBeInTheDocument();
		});
	});
});
