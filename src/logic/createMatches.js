export const createRoundMatches = (teams) => {
	const matches = [];

	for (let i = 0; i < teams.length; i += 2) {
		if (teams[i + 1]) {
			matches.push({
				team1: teams[i],
				team2: teams[i + 1],
				score1: null,
				score2: null
			});
		} else {
			console.warn(`Odd number of teams; ${teams[i]} has no opponent.`);
		}
	}

	return matches;
};

export const createGroupMatches = (teams) => {
	const matches = [];
	for (let i = 0; i < teams.length; i++) {
		for (let j = i + 1; j < teams.length; j++) {
			matches.push({ team1: teams[i], team2: teams[j] });
		}
	}
	return matches;
};
