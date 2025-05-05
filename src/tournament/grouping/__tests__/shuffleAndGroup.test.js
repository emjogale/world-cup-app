import { describe, it, expect } from 'vitest';
import { shuffleAndGroup } from '../shuffleAndGroup';

const mockTeams = [
	{ name: 'Argentina', flag: '🇦🇷' },
	{ name: 'Australia', flag: '🇦🇺' },
	{ name: 'Belgium', flag: '🇧🇪' },
	{ name: 'Brazil', flag: '🇧🇷' },
	{ name: 'Cameroon', flag: '🇨🇲' },
	{ name: 'Canada', flag: '🇨🇦' },
	{ name: 'Chile', flag: '🇨🇱' },
	{ name: 'China', flag: '🇨🇳' }
];

describe('shuffleAndGroup', () => {
	it('shuffles and groups teams into 2 groups of 4 with stable seed', () => {
		const grouped = shuffleAndGroup(mockTeams, 'test-seed');
		// console.log('grouped is', grouped);
		// console.log('flat is', Object.values(grouped).flat());

		expect(Object.keys(grouped)).toHaveLength(2); // 2 groups
		expect(Object.values(grouped).flat()).toHaveLength(8); // 8 teams flat

		const teamNames = Object.values(grouped)
			.flat()
			.map((t) => t.name);

		expect(teamNames).toEqual([
			'China',
			'Argentina',
			'Canada',
			'Chile',
			'Australia',
			'Brazil',
			'Cameroon',
			'Belgium'
		]);
	});
});
