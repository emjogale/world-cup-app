import React from 'react';
import { useState } from 'react';
import './Match.css';

const Match = ({ team1, team2, onResult }) => {
	const [score1, setScore1] = useState('');
	const [score2, setScore2] = useState('');

	const handleSubmit = () => {
		if (onResult && score1 !== '' && score2 !== '') {
			onResult(team1, Number(score1), team2, Number(score2));
		}
	};

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
				onChange={(e) => setScore1(e.target.value)}
			/>
			v
			<input
				data-testid={`score-${team2}`}
				type="number"
				min="0"
				value={score2}
				onChange={(e) => setScore2(e.target.value)}
			/>
			<span className="team-name">{team2}</span>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
};

export default Match;
