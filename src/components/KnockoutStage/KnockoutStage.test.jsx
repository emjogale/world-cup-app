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
		console.log(
			'this is the matchEls list',
			matchEls.map((el) => el.dataset.testid)
		);
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

	it('generates next round with correct winners after all first round matches are submitted', async () => {
		const mockTeams = [
			{ name: 'Brazil', flag: '🇧🇷' },
			{ name: 'Germany', flag: '🇩🇪' },
			{ name: 'France', flag: '🇫🇷' },
			{ name: 'Argentina', flag: '🇦🇷' }
		];

		render(<KnockoutStage qualifiedTeams={mockTeams} />);

		// Fill in scores and submit for both matches
		await userEvent.clear(screen.getByTestId('score-Brazil'));
		await userEvent.type(screen.getByTestId('score-Brazil'), '2');
		await userEvent.clear(screen.getByTestId('score-Germany'));
		await userEvent.type(screen.getByTestId('score-Germany'), '1');
		await userEvent.click(
			screen.getAllByRole('button', { name: /submit/i })[0]
		);

		await userEvent.clear(screen.getByTestId('score-France'));
		await userEvent.type(screen.getByTestId('score-France'), '3');
		await userEvent.clear(screen.getByTestId('score-Argentina'));
		await userEvent.type(screen.getByTestId('score-Argentina'), '0');
		await userEvent.click(
			screen.getAllByRole('button', { name: /submit/i })[1]
		);

		// Wait for Round 2 to appear
		const round2Heading = await screen.findByText('Round 2');
		expect(round2Heading).toBeInTheDocument();

		// Check the correct teams made it
		expect(
			screen.getByTestId('match-Brazil-vs-France')
		).toBeInTheDocument();
	});

	describe('knockoutStage extra time and penalties logic', () => {
		it('shows extra time input if regular time ends in a draw', async () => {
			render(<KnockoutStage qualifiedTeams={mockTeams} />);

			// enter draw score
			const scoreBrazil = screen.getByTestId('score-Brazil');
			const scoreGermany = screen.getByTestId('score-Germany');
			const submitButtons = screen.getAllByRole('button', {
				name: /submit/i
			});
			const submit = submitButtons[0]; // or use find/within a parent

			await userEvent.clear(scoreBrazil);
			await userEvent.type(scoreBrazil, '1');

			await userEvent.clear(scoreGermany);
			await userEvent.type(scoreGermany, '1');

			await userEvent.click(submit);

			// check for extra time input visibility
			expect(screen.getByText('Extra Time')).toBeInTheDocument();
			expect(screen.getByTestId('extra-Brazil')).toBeInTheDocument();
			expect(screen.getByTestId('extra-Germany')).toBeInTheDocument();
		});

		// More tests to follow:
		// - penalties only appear after extra time draw
		// - determine winner correctly
		// - winner message appears
	});
});
