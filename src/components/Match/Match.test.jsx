import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Match from './Match';

describe('Sanity check', () => {
	it('should import Match without syntax errors', () => {
		expect(Match).toBeDefined();
	});
});

describe('Match component', () => {
	// 	it('renders without errors', () => {
	// 		render(<Match team1="England" team2="Germany" />);

	// 		// (document.body.innerHTML); // 🛠️ Debug: See what's rendered

	// 		const heading = screen.getByRole('heading', { level: 3 }); // 🔍 Find <h3>
	// 		expect(heading).toHaveTextContent('England vs Germany');
	// 	});

	// 	describe('Match component', () => {
	it('renders without crashing', () => {
		render(<Match team1="England" team2="Germany" />);
	});
	it('renders the match correctly', () => {
		render(<Match team1="England" team2="Germany" />);
		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('England vs Germany');
	});
	// 		it('should update scores when entered', async () => {
	// 			render(<Match team1="England" team2="Germany" />);
	// 			const scoreInput1 = screen.getByTestId('score-England');
	// 			const scoreInput2 = screen.getByTestId('score-Germany');
	// 			await userEvent.type(scoreInput1, '4');
	// 			await userEvent.type(scoreInput2, '0');
	// 			expect(scoreInput1.value).toBe('4');
	// 			expect(scoreInput2.value).toBe('0');
	// 		});
	// 	});
});
