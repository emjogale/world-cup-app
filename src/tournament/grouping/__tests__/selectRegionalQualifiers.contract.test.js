// src/tournament/grouping/__tests__/selectRegionalQualifiers.contract.test.js
import { describe, it, expect } from 'vitest';
import { selectRegionalQualifiers } from '../selectRegionalQualifiers';

describe('selectRegionalQualifiers contract', () => {
	it('picks top team from each group; then best seconds by points/gd/gf', () => {
		const regionalStats = {
			'Group A': {
				Alpha: { name: 'Alpha', points: 6, gd: 3, for: 5 },
				Bravo: { name: 'Bravo', points: 4, gd: 1, for: 4 },
				Charlie: { name: 'Charlie', points: 1, gd: -2, for: 1 }
			},
			'Group B': {
				Delta: { name: 'Delta', points: 6, gd: 4, for: 6 },
				Echo: { name: 'Echo', points: 4, gd: 0, for: 3 },
				Foxtrot: { name: 'Foxtrot', points: 1, gd: -2, for: 1 }
			},
			'Group C': {
				Gamma: { name: 'Gamma', points: 6, gd: 2, for: 4 },
				Hotel: { name: 'Hotel', points: 4, gd: 1, for: 5 },
				India: { name: 'India', points: 0, gd: -5, for: 0 }
			}
		};

		// 3 spots → winners only
		const top3 = selectRegionalQualifiers(regionalStats, 3);
		expect(top3.map((t) => t.name)).toEqual(['Alpha', 'Delta', 'Gamma']);

		// 5 spots → winners + 2 best seconds (Bravo vs Echo vs Hotel)
		// Seconds sorted by points→gd→for : Hotel(4, +1,5), Bravo(4,+1,4), Echo(4,0,3)
		const top5 = selectRegionalQualifiers(regionalStats, 5);
		expect(top5.map((t) => t.name)).toEqual([
			'Alpha',
			'Delta',
			'Gamma',
			'Hotel',
			'Bravo'
		]);
	});
});
