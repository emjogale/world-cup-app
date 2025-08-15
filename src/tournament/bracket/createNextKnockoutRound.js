import { makeBye, createKnockoutMatch } from './createFirstKnockoutRound';

export const createNextKnockoutRound = (matches) => {
	// Winner resolution that doesn't depend purely on "played"
	const resolveWinner = (m) => {
		// 1) explicit winner set (e.g., from UI / earlier resolver)
		if (m?.winner) return m.winner;

		// 2) BYE logic: if one side is a BYE, the other advances automatically
		const isBye1 = m?.team1?.isBye;
		const isBye2 = m?.team2?.isBye;
		if (isBye1 && !isBye2) return m.team2;
		if (!isBye1 && isBye2) return m.team1;
		if (isBye1 && isBye2) return null; // nothing to advance

		// 3) As a fallback, if your code sets "played" and scores, you could derive a winner here.
		// But typically you already set m.winner when finishing a match.
		return m?.played ? m.winner ?? null : null;
	};

	// Build the winners list independent of "played" flag, honoring BYEs.
	const winners = matches.map(resolveWinner).filter(Boolean);

	// Tournament over if we have < 2 winners
	if (winners.length <= 1) return [];

	// If odd number of winners (very rare), pad with a BYE so we can pair everyone
	let byeIndex = 0;
	if (winners.length % 2 !== 0) {
		winners.push(makeBye(byeIndex++));
	}

	const nextRound = [];
	for (let i = 0; i < winners.length; i += 2) {
		const team1 = winners[i];
		const team2 = winners[i + 1];
		// Use the same match factory that auto-advances BYEs
		nextRound.push(createKnockoutMatch(team1, team2));
	}

	return nextRound;
};
