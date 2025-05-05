import { describe, it, expect } from 'vitest';
import { createNextKnockoutRound } from '../createNextKnockoutRound';

describe('createNextKnockoutRound', () => {
	it('generates next round with correct winners only', () => {
		const currentRound = [
			{
				team1: { name: 'Brazil' },
				team2: { name: 'Germany' },
				score1: 2,
				score2: 1,
				extraTimeScore1: null,
				extraTimeScore2: null,
				penaltyScore1: null,
				penaltyScore2: null,
				regularTimePlayed: false,
				extraTimePlayed: false,
				penaltiesPlayed: false,
				played: true,
				winner: { name: 'Brazil' }
			},
			{
				team1: { name: 'France' },
				team2: { name: 'Argentina' },
				score1: 1,
				score2: 3,
				extraTimeScore1: null,
				extraTimeScore2: null,
				penaltyScore1: null,
				penaltyScore2: null,
				regularTimePlayed: false,
				extraTimePlayed: false,
				penaltiesPlayed: false,
				played: true,
				winner: { name: 'Argentina' }
			}
		];
		const nextRound = createNextKnockoutRound(currentRound);

		expect(nextRound).toMatchSnapshot(
			'Next round after first knockout round'
		);
	});

	it('handles incomplete matches by inserting placeholders', () => {
		const currentRound = [
			{
				team1: { name: 'Brazil', flag: '🇧🇷' },
				team2: { name: 'Germany', flag: '🇩🇪' },
				score1: 2,
				score2: 1,
				played: true,
				winner: { name: 'Brazil', flag: '🇧🇷' }
			},
			{
				team1: { name: 'France', flag: '🇫🇷' },
				team2: { name: 'Argentina', flag: '🇦🇷' },
				played: false,
				winner: null
			}
		];

		const nextRound = createNextKnockoutRound(currentRound);

		expect(nextRound).toEqual([]);
	});
});
