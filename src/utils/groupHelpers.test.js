import { sortByGroupRanking } from './groupHelpers';
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
