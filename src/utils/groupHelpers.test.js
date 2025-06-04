import {
	handleGroupSubmitHelper,
	sortByGroupRanking,
	splitIntoGroups
} from './groupHelpers';
import { describe, it, expect } from 'vitest';

describe('sortByGroupRanking', () => {
	it('sorts teams by points, goal difference, and goals for', () => {
		const teams = [
			{ name: 'Team A', points: 6, gd: 1, for: 5 },
			{ name: 'Team B', points: 6, gd: 1, for: 6 },
			{ name: 'Team C', points: 7, gd: 0, for: 4 }
		];

		const sorted = teams.sort(sortByGroupRanking);

		expect(sorted.map((t) => t.name)).toEqual([
			'Team C',
			'Team B',
			'Team A'
		]);
	});
});

describe('handleGroupSubmitHelper', () => {
	it('updates stats, marks matches played, and clears scores', () => {
		const matchesToDisplay = [
			{
				team1: { name: 'Team A' },
				team2: { name: 'Team B' },
				played: false
			},
			{
				team1: { name: 'Team C' },
				team2: { name: 'Team D' },
				played: false
			}
		];

		const scores = {
			'Team A-vs-Team B': { score1: '2', score2: '1' },
			'Team C-vs-Team D': { score1: '0', score2: '3' }
		};

		const currentStats = {
			'Team A': {
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			},
			'Team B': {
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			},
			'Team C': {
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				points: 0,
				gd: 0
			},
			'Team D': {
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

		const { newStats, updatedMatches, nextScores } =
			handleGroupSubmitHelper({
				matchesToDisplay,
				scores,
				currentStats
			});

		// Check matches marked as played
		expect(updatedMatches.every((m) => m.played)).toBe(true);

		// Check stats updated correctly
		expect(newStats['Team A'].won).toBe(1);
		expect(newStats['Team B'].lost).toBe(1);
		expect(newStats['Team D'].won).toBe(1);
		expect(newStats['Team C'].lost).toBe(1);

		// Check scores cleared
		expect(nextScores).toEqual({
			'Team A-vs-Team B': {
				score1: '',
				score2: ''
			},
			'Team C-vs-Team D': {
				score1: '',
				score2: ''
			}
		});
	});
});

describe('splitIntoGroups', () => {
	it('splits an array of teams into groups of a given size', () => {
		const teams = Array.from({ length: 14 }, (_, i) => ({
			name: `Team ${i + 1}`
		}));
		const groups = splitIntoGroups(teams, 5);

		// should result in 3 groups: 5 + 5 + 4
		expect(groups.length).toBe(3);
		expect(groups[0].length).toBe(5);
		expect(groups[1].length).toBe(5);
		expect(groups[2].length).toBe(4);
	});

	it('returns one group if total teams <= groupSize', () => {
		const teams = [
			{ name: 'Team A' },
			{ name: 'Team B' },
			{ name: 'Team C' }
		];

		const groups = splitIntoGroups(teams, 6);

		expect(groups.length).toBe(1);
		expect(groups).toEqual([teams]);
	});
});
