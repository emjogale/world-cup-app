import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Qualifiers from './Qualifiers';
import { beforeEach, afterEach } from 'vitest';
import { mockFetchTeams } from '../../test-utils/mockFetchTeams';
import { mockTeams } from '../../test-utils/mockTeams';
import { TeamsProvider } from '../../context/TeamsProvider';

beforeEach(() => {
	mockFetchTeams();
});

describe('Qualifiers component - fetch scenarios', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders team names from fetch', async () => {
		// success case
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockTeams)
			})
		);
		render(
			<TeamsProvider>
				<Qualifiers />
			</TeamsProvider>
		);

		expect(globalThis.fetch).toHaveBeenCalled();
		expect(globalThis.fetch).toHaveBeenCalledWith('/teams.json');
		expect(await screen.findByText(mockTeams[0].name)).toBeInTheDocument();
	});

	it('❌ handles fetch failure when res.ok is false', async () => {
		globalThis.fetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
				status: 404
			})
		);
	});
});
