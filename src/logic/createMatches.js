// Creates pairs of teams for a knockout or round-based match
export const createRoundMatches = (teams) => {
	const matches = [];

	for (let i = 0; i < teams.length; i += 2) {
		if (teams[i + 1]) {
			matches.push({
				team1: teams[i],
				team2: teams[i + 1],
				score1: null,
				score2: null,
				extraTimeScore1: null,
				extraTimeScore2: null,
				penaltyScore1: null,
				penaltyScore2: null,
				played: false,
				winner: null
			});
		} else {
			console.warn(`Odd number of teams; ${teams[i]} has no opponent.`);
		}
	}

	return matches;
};

// For 4 teams in a group, returns all 6 possible matchups (round-robin)
export const createGroupMatches = (teams) => {
	const matches = [];
	for (let i = 0; i < teams.length; i++) {
		for (let j = i + 1; j < teams.length; j++) {
			matches.push({ team1: teams[i], team2: teams[j], played: false });
		}
	}
	return matches;
};

// Returns the first 2 matches where no team is duplicated (used for display)
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

// Used by GroupStage to get the next 2 non-conflicting matches
export function getNextAvailableMatches(allMatches, currentIndex) {
	return getFirstIndividualMatches(allMatches.slice(currentIndex));
}

// gets next matches for a group based on who has played fewer than 3 games
export const getNextMatches = (allMatches) => {
	const nextMatches = [];
	const usedTeams = new Set();

	const unplayed = allMatches.filter((m) => !m.played);

	for (let i = 0; i < unplayed.length; i++) {
		const match = unplayed[i];
		const t1 = match.team1.name;
		const t2 = match.team2.name;

		if (usedTeams.has(t1) || usedTeams.has(t2)) {
			// 🛠️ Allow last match to be shown even if there's overlap
			if (unplayed.length === 1) {
				nextMatches.push(match);
				break;
			}
			continue;
		}

		nextMatches.push(match);
		usedTeams.add(t1);
		usedTeams.add(t2);

		if (nextMatches.length === 2) break;
	}

	return nextMatches;
};
