export const makeTeam = (name, region, flag = '') => ({
	name,
	region,
	flag,
	played: 0,
	won: 0,
	drawn: 0,
	lost: 0,
	for: 0,
	against: 0,
	points: 0,
	gd: 0
});

export const generateMockTeams = (count, region) => {
	return Array.from({ length: count }, (_, i) => {
		return makeTeam(`Team ${region} ${i + 1}`, region);
	});
};
