const nextPowerOfTwo = (n) => 1 << Math.ceil(Math.log2(Math.max(1, n)));
export const makeBye = (i = 0) => ({ name: `BYE ${i + 1}`, isBye: true });

export const createFirstKnockoutRound = (teams) => {
	const matches = [];
	const used = new Set();

	// Keep your existing seeding rule: 1st vs 2nd, avoid same group
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

	// Anything not yet used (leftover 2nds + best 3rds/4ths/etc.)
	const remaining = teams.filter((t) => !used.has(t.name));

	// === BYE padding logic ===
	// Pad total teams up to next power of two *for this round*.
	// That means we need (targetTotal - currentTotal) BYE placeholders.
	const targetTotal = nextPowerOfTwo(teams.length);
	const byesNeeded = targetTotal - teams.length;

	// Distribute BYEs so they don't pair together.
	// Prefer to give BYEs to higher-seeded 'remaining' entries by pairing
	// each BYE with a remaining team (team vs BYE).
	const rem = [...remaining];
	const pairs = [];

	let byeIdx = 0;
	let byesLeft = byesNeeded;

	// Pair teams against BYEs while we still need padding
	while (byesLeft > 0 && rem.length > 0) {
		const team = rem.shift();
		pairs.push([team, makeBye(byeIdx++)]); // team gets free advance
		byesLeft--;
	}

	// Pair any remaining teams against each other
	for (let i = 0; i < rem.length; i += 2) {
		const t1 = rem[i];
		const t2 = rem[i + 1] || makeBye(byeIdx++); // if odd, give last team a BYE
		pairs.push([t1, t2]);
	}

	// If we still have BYEs left (very rare), add matches of BYE vs BYE to fill bracket
	while (byesLeft > 0) {
		pairs.push([makeBye(byeIdx++), makeBye(byeIdx++)]);
		byesLeft -= 2;
	}

	// Build matches (auto-advance if BYE is involved)
	for (const [a, b] of pairs) {
		matches.push(createKnockoutMatch(a, b));
	}

	return matches;
};

export const createKnockoutMatch = (team1, team2) => {
	const isBye1 = team1?.isBye;
	const isBye2 = team2?.isBye;

	let winner = null;
	let regularTimePlayed = false;
	let played = false;

	if (isBye1 && !isBye2) {
		winner = team2;
		regularTimePlayed = true;
		played = true; // treat as resolved
	} else if (!isBye1 && isBye2) {
		winner = team1;
		regularTimePlayed = true;
		played = true;
	} else if (isBye1 && isBye2) {
		// No real team advances; mark resolved to avoid blocking
		winner = null;
		regularTimePlayed = true;
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
		regularTimePlayed,
		extraTimePlayed: false,
		penaltiesPlayed: false,
		played,
		winner
	};
};
