import seedrandom from 'seedrandom';

export const shuffleTeams = (teams, seed = null) => {
	const rng = seed ? seedrandom(seed) : Math.random;

	const shuffled = [...teams];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1)); // Uses seeded random generator if provided
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};
