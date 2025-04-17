export function hasFinalWinner(match) {
	if (match.score1 == null || match.score2 == null) return false;
	if (match.score1 !== match.score2) return true;
	if (
		match.penaltyScore1 != null &&
		match.penaltyScore2 != null &&
		match.penaltyScore1 !== match.penaltyScore2
	) {
		return true;
	}
	return false;
}

export function determineWinner(match) {
	const {
		score1,
		score2,
		extraTimeScore1,
		extraTimeScore2,
		penaltyScore1,
		penaltyScore2,
		team1,
		team2
	} = match;

	if (score1 > score2) return team1;
	if (score2 > score1) return team2;

	if (extraTimeScore1 > extraTimeScore2) return team1;
	if (extraTimeScore2 > extraTimeScore1) return team2;

	// If tied, check penalties
	if (penaltyScore1 != null && penaltyScore2 != null) {
		if (penaltyScore1 > penaltyScore2) return team1;
		if (penaltyScore2 > penaltyScore1) return team2;
	}

	return null;
}
