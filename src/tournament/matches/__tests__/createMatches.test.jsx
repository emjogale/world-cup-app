import { describe, it, expect, vi } from 'vitest';
import { createRoundMatches } from '../createMatches';
import { createGroupMatches } from '../createMatches';

describe('createMatches.js', () => {
	describe('createRoundMatches', () => {
		it('should create matches from an even number of teams', () => {
			const teams = ['Brazil', 'Germany', 'France', 'Argentina'];
			const matches = createRoundMatches(teams);

			expect(matches).toHaveLength(2);
			expect(matches[0]).toEqual({
				team1: 'Brazil',
				team2: 'Germany',
				score1: null,
				score2: null,
				extraTimeScore1: null,
				extraTimeScore2: null,
				penaltyScore1: null,
				penaltyScore2: null,
				regularTimePlayed: false,
				extraTimePlayed: false,
				penaltiesPlayed: false,
				winner: null
			});
		});
		it('Should log a warning if there is an odd number of teams', () => {
			const warnSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {});
			const teams = ['Brazil', 'Germany', 'France'];
			const matches = createRoundMatches(teams);

			expect(matches).toHaveLength(1);
			expect(warnSpy).toHaveBeenCalledWith(
				'Odd number of teams; France has no opponent.'
			);
			warnSpy.mockRestore();
		});
	});
	it('creates 16 matches from 32 teams', () => {
		const teams = Array.from({ length: 32 }, (_, i) => ({
			name: `Team${i + 1}`
		}));

		const matches = createRoundMatches(teams);

		expect(matches).toHaveLength(16);
		expect(matches[0]).toEqual({
			team1: teams[0],
			team2: teams[1],
			score1: null,
			score2: null,
			extraTimeScore1: null,
			extraTimeScore2: null,
			penaltyScore1: null,
			penaltyScore2: null,
			regularTimePlayed: false,
			extraTimePlayed: false,
			penaltiesPlayed: false,
			winner: null
		});
	});
});

describe('createGroupMatches', () => {
	it('generates all the unique match combinations for a group of 4 teams', () => {
		const mockGroup = ['Brazil', 'Germany', 'France', 'Argentina'];
		const matches = createGroupMatches(mockGroup.map((name) => ({ name })));

		expect(matches).toHaveLength(6);
		const matchStrings = matches.map(
			(m) => `${m.team1.name} vs ${m.team2.name}`
		);

		expect(matchStrings).toEqual(
			expect.arrayContaining([
				'Brazil vs Germany',
				'Brazil vs France',
				'Brazil vs Argentina',
				'Germany vs France',
				'Germany vs Argentina',
				'France vs Argentina'
			])
		);
	});

	it('ensures no team plays against itself', () => {
		const mockGroup = ['Brazil', 'Germany', 'France'];
		const matches = createGroupMatches(mockGroup.map((name) => ({ name })));

		matches.forEach((match) => {
			expect(match.team1.name).not.toBe(match.team2.name);
		});
	});

	it('creates the correct number of matches for a group of 6 teams', () => {
		const mockGroup = ['A', 'B', 'C', 'D', 'E', 'F'];
		const matches = createGroupMatches(mockGroup.map((name) => ({ name })));

		expect(matches).toHaveLength(15); // (6 * 5) / 2 = 15 matches
	});
});
