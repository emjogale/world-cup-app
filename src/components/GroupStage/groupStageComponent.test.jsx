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

	it('renders team names in each group', () => {
		render(<GroupStage teams={mockTeams} />);

		mockTeams.forEach((team) => {
			expect(screen.getAllByText(team.name)).not.toHaveLength();
		});
	});

	it('renders match fixtures for each group', () => {
		render(<GroupStage teams={mockTeams} />);

		// for 2 groups of 4 teams each -> 6 matches per group = 12 in total
		const scoreInputs = screen.getAllByRole('spinbutton');

		expect(scoreInputs.length).toBe(24);
	});

	it('shows submitted result after a match is completed', async () => {
		render(<GroupStage teams={mockTeams} />);
		const matchCard = screen.getByTestId('match-Brazil-vs-Cameroon');

		console.log('\n\n🔍 MATCH DEBUG:\n\n');
		screen.debug();
		const scoreInput1 = within(matchCard).getByTestId('score-Brazil');
		const scoreInput2 = within(matchCard).getByTestId('score-Cameroon');
		console.log(
			'Match card IDs:',
			screen.getAllByTestId((_, node) => node?.dataset?.testid)
		);
		screen.debug();

		await userEvent.clear(scoreInput1);
		await userEvent.type(scoreInput1, '2');

		await userEvent.clear(scoreInput2);
		await userEvent.type(scoreInput2, '1');

		await userEvent.click(
			within(matchCard).getByRole('button', { name: /submit/i })
		);

		const result = await within(matchCard).findByTestId('result');

		expect(result).toHaveTextContent('Brazil 2 - 1 Cameroon');
	});
});
