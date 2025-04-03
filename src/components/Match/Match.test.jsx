import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Match from './Match';

describe('Sanity check', () => {
	it('should import Match without syntax errors', () => {
		expect(Match).toBeDefined();
	});
});

describe('Match component', () => {
	it('renders without crashing', () => {
		render(
			<Match
				team1="England"
				team2="Germany"
				score1=""
				score2=""
				onScoreChange={() => {}} // a dummy handler
			/>
		);
	});

	it('updates score inputs correctly', async () => {
		const Wrapper = () => {
			const [scores, setScores] = React.useState({
				England: '',
				Germany: ''
			});

			const handleScoreChange = (team, score) => {
				setScores((prev) => ({ ...prev, [team]: score }));
			};

			return (
				<Match
					team1="England"
					team2="Germany"
					score1={scores.England}
					score2={scores.Germany}
					onScoreChange={handleScoreChange}
				/>
			);
		};

		render(<Wrapper />);

		const scoreInput1 = screen.getByTestId('score-England');
		const scoreInput2 = screen.getByTestId('score-Germany');

		await userEvent.clear(scoreInput1);
		await userEvent.type(scoreInput1, '4');

		await userEvent.clear(scoreInput2);
		await userEvent.type(scoreInput2, '2');

		expect(scoreInput1.value).toBe('4');
		expect(scoreInput2.value).toBe('2');
	});

	// it('calls onResult with correct scores when submitted', async () => {
	// 	const mockHandler = vi.fn();

	// 	render(
	// 		<Match team1="England" team2="Germany" onResult={mockHandler} />
	// 	);

	// 	const scoreInput1 = screen.getByTestId('score-England');
	// 	const scoreInput2 = screen.getByTestId('score-Germany');

	// 	await userEvent.clear(scoreInput1);
	// 	await userEvent.type(scoreInput1, '3');

	// 	await userEvent.clear(scoreInput2);
	// 	await userEvent.type(scoreInput2, '1');

	// 	const submitButton = screen.getByRole('button', { name: /submit/i });
	// 	await userEvent.click(submitButton);

	// 	expect(mockHandler).toHaveBeenCalledWith('England', 3, 'Germany', 1);
	// });
});
