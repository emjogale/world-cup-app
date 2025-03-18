export const shuffleTeams = (teams) => {
	return [...teams].sort(() => Math.random() - 0.5);
};
