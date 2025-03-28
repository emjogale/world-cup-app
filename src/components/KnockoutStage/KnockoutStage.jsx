import { useState } from 'react';
import Match from '../Match/Match';

const KnockoutStage = ({ teams }) => {
	const [results, setResults] = useState([]);

	const handleResult = (team1, score1, team2, score2) => {
		setResults([...results, { team1, score1, team2, score2 }]);
		console.log('the results are:', results);
	};

	return (
		<div>
			{teams.map((team, index) =>
				index % 2 === 0 && teams[index + 1] ? (
					<Match
						key={index}
						team1={team}
						team2={teams[index + 1]}
						onResult={handleResult}
					/>
				) : null
			)}
		</div>
	);
};

export default KnockoutStage;
