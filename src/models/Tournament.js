import React from 'react';

export class Tournament {
	constructor(teams) {
		this.teams = teams.map((name) => ({ name, score: 0 }));
		this.results = [];
	}

	setMatchResult(team1, score1, team2, score2) {
		this.results.push({ team1, score1, team2, score2 });
	}

	getWinners() {
		return this.results.map((match) => {
			match.score1 > match.score2 ? match.team1 : match.team2;
		});
	}
}
