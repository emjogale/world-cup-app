export function hasFinalWinner(match) {
	if (match.score1 == null || match.score2 == null) return false;
	if (match.score1 !== match.score2) return true;
	if (
		match.penalties1 != null &&
		match.penalties2 != null &&
		match.penalties1 !== match.penalties2
	) {
		return true;
	}
	return false;
}

export function determineWinner(match) {
	const { score1, score2, penalties1, penalties2, team1, team2 } = match;

	if (score1 > score2) return team1;
	if (score2 > score1) return team2;

	// If tied, check penalties
	if (penalties1 != null && penalties2 != null) {
		if (penalties1 > penalties2) return team1;
		if (penalties2 > penalties1) return team2;
	}

	return null;
}
