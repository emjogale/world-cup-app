// ⬇️ This mock replaces global fetch for the test runtime
// Any call to fetch('/teams.json') now returns mockTeams instead of doing a real HTTP request
//TODO: update to include regions
import { vi } from 'vitest';
import { mockTeams } from './mockTeams';
import { mockRegions } from './mockRegions';

export const mockFetchTeams = ({
	teams = mockTeams,
	regions = mockRegions
} = {}) => {
	globalThis.fetch = vi.fn((url) => {
		if (url.includes('/teams.json')) {
			return Promise.resolve({
				ok: true,
				json: () => Promise.resolve(teams)
			});
		}
		if (url.includes('/regions.json')) {
			return Promise.resolve({
				ok: true,
				json: () => Promise.resolve(regions)
			});
		}
		// fallback if unrecognized URL
		return Promise.reject(new Error(`Unhandled fetch URL: ${url}`));
	});
};
