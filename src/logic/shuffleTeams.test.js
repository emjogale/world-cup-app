import { describe, it, expect } from 'vitest';

import { shuffleTeams } from './shuffleTeams';

describe('shuffleTeams', () => {
	it('should shuffle teams randomly without changing the count', () => {
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
		expect(shuffledTeams).toHaveLength(teams.length);
		expect(shuffledTeams.sort()).toEqual(teams.sort());
	});

	it('shuffles predictably with a given seed', () => {
		const teams = ['Brazil', 'Germany', 'France', 'Argentina'];
		const result = shuffleTeams(teams, 'test-seed');
		// console.log('🔍 Seeded shuffle result:', result);
		const expected = ['Brazil', 'France', 'Argentina', 'Germany'];

		expect(result).toEqual(expected);
	});
});
