import seedrandom from 'seedrandom';
import { generateFakeScore } from './fakeScore';

export const autoCompleteGroupStage = (
	groupMatches,
	groupStats,
	seed = null
) => {
	const updatedMatches = {};
	const updatedStats = {};
	const rng = seed ? seedrandom(seed) : Math.random;

	for (const [groupName, matches] of Object.entries(groupMatches)) {
		const groupStatsCopy = structuredClone(groupStats[groupName]);

		updatedMatches[groupName] = matches.map((match) => {
			const t1 = match.team1.name;
			const t2 = match.team2.name;

			// You can add index or group name to vary the RNG per match
			const [score1, score2] = generateFakeScore(t1, t2, rng);

			groupStatsCopy[t1].played += 1;
			groupStatsCopy[t2].played += 1;

			if (score1 > score2) {
				groupStatsCopy[t1].won += 1;
				groupStatsCopy[t2].lost += 1;
				groupStatsCopy[t1].points += 3;
			} else if (score2 > score1) {
				groupStatsCopy[t2].won += 1;
				groupStatsCopy[t1].lost += 1;
				groupStatsCopy[t2].points += 3;
			} else {
				groupStatsCopy[t1].drawn += 1;
				groupStatsCopy[t2].drawn += 1;
				groupStatsCopy[t1].points += 1;
				groupStatsCopy[t2].points += 1;
			}

			groupStatsCopy[t1].for += score1;
			groupStatsCopy[t1].against += score2;
			groupStatsCopy[t2].for += score2;
			groupStatsCopy[t2].against += score1;

			groupStatsCopy[t1].gd =
				groupStatsCopy[t1].for - groupStatsCopy[t1].against;
			groupStatsCopy[t2].gd =
				groupStatsCopy[t2].for - groupStatsCopy[t2].against;

			return { ...match, played: true, score1, score2 };
		});

		updatedStats[groupName] = groupStatsCopy;
	}

	return { updatedMatches, updatedStats };
};

export const devAutofillKnockoutRound = (round) => {
	return round.map((match) => {
		const updated = { ...match };

		// Simple logic: team1 always wins with score 2-0
		updated.score1 = 2;
		updated.score2 = 0;
		updated.regularTimePlayed = true;
		updated.played = true;
		updated.winner = updated.team1;

		return updated;
	});
};
