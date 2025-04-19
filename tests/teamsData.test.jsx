import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockFetchTeams } from '../src/test-utils/mockFetchTeams';
import { mockTeams } from '../src/test-utils/mockTeams';

beforeEach(() => {
	mockFetchTeams(); // sets up the fetch mock using mockTeams
});

afterEach(() => {
	vi.restoreAllMocks(); // clean up after test
});

describe('Teams Data', () => {
	it('should be an array', async () => {
		const res = await fetch('/teams.json');
		const teams = await res.json();

		expect(Array.isArray(teams)).toBe(true);
		expect(teams.length).toBe(mockTeams.length);
	});

	it('each team should have a name and flag', async () => {
		const res = await fetch('/teams.json');
		const teams = await res.json();
		teams.forEach((team) => {
			expect(typeof team.name).toBe('string');

			expect(typeof team.flag).toBe('string');
			expect(team).toHaveProperty('name');
			expect(team.flag).toBeDefined();
			if (team.flag.startsWith('http')) {
				// URL-style flag (likely in production or older test data)
				expect(team.flag).toMatch(/^https:\/\/.*\.png$/);
			} else {
				// Emoji-style flag
				expect(Array.from(team.flag).length).toBe(2);
			}
		});
	});
});
