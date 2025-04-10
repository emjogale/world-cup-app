import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import KnockoutStage from './KnockoutStage';

describe('KnockoutStage component', () => {
	it('renders without crashing', () => {
		const mockTeams = [
			{ name: 'Brazil', flag: '🇧🇷' },
			{ name: 'Germany', flag: '🇧🇷' }
		];

		render(<KnockoutStage qualifiedTeams={mockTeams} />);

		expect(screen.getByText(/brazil/i)).toBeInTheDocument();
	});
	it('renders a match for each pair of teams', () => {
		const mockTeams = [
			{ name: 'Brazil', flag: '🇧🇷' },
			{ name: 'Germany', flag: '🇧🇷' },
			{ name: 'France', flag: '🇧🇷' },
			{ name: 'Chile', flag: '🇧🇷' }
		];
		render(<KnockoutStage qualifiedTeams={mockTeams} />);

		const matches = screen.getAllByTestId(/match/i);
		expect(matches.length).toBeGreaterThan(0);
	});

	it('shows submitted result after a match is completed', async () => {
		const teams = [
			{ name: 'Brazil', flag: '🇧🇷' },
			{ name: 'Germany', flag: '🇧🇷' }
		]; // one match

		render(<KnockoutStage qualifiedTeams={teams} />);

		const scoreInput1 = screen.getByTestId('score-Brazil');
		const scoreInput2 = screen.getByTestId('score-Germany');
		const submitBtn = screen.getByRole('button', { name: /submit/i });

		await userEvent.clear(scoreInput1);
		await userEvent.type(scoreInput1, '2');

		await userEvent.clear(scoreInput2);
		await userEvent.type(scoreInput2, '1');

		await userEvent.click(submitBtn);

		expect(screen.getByText(/Brazil 2 - 1 Germany/i)).toBeInTheDocument();
	});
});
