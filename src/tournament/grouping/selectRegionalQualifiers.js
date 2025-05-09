export const selectRegionalQualifiers = (regionalStats, spots) => {
	const allTeams = [];

	for (const groupName in regionalStats) {
		const teams = Object.entries(regionalStats[groupName]).map(
			([name, stats]) => ({
				...stats,
				name,
				group: groupName
			})
		);

		// sort group standings (stats)
		teams.sort(
			(a, b) => b.points - a.points || b.gd - a.gd || b.for - a.for
		);

		// push top team from this group
		allTeams.push(teams[0]);
	}

	// if spots exceed number of groups, pick the best 2nd best teams
	if (spots > allTeams.length) {
		const seconds = Object.values(regionalStats)
			.map((group) => {
				const sorted = Object.entries(group)
					.map(([name, stats]) => ({ ...stats, name }))
					.filter((team) => team && team.name)
					.sort(
						(a, b) =>
							b.points - a.points || b.gd - a.gd || b.for - a.for
					);

				return sorted[1]; // 2nd place
			})
			.filter((team) => team !== undefined);

		// sort all seconds to find best ones
		seconds.sort(
			(a, b) => b.points - a.points || b.gd - a.gd || b.for - a.for
		);
		const extras = seconds.slice(0, spots - allTeams.length);
		allTeams.push(...extras);
	}

	return allTeams.slice(0, spots);
};
