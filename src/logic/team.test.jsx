import { describe, it, expect } from 'vitest';
import { Team } from './Team';

describe('Team model', () => {
	it('should create a team with a name and a score', () => {
		const team = new Team('England');

		expect(team.name).toBe('England');
		expect(team.score).toBe(0);
	});
});
