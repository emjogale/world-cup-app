import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AllRegionalQualifiers from './AllRegionalQualifiers';
import { mockTeams } from '../../test-utils/mockTeams';
import {
	mockRegions,
	getMinimalMockRegion
} from '../../test-utils/mockRegions';
import { MockTeamsProvider } from '../../test-utils/MockTeamsProvider';
import userEvent from '@testing-library/user-event';

describe('AllRegionalQualifiers', () => {
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

	it('qualifies 1 team from Test Region with 3 teams', async () => {
		const { teams, regions } = getMinimalMockRegion({
			teamNames: ['Alpha', 'Bravo', 'Charlie'],
			spots: 1
		});

		render(
			<MockTeamsProvider teams={teams} regions={regions}>
				<AllRegionalQualifiers />
			</MockTeamsProvider>
		);

		// get the test region name
		const regionName = regions[0].region;
		const regionTestId = `regional-qualifiers-${regionName.toLowerCase()}`;
		console.log('regionTestId is', regionTestId);

		// Find the regional qualifiers section by data-testid
		const regionSection = await screen.findByTestId(regionTestId);
		expect(regionSection).toBeInTheDocument();

		// Optionally check if all teams are shown
		for (const team of teams) {
			expect(screen.getAllByText(team.name).length > 0);
		}
		//TODO: update these so they use dataTestid instead of getByLabelText? Or something like that

		// Fill in scores to make Alpha the clear winner
		// 	const alphaVsBravoInput = screen.getByLabelText(/Alpha vs Bravo/i);
		// 	const bravoVsAlphaInput = screen.getByLabelText(/Bravo vs Alpha/i);
		// 	await userEvent.type(alphaVsBravoInput, '2');
		// 	await userEvent.type(bravoVsAlphaInput, '0');

		// 	const alphaVsCharlieInput = screen.getByLabelText(/Alpha vs Charlie/i);
		// 	const charlieVsAlphaInput = screen.getByLabelText(/Charlie vs Alpha/i);
		// 	await userEvent.type(alphaVsCharlieInput, '1');
		// 	await userEvent.type(charlieVsAlphaInput, '0');

		// 	const bravoVsCharlieInput = screen.getByLabelText(/Bravo vs Charlie/i);
		// 	const charlieVsBravoInput = screen.getByLabelText(/Charlie vs Bravo/i);
		// 	await userEvent.type(bravoVsCharlieInput, '1');
		// 	await userEvent.type(charlieVsBravoInput, '1');

		// 	// Click submit button for the region
		// 	const submitButton = screen.getByRole('button', {
		// 		name: /submit test region/i
		// 	});
		// 	await userEvent.click(submitButton);

		// 	// Wait for the qualified line
		// 	await waitFor(() => {
		// 		expect(screen.getByText(/qualified:/i)).toBeInTheDocument();
		// 		expect(screen.getByText(/alpha/i)).toBeInTheDocument();
		// 	});

		// 	// Optional: ensure only 1 team is shown as qualified
		// 	const qualifiedLine = screen.getByText(/qualified:/i);
		// 	expect(qualifiedLine.textContent.match(/alpha/i).length).toBe(1);
	});
});
