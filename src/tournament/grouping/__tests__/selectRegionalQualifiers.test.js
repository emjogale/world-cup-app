import { describe, it, expect } from 'vitest';
import { selectRegionalQualifiers } from '../selectRegionalQualifiers';

describe('selectRegionalQualifiers', () => {
	it('selects top teams from each group and best runners-up', () => {
		const mockStats = {
			GroupA: {
				Team1: { points: 9, gd: 6, for: 10 },
				Team2: { points: 6, gd: 2, for: 6 }
			},
			GroupB: {
				Team3: { points: 9, gd: 5, for: 9 },
				Team4: { points: 7, gd: 1, for: 5 }
			},
			GroupC: {
				Team5: { points: 9, gd: 4, for: 8 },
				Team6: { points: 3, gd: -3, for: 3 }
			}
		};

		const result = selectRegionalQualifiers(mockStats, 4);

		// Ensure all selected teams are valid
		expect(result.map((t) => t.name)).toEqual(
			expect.arrayContaining(['Team1', 'Team3', 'Team5', 'Team4'])
		);
	});
});
