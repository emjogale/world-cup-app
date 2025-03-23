import { describe, expect, it } from 'vitest';

import { groupTeams } from './groupTeams';

describe('groupTeams', () => {
	const mockTeams = Array.from({ length: 8 }, (_, i) => ({
		name: `Team ${i + 1}`,
		flag: `https://flagpedia.net/data/flags/w320/t${i + 1}.png`
	}));

	it('should divide teams into groups of 4', () => {
		const grouped = groupTeams(mockTeams);

		console.log(grouped);

		expect(Object.keys(grouped)).toHaveLength(2);
		expect(grouped.A).toHaveLength(4);
		expect(grouped.B).toHaveLength(4);
	});

	it('should assign correct group names (A, B, C...', () => {
		const names = Object.keys(groupTeams(mockTeams));
		expect(names).toEqual(['A', 'B']);
	});
});
