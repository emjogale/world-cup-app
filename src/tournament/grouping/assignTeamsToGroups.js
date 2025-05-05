import { groupTeams } from './groupTeams';

export const assignTeamsToGroups = (teams, teamsPerGroup = 6) => {
	const groupedObj = groupTeams(teams, teamsPerGroup);

	return Object.entries(groupedObj).map(([groupName, groupTeams]) => ({
		name: `Group ${groupName}`,
		teams: groupTeams
	}));
};
