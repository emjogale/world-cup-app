import { describe, it, expect } from 'vitest';
import { hasFinalWinner, determineWinner } from './matchHelpers';

const mockTeam = (name) => ({ name, flag: '🏳️' });

describe('matchHelpers', () => {
	describe('hasFinalWinner', () => {
		it('returns false if score1 or score2 is null', () => {
			expect(hasFinalWinner({ score1: null, score2: 1 })).toBe(false);
			expect(hasFinalWinner({ score1: 2, score2: null })).toBe(false);
		});

		it('returns false if score1 === score2 and no penalties', () => {
			const match = {
				score1: 1,
				score2: 1,
				penaltyScore1: null,
				penaltyScore2: null
			};

			expect(hasFinalWinner(match)).toBe(false);
		});

		it('returns true for regular win', () => {
			expect(hasFinalWinner({ score1: 2, score2: 1 })).toBe(true);
		});

		it('returns true for win via penalties', () => {
			const match = {
				score1: 1,
				score2: 1,
				penaltyScore1: 5,
				penaltyScore2: 4
			};

			expect(hasFinalWinner(match)).toBe(true);
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
});
