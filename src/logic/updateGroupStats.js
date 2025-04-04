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

export const upDateGroupStats = (currentStats, matchresults) => {
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
export function buildInitialGroupStats(groupedTeams) {
	const initial = {};
	for (const [groupName, group] of Object.entries(groupedTeams)) {
		initial[groupName] = {};
		for (const team of group) {
			initial[groupName][team.name] = {
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
	return initial;
}
