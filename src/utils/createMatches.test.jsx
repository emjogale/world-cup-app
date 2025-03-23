import { describe, it, expect } from 'vitest';
import { shuffleTeams, createRoundMatches } from './createMatches';

describe('Random Team Draw', () => {
	it('should shuffle teams randomly for putting into matches', () => {
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

it('should pair teams into matches', () => {
	const teams = ['Brazil', 'Germany', 'France', 'Argentina'];
	const matches = createRoundMatches([...teams]);

	expect(matches.length).toBe(2);
	expect(matches[0].team1).toBe('Brazil');
	expect(matches[0].team2).toBe('Germany');
	expect(matches[1].team1).toBe('France');
	expect(matches[1].team2).toBe('Argentina');
});
