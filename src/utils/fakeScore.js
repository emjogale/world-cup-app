import seedrandom from 'seedrandom';

export const generateFakeScore = (team1, team2, rng) => {
	const maxGoals = 5;
	const score1 = Math.floor(rng() * (maxGoals + 1)); // 0 to 5
	const score2 = Math.floor(rng() * (maxGoals + 1));

	return [score1, score2];
};
