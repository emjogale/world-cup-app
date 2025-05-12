import { updateGroupStats } from '../tournament/grouping/updateGroupStats';

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
	const results = matchesToDisplay.map(({ team1, team2 }) => ({
		team1: team1.name,
		score1: parseInt(scores[team1.name], 10),
		team2: team2.name,
		score2: parseInt(scores[team2.name], 10)
	}));
	const newStats = updateGroupStats(currentStats, results);

	const updatedMatches = matchesToDisplay.map((match) => {
		const matchWasJustPlayed = results.some(
			(r) =>
				(r.team1 === match.team1.name &&
					r.team2 === match.team2.name) ||
				(r.team1 === match.team2.name && r.team2 === match.team1.name)
		);
		return matchWasJustPlayed ? { ...match, played: true } : match;
	});

	const teamsToReset = new Set();
	results.forEach(({ team1, team2 }) => {
		teamsToReset.add(team1);
		teamsToReset.add(team2);
	});

	const nextScores = { ...scores };
	teamsToReset.forEach((team) => {
		nextScores[team] = '';
	});

	return {
		newStats,
		updatedMatches,
		nextScores
	};
};
