import { describe, it, expect } from 'vitest';
import { selectQualifiedTeams } from '../selectQualifiedTeams';

// Mock data for testing including fake flags
const buildTeam = (name, stats = {}) => ({
	name,
	flag: `🏳️‍🌈`,
	points: 0,
	gd: 0,
	for: 0,
	...stats
});

describe('selectQualifiedTeams', () => {
	it('selects top 2 from each group and best 8 third-place teams', () => {
		const mockStats = {
			A: {
				TeamA1: buildTeam('TeamA1', { points: 9 }),
				TeamA2: buildTeam('TeamA2', { points: 6 }),
				TeamA3: buildTeam('TeamA3', { points: 3 }),
				TeamA4: buildTeam('TeamA4', { points: 0 })
			},
			B: {
				TeamB1: buildTeam('TeamB1', { points: 9 }),
				TeamB2: buildTeam('TeamB2', { points: 6 }),
				TeamB3: buildTeam('TeamB3', { points: 3 }),
				TeamB4: buildTeam('TeamB4', { points: 0 })
			},
			C: {
				TeamC1: buildTeam('TeamC1', { points: 9 }),
				TeamC2: buildTeam('TeamC2', { points: 6 }),
				TeamC3: buildTeam('TeamC3', { points: 4 }),
				TeamC4: buildTeam('TeamC4', { points: 0 })
			},
			D: {
				TeamD1: buildTeam('TeamD1', { points: 9 }),
				TeamD2: buildTeam('TeamD2', { points: 6 }),
				TeamD3: buildTeam('TeamD3', { points: 2 }),
				TeamD4: buildTeam('TeamD4', { points: 1 })
			},
			E: {
				TeamE1: buildTeam('TeamE1', { points: 7 }),
				TeamE2: buildTeam('TeamE2', { points: 5 }),
				TeamE3: buildTeam('TeamE3', { points: 4 }),
				TeamE4: buildTeam('TeamE4', { points: 1 })
			},
			F: {
				TeamF1: buildTeam('TeamF1', { points: 7 }),
				TeamF2: buildTeam('TeamF2', { points: 5 }),
				TeamF3: buildTeam('TeamF3', { points: 3 }),
				TeamF4: buildTeam('TeamF4', { points: 0 })
			},
			G: {
				TeamG1: buildTeam('TeamG1', { points: 6 }),
				TeamG2: buildTeam('TeamG2', { points: 6 }),
				TeamG3: buildTeam('TeamG3', { points: 3 }),
				TeamG4: buildTeam('TeamG4', { points: 0 })
			},
			H: {
				TeamH1: buildTeam('TeamH1', { points: 9 }),
				TeamH2: buildTeam('TeamH2', { points: 6 }),
				TeamH3: buildTeam('TeamH3', { points: 2 }),
				TeamH4: buildTeam('TeamH4', { points: 0 })
			},
			I: {
				TeamI1: buildTeam('TeamI1', { points: 8 }),
				TeamI2: buildTeam('TeamI2', { points: 7 }),
				TeamI3: buildTeam('TeamI3', { points: 6 }),
				TeamI4: buildTeam('TeamI4', { points: 1 })
			},
			J: {
				TeamJ1: buildTeam('TeamJ1', { points: 7 }),
				TeamJ2: buildTeam('TeamJ2', { points: 6 }),
				TeamJ3: buildTeam('TeamJ3', { points: 4 }),
				TeamJ4: buildTeam('TeamJ4', { points: 1 })
			},
			K: {
				TeamK1: buildTeam('TeamK1', { points: 7 }),
				TeamK2: buildTeam('TeamK2', { points: 5 }),
				TeamK3: buildTeam('TeamK3', { points: 3 }),
				TeamK4: buildTeam('TeamK4', { points: 0 })
			},
			L: {
				TeamL1: buildTeam('TeamL1', { points: 9 }),
				TeamL2: buildTeam('TeamL2', { points: 6 }),
				TeamL3: buildTeam('TeamL3', { points: 4 }),
				TeamL4: buildTeam('TeamL4', { points: 0 })
			}
		};

		const qualified = selectQualifiedTeams(mockStats);
		expect(qualified).toHaveLength(32);

		// Basic spot check
		expect(qualified.map((t) => t.name)).toContain('TeamI3'); // strong 3rd
		expect(qualified.map((t) => t.name)).not.toContain('TeamD3'); // weak 3rd
	});
});
