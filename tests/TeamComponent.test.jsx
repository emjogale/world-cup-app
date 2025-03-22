import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Teams from '../src/components/Teams';
import { beforeEach, afterEach } from 'vitest';

// mock teams data
const mockTeams = [
	{ name: 'Brazil', flag: 'https://flagpedia.net/data/flags/w320/br.png' },
	{ name: 'Germany', flag: 'https://flagpedia.net/data/flags/w320/de.png' }
];

beforeEach(() => {
	globalThis.fetch = vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(mockTeams)
		})
	);
});
afterEach(() => {
	vi.restoreAllMocks();
});

describe('Team component', () => {
	it('renders team names from fetch', async () => {
		render(<Teams />);

		expect(await screen.findByText('Brazil')).toBeInTheDocument();
	});
});
