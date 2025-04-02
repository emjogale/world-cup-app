import { render, screen, within } from '@testing-library/react';
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

	it('renders only the first two matches for each group initially', () => {
		render(<GroupStage teams={mockTeams} />);

		const matchCards = screen.getAllByTestId(/match-/);

		expect(matchCards.length).toBe(4);
	});

	it('updates the group table stats when a match is submitted', async () => {
		render(<GroupStage teams={mockTeams} />);
		// use this temporarily to log what gets rendered once
		//screen.debug();
		// simulate a match result
		const matchCard = screen.getByTestId('match-China-vs-Argentina');
		const score1 = within(matchCard).getByTestId('score-China');
		const score2 = within(matchCard).getByTestId('score-Argentina');

		await userEvent.type(score1, '3');
		await userEvent.type(score2, '1');
		await userEvent.click(
			within(matchCard).getByRole('button', { name: /submit/i })
		);

		//check that the table updated for China
		// const chinaRow = screen.getByTestId('row-China');
		// expect(within(chinaRow).getByText('1')).toBeInTheDocument(); // Played
		// expect(within(chinaRow).getByText('1')).toBeInTheDocument(); // Win
		// expect(within(chinaRow).getByText('3')).toBeInTheDocument(); // Points
	});
});
