import { describe, expect, it, vi } from 'vitest';

import { groupTeams } from './groupTeams';

describe('groupTeams', () => {
	const mockTeams = Array.from({ length: 8 }, (_, i) => ({
		name: `Team ${i + 1}`,
		flag: `https://flagpedia.net/data/flags/w320/t${i + 1}.png`
	}));

	it('should divide teams into groups of 4', () => {
		const grouped = groupTeams(mockTeams);

		expect(Object.keys(grouped)).toHaveLength(2);
		expect(grouped.A).toHaveLength(4);
		expect(grouped.B).toHaveLength(4);
	});

	it('should assign correct group names (A, B, C...in order', () => {
		const names = Object.keys(groupTeams(mockTeams));
		expect(names).toEqual(['A', 'B']);
	});

	it('warns when a team count is not divisible by 4', () => {
		const teams = Array.from({ length: 10 }, (_, i) => ({
			name: `Team ${i + 1}`,
			flag: `flag${i + 1}`
		}));

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		groupTeams(teams);

		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('is not divisible by 4')
		);
		warnSpy.mockRestore();
	});
});
