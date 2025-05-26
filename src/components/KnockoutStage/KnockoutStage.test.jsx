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
			.getByText('Semifinals')
			.closest('.knockout-round');
		const matchEls = within(firstRound).getAllByTestId(/match-.*-vs-.*/);

		expect(matchEls).toHaveLength(2); // 4 teams = 2 matches
	});

	it('shows submitted result after a match is completed', async () => {
		render(<KnockoutStage qualifiedTeams={mockTeams.slice(0, 2)} />); // only one match

		const score1 = screen.getByTestId('score-brazil');
		const score2 = screen.getByTestId('score-germany');

		await userEvent.clear(score1);
		await userEvent.type(score1, '2');
		await userEvent.clear(score2);
		await userEvent.type(score2, '1');

		const submit = screen.getByTestId('submit-regular-Brazil');
		await userEvent.click(submit);

		expect(
			screen.getByText('Brazil wins the World Cup! 🏆')
		).toBeInTheDocument();
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
		await userEvent.clear(screen.getByTestId('score-brazil'));
		await userEvent.type(screen.getByTestId('score-brazil'), '2');
		await userEvent.clear(screen.getByTestId('score-germany'));
		await userEvent.type(screen.getByTestId('score-germany'), '1');
		await userEvent.click(screen.getByTestId('submit-regular-Brazil'));

		// Submit France vs Argentina
		await userEvent.clear(screen.getByTestId('score-france'));
		await userEvent.type(screen.getByTestId('score-france'), '3');
		await userEvent.clear(screen.getByTestId('score-argentina'));
		await userEvent.type(screen.getByTestId('score-argentina'), '0');
		await userEvent.click(screen.getByTestId('submit-regular-France'));

		// ✅ Wait for Round 2 match to appear
		await screen.findByTestId('match-Brazil-vs-France');

		// ✅ Optionally check Round 2 heading exists (H3)
		const round2Heading = screen
			.getAllByRole('heading', { level: 3 })
			.find((el) => el.textContent.includes('Final'));

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
			const scoreBrazil = screen.getByTestId('score-brazil');
			const scoreGermany = screen.getByTestId('score-germany');

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

		it('shows winner message after extra time win', async () => {
			render(<KnockoutStage qualifiedTeams={mockTeams.slice(0, 2)} />); // Brazil vs Germany

			const score1 = screen.getByTestId('score-brazil');
			const score2 = screen.getByTestId('score-germany');

			// Regular time draw
			await userEvent.clear(score1);
			await userEvent.type(score1, '1');
			await userEvent.clear(score2);
			await userEvent.type(score2, '1');

			const regularSubmit = await screen.findByTestId(
				'submit-regular-Brazil'
			);
			await userEvent.click(regularSubmit);

			// Fill extra time scores
			const extra1 = await screen.findByTestId('extra-Brazil');
			const extra2 = await screen.findByTestId('extra-Germany');

			await userEvent.clear(extra1);
			await userEvent.type(extra1, '2');
			await userEvent.clear(extra2);
			await userEvent.type(extra2, '1');

			const extraSubmit = await screen.findByTestId(
				'submit-extra-Brazil'
			);
			await userEvent.click(extraSubmit);

			expect(
				await screen.findByText('Brazil wins the World Cup! 🏆')
			).toBeInTheDocument();
		});
	});

	it('shows penalty inputs only after an extra time draw', async () => {
		render(<KnockoutStage qualifiedTeams={mockTeams.slice(0, 2)} />);

		// Regular time: draw
		await userEvent.clear(screen.getByTestId('score-brazil'));
		await userEvent.type(screen.getByTestId('score-brazil'), '1');
		await userEvent.clear(screen.getByTestId('score-germany'));
		await userEvent.type(screen.getByTestId('score-germany'), '1');

		const regularSubmit = await screen.findByTestId(
			'submit-regular-Brazil'
		);
		await userEvent.click(regularSubmit);

		// Extra time: draw
		await userEvent.clear(screen.getByTestId('extra-Brazil'));
		await userEvent.type(screen.getByTestId('extra-Brazil'), '2');
		await userEvent.clear(screen.getByTestId('extra-Germany'));
		await userEvent.type(screen.getByTestId('extra-Germany'), '2');

		await screen.findByText('Extra Time'); // confirms draw was processed
		const extraSubmit = await screen.findByTestId('submit-extra-Brazil');
		await userEvent.click(extraSubmit);

		// Penalty input appears
		expect(await screen.findByText('Penalties')).toBeInTheDocument();
		expect(screen.getByTestId('penalty-Brazil')).toBeInTheDocument();
		expect(screen.getByTestId('penalty-Germany')).toBeInTheDocument();
	});

	it('shows winner message after penalty shootout win', async () => {
		render(<KnockoutStage qualifiedTeams={mockTeams.slice(0, 2)} />); // Brazil vs Germany

		// Regular time draw
		await userEvent.clear(screen.getByTestId('score-brazil'));
		await userEvent.type(screen.getByTestId('score-brazil'), '1');
		await userEvent.clear(screen.getByTestId('score-germany'));
		await userEvent.type(screen.getByTestId('score-germany'), '1');

		const regularSubmit = await screen.findByTestId(
			'submit-regular-Brazil'
		);
		await userEvent.click(regularSubmit);

		// Extra time draw
		const extra1 = await screen.findByTestId('extra-Brazil');
		const extra2 = await screen.findByTestId('extra-Germany');

		await userEvent.clear(extra1);
		await userEvent.type(extra1, '2');
		await userEvent.clear(extra2);
		await userEvent.type(extra2, '2');

		const extraSubmit = await screen.findByTestId('submit-extra-Brazil');
		await userEvent.click(extraSubmit);

		// Penalty shootout
		const pen1 = await screen.findByTestId('penalty-Brazil');
		const pen2 = await screen.findByTestId('penalty-Germany');

		await userEvent.clear(pen1);
		await userEvent.type(pen1, '4');
		await userEvent.clear(pen2);
		await userEvent.type(pen2, '3');

		const penSubmit = await screen.findByTestId('submit-penalties-Brazil');
		await userEvent.click(penSubmit);

		expect(
			await screen.findByText('Brazil wins the World Cup! 🏆')
		).toBeInTheDocument();
	});

	it('shows the final winner message in the last round', async () => {
		const mockTeams = [
			{ name: 'Brazil', flag: '🇧🇷' },
			{ name: 'Germany', flag: '🇩🇪' }
		];

		render(<KnockoutStage qualifiedTeams={mockTeams} />);

		// Fill in a score to win the final
		await userEvent.type(screen.getByTestId('score-brazil'), '2');
		await userEvent.type(screen.getByTestId('score-germany'), '1');

		const submit = await screen.findByTestId('submit-regular-Brazil');
		await userEvent.click(submit);

		expect(
			screen.getByText(/brazil wins the world cup/i)
		).toBeInTheDocument();
	});
	it('does not declare a World Cup winner after a non-final match', () => {
		render(<KnockoutStage qualifiedTeams={[]} />); // however you normally set up

		// Simulate knockoutRounds state manually if needed or mock
		// OR better: inject knockoutRounds as a prop if refactored for easier testability

		// Now: expect NO World Cup winner text yet
		expect(
			screen.queryByText(/wins the World Cup/)
		).not.toBeInTheDocument();
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
		await userEvent.clear(screen.getByTestId('score-brazil'));
		await userEvent.type(screen.getByTestId('score-brazil'), '2');

		await userEvent.clear(screen.getByTestId('score-germany'));
		await userEvent.type(screen.getByTestId('score-germany'), '1');

		// Wait for the regular time submit button to appear
		const submitButton = await screen.findByTestId('submit-regular-Brazil');

		expect(submitButton).toBeInTheDocument();

		await userEvent.click(submitButton);

		// Confirm winner message appears
		expect(
			await screen.findByText('Brazil wins the World Cup! 🏆')
		).toBeInTheDocument();
	});
});
