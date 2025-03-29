import { shuffleTeams } from './shuffleTeams';
import { createRoundMatches } from './createMatches';

export default class Tournament {
	constructor(teams, seed = null) {
		this.teams = shuffleTeams(teams, seed);
		this.matches = createRoundMatches(this.teams);
	}

	createRoundMatches(teams) {
		const matches = [];
		for (let i = 0; i < teams.length; i += 2) {
			matches.push({
				team1: teams[i],
				team2: teams[i + 1],
				score1: null,
				score2: null
			});
		}
		return matches;
	}

	// Method to update scores of a match
	updateMatchScores(matchIndex, score1, score2) {
		// Check if the matchIndex is valid
		if (matchIndex >= 0 && matchIndex < this.matches.length) {
			const match = this.matches[matchIndex];

			// Check for invalid (negative) scores
			if (score1 < 0 || score2 < 0) {
				console.error('Invalid score: Scores cannot be negative');
				return;
			}

			// Update the scores
			match.score1 = score1;
			match.score2 = score2;
		} else {
			console.error('Invalid match index');
		}
	}

	getWinners() {
		return this.matches
			.map((match, index) => {
				`Processing match ${index}:`, match;
				if (match.score1 === undefined || match.score2 === undefined) {
					console.error('⚠️ Missing scores!', match);
					return null;
				}
				const winner =
					match.score1 > match.score2 ? match.team1 : match.team2;
				`Winner of match ${index}:`, winner;
				return winner;
			})
			.filter((winner) => winner !== null);
	}
}
