// src/utils/__tests__/handleGroupSubmitHelper.keys.test.js
import { describe, it, expect } from 'vitest';
import { handleGroupSubmitHelper } from '../../utils/groupHelpers';
import { getMatchKey } from '../../utils/matchHelpers';

const blank = (name) => ({
	name,
	played: 0,
	won: 0,
	drawn: 0,
	lost: 0,
	for: 0,
	against: 0,
	points: 0,
	gd: 0
});

describe('handleGroupSubmitHelper supports UI id and normalized keys', () => {
	it('reads scores by id/UI key', () => {
		const matches = [
			{
				id: 'Bravo-vs-Alpha',
				team1: { name: 'Bravo' },
				team2: { name: 'Alpha' },
				played: false
			}
		];
		const currentStats = { Alpha: blank('Alpha'), Bravo: blank('Bravo') };
		const scores = { 'Bravo-vs-Alpha': { score1: '2', score2: '0' } };

		const { newStatsByName } = handleGroupSubmitHelper({
			matchesToDisplay: matches,
			scores,
			currentStats
		});
		expect(newStatsByName.Bravo.points).toBe(3);
		expect(newStatsByName.Alpha.points).toBe(0);
	});

	it('reads scores by normalized key', () => {
		const matches = [
			{
				team1: { name: 'Bravo' },
				team2: { name: 'Alpha' },
				played: false
			}
		];
		const currentStats = { Alpha: blank('Alpha'), Bravo: blank('Bravo') };
		const norm = getMatchKey(matches[0].team1, matches[0].team2);
		const scores = { [norm]: { score1: '0', score2: '2' } }; // normalized left may be Alpha

		const { newStatsByName } = handleGroupSubmitHelper({
			matchesToDisplay: matches,
			scores,
			currentStats
		});
		expect(newStatsByName.Alpha.points).toBe(3);
		expect(newStatsByName.Bravo.points).toBe(0);
	});
});
