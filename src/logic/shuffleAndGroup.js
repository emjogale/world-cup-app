import { shuffleTeams } from './shuffleTeams';
import { groupTeams } from './groupTeams';

export const shuffleAndGroup = (teams, seed = null) => {
	const shuffled = shuffleTeams(teams, seed);
	return groupTeams(shuffled);
};
