import { describe, it, expect, beforeEach } from 'vitest';
import { Tournament } from '../src/models/Tournament';

describe('Tournament class with fixed seed for randomness', () => {
	let tournament;
	const teams = ['Brazil', 'Germany', 'France', 'Argentina'];

	// pass fixed seed to the Tournament instance
	beforeEach(() => {
		tournament = new Tournament(teams, 'test-seed');
		const shuffledTeams = tournament.teams;
		console.log('shuffled teams are: ', shuffledTeams);
	});
	it('should shuffle teams predictably', () => {
		const expectedShuffledTeams = [
			'Brazil',
			'France',
			'Argentina',
			'Germany'
		]; // Expected order based on the seed
		expect(tournament.teams).toEqual(expectedShuffledTeams);
	});
	it('should update scores after a match has been played', () => {
		tournament.updateMatchScores(0, 3, 1); // 0 denotes it is the match at index 0 in matches

		// Check that the scores have been updated correctly
		expect(tournament.matches[0].score1).toBe(3);
		expect(tournament.matches[0].score2).toBe(1);
	});

	it('should advance winners to the next round', () => {
		// // assinging scores to matches
		tournament.updateMatchScores(0, 3, 1); // Brazil vs France
		tournament.updateMatchScores(1, 2, 1); // Argentina vs Germany

		const winners = tournament.getWinners();
		console.log('winners from matches are', winners);
		expect(winners).toStrictEqual(['Brazil', 'Argentina']);
	});
});
