import { updateGroupStats } from '../tournament/grouping/updateGroupStats';
import { getMatchKey } from './matchHelpers';

// sorts teams by points, then goal difference, then goals for
export const sortByGroupRanking = (a, b) =>
	b.points - a.points || b.gd - a.gd || b.for - a.for;

/**
 * Take a list of matches and score input state
 * from this produce updated stats via updateGroupStats
 * mark matches as played
 * clear score inputs
 */

export const handleGroupSubmitHelper = ({
	matchesToDisplay,
	scores,
	currentStats
}) => {
	// Build results array from score inputs
	const results = matchesToDisplay.map(({ team1, team2 }) => {
		const key = getMatchKey(team1, team2);
		return {
			team1: team1.name,
			score1: parseInt(scores[key]?.score1, 10),
			team2: team2.name,
			score2: parseInt(scores[key]?.score2, 10)
		};
	});

	// Update stats with these match results
	const newStats = updateGroupStats(currentStats, results);

	// Create a Set of keys for submitted matches
	const justPlayedKeys = new Set(
		results.map((r) => getMatchKey({ name: r.team1 }, { name: r.team2 }))
	);

	// Mark those matches as played
	const updatedMatches = matchesToDisplay.map((match) => {
		const matchKey = getMatchKey(match.team1, match.team2);
		return justPlayedKeys.has(matchKey)
			? { ...match, played: true }
			: match;
	});

	// Clear only the submitted match scores
	const keysToReset = matchesToDisplay.map((match) =>
		getMatchKey(match.team1, match.team2)
	);
	const nextScores = { ...scores };
	keysToReset.forEach((key) => {
		nextScores[key] = { score1: '', score2: '' };
	});

	return {
		newStats,
		updatedMatches,
		nextScores
	};
};
