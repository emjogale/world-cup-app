import { useEffect, useState } from 'react';
import Match from './Match';

const Tournament = ({ teams }) => {
	const [results, setResults] = useState([]);

	const handleResult = (team1, score1, team2, score2) => {
		setResults([...results, { team1, score1, team2, score2 }]);
	};
	useEffect(() => {
		console.log('winners are: ', results);
	}, [results]);
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

export default Tournament;
