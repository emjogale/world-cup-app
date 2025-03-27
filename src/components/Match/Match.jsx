import React from 'react';
import { useState } from 'react';

const Match = ({ team1, team2, onResult }) => {
	const [score1, setScore1] = useState('');
	const [score2, setScore2] = useState('');

	const handleSubmit = () => {
		if (onResult && score1 !== '' && score2 !== '') {
			onResult(team1, Number(score1), team2, Number(score2));
		}
	};

	return (
		<div>
			<h3>
				{team1} vs {team2}
			</h3>
			<input
				data-testid={`score-${team1}`}
				type="number"
				min="0"
				value={score1}
				onChange={(e) => setScore1(e.target.value)}
			/>
			<input
				data-testid={`score-${team2}`}
				type="number"
				min="0"
				value={score2}
				onChange={(e) => setScore2(e.target.value)}
			/>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
};

export default Match;
