import { isBYE } from './isBYE';

const largestPowerOfTwo = (n) => 1 << Math.floor(Math.log2(Math.max(1, n)));

// Fallback BYE maker (might not be needed anymore)
export const makeBye = (i = 0) => ({ name: `BYE ${i + 1}`, isBye: true });

export const createFirstKnockoutRound = (teams) => {
	const matches = [];

	// Step 1. Find target (biggest power of two ≤ team count)
	const target = largestPowerOfTwo(teams.length);

	// Step 2. How many extra teams need to be trimmed?
	const extra = teams.length - target;

	if (extra === 0) {
		// Perfect power of two → just pair them directly
		for (let i = 0; i < teams.length; i += 2) {
			matches.push(createKnockoutMatch(teams[i], teams[i + 1]));
		}
		return matches;
	}

	// Step 3. Preliminary round:
	//   - 2*extra teams must play prelim matches.
	//   - The rest go directly into next round.
	const prelimTeams = teams.slice(0, 2 * extra);
	const directTeams = teams.slice(2 * extra);

	// Pair up prelim teams
	for (let i = 0; i < prelimTeams.length; i += 2) {
		matches.push(createKnockoutMatch(prelimTeams[i], prelimTeams[i + 1]));
	}

	// Mark direct teams as "waiting" (they will enter next round)
	// 👉 In real code you might store them separately
	// For now, just attach a property so you can handle them later
	directTeams.forEach((team) => {
		matches.push({
			team1: team,
			team2: null,
			played: true,
			winner: team, // they auto-advance to next round
			waiting: true
		});
	});

	return matches;
};

export const createKnockoutMatch = (team1, team2) => {
	const bye1 = isBYE(team1);
	const bye2 = isBYE(team2);

	let winner = null;
	let played = false;

	if (bye1 && !bye2) {
		winner = team2;
		played = true;
	} else if (!bye1 && bye2) {
		winner = team1;
		played = true;
	} else if (bye1 && bye2) {
		played = true;
	}

	return {
		team1,
		team2,
		score1: null,
		score2: null,
		extraTimeScore1: null,
		extraTimeScore2: null,
		penaltyScore1: null,
		penaltyScore2: null,
		regularTimePlayed: played,
		extraTimePlayed: false,
		penaltiesPlayed: false,
		played,
		winner
	};
};
