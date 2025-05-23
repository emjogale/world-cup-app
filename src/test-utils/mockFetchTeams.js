// ⬇️ This mock replaces global fetch for the test runtime
// Any call to fetch('/teams.json') now returns mockTeams instead of doing a real HTTP request

import { vi } from 'vitest';
import { mockTeams } from './mockTeams';

export const mockFetchTeams = (data = mockTeams) => {
	globalThis.fetch = vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(data)
		})
	);
};
