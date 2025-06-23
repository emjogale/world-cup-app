const REGION_QUOTAS = {
	UEFA: 13,
	CAF: 5,
	AFC: 5,
	CONMEBOL: 4,
	CONCACAF: 3,
	OFC: 1
};

// Mock logic: pick top N teams from each region (you can randomize or sort later)
export const selectRegionalWinners = (regionName, teams) => {
	const quota = REGION_QUOTAS[regionName] || 0;
	return teams.slice(0, quota);
};

// Opptional: utility to select winners for all regions in one go
export const selectAllRegionalWinners = (groupedTeamsByRegion) => {
	const winners = [];
	for (const region in groupedTeamsByRegion) {
		const teams = groupedTeamsByRegion[region];
		const regionWinners = selectRegionalWinners(region, teams);
		winners.push(...regionWinners);
	}
	return winners;
};
