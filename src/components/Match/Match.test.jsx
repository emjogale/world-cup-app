import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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
		render(<Match team1="England" team2="Germany" />);
	});
	it('renders the match correctly', () => {
		render(<Match team1="England" team2="Germany" />);
		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('England vs Germany');
	});
	it('updates score inputs correctly', async () => {
		render(<Match team1="England" team2="Germany" />);

		const scoreInput1 = screen.getByTestId('score-England');
		const scoreInput2 = screen.getByTestId('score-Germany');

		await userEvent.clear(scoreInput1);
		await userEvent.type(scoreInput1, '4');

		await userEvent.clear(scoreInput2);
		await userEvent.type(scoreInput2, '2');

		expect(scoreInput1.value).toBe('4');
		expect(scoreInput2.value).toBe('2');
	});

	it('calls onResult with correct scores when submitted', async () => {
		const mockHandler = vi.fn();

		render(
			<Match team1="England" team2="Germany" onResult={mockHandler} />
		);

		const scoreInput1 = screen.getByTestId('score-England');
		const scoreInput2 = screen.getByTestId('score-Germany');

		await userEvent.clear(scoreInput1);
		await userEvent.type(scoreInput1, '3');

		await userEvent.clear(scoreInput2);
		await userEvent.type(scoreInput2, '1');

		const submitButton = screen.getByRole('button', { name: /submit/i });
		await userEvent.click(submitButton);

		expect(mockHandler).toHaveBeenCalledWith('England', 3, 'Germany', 1);
	});
});
