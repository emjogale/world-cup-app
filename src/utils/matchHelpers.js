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

export const isReadyToSubmitRegular = (match) => {
	const { score1, score2 } = match;

	return typeof score1 === 'number' && typeof score2 === 'number';
};

export const isReadyToSubmitExtraTime = (match) => {
	const {
		score1,
		score2,
		extraTimeScore1,
		extraTimeScore2,

		extraTimePlayed
	} = match;

	const regDraw =
		typeof score1 === 'number' &&
		typeof score2 === 'number' &&
		score1 === score2;
	const extraSet =
		typeof extraTimeScore1 === 'number' &&
		typeof extraTimeScore2 === 'number';

	return regDraw && extraSet && !extraTimePlayed;
};

export const isReadyToSubmitPenalties = (match) => {
	const { extraTimeScore1, extraTimeScore2, penaltyScore1, penaltyScore2 } =
		match;

	const extraDraw =
		typeof extraTimeScore1 === 'number' &&
		typeof extraTimeScore2 === 'number' &&
		extraTimeScore1 === extraTimeScore2;

	const penaltiesValid =
		typeof penaltyScore1 === 'number' &&
		typeof penaltyScore2 === 'number' &&
		penaltyScore1 !== penaltyScore2;

	return extraDraw && penaltiesValid;
};

export const hasFinalWinner = (match) => {
	return match.played === true && typeof match.winner?.name === 'string';
};

export const getTournamentWinner = (knockoutRounds) => {
	if (!Array.isArray(knockoutRounds) || knockoutRounds.length === 0)
		return null;

	const lastRound = knockoutRounds[knockoutRounds.length - 1];
	if (lastRound.length === 1 && lastRound[0].played && lastRound[0].winner) {
		return lastRound[0].winner.name;
	}
	return null;
};
