import { sortByGroupRanking } from '../../utils/groupHelpers';

export const selectQualifiedTeams = (groupStats) => {
	const topTwo = [];
	const thirdPlaceCandidates = [];

	Object.entries(groupStats).forEach(([groupName, teams]) => {
		const sorted = Object.values(teams)
			.sort(sortByGroupRanking)
			.map((team, index) => ({
				...team,
				group: groupName,
				position: index + 1 // 1 for 1st, 2 for 2nd, etc.
			}));

		topTwo.push(...sorted.slice(0, 2));
		thirdPlaceCandidates.push(sorted[2]); // the third-place team
	});

	const bestThirds = thirdPlaceCandidates
		.sort(sortByGroupRanking)
		.slice(0, 8);

	return [...topTwo, ...bestThirds];
};
