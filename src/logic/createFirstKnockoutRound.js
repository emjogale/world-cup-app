export const createFirstKnockoutRound = (teams) => {
	const matches = [];
	const used = new Set();

	// 1st vs 2nd, avoiding same group
	const firsts = teams.filter((t) => t.position === 1);
	const seconds = teams.filter((t) => t.position === 2);

	firsts.forEach((first) => {
		const opponentIndex = seconds.findIndex(
			(second) => second.group !== first.group && !used.has(second.name)
		);

		if (opponentIndex !== -1) {
			const second = seconds.splice(opponentIndex, 1)[0];
			matches.push(createKnockoutMatch(first, second));
			used.add(first.name);
			used.add(second.name);
		}
	});

	// leftover 2nds + best thirds
	const remaining = teams.filter((t) => !used.has(t.name));

	for (let i = 0; i < remaining.length; i += 2) {
		if (remaining[i + 1]) {
			matches.push(createKnockoutMatch(remaining[i], remaining[i + 1]));
		}
	}

	return matches;
};

const createKnockoutMatch = (team1, team2) => {
	return {
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
		winner: null
	};
};
