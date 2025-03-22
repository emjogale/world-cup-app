export const groupTeams = (teams) => {
	const teamsPerGroup = 4;
	const numGroups = Math.ceil(teams.length / teamsPerGroup);
	const groupNames = Array.from({ length: numGroups }, (_, i) =>
		String.fromCharCode(65 + i)
	); // A, B, C...

	const grouped = {};

	groupNames.forEach((name) => {
		grouped[name] = [];
	});

	teams.forEach((team, index) => {
		const groupIndex = Math.floor(index / teamsPerGroup);
		const groupName = groupNames[groupIndex];
		grouped[groupName].push(team);
	});
	return grouped;
};

// works out how many groups there are by dividing total teams by teamsPerGroup
// initialize an empty group object
// assigns each group a name (A-Z) and puts in an array - groupNames ['A', 'B', ...]
// loops through list of teams and assigns them to a groupName until that group is full then fills the next
