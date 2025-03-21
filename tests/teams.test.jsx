import { describe, it, expect } from 'vitest';

// mock teams data
const mockTeams = [
	{ name: 'Brazil', flag: 'https://flagpedia.net/data/flags/w320/br.png' },
	{ name: 'Germany', flag: 'https://flagpedia.net/data/flags/w320/de.png' }
];

describe('Teams Data', () => {
	it('should be an array', () => {
		expect(Object.prototype.toString.call(mockTeams)).toBe(
			'[object Array]'
		);
	});
	it('each team should have a name and flag', () => {
		mockTeams.forEach((team, index) => {
			expect(typeof team.name).toBe('string');
			console.log(`Team at index ${index}:`, team);
			expect(typeof team.flag).toBe('string');
			expect(team).toHaveProperty('name');
			expect(team.flag).toBeDefined();
			expect(team.flag).toMatch(
				/^https:\/\/flagpedia\.net\/data\/flags\/w320\/[a-z]{2}(?:-[a-z0-9]{1,3})?\.png$/
			);
		});
	});
});
