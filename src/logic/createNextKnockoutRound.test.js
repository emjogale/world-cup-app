import { describe, it, expect } from 'vitest';
import { createNextKnockoutRound } from './createNextKnockoutRound';

describe('createNextKnockoutRound', () => {
	it('generates next round with correct winners only', () => {
		const currentRound = [
			{
				team1: { name: 'Brazil' },
				team2: { name: 'Germany' },
				score1: 2,
				score2: 1,
				winner: 'Brazil'
			},
			{
				team1: { name: 'France' },
				team2: { name: 'Argentina' },
				score1: 1,
				score2: 3,
				winner: 'Argentina'
			}
		];
		const nextRound = createNextKnockoutRound(currentRound);

		expect(nextRound).toEqual([
			{
				team1: { name: 'Brazil' },
				team2: { name: 'Argentina' },
				score1: null,
				score2: null,
				winner: null
			}
		]);
	});

	it('handles incomplete matches by inserting placeholders', () => {
		const currentRound = [
			{
				team1: { name: 'Brazil' },
				team2: { name: 'Germany' },
				score1: 2,
				score2: 1,
				winner: 'Brazil'
			},
			{
				team1: { name: 'France' },
				team2: { name: 'Argentina' },
				score1: null,
				score2: null,
				winner: null
			}
		];

		const nextRound = createNextKnockoutRound(currentRound);

		expect(nextRound).toEqual([
			{
				team1: { name: 'Brazil' },
				team2: { name: 'TBD', flag: '🏳️' },
				score1: null,
				score2: null,
				winner: null
			}
		]);
	});
});
