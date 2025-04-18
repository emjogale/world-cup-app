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

		await userEvent.clear(score1);
		await userEvent.type(score1, '2');
		await userEvent.clear(score2);
		await userEvent.type(score2, '1');

		const submit = screen.getByTestId('submit-regular-Brazil');
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

		// Submit Brazil vs Germany
		await userEvent.clear(screen.getByTestId('score-Brazil'));
		await userEvent.type(screen.getByTestId('score-Brazil'), '2');
		await userEvent.clear(screen.getByTestId('score-Germany'));
		await userEvent.type(screen.getByTestId('score-Germany'), '1');
		await userEvent.click(screen.getByTestId('submit-regular-Brazil'));

		// Submit France vs Argentina
		await userEvent.clear(screen.getByTestId('score-France'));
		await userEvent.type(screen.getByTestId('score-France'), '3');
		await userEvent.clear(screen.getByTestId('score-Argentina'));
		await userEvent.type(screen.getByTestId('score-Argentina'), '0');
		await userEvent.click(screen.getByTestId('submit-regular-France'));

		// ✅ Wait for Round 2 match to appear
		await screen.findByTestId('match-Brazil-vs-France');

		// ✅ Optionally check Round 2 heading exists (H3)
		const round2Heading = screen
			.getAllByRole('heading', { level: 3 })
			.find((el) => el.textContent.includes('Round 2'));
		expect(round2Heading).toBeTruthy();

		// ✅ Check the correct match is present
		expect(
			screen.getByTestId('match-Brazil-vs-France')
		).toBeInTheDocument();
	});

	describe('knockoutStage extra time and penalties logic', () => {
		it('shows extra time input if regular time ends in a draw', async () => {
			render(<KnockoutStage qualifiedTeams={mockTeams} />);

			// Enter draw scores for Brazil vs Germany
			const scoreBrazil = screen.getByTestId('score-Brazil');
			const scoreGermany = screen.getByTestId('score-Germany');

			await userEvent.clear(scoreBrazil);
			await userEvent.type(scoreBrazil, '1');
			await userEvent.clear(scoreGermany);
			await userEvent.type(scoreGermany, '1');

			// Wait for the submit button to appear, then click it
			const submitButton = await screen.findByTestId(
				'submit-regular-Brazil'
			);
			await userEvent.click(submitButton);

			// Assert that extra time inputs are now visible
			expect(await screen.findByText('Extra Time')).toBeInTheDocument();
			expect(screen.getByTestId('extra-Brazil')).toBeInTheDocument();
			expect(screen.getByTestId('extra-Germany')).toBeInTheDocument();
		});

		// More tests to follow:
		// - penalties only appear after extra time draw
		// - determine winner correctly
		// - winner message appears
	});
});

describe('KnockoutStage sanity test', () => {
	it('shows regular time submit and winner message after score entry', async () => {
		const teams = [
			{ name: 'Brazil', flag: '🇧🇷' },
			{ name: 'Germany', flag: '🇩🇪' }
		];

		render(<KnockoutStage qualifiedTeams={teams} />);

		// Enter a non-draw score
		await userEvent.clear(screen.getByTestId('score-Brazil'));
		await userEvent.type(screen.getByTestId('score-Brazil'), '2');

		await userEvent.clear(screen.getByTestId('score-Germany'));
		await userEvent.type(screen.getByTestId('score-Germany'), '1');

		// Wait for the regular time submit button to appear
		const submitButton = await screen.findByTestId('submit-regular-Brazil');

		expect(submitButton).toBeInTheDocument();

		await userEvent.click(submitButton);

		// Confirm winner message appears
		expect(await screen.findByText('Brazil advances!')).toBeInTheDocument();
	});
});
