export const createNextKnockoutRound = (matches) => {
	const winners = matches
		.filter((match) => match.played && match.winner)
		.map((match) => match.winner);

	if (winners.length <= 1) {
		return []; // Tournament over
	}

	if (winners.length % 2 !== 0) {
		return []; // Cannot create fair next round yet
	}

	const nextRound = [];

	for (let i = 0; i < winners.length; i += 2) {
		const team1 = winners[i];
		const team2 = winners[i + 1];

		nextRound.push({
			team1,
			team2,
			score1: null,
			score2: null,
			extraTimeScore1: null,
			extraTimeScore2: null,
			penaltyScore1: null,
			penaltyScore2: null,
			regularTimePlayed: false,
			extraTimePlayed: false,
			penaltiesPlayed: false,
			played: false,
			winner: null
		});
	}

	return nextRound;
};
