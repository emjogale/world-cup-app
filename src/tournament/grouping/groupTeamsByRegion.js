export const groupTeamsByRegion = (teams) => {
	return teams.reduce((regions, team) => {
		if (!regions[team.region]) {
			regions[team.region] = [];
		}
		regions[team.region].push(team);
		return regions;
	}, {});
};
