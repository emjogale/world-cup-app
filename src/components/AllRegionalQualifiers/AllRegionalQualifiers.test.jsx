import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AllRegionalQualifiers from './AllRegionalQualifiers';
import { mockTeams } from '../../test-utils/mockTeams';
import {
	mockRegions,
	getMinimalMockRegion
} from '../../test-utils/mockRegions';
import { MockTeamsProvider } from '../../test-utils/MockTeamsProvider';
import userEvent from '@testing-library/user-event';
import { handleGroupSubmitHelper } from '../../utils/groupHelpers';

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

	it('submits group matches for Asia mock teams', () => {
		const matchesToDisplay = [
			{
				id: 'Bravo-vs-Alpha',
				team1: 'Bravo',
				team2: 'Alpha',
				played: false
			},
			{
				id: 'Alpha-vs-Charlie',
				team1: 'Alpha',
				team2: 'Charlie',
				played: false
			},
			{
				id: 'Bravo-vs-Charlie',
				team1: 'Bravo',
				team2: 'Charlie',
				played: false
			}
		];

		const scores = {
			'Bravo-vs-Alpha': { score1: '2', score2: '0' },
			'Alpha-vs-Charlie': { score1: '1', score2: '0' },
			'Bravo-vs-Charlie': { score1: '1', score2: '1' }
		};

		const currentStats = {
			Bravo: {
				name: 'Bravo',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			},
			Alpha: {
				name: 'Alpha',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			},
			Charlie: {
				name: 'Charlie',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			}
		};

		const { newStatsByName } = handleGroupSubmitHelper({
			matchesToDisplay,
			scores,
			currentStats
		});
		console.log('updated stats are: ', newStatsByName);
		expect(newStatsByName.Bravo.points).toBe(4); // Example assertion
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

		const regionName = regions[0].region;
		const regionTestId = `regional-qualifiers-${regionName.toLowerCase()}`;
		const regionSection = await screen.findByTestId(regionTestId);
		expect(regionSection).toBeInTheDocument();

		// helper: find the LI that contains both team names, then type to its two inputs
		async function typeFixture(container, teamA, teamB, goalsA, goalsB) {
			const scoped = within(container);
			const rows = scoped.getAllByRole('listitem');

			// find the row that mentions both teams
			const row = rows.find((li) => {
				const txt = li.textContent || '';
				return (
					txt.toLowerCase().includes(teamA.toLowerCase()) &&
					txt.toLowerCase().includes(teamB.toLowerCase())
				);
			});

			if (!row) {
				throw new Error(
					`Could not find fixture row for ${teamA} vs ${teamB}`
				);
			}

			// left/right team names as rendered
			const nameEls = within(row).getAllByText(/.+/i, {
				selector: '.team-name'
			});
			const leftName = nameEls[0].textContent?.trim();

			// the two number inputs in this row, left then right
			const inputs = within(row).getAllByRole('spinbutton');
			const leftInput = inputs[0];
			const rightInput = inputs[1];

			// map intended (teamA, teamB) scores to visible (left, right)
			const leftGoals =
				leftName?.toLowerCase() === teamA.toLowerCase()
					? goalsA
					: goalsB;
			const rightGoals =
				leftName?.toLowerCase() === teamA.toLowerCase()
					? goalsB
					: goalsA;

			await userEvent.clear(leftInput);
			await userEvent.type(leftInput, String(leftGoals));
			await userEvent.clear(rightInput);
			await userEvent.type(rightInput, String(rightGoals));
		}

		// Enter results (Alpha tops group regardless of row orientation)
		await typeFixture(regionSection, 'Alpha', 'Bravo', 2, 0); // Alpha 2–0 Bravo
		await typeFixture(regionSection, 'Alpha', 'Charlie', 1, 0); // Alpha 1–0 Charlie
		await typeFixture(regionSection, 'Bravo', 'Charlie', 1, 1); // Bravo 1–1 Charlie

		// ensure inputs exist in THIS region before submitting
		await waitFor(() => {
			expect(
				within(regionSection).getAllByRole('spinbutton').length
			).toBeGreaterThanOrEqual(6);
		});

		// Submit only this region
		const submitButton = within(regionSection).getByRole('button', {
			name: /submit/i
		});
		await userEvent.click(submitButton);

		// Assert "Qualified Teams" appears in THIS region and contains Alpha
		const qualifiedHeading = await within(regionSection).findByText(
			/qualified/i
		);
		const qualifiedGrid =
			qualifiedHeading.parentElement.querySelector('.qualified-grid');
		expect(qualifiedGrid).toBeTruthy();

		await waitFor(() => {
			expect(
				within(qualifiedGrid).getByText(/^alpha$/i)
			).toBeInTheDocument();
		});
	});
});
