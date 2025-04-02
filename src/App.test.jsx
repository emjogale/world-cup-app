import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App component', () => {
	it('shows qualifiers before the tournament starts', async () => {
		render(<App />);

		// should show the text button
		expect(screen.getByRole('button', { name: /start tournament/i }))
			.toBeInTheDocument;
	});

	it.skip('shows the group stage after clicking start', async () => {
		render(<App />);
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		fireEvent.click(startBtn);

		// should now show group stage based on GroupStage headings/group names
		expect(await screen.findByText(/Group A/i)).toBeInTheDocument();
	});
});
