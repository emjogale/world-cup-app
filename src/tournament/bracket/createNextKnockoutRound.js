import { createKnockoutMatch, makeBye } from './createFirstKnockoutRound';
import { pairWinnersFairly } from './pairFairly';

export const createNextKnockoutRound = (prevRoundMatches) => {
	if (!Array.isArray(prevRoundMatches)) return [];

	// collect advancing teams (incl. prelim "waiting" entries)
	const winners = [];
	for (const m of prevRoundMatches) {
		if (m.winner) winners.push(m.winner);
	}
	if (winners.length <= 1) return [];

	return pairWinnersFairly(winners, {
		makeMatch: createKnockoutMatch,
		makeBye
	});
};
