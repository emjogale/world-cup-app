import { describe, it, expect } from 'vitest';
import { autoCompleteGroupStage } from './devTools';

describe('autoCompleteGroupStage', () => {
	it('returns updated matches and stats', () => {
		const mockMatches = {
			GroupA: [
				{ team1: { name: 'Brazil' }, team2: { name: 'Germany' } },
				{ team1: { name: 'France' }, team2: { name: 'Argentina' } }
			]
		};

		const mockStats = {
			GroupA: {
				Brazil: {
					played: 0,
					won: 0,
					lost: 0,
					for: 0,
					against: 0,
					points: 0,
					gd: 0
				},
				Germany: {
					played: 0,
					won: 0,
					lost: 0,
					for: 0,
					against: 0,
					points: 0,
					gd: 0
				},
				France: {
					played: 0,
					won: 0,
					lost: 0,
					for: 0,
					against: 0,
					points: 0,
					gd: 0
				},
				Argentina: {
					played: 0,
					won: 0,
					lost: 0,
					for: 0,
					against: 0,
					points: 0,
					gd: 0
				}
			}
		};

		const { updatedMatches, updatedStats } = autoCompleteGroupStage(
			mockMatches,
			mockStats
		);

		expect(updatedMatches.GroupA[0].played).toBe(true);
		expect(updatedStats.GroupA.Brazil.won).toBe(1);
		expect(updatedStats.GroupA.Germany.lost).toBe(1);
	});
});
