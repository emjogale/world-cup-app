import React from 'react';
import { useState } from 'react';

const Match = ({ team1, team2 }) => {
	const [score1, setScore1] = useState('');
	const [score2, setScore2] = useState('');

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
		</div>
	);
};

export default Match;
