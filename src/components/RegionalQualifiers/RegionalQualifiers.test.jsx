import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { describe, it, expect, vi } from 'vitest';
import RegionalQualifiers from './RegionalQualifiers';

import { getScoreTestId } from '../../test-utils/getScoreTestId';

const defaultSeed = 'test-seed';

vi.mock('../../context/TeamsContext', () => {
	const mockTeams = [
		{ name: 'Japan', region: 'Asia', flag: '🇯🇵' },
		{ name: 'South Korea', region: 'Asia', flag: '🇰🇷' },
		{ name: 'Iran', region: 'Asia', flag: '🇮🇷' },
		{ name: 'Saudi Arabia', region: 'Asia', flag: '🇸🇦' },
		{ name: 'Australia', region: 'Asia', flag: '🇦🇺' },
		{ name: 'Qatar', region: 'Asia', flag: '🇶🇦' }
	];
	return {
		/* 👇 the hook returns the usual shape */
		useTeams: () => ({ teams: mockTeams, loading: false, error: null }),
		TeamsProvider: ({ children }) => children
	};
});

describe('RegionalQualifiers component', () => {
	it('renders Asia Qualifiers and dev-autofills matches', () => {
		render(
			<RegionalQualifiers region="Asia" spots={8} seed={defaultSeed} />
		);

		// Check the heading
		expect(screen.getByText(/Asia Qualifiers/i)).toBeInTheDocument();

		// Click the dev autofill button
		const button = screen.getByText(/Dev Autofill Regional Matches/i);
		fireEvent.click(button);

		// after autofill at least one table cell should contain "Japan" or any team
		expect(screen.getAllByText('Japan')).not.toHaveLength(0);
	});

	it('only updates the score for the targeted match input', async () => {
		render(
			<RegionalQualifiers region="Asia" spots={4} seed={defaultSeed} />
		);

		const japanInput = await screen.findByTestId(
			getScoreTestId('South Korea', 'Japan', 1)
		);
		await userEvent.type(japanInput, '2');

		const unrelatedInput = screen.getByTestId(
			getScoreTestId('Qatar', 'Australia', 1)
		);
		expect(unrelatedInput.value).toBe('');
	});

	it('does not update Japan/South Korea input when Australia/Qatar is changed', async () => {
		render(
			<RegionalQualifiers region="Asia" spots={4} seed={defaultSeed} />
		);

		const qatarInput = await screen.findByTestId(
			getScoreTestId('Australia', 'Qatar', 2)
		);
		await userEvent.type(qatarInput, '3');

		const japanInput = screen.getByTestId(
			getScoreTestId('Japan', 'South Korea', 2)
		);
		expect(japanInput.value).toBe('');
	});

	it('only updates ther score for the Australia vs Qatar input', async () => {
		render(
			<RegionalQualifiers region="Asia" spots={4} seed={defaultSeed} />
		);

		const qatarInput = await screen.findByTestId(
			getScoreTestId('Australia', 'Qatar', 2)
		);
		await userEvent.type(qatarInput, '3');

		const japanInput = screen.getByTestId(
			getScoreTestId('Japan', 'South Korea', 2)
		);
		expect(japanInput.value).toBe('');
	});
});
