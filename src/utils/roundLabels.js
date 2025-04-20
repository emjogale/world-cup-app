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

		default:
			return 'Knockout Round';
	}
};
