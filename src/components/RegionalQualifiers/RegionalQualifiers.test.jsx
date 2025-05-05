import { render, screen, fireEvent } from '@testing-library/react';

import { describe, it, expect } from 'vitest';
import RegionalQualifiers from './RegionalQualifiers';
import { generateMockTeams } from '../../utils/teamFactories';

describe('RegionalQualifiers component', () => {
	it('renders regional qualifiers and autofills matches', () => {
		const mockTeams = generateMockTeams(42, 'Asia');

		render(
			<RegionalQualifiers region="Asia" teams={mockTeams} spots={8} />
		);

		// Check the heading
		expect(screen.getByText(/Asia Qualifiers/i)).toBeInTheDocument();

		// Click the dev autofill button
		const button = screen.getByText(/Dev Autofill Regional Matches/i);
		fireEvent.click(button);

		// Check that some match results appeared (e.g., Team Asia 1 vs Team Asia 2)
		expect(screen.getAllByText(/Team Asia/i)).not.toHaveLength(0);
	});
});
