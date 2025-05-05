import { assignTeamsToGroups } from '../assignTeamsToGroups';
import { describe, it, expect } from 'vitest';

describe('assignTeamsToGroups', () => {
	it('divides 12 teams into 2 groups of 6', () => {
		const mockTeams = Array.from({ length: 12 }, (_, i) => ({
			name: `Team ${i + 1}`
		}));
		const groups = assignTeamsToGroups(mockTeams, 6);
		expect(groups).toHaveLength(2);

		expect(groups[0].name).toBe('Group A');
		expect(groups[1].name).toBe('Group B');

		expect(groups[0].teams).toHaveLength(6);
		expect(groups[1].teams).toHaveLength(6);
	});

	it('handles uneven team count by filling the last group partially', () => {
		const mockTeams = Array.from({ length: 13 }, (_, i) => ({
			name: `Team ${i + 1}`
		}));

		const groups = assignTeamsToGroups(mockTeams, 6);

		expect(groups).toHaveLength(3); // 6 + 6 + 1
		expect(groups[2].teams).toHaveLength(1);
		expect(groups[2].name).toBe('Group C');
	});

	it('returns an empty array when given no teams', () => {
		const groups = assignTeamsToGroups([], 6);
		expect(groups).toEqual([]);
	});
});
