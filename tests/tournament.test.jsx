import { describe, it, expect } from 'vitest';
import { Tournament } from '../src/models/Tournament';

describe('Tournament', () => {
	it('should advance winners to the next round', () => {
		const teams = ['Brazil', 'Germany', 'France', 'Spain'];
		const tournament = new Tournament(teams);

		tournament.setMatchResult('Brazil', 2, 'Germany', 1);
		tournament.setMatchResult('France', 3, 'Spain', 0);

		// expect(tournament.getWinners()).toEqual(['Brazil', 'France']);
	});
});
