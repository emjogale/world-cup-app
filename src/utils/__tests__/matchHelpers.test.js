import { describe, it, expect } from 'vitest';
import { determineWinner } from './../matchHelpers';

const mockTeam = (name) => ({ name, flag: '🏳️' });

describe('matchHelpers', () => {
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
