import { describe, it, expect } from 'vitest';
import teams from '../teams.json';

const teamsCopy = JSON.parse(JSON.stringify(teams));
describe('Teams Data', () => {
	it('should be an array', () => {
		console.log(
			'typeof last teams flag is',
			typeof teams[teams.length - 1].flag
		);
		expect(Object.prototype.toString.call(teams)).toBe('[object Array]');
	});
	it('each team should have a name and flag', () => {
		teamsCopy.forEach((team, index) => {
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
