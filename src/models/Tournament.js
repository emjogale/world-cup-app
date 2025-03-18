export class Tournament {
	constructor(matches) {
		console.log('constructor received these matches', matches);
		this.matches = matches || [];
	}

	getWinners() {
		console.log(
			'getWinners called with the following matches',
			this.matches
		);
		return this.matches.map((match, index) => {
			console.log(`processing match ${index}:`, match);
			if (match.score1 === undefined || match.score2 === undefined) {
				console.error('⚠️ Missing scores!', match);
				return undefined;
			}
			return match.score1 > match.score2 ? match.team1 : match.team2;
		});
	}
}
