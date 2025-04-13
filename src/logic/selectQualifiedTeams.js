export const selectQualifiedTeams = (groupStats) => {
	const topTwo = [];
	const thirdPlaceCandidates = [];

	Object.entries(groupStats).forEach(([, teams]) => {
		const sorted = Object.values(teams).sort(
			(a, b) => b.points - a.points || b.gd - a.gd || b.for - a.for
		);

		topTwo.push(...sorted.slice(0, 2));
		thirdPlaceCandidates.push(sorted[2]); // the third-place team
	});

	const bestThirds = thirdPlaceCandidates
		.sort((a, b) => b.points - a.points || b.gd - a.gd || b.for - a.for)
		.slice(0, 8);

	return [...topTwo, ...bestThirds];
};
