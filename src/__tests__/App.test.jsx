// src/App.test.jsx
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// --- M O C K S  (must be before importing App) ---

// Let the test see the regional screen briefly, then advance the App flow
vi.mock('../components/AllRegionalQualifiers/AllRegionalQualifiers', () => {
	const StubRegional = ({ onComplete, onAllQualified }) => {
		React.useEffect(() => {
			const id = setTimeout(() => {
				const teams = Array.from({ length: 32 }, (_, i) => ({
					name: `T${i + 1}`,
					region: 'Test'
				}));
				// legacy contract
				onComplete?.({ Test: teams });
				// new contract
				onAllQualified?.({ byRegion: { Test: teams }, flat: teams });
			}, 10);
			return () => clearTimeout(id);
		}, [onComplete, onAllQualified]);

		return <div data-testid="stub-regional">Regional stub</div>;
	};
	return { default: StubRegional };
});

// Keep Qualifiers light so it never blocks the Start button
vi.mock('../components/Qualifiers/Qualifiers', () => ({
	default: () => <div data-testid="stub-qualifiers" />
}));

// --- real imports (AFTER mocks) ---
import App from '../App';
import { TeamsProvider } from '../context/TeamsProvider';
import { MockTeamsProvider } from '../test-utils/MockTeamsProvider';
import { mockTeams } from '../test-utils/mockTeams';
import { mockRegions } from '../test-utils/mockRegions';
import { mockFetchTeams } from '../test-utils/mockFetchTeams';

// ========== Integration-ish: real TeamsProvider ==========
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
		expect(await screen.findByText(/network error/i)).toBeInTheDocument();
	});
});

// ========== Unit-ish: fast flow with MockTeamsProvider ==========
describe('App component — using MockTeamsProvider (unit)', () => {
	beforeEach(() => {
		localStorage.setItem('tdd-seed', 'mock-seed-abc');
	});
	afterEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
	});

	it('shows the group stage after clicking Start Tournament', async () => {
		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);

		// Regional stub appears first…
		expect(await screen.findByTestId('stub-regional')).toBeInTheDocument();

		// …then app advances to qualifiers (Start button present)
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		await userEvent.click(startBtn);

		// Group Stage is shown
		const container = await screen.findByTestId('group-stage');
		const groupHeading = within(container).getByText(/group a/i);
		expect(groupHeading).toBeInTheDocument();
	});

	it('shows seed if available and lets you copy it', async () => {
		Object.assign(navigator, { clipboard: { writeText: vi.fn() } });

		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);

		// advance to qualifiers, then groups
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		await userEvent.click(startBtn);
		await screen.findByText(/group a/i);

		// seed line
		expect(screen.getByTestId('seed-line')).toHaveTextContent(
			/mock-seed-abc/
		);

		await userEvent.click(screen.getByRole('button', { name: /copy/i }));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			'mock-seed-abc'
		);
	});

	it('renders the seed line consistently', async () => {
		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);

		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		await userEvent.click(startBtn);

		const seedLine = await screen.findByTestId('seed-line');
		expect(seedLine.textContent).toMatch(/mock-seed-abc/);
	});

	it('shows "Copied!" message after clicking copy', async () => {
		Object.assign(navigator, { clipboard: { writeText: vi.fn() } });

		render(
			<MockTeamsProvider teams={mockTeams} regions={mockRegions}>
				<App />
			</MockTeamsProvider>
		);

		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		await userEvent.click(startBtn);

		await userEvent.click(screen.getByRole('button', { name: /copy/i }));
		expect(await screen.findByText(/copied!/i)).toBeInTheDocument();
	});
});
