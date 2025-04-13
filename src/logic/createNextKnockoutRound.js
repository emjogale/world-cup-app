export const createNextKnockoutRound = (matches) => {
	const nextRound = [];

	for (let i = 0; i < matches.length; i += 2) {
		const match1 = matches[i];
		const match2 = matches[i + 1];

		const winner1 = getWinner(match1);
		const winner2 = match2 ? getWinner(match2) : null;

		nextRound.push({
			team1: winner1,
			team2: winner2,
			score1: null,
			score2: null,
			extraTimeScore1: null,
			extraTimeScore2: null,
			penaltyScore1: null,
			penaltyScore2: null,
			played: false,
			winner: null
		});
	}

	return nextRound;
};

// helper
function getWinner(match) {
	const { team1, team2, score1, score2 } = match;

	if (score1 === null || score2 === null) {
		return { name: 'TBD', flag: '🏳️' };
	}

	return score1 > score2 ? team1 : team2;
}
