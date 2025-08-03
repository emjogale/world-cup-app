import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../src/App';
import { mockFetchTeams } from './test-utils/mockFetchTeams';
import userEvent from '@testing-library/user-event';
import { TeamsProvider } from './context/TeamsProvider';
import { MockTeamsProvider } from './test-utils/MockTeamsProvider';
import { mockTeams } from './test-utils/mockTeams';
import { mockRegions } from './test-utils/mockTeams';

describe('App component — using real TeamsProvider (integration', () => {
	beforeEach(() => {
		mockFetchTeams();
		localStorage.setItem('tdd-seed', 'mock-seed-abc');
	});

	afterEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
	});

	it('shows loading state initially', () => {
		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);
		expect(screen.getByText(/loading teams/i)).toBeInTheDocument();
	});

	it('shows error message if fetch fails', async () => {
		fetch.mockRejectedValueOnce(new Error('Network error'));

		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);

		expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
	});
});

// This test assumes the old app flow before regional qualifiers
// TODO: rewrite once new flow is finalized

describe('App component — using MockTeamsProvider (unit)', () => {
	beforeEach(() => {
		localStorage.setItem('tdd-seed', 'mock-seed-abc');
	});
	afterEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
	});

	it.skip('shows the group stage after clicking start', async () => {
		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		fireEvent.click(startBtn);

		const container = await screen.findByTestId('group-stage');
		const groupHeading = within(container).getByText(/Group A/i);
		expect(groupHeading).toBeInTheDocument();
	});

	it.skip('shows seed if available and lets you copy it', async () => {
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn()
			}
		});
		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);
		await userEvent.click(
			await screen.findByRole('button', { name: /start tournament/i })
		);
		await screen.findByText(/group a/i);
		expect(screen.getByTestId('seed-line')).toHaveTextContent(
			/mock-seed-abc/
		);
		await userEvent.click(screen.getByRole('button', { name: /copy/i }));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			'mock-seed-abc'
		);
	});

	it.skip('renders the seed line consistently', async () => {
		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);
		await userEvent.click(
			await screen.findByRole('button', { name: /start tournament/i })
		);
		const seedLine = await screen.findByTestId('seed-line');
		expect(seedLine.textContent).toMatch(/mock-seed-abc/);
	});

	it.skip('shows "Copied!" message after clicking copy', async () => {
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn()
			}
		});
		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);
		await userEvent.click(
			await screen.findByRole('button', { name: /start tournament/i })
		);
		await userEvent.click(
			await screen.findByRole('button', { name: /copy/i })
		);
		expect(await screen.findByText(/copied!/i)).toBeInTheDocument();
	});
});
