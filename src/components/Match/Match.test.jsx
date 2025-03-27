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
		render(<Match team1="England" team2="Germany" />);
	});
	it('renders the match correctly', () => {
		render(<Match team1="England" team2="Germany" />);
		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('England vs Germany');
	});
});
