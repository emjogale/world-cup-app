import { describe, it, expect } from 'vitest';
import { createNextKnockoutRound } from '../createNextKnockoutRound';
import { createFirstKnockoutRound } from '../createFirstKnockoutRound';
import { isBYE } from '../isBYE';

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

// --- BYE handling tests ---
// Tiny helpers
const TEAM = (name) => ({ name });
const mkTeams = (n, prefix = 'T') =>
	Array.from({ length: n }, (_, i) => TEAM(`${prefix}${i + 1}`));

describe('Knockout prelims + next round handling (real-world)', () => {
	it('with a perfect power of two (e.g. 16) creates direct pairings, no prelims, no BYEs', () => {
		const teams = mkTeams(16, 'Q');
		const r1 = createFirstKnockoutRound(teams);

		// Expect 8 matches, none auto-played
		expect(r1.length).toBe(8);
		r1.forEach((m) => {
			expect(isBYE(m.team1)).toBe(false);
			expect(isBYE(m.team2)).toBe(false);
			expect(m.played).toBe(false);
		});
	});

	it('with 24 teams creates prelims for 16, and 8 waiting teams skip into the Round of 16', () => {
		const teams = mkTeams(24, 'T');
		const prelim = createFirstKnockoutRound(teams);

		// Expect 8 prelim matches + 8 waiting "auto-advance" entries
		const prelimMatches = prelim.filter((m) => !m.waiting);
		const waiting = prelim.filter((m) => m.waiting);

		expect(prelimMatches.length).toBe(8);
		expect(waiting.length).toBe(8);

		// Advance to next round
		prelimMatches.forEach((m) => {
			m.played = true;
			m.winner = m.team1; // arbitrary
		});
		const r2 = createNextKnockoutRound(prelim);

		// Round of 16 = 16 teams → 8 matches
		expect(r2.length).toBe(8);
		r2.forEach((m) => {
			expect(isBYE(m.team1)).toBe(false);
			expect(isBYE(m.team2)).toBe(false);
			expect(m.played).toBe(false);
		});
	});

	it('with 20 teams creates 4 prelim matches (8 teams) and 12 waiting', () => {
		const teams = mkTeams(20, 'U');
		const prelim = createFirstKnockoutRound(teams);

		const prelimMatches = prelim.filter((m) => !m.waiting);
		const waiting = prelim.filter((m) => m.waiting);

		expect(prelimMatches.length).toBe(4);
		expect(waiting.length).toBe(12);

		// Simulate prelim results
		prelimMatches.forEach((m) => {
			m.played = true;
			m.winner = m.team2; // arbitrary
		});
		const r2 = createNextKnockoutRound(prelim);

		// Should produce exactly 16 teams → 8 matches
		expect(r2.length).toBe(8);
		r2.forEach((m) => {
			expect(isBYE(m.team1)).toBe(false);
			expect(isBYE(m.team2)).toBe(false);
			expect(m.played).toBe(false);
		});
	});

	it('handles odd counts (e.g. 17 teams → 1 prelim match, 15 waiting → 16 total)', () => {
		const teams = mkTeams(17, 'X');
		const prelim = createFirstKnockoutRound(teams);

		const prelimMatches = prelim.filter((m) => !m.waiting);
		const waiting = prelim.filter((m) => m.waiting);

		expect(prelimMatches.length).toBe(1);
		expect(waiting.length).toBe(15);

		// Simulate prelim
		prelimMatches[0].played = true;
		prelimMatches[0].winner = prelimMatches[0].team1;
		const r2 = createNextKnockoutRound(prelim);

		// 16 teams → 8 matches
		expect(r2.length).toBe(8);
	});
});
