// Returns a new object with all stat fields set to zero
export const emptyStats = () => ({
	played: 0,
	won: 0,
	drawn: 0,
	lost: 0,
	for: 0,
	against: 0,
	points: 0,
	gd: 0
});

/**
 * 🎯 Used in: RegionalQualifiers (one group at a time)
 * Creates an initial stats object for a list of teams
 * Example output:
 * {
 *   Brazil: { played: 0, won: 0, ... },
 *   Germany: { played: 0, won: 0, ... }
 * }
 */
export const initializeGroupStats = (teams) => {
	const stats = {};
	for (const team of teams) {
		stats[team.name] = {
			name: team.name,
			flag: team.flag,
			...emptyStats()
		};
	}
	return stats;
};

/**
 * 🔁 Used in: GroupStage (all groups at once)
 * Builds full tournament group stats from a grouped team object
 * Example input:
 * {
 *   A: [team1, team2, ...],
 *   B: [team5, team6, ...],
 *   ...
 * }
 * Output:
 * {
 *   A: { Brazil: {...}, Germany: {...} },
 *   B: { France: {...}, Japan: {...} }
 * }
 */
export const buildInitialGroupStats = (groups) => {
	const stats = {};
	for (const [groupName, teams] of Object.entries(groups)) {
		stats[groupName] = {};
		for (const team of teams) {
			stats[groupName][team.name] = {
				name: team.name,
				flag: team.flag,
				played: 0,
				won: 0,
				drawn: 0,
				lost: 0,
				for: 0,
				against: 0,
				gd: 0,
				points: 0
			};
		}
	}
	return stats;
};

/**
 * 🏟️ Updates group stats after one or more matches
 * Used throughout the app (GroupStage, RegionalQualifiers) to calculate standings
 */
export const updateGroupStats = (currentStats, matchresults) => {
	const newStats = {};
	for (const team in currentStats) {
		newStats[team] = { ...currentStats[team] };
	}

	for (const { team1, team2, score1, score2 } of matchresults) {
		if (!newStats[team1]) newStats[team1] = emptyStats();
		if (!newStats[team2]) newStats[team2] = emptyStats();

		newStats[team1].played += 1;
		newStats[team2].played += 1;

		newStats[team1].for += score1;
		newStats[team1].against += score2;

		newStats[team2].for += score2;
		newStats[team2].against += score1;

		if (score1 > score2) {
			newStats[team1].won += 1;
			newStats[team1].points += 3;
			newStats[team2].lost += 1;
		} else if (score1 < score2) {
			newStats[team2].won += 1;
			newStats[team2].points += 3;
			newStats[team1].lost += 1;
		} else {
			newStats[team1].drawn += 1;
			newStats[team2].drawn += 1;
			newStats[team1].points += 1;
			newStats[team2].points += 1;
		}

		newStats[team1].gd = newStats[team1].for - newStats[team1].against;
		newStats[team2].gd = newStats[team2].for - newStats[team2].against;
	}

	return newStats;
};
