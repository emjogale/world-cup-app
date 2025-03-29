import { describe, it, expect, vi } from 'vitest';
import { createRoundMatches } from './createMatches';
import { createGroupMatches } from './createMatches';

describe('createMatches.js', () => {
	describe('createRoundMatches', () => {
		it('should create matches from an even number odf teams', () => {
			const teams = ['Brazil', 'Germany', 'France', 'Argentina'];
			const matches = createRoundMatches(teams);

			expect(matches).toHaveLength(2);
			expect(matches[0]).toEqual({
				team1: 'Brazil',
				team2: 'Germany',
				score1: null,
				score2: null
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
});
