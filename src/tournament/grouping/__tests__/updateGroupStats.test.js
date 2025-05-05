import {
	emptyStats,
	initializeGroupStats,
	updateGroupStats,
	buildInitialGroupStats
} from '../updateGroupStats'; // adjust if needed
import { describe, it, expect } from 'vitest';

describe('group stat helpers', () => {
	it('emptyStats returns all zeroed fields', () => {
		expect(emptyStats()).toEqual({
			played: 0,
			won: 0,
			drawn: 0,
			lost: 0,
			for: 0,
			against: 0,
			points: 0,
			gd: 0
		});
	});

	it('initializeGroupStats sets stats for each team', () => {
		const teams = [{ name: 'Brazil' }, { name: 'Germany' }];
		const stats = initializeGroupStats(teams);

		expect(stats.Brazil.played).toBe(0);
		expect(stats.Germany.points).toBe(0);
	});

	it('buildInitialGroupStats creates nested group stats', () => {
		const groups = {
			A: [{ name: 'France', flag: '🇫🇷' }]
		};
		const stats = buildInitialGroupStats(groups);

		expect(stats.A.France).toEqual({
			name: 'France',
			flag: '🇫🇷',
			...emptyStats()
		});
	});

	it('updateGroupStats applies a win, loss, and goal tally', () => {
		const current = initializeGroupStats([
			{ name: 'France' },
			{ name: 'Spain' }
		]);

		const updated = updateGroupStats(current, [
			{ team1: 'France', score1: 2, team2: 'Spain', score2: 1 }
		]);

		expect(updated.France.won).toBe(1);
		expect(updated.France.points).toBe(3);
		expect(updated.Spain.lost).toBe(1);
	});
});
