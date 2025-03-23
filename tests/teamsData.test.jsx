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
		console.log('teams are: ', teams);

		expect(Array.isArray(teams)).toBe(true);
	});
	// it('each team should have a name and flag', () => {
	// 	mockFetchTeams.forEach((team, index) => {
	// 		expect(typeof team.name).toBe('string');
	// 		console.log(`Team at index ${index}:`, team);
	// 		expect(typeof team.flag).toBe('string');
	// 		expect(team).toHaveProperty('name');
	// 		expect(team.flag).toBeDefined();
	// 		expect(team.flag).toMatch(
	// 			/^https:\/\/flagpedia\.net\/data\/flags\/w320\/[a-z]{2}(?:-[a-z0-9]{1,3})?\.png$/
	// 		);
	// 	});
	// });
});
