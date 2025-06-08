import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from '../src/App';
import { mockFetchTeams } from './test-utils/mockFetchTeams';

import userEvent from '@testing-library/user-event';
import { TeamsProvider } from './context/TeamsProvider';

// 👇 Mock fetch before each test
beforeEach(() => {
	mockFetchTeams(); // mock fetch with default mockTeams
	localStorage.setItem('tdd-seed', 'mock-seed-abc');
});

afterEach(() => {
	localStorage.clear();
	vi.restoreAllMocks();
});

describe('App component', () => {
	it('shows loading state initially', async () => {
		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);
		const loading = await screen.getByText(/loading teams/i);
		expect(loading).toBeInTheDocument();
	});

	it('shows error message if fetch fails', async () => {
		fetch.mockRejectedValueOnce(new Error('Network error'));

		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);
		expect(
			await screen.findByText(/error loading teams/i)
		).toBeInTheDocument();
	});

	it('shows qualifiers before the tournament starts', async () => {
		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);

		expect(
			await screen.findByRole('button', { name: /start tournament/i })
		).toBeInTheDocument();
	});

	it('shows the group stage after clicking start', async () => {
		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		fireEvent.click(startBtn);

		// ✅ Wait directly for the heading using findByText
		const container = await screen.findByTestId('group-stage');
		const groupHeading = within(container).getByText(/Group A/i);
		expect(groupHeading).toBeInTheDocument();
	});

	it('shows seed if available and lets you copy it', async () => {
		localStorage.setItem('tdd-seed', 'mock-seed-abc');

		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn()
			}
		});

		mockFetchTeams(); // ensure data loads

		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);

		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		await userEvent.click(startBtn);

		// Wait for Group A to confirm we're past qualifiers
		await screen.findByText(/group a/i);

		// Look for the seed line
		expect(screen.getByTestId('seed-line')).toHaveTextContent(
			/mock-seed-abc/
		);
		const copyButton = screen.getByRole('button', { name: /copy/i });
		await userEvent.click(copyButton);

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			'mock-seed-abc'
		);
	});

	it('renders the seed line consistently', async () => {
		localStorage.setItem('tdd-seed', 'mock-seed-abc');
		mockFetchTeams();

		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		await userEvent.click(startBtn);

		await screen.findByTestId('seed-line');

		const seedLine = screen.getByTestId('seed-line');
		expect(seedLine).toMatchSnapshot();
	});
	it('shows "Copied!" message after clicking copy', async () => {
		localStorage.setItem('tdd-seed', 'mock-seed-abc');

		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn()
			}
		});

		mockFetchTeams(); // ensure data loads

		render(
			<TeamsProvider>
				<App />
			</TeamsProvider>
		);

		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		await userEvent.click(startBtn);

		const copyBtn = await screen.findByRole('button', { name: /copy/i });
		await userEvent.click(copyBtn);

		const copiedMsg = await screen.findByText(/copied!/i);
		expect(copiedMsg).toBeInTheDocument();
	});
});
