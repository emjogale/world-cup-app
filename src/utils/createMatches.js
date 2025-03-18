export const shuffleTeams = (teams) => {
	return [...teams].sort(() => Math.random() - 0.5);
};

export const createRoundMatches = (teams) => {
	const matches = [];
	for (let i = 0; i < teams.length; i += 2) {
		matches.push({
			team1: teams[i],
			team2: teams[i + 1],
			score1: null,
			score2: null
		});
	}
	return matches;
};
