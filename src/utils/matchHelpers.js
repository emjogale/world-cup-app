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

export const isReadyToSubmit = (match) => {
	const {
		score1,
		score2,
		extraTimeScore1,
		extraTimeScore2,
		penaltyScore1,
		penaltyScore2
	} = match;

	if (typeof score1 !== 'number' || typeof score2 !== 'number') return false;

	if (score1 !== score2) return true; // regular time win

	// Allow submission at end of regular time if it's a draw
	if (
		extraTimeScore1 == null &&
		extraTimeScore2 == null &&
		penaltyScore1 == null &&
		penaltyScore2 == null
	) {
		return true;
	}

	if (
		typeof extraTimeScore1 !== 'number' ||
		typeof extraTimeScore2 !== 'number'
	)
		return false;

	if (extraTimeScore1 !== extraTimeScore2) return true;

	if (typeof penaltyScore1 !== 'number' || typeof penaltyScore2 !== 'number')
		return false;

	return penaltyScore1 !== penaltyScore2;
};
