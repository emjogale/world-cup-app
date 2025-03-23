import { vi } from 'vitest';
import { mockTeams } from './mockTeams';

export function mockFetchTeams(data = mockTeams) {
	globalThis.fetch = vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(data)
		})
	);
}
