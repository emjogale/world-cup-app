// Pair winners in order, avoiding same-group clashes when possible.
// Uses a minimal forward-swap heuristic.
export function pairWinnersFairly(winners, { makeMatch, makeBye }) {
	const avail = winners.slice();
	const out = [];

	while (avail.length > 0) {
		const a = avail.shift();
		if (avail.length === 0) {
			out.push(makeMatch(a, makeBye())); // odd fallback (rare)
			break;
		}

		// Find earliest non-conflicting opponent for 'a'
		let j = -1;
		for (let i = 0; i < avail.length; i++) {
			if (!a.group || !avail[i].group || a.group !== avail[i].group) {
				j = i;
				break;
			}
		}

		// If none, unavoidable clash: pair with next
		if (j === -1) {
			out.push(makeMatch(a, avail.shift()));
			continue;
		}

		// If immediate next (index 0) conflicts, try a minimal swap:
		if (
			j === 0 &&
			a.group &&
			avail[0].group &&
			a.group === avail[0].group
		) {
			let swapped = false;
			for (let k = 1; k < avail.length; k++) {
				const b = avail[0]; // conflicting immediate next
				const c = avail[k]; // candidate for 'a'
				const d = avail[k + 1]; // candidate for 'b' after we take c

				const aOk = !c.group || !a.group || c.group !== a.group;
				const bOk = d && (!b.group || !d.group || b.group !== d.group);

				if (aOk && bOk) {
					// pair a–c
					avail.splice(k, 1);
					out.push(makeMatch(a, c));
					// pair b–d (d is now at index k)
					const dNow = avail.splice(k, 1)[0];
					out.push(makeMatch(b, dNow));
					// remove b from front (already paired)
					avail.shift();
					swapped = true;
					break;
				}
			}
			if (swapped) continue; // done two pairs, loop again
			// else fall through to use earliest non-conflicting j
		}

		// Pair with earliest non-conflicting candidate
		const b = avail.splice(j, 1)[0];
		out.push(makeMatch(a, b));
	}

	return out;
}
