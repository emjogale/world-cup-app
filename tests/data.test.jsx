import { describe, it, expect } from 'vitest';
import { teams } from '../data';

describe('Teams data', () => {
	it('should export an array of teams', () => {
		expect(Array.isArray(teams)).toBe(true);
		expect(teams.length).toBeGreaterThan(0);
		expect(teams.length % 2).toBe(0);
	});

	it('each team should have a name and a flag', () => {
		teams.forEach((team) => {
			expect(team).toHaveProperty('name');
			expect(typeof team.name).toBe('string');
			expect(team.name.length).toBeGreaterThan(0);

			expect(team).toHaveProperty('flag');
			expect(typeof team.flag).toBe('string');
			expect(team.flag.length).toBeGreaterThan(0);
		});
	});
});
