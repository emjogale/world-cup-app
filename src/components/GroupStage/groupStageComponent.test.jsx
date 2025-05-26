import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import GroupStage from './GroupStage';
import { groupTeams } from '../../tournament/grouping/groupTeams';
import { updateGroupStats } from '../../tournament/grouping/updateGroupStats';

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

	it('calculates stats correctly for a win', () => {
		const startingStats = {
			China: {
				name: 'China',
				flag: '🇨🇳',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				gd: 0,
				points: 0
			},
			Argentina: {
				name: 'Argentina',
				flag: '🇦🇷',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				gd: 0,
				points: 0
			}
		};

		const results = [
			{ team1: 'China', score1: 3, team2: 'Argentina', score2: 1 }
		];

		const updated = updateGroupStats(startingStats, results);
		expect(updated.China.points).toBe(3);
		expect(updated.China.played).toBe(1);
		expect(updated.Argentina.points).toBe(0);
	});

	it('only updates the score for the match just played', async () => {
		render(<GroupStage teams={mockTeams} />);

		// enter a score for China
		const chinaInput = screen.getByTestId('score-china');
		await userEvent.type(chinaInput, '3');

		const argentinaInput = screen.getByTestId('score-argentina');
		const brazilInput = screen.getByTestId('score-brazil');

		// check another teams score input is unaffected
		expect(argentinaInput.value).toBe('');
		expect(brazilInput.value).toBe('');
	});
});
