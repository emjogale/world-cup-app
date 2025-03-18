import { describe, it, expect } from 'vitest';
import { shuffleTeams } from '../src/utils/shuffleTeams';

describe('Random Team Draw', () => {
	it('should draw teams randomly for matches', () => {
		const teams = [
			'Brazil',
			'Germany',
			'France',
			'Argentina',
			'Italy',
			'Spain',
			'Portugal',
			'Netherlands'
		];
		const shuffledTeams = shuffleTeams(teams);

		expect(shuffledTeams).not.toEqual(teams);
		expect(shuffledTeams.length).toBe(teams.length);
	});
});
