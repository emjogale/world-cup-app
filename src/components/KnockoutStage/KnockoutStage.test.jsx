import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KnockoutStage from './KnockoutStage';

describe('KnockoutStage component', () => {
	it('renders without crashing', () => {
		const mockTeams = ['Brazil', 'Germany'];

		render(<KnockoutStage teams={mockTeams} />);

		expect(screen.getByText(/Brazil vs Germany/i)).toBeInTheDocument();
	});

	it('renders a match for each pair of teams', () => {
		const mockTeams = ['Brazil', 'Germany', 'France', 'Argentina'];
		render(<KnockoutStage teams={mockTeams} />);

		expect(screen.getByText(/Brazil vs Germany/i)).toBeInTheDocument();
		expect(screen.getByText(/France vs Argentina/i)).toBeInTheDocument();
	});
});
