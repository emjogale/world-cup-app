import { describe, it, expect } from 'vitest';
import { Tournament } from '../src/models/Tournament';

describe('Tournament class', () => {
	it('should advance winners to the next round', () => {
		const matches = [
			{ team1: 'Brazil', team2: 'Germany', score1: 3, score2: 1 },
			{ team1: 'France', team2: 'Argentina', score1: 2, score2: 1 }
		];
		const tournament = new Tournament(matches);
		const winners = tournament.getWinners();
		console.log('winners from matches are', winners);

		expect(winners).toEqual(['Brazil', 'France']);
	});
});
