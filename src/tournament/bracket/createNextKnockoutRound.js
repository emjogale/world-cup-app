import { createKnockoutMatch, makeBye } from './createFirstKnockoutRound';

export const createNextKnockoutRound = (prevRoundMatches) => {
	if (!Array.isArray(prevRoundMatches)) return [];

	// Step 1. Collect advancing teams (includes prelim "waiting" entries)
	const winners = [];
	for (const m of prevRoundMatches) {
		if (m.waiting && m.winner) {
			winners.push(m.winner);
		} else if (m.winner) {
			winners.push(m.winner);
		}
	}

	// Step 2. Tournament over if < 2 teams left
	if (winners.length <= 1) return [];

	// 🔁 Step 3. Pair with fairness:
	// - keep order as much as possible
	// - avoid same-group pairings when possible via a minimal forward-swap
	const avail = winners.slice(); // copy so we can splice
	const matches = [];

	while (avail.length > 0) {
		const a = avail.shift();
		if (avail.length === 0) {
			// odd count fallback: give last team a BYE (very rare here)
			matches.push(createKnockoutMatch(a, makeBye()));
			break;
		}

		// 3a) find earliest opponent that doesn't share group with 'a'
		let j = -1;
		for (let i = 0; i < avail.length; i++) {
			if (!a.group || !avail[i].group || a.group !== avail[i].group) {
				j = i;
				break;
			}
		}

		if (j === -1) {
			// everyone left is same group → unavoidable clash
			const b = avail.shift();
			matches.push(createKnockoutMatch(a, b));
			continue;
		}

		// 3b) if immediate next (index 0) conflicts, try a minimal swap so both pairs are valid
		if (
			j === 0 &&
			a.group &&
			avail[0].group &&
			a.group === avail[0].group
		) {
			let foundSwap = false;
			for (let k = 1; k < avail.length; k++) {
				const c = avail[k]; // candidate for 'a'
				const b = avail[0]; // the conflicting immediate next
				const aOk = !c.group || !a.group || c.group !== a.group;

				// can 'b' face the item after 'c'?
				const d = avail[k + 1];
				const bOk = d && (!b.group || !d.group || b.group !== d.group);

				if (aOk && bOk) {
					// pair a–c
					avail.splice(k, 1); // remove c
					matches.push(createKnockoutMatch(a, c));

					// pair b–d (d is now at index k because we removed c)
					const dNow = avail.splice(k, 1)[0]; // remove d
					matches.push(createKnockoutMatch(b, dNow));

					// remove b from front (already paired)
					avail.shift();
					foundSwap = true;
					break;
				}
			}
			if (foundSwap) continue;
			// if no valid swap, fall through to use earliest non-conflicting j below
		}

		// 3c) pair with earliest non-conflicting opponent (could be index 0 if non-conflicting)
		const b = avail.splice(j, 1)[0];
		matches.push(createKnockoutMatch(a, b));
	}

	return matches;
};
