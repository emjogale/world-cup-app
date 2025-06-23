import { describe, it, expect } from 'vitest';
import {
	selectAllRegionalWinners,
	selectRegionalWinners
} from '../selectRegionalWinners';

describe('selectRegionalWinners', () => {
	const makeMockTeams = (prefix, count) =>
		Array.from({ length: count }, (_, i) => ({
			name: `${prefix} Team ${i}`
		}));

	it('selects 13 UEFA teams', () => {
		const teams = makeMockTeams('UEFA', 20);
		const selected = selectRegionalWinners('UEFA', teams);
		expect(selected).toHaveLength(13);
	});

	it('selects 5 CAF teams', () => {
		const teams = makeMockTeams('CAF', 14);
		const selected = selectRegionalWinners('CAF', teams);
		expect(selected).toHaveLength(5);
	});

	it('selects 1 OFC team', () => {
		const teams = makeMockTeams('OFC', 6);
		const selected = selectRegionalWinners('OFC', teams);
		expect(selected).toHaveLength(1);
	});
});

describe('selectAllRegionalWinners', () => {
	it('selects the correct total number of winners across all regions', () => {
		const grouped = {
			UEFA: Array(20).fill({ region: 'UEFA' }),
			CAF: Array(14).fill({ region: 'CAF' }),
			AFC: Array(12).fill({ region: 'AFC' }),
			CONMEBOL: Array(8).fill({ region: 'CONMEBOL' }),
			CONCACAF: Array(8).fill({ region: 'CONCACAF' }),
			OFC: Array(6).fill({ region: 'OFC' })
		};

		const winners = selectAllRegionalWinners(grouped);
		expect(winners).toHaveLength(13 + 5 + 5 + 4 + 3 + 1);
	});
});
