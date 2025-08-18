import { createKnockoutMatch, makeBye } from './createFirstKnockoutRound';

export const createNextKnockoutRound = (prevRoundMatches) => {
	if (!Array.isArray(prevRoundMatches)) return [];

	// Step 1. Collect advancing teams
	const winners = [];
	for (const m of prevRoundMatches) {
		if (m.waiting && m.winner) {
			// Team skipped prelim round
			winners.push(m.winner);
		} else if (m.winner) {
			// Normal winner
			winners.push(m.winner);
		}
	}

	// Step 2. Tournament over if < 2 teams left
	if (winners.length <= 1) return [];

	// Step 3. Pair in order
	const matches = [];
	for (let i = 0; i < winners.length; i += 2) {
		const team1 = winners[i];
		const team2 = winners[i + 1];

		if (team2) {
			matches.push(createKnockoutMatch(team1, team2));
		} else {
			// Odd count: last team gets a BYE and auto-advances
			matches.push({
				team1,
				team2: makeBye(),
				played: true,
				winner: team1
			});
		}
	}

	return matches;
};
