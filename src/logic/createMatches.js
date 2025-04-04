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

export const getFirstIndividualMatches = (matches) => {
	const usedTeams = new Set();
	const selected = [];

	for (const match of matches) {
		const { team1, team2 } = match;
		if (!usedTeams.has(team1.name) && !usedTeams.has(team2.name)) {
			selected.push(match);
			usedTeams.add(team1.name);
			usedTeams.add(team2.name);
		}
		if (selected.length === 2) break;
	}

	return selected;
};

export function getNextAvailableMatches(allMatches, currentIndex) {
	return getFirstIndividualMatches(allMatches.slice(currentIndex));
}

export const buildInitialProgress = (groups) => {
	const initial = {};
	for (const groupName of Object.keys(groups)) {
		initial[groupName] = 0;
	}
	return initial;
};
