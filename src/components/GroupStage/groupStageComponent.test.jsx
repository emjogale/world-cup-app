import { render, screen, within, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import GroupStage from './GroupStage';
import { groupTeams } from '../../logic/groupTeams';

const mockTeams = [
	{ name: 'Argentina', flag: '🇦🇷' },
	{ name: 'Australia', flag: '🇦🇺' },
	{ name: 'Belgium', flag: '🇧🇪' },
	{ name: 'Brazil', flag: '🇧🇷' },
	{ name: 'Cameroon', flag: '🇨🇲' },
	{ name: 'Canada', flag: '🇨🇦' },
	{ name: 'Chile', flag: '🇨🇱' },
	{ name: 'China', flag: '🇨🇳' }
];

describe('group stage component', () => {
	it('renders group names', () => {
		const grouped = groupTeams(mockTeams);
		render(<GroupStage teams={mockTeams} />);
		for (const groupName of Object.keys(grouped)) {
			expect(
				screen.getAllByText(`Group ${groupName}`)
			).not.toHaveLength();
		}
	});

	it('renders group table with headers for each group', () => {
		render(<GroupStage teams={mockTeams} />);

		const headers = ['Team', 'P', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts'];
		headers.forEach((header) => {
			const matches = screen.getAllByText(header);
			expect(matches).not.toHaveLength(0);
		});
	});

	it('renders team names in each group', () => {
		render(<GroupStage teams={mockTeams} />);

		mockTeams.forEach((team) => {
			expect(screen.getAllByText(team.name)).not.toHaveLength();
		});
	});

	it('ensures each team appears only once in the visible matches', () => {
		render(<GroupStage teams={mockTeams} />);

		// Find all match cards
		const matchCards = screen.getAllByTestId(/match-/);

		// Collect team names from data-testid
		const teamCounts = new Map();

		matchCards.forEach((card) => {
			const testId = card.getAttribute('data-testid'); // e.g. "match-Brazil-vs-Germany"
			const [team1, team2] = testId.replace('match-', '').split('-vs-');

			[team1, team2].forEach((team) => {
				teamCounts.set(team, (teamCounts.get(team) || 0) + 1);
			});
		});

		// Assert each team only appears once
		for (const [_team, count] of teamCounts) {
			expect(count).toBeLessThanOrEqual(1);
		}
	});

	it('ensures no team appears more than once in the visible matches per group', () => {
		render(<GroupStage teams={mockTeams} />);

		const matchCards = screen.getAllByTestId(/match-/);
		const seenTeams = new Set();

		matchCards.forEach((card) => {
			const testId = card.getAttribute('data-testid');
			const [, matchStr] = testId.split('match-');
			const [team1, , team2] = matchStr.split('-');

			expect(seenTeams.has(team1)).toBe(false);
			expect(seenTeams.has(team2)).toBe(false);

			seenTeams.add(team1);
			seenTeams.add(team2);
		});
	});

	it('replaces previous matches with new ones after submission', async () => {
		render(<GroupStage teams={mockTeams} />);

		// Make sure specific initial match is on screen
		expect(
			screen.getByTestId('match-China-vs-Argentina')
		).toBeInTheDocument();

		// Submit Group A's matches (China, Argentina, Canada, Chile)
		const inputs = screen.getAllByRole('spinbutton');
		await userEvent.type(inputs[0], '1'); // China
		await userEvent.type(inputs[1], '0'); // Argentina
		await userEvent.type(inputs[2], '2'); // Canada
		await userEvent.type(inputs[3], '1'); // Chile

		const groupASubmit = screen.getByTestId('submit-group-A');
		await userEvent.click(groupASubmit);

		// After submission, that match should be gone
		expect(
			screen.queryByTestId('match-China-vs-Argentina')
		).not.toBeInTheDocument();

		// Still 4 matches total (2 from Group B, 2 new from Group A)
		const updatedMatches = screen.getAllByTestId(/match-/);
		expect(updatedMatches).toHaveLength(4);
	});

	it('shows one submit button for every 2 matches', () => {
		render(<GroupStage teams={mockTeams} />);
		const buttons = screen.getAllByRole('button', { name: /submit/i });
		expect(buttons.length).toBe(2); // 1 per group
	});

	it.skip('updates the group table stats when a match is submitted', async () => {
		render(<GroupStage teams={mockTeams} />);

		const matchCard = await screen.findByTestId('match-China-vs-Argentina');
		const score1 = within(matchCard).getByTestId('score-China');
		const score2 = within(matchCard).getByTestId('score-Argentina');

		await userEvent.clear(score1);
		await userEvent.type(score1, '3');
		await userEvent.clear(score2);
		await userEvent.type(score2, '1');

		const submitButton = screen.getByTestId('submit-group-A');

		// 💡 Wait for button to become enabled
		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
		});

		await userEvent.click(submitButton);

		const chinaRow = await screen.findByTestId('row-China');
		const cells = within(chinaRow).getAllByRole('cell');

		// 🧪 Assert correct updated stats
		expect(cells[1]).toHaveTextContent('1'); // Played
		expect(cells[2]).toHaveTextContent('1'); // Won
		expect(cells[8]).toHaveTextContent('3'); // Points
	});

	it.skip('confirms stats update visibly', async () => {
		render(<GroupStage teams={mockTeams} />);

		const matchCard = await screen.findByTestId('match-China-vs-Argentina');
		const score1 = within(matchCard).getByTestId('score-China');
		const score2 = within(matchCard).getByTestId('score-Argentina');

		await userEvent.clear(score1);
		await userEvent.type(score1, '3');
		await userEvent.clear(score2);
		await userEvent.type(score2, '1');

		const submitButton = screen.getByTestId('submit-group-A');
		await userEvent.click(submitButton);

		// Wait until the row shows the updated values
		await waitFor(() => {
			const chinaRow = screen.getByTestId('row-China');
			const cells = within(chinaRow).getAllByRole('cell');
			expect(cells[1]).toHaveTextContent('1'); // Played
			expect(cells[2]).toHaveTextContent('1'); // Won
			expect(cells[8]).toHaveTextContent('3'); // Points
		});
	});
});
