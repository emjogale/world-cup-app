export const makeTeam = (name, region, flag = '') => {
	return {
		name,
		region,
		flag
	};
};

export const generateMockTeams = (count, region) => {
	return Array.from({ length: count }, (_, i) => {
		return makeTeam(`Team ${region} ${i + 1}`, region);
	});
};
