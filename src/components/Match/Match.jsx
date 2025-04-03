import React from 'react';
import './Match.css';

const Match = ({ team1, team2, score1, score2, onScoreChange }) => {
	return (
		<div
			className="match-card horizontal"
			data-testid={`match-${team1}-vs-${team2}`}
		>
			<span className="team-name">{team1}</span>
			<input
				data-testid={`score-${team1}`}
				type="number"
				min="0"
				value={score1}
				onChange={(e) => onScoreChange(team1, e.target.value)}
			/>
			v
			<input
				data-testid={`score-${team2}`}
				type="number"
				min="0"
				value={score2}
				onChange={(e) => onScoreChange(team2, e.target.value)}
			/>
			<span className="team-name">{team2}</span>
		</div>
	);
};

export default Match;
