// utils/roundLabels.js
export const getKnockoutRoundLabel = (numTeams) => {
	switch (numTeams) {
		case 32:
			return 'Round of 32';
		case 16:
			return 'Round of 16';
		case 8:
			return 'Quarterfinals';
		case 4:
			return 'Semifinals';
		case 2:
			return 'Final';
		case 1:
			return 'Third Place Playoff'; // optional, if you're showing it separately
		default:
			return 'Knockout Round';
	}
};
