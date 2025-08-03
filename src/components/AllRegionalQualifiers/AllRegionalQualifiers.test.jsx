import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AllRegionalQualifiers from './AllRegionalQualifiers';
import { mockTeams } from '../../test-utils/mockTeams';
import { mockRegions } from '../../test-utils/mockRegions';
import { MockTeamsProvider } from '../../test-utils/MockTeamsProvider';

// mock global fetch
beforeEach(() => {
	globalThis.fetch = vi.fn((url) => {
		if (url.includes('regions.json')) {
			return Promise.resolve({
				json: () => Promise.resolve(mockRegions)
			});
		}
		if (url.includes('teams.json')) {
			return Promise.resolve({ json: () => Promise.resolve(mockTeams) });
		}
		return Promise.reject(new Error('unknown fetch url'));
	});
});

afterEach(() => {
	vi.resetAllMocks();
});
describe('AllRegionalQualifiers', () => {
	console.log('DEBUG: regions =', mockRegions);
	it('renders a regional qualifier for each region', async () => {
		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<AllRegionalQualifiers
					regions={mockRegions}
					allTeams={mockTeams}
					onComplete={vi.fn()}
				/>
			</MockTeamsProvider>
		);
		//should see one heading per region
		for (const region of mockRegions) {
			await waitFor(() => {
				expect(
					screen.getByText(
						new RegExp(`${region.region}\\s*qualifiers`, 'i')
					)
				).toBeInTheDocument();
			});
		}
	});
});
