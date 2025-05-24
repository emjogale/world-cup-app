import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { describe, it, expect } from 'vitest';
import RegionalQualifiers from './RegionalQualifiers';
import { generateMockTeams } from '../../utils/teamFactories';
import { getScoreTestId } from '../../test-utils/getScoreTestId';

const mockTeams = [
	{ name: 'Japan', flag: '🇯🇵' },
	{ name: 'South Korea', flag: '🇰🇷' },
	{ name: 'Iran', flag: '🇮🇷' },
	{ name: 'Saudi Arabia', flag: '🇸🇦' },
	{ name: 'Australia', flag: '🇦🇺' },
	{ name: 'Qatar', flag: '🇶🇦' }
];

describe('RegionalQualifiers component', () => {
	it('dev autofill renders regional qualifiers and autofills matches', () => {
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

describe('RegionalQualifiers input isolation', () => {
	it('only updates the score for the targeted match input', async () => {
		render(
			<RegionalQualifiers region="Asia" teams={mockTeams} spots={4} />
		);

		const japanInput = await screen.findByTestId(
			getScoreTestId('Japan', 'South Korea', 1)
		);
		await userEvent.type(japanInput, '2');

		const unrelatedInput = screen.getByTestId(
			getScoreTestId('Australia', 'Qatar', 1)
		);
		expect(unrelatedInput.value).toBe('');
	});
});
