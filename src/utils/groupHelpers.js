import { updateGroupStats } from '../tournament/grouping/updateGroupStats';
import { shuffleTeams } from '../tournament/shuffleTeams';
import { getMatchKey } from './matchHelpers';

// sorts teams by points, then goal difference, then goals for
export const sortByGroupRanking = (a, b) =>
	b.points - a.points || b.gd - a.gd || b.for - a.for;

const teamName = (t) => (typeof t === 'string' ? t : t?.name) || '';
const uiKeyFor = (t1, t2) => `${teamName(t1)}-vs-${teamName(t2)}`;

export const handleGroupSubmitHelper = ({
	matchesToDisplay,
	scores,
	currentStats
}) => {
	if (!Array.isArray(matchesToDisplay)) {
		const fallback = currentStats || {};
		return {
			newStats: Array.isArray(fallback)
				? fallback
				: Object.values(fallback),
			newStatsByName: Array.isArray(fallback)
				? Object.fromEntries(fallback.map((s) => [s.name, s]))
				: fallback,
			updatedMatches: [],
			nextScores: scores || {}
		};
	}

	const results = matchesToDisplay
		.map(({ id, team1, team2 }) => {
			const name1 = teamName(team1);
			const name2 = teamName(team2);

			const uiKey = id ?? uiKeyFor(team1, team2); // rendered order
			const normKey = getMatchKey(team1, team2); // normalized storage

			const pairFromUi = scores?.[uiKey];
			const pairFromNorm = scores?.[normKey];

			const usingUi =
				!!pairFromUi &&
				(pairFromUi.score1 ?? '') !== '' &&
				(pairFromUi.score2 ?? '') !== '';

			// prefer UI; fallback to normalized
			const pair = usingUi ? pairFromUi : pairFromNorm || {};
			let a = parseInt(pair?.score1, 10);
			let b = parseInt(pair?.score2, 10);

			// if we fell back to normalized, and normalized first ≠ left name, swap
			if (!usingUi && pairFromNorm) {
				const [normFirst] = (normKey || '').split('-vs-');
				if (normFirst && normFirst !== name1) {
					const tmp = a;
					a = b;
					b = tmp;
				}
			}

			return {
				team1: name1,
				score1: Number.isFinite(a) ? a : 0,
				team2: name2,
				score2: Number.isFinite(b) ? b : 0
			};
		})
		.filter((r) => r.team1 && r.team2);

	const updated = updateGroupStats(currentStats || {}, results);

	const newStats = Array.isArray(updated) ? updated : Object.values(updated);
	const newStatsByName = Array.isArray(updated)
		? Object.fromEntries(updated.map((s) => [s.name, s]))
		: updated || {};

	const updatedMatches = matchesToDisplay.map((m) => ({
		...m,
		played: true
	}));

	// clear both potential keys (UI + normalized) for just-submitted matches
	const nextScores = { ...(scores || {}) };
	for (const m of matchesToDisplay) {
		const uiKey = m.id ?? uiKeyFor(m.team1, m.team2);
		const normKey = getMatchKey(m.team1, m.team2);
		if (nextScores[uiKey]) nextScores[uiKey] = { score1: '', score2: '' };
		if (nextScores[normKey])
			nextScores[normKey] = { score1: '', score2: '' };
	}

	return { newStats, newStatsByName, updatedMatches, nextScores };
};

export const splitIntoGroups = (teams, groupSize, seed = null) => {
	const shuffled = shuffleTeams(teams, seed);
	const totalTeams = shuffled.length;

	if (!groupSize) {
		if (totalTeams <= 24) groupSize = 4;
		else if (totalTeams <= 36) groupSize = 5;
		else groupSize = 6;
	}
	const groups = [];
	for (let i = 0; i < teams.length; i += groupSize) {
		groups.push(shuffled.slice(i, i + groupSize));
	}
	return groups;
};
