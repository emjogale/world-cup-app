/**
 * Generates a test ID for a score input based on team names and position.
 * @param {string} team1 - First team name
 * @param {string} team2 - Second team name
 * @param {1 | 2} position - 1 for team1's score, 2 for team2's score
 * @returns {string} data-testid string for a score input
 */

import { safe } from '../utils/stringUtils';

export const getScoreTestId = (team1, team2, position) => {
	return `score-${safe(safe(team1))}-vs-${safe(team2)}-${position}`;
};
