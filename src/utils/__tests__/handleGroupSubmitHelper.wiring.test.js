// src/utils/__tests__/handleGroupSubmitHelper.wiring.test.js
import { describe, it, expect } from 'vitest';
import { handleGroupSubmitHelper } from '../../utils/groupHelpers';

describe('handleGroupSubmitHelper wiring', () => {
	it('updates stats, marks played, and clears only the submitted matches', () => {
		const matches = [
			{
				id: 'A-vs-B',
				team1: { name: 'A' },
				team2: { name: 'B' },
				played: false
			},
			{
				id: 'A-vs-C',
				team1: { name: 'A' },
				team2: { name: 'C' },
				played: false
			}
		];

		const k1 = 'A-vs-B';
		const k2 = 'A-vs-C';
		const k3 = 'B-vs-C';

		const scores = {
			[k1]: { score1: '2', score2: '0' },
			[k2]: { score1: '1', score2: '1' },
			[k3]: { score1: '7', score2: '7' } // not submitted this round
		};

		const currentStats = {
			A: {
				name: 'A',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			},
			B: {
				name: 'B',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			},
			C: {
				name: 'C',
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			}
		};

		const { newStatsByName, updatedMatches, nextScores } =
			handleGroupSubmitHelper({
				matchesToDisplay: matches,
				scores,
				currentStats
			});

		expect(updatedMatches.every((m) => m.played)).toBe(true);
		expect(newStatsByName.A.played).toBe(2);
		expect(newStatsByName.B.points).toBe(0);
		expect(newStatsByName.C.points).toBe(1);

		// submitted ones cleared
		expect(nextScores[k1]).toEqual({ score1: '', score2: '' });
		expect(nextScores[k2]).toEqual({ score1: '', score2: '' });
		// untouched fixture stays as-is
		expect(nextScores[k3]).toEqual({ score1: '7', score2: '7' });
	});
});
