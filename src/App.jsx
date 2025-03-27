import React, { useEffect, useState } from 'react';
import Qualifiers from './components/Qualifiers/Qualifiers';
import GroupStage from './components/GroupStage/GroupStage';
import './index.css';

const App = () => {
	const [teams, setTeams] = useState([]);
	const [tournamentStarted, setTournamentStarted] = useState(false);

	useEffect(() => {
		fetch('/teams.json')
			.then((res) => res.json())
			.then((data) => setTeams(data))
			.catch((err) => console.error('Error loading teams', err));
	}, []);

	return (
		<div className="app-container">
			<h1>🌍 World Cup</h1>

			{!tournamentStarted ? (
				<>
					<Qualifiers />
					<button
						onClick={() => setTournamentStarted(true)}
						className="start-button"
					>
						Start Tournament
					</button>
				</>
			) : (
				<GroupStage teams={teams} />
			)}
		</div>
	);
};

export default App;
