export const matchHasClearWinner = (match) => {
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
};

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
	console.log('🔎 isReadyToSubmitRegular:', match);
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

	console.log('📍 Checking ExtraTime:', {
		score1,
		score2,
		extraTimeScore1,
		extraTimeScore2,
		regDraw,
		extraSet,
		ready: regDraw && extraSet && !extraTimePlayed
	});

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
	console.log('📍 Checking Penalties:', {
		extraTimeScore1,
		extraTimeScore2,
		penaltyScore1,
		penaltyScore2,
		extraDraw,
		penaltiesValid
	});

	return extraDraw && penaltiesValid;
};

export const hasFinalWinner = (match) => {
	return match.played === true && typeof match.winner?.name === 'string';
};
