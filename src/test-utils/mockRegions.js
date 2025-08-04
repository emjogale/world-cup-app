export const mockRegions = [
	{
		region: 'AFC',
		spots: 2
	},
	{
		region: 'UEFA',
		spots: 2
	}
];

export const getMinimalMockRegion = ({
	regionName = 'Test Region',
	teamNames = ['Alpha', 'Bravo', 'Charlie'],
	spots
}) => {
	const teams = teamNames.map((name) => ({
		name,
		flag: `https://flagcdn.com/${name.toLowerCase()}.svg`, // or a placeholder
		region: regionName
	}));

	const region = {
		region: regionName,
		groups: [teamNames],
		spots
	};
	return { teams, regions: [region] };
};
