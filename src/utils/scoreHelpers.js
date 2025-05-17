import { getMatchKey } from './matchHelpers';

/**
 * the parameters of this function let the helper know:
 * which match to update (match)
 * which team's score is being updated ('score1 or 'score2)
 * what the new value is (value)
 * and how to update the state (setScores)
 */
export const handleScoreChangeHelper = (
	match,
	teamPosition,
	value,
	setScores
) => {
	const key = getMatchKey(match.team1, match.team2);
	setScores((prev) => ({
		...prev,
		[key]: {
			...prev[key],
			[teamPosition]: value
		}
	}));
};
