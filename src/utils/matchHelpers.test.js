import { describe, it, expect } from 'vitest';
import {
	matchHasClearWinner,
	determineWinner,
	isFinalMatch
} from './matchHelpers';

const mockTeam = (name) => ({ name, flag: '🏳️' });

describe('matchHelpers', () => {
	describe('matchHasClearWinner', () => {
		it('returns false if score1 or score2 is null', () => {
			expect(matchHasClearWinner({ score1: null, score2: 1 })).toBe(
				false
			);
			expect(matchHasClearWinner({ score1: 2, score2: null })).toBe(
				false
			);
		});

		it('returns false if score1 === score2 and no penalties', () => {
			const match = {
				score1: 1,
				score2: 1,
				penaltyScore1: null,
				penaltyScore2: null
			};

			expect(matchHasClearWinner(match)).toBe(false);
		});

		it('returns true for regular win', () => {
			expect(matchHasClearWinner({ score1: 2, score2: 1 })).toBe(true);
		});

		it('returns true for win via penalties', () => {
			const match = {
				score1: 1,
				score2: 1,
				penaltyScore1: 5,
				penaltyScore2: 4
			};

			expect(matchHasClearWinner(match)).toBe(true);
		});
	});

	describe('determineWinner', () => {
		const t1 = mockTeam('Brazil');
		const t2 = mockTeam('Germany');

		it('returns team1 for regular win', () => {
			const match = {
				score1: 3,
				score2: 1,
				team1: t1,
				team2: t2
			};
			expect(determineWinner(match)).toEqual(t1);
		});

		it('returns team2 for win via penalties', () => {
			const match = {
				score1: 1,
				score2: 1,
				penaltyScore1: 3,
				penaltyScore2: 4,
				team1: t1,
				team2: t2
			};
			expect(determineWinner(match)).toEqual(t2);
		});
	});

	describe('isFinalMatch', () => {
		it('returns true for a 1-match final round', () => {
			const knockoutRounds = [
				[{ team1: {}, team2: {} }],
				[{ team1: {}, team2: {} }]
			];
			const round = [{ team1: {}, team2: {} }];
			expect(isFinalMatch(round, 1, knockoutRounds)).toBe(true);
		});

		it('returns false for earlier rounds', () => {
			const knockoutRounds = [
				[
					{ team1: {}, team2: {} },
					{ team1: {}, team2: {} }
				]
			];
			const round = [
				{ team1: {}, team2: {} },
				{ team1: {}, team2: {} }
			];
			expect(isFinalMatch(round, 0, knockoutRounds)).toBe(false);
		});
	});
});
