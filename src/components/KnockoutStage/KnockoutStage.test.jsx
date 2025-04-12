import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import KnockoutStage from './KnockoutStage';

describe('KnockoutStage component', () => {
	const mockTeams = [
		{ name: 'Brazil', flag: '🇧🇷' },
		{ name: 'Germany', flag: '🇩🇪' },
		{ name: 'France', flag: '🇫🇷' },
		{ name: 'Argentina', flag: '🇦🇷' }
	];

	it('renders the correct number of matches in the first round', () => {
		render(<KnockoutStage qualifiedTeams={mockTeams} />);

		// scope to first round container only
		const firstRound = screen
			.getByText('Round 1')
			.closest('.knockout-round');
		const matchEls = within(firstRound).getAllByTestId(/match-.*-vs-.*/);
		console.log(matchEls.map((el) => el.dataset.testid));
		expect(matchEls).toHaveLength(2); // 4 teams = 2 matches
	});

	it('shows submitted result after a match is completed', async () => {
		render(<KnockoutStage qualifiedTeams={mockTeams.slice(0, 2)} />); // only one match

		const score1 = screen.getByTestId('score-Brazil');
		const score2 = screen.getByTestId('score-Germany');
		const submit = screen.getByRole('button', { name: /submit/i });

		await userEvent.clear(score1);
		await userEvent.type(score1, '2');
		await userEvent.clear(score2);
		await userEvent.type(score2, '1');

		await userEvent.click(submit);

		expect(screen.getByText('Brazil advances!')).toBeInTheDocument();
	});
});
