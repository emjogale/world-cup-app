import React, { useEffect, useState } from 'react';
import Qualifiers from './components/Qualifiers/Qualifiers';
import GroupStage from './components/GroupStage/GroupStage';
import KnockoutStage from './components/KnockoutStage/KnockoutStage';
import './index.css';

const App = () => {
	const [stage, setStage] = useState('qualifiers');
	const [teams, setTeams] = useState([]);
	const [winners, setWinners] = useState([]);

	useEffect(() => {
		fetch('/teams.json')
			.then((res) => res.json())
			.then((data) => setTeams(data))
			.catch((err) => console.error('Error loading teams', err));
	}, []);

	return (
		<div className="app-container">
			<h1>🌍 World Cup</h1>
			{stage === 'qualifiers' && (
				<>
					<Qualifiers />
					<button
						onClick={() => setStage('groups')}
						className="start-button"
					>
						Start Tournament
					</button>
				</>
			)}
			{stage === 'groups' && (
				<GroupStage
					teams={teams}
					onComplete={(groupWinners) => {
						setWinners(groupWinners);
						setStage('knockout');
					}}
				/>
			)}
			{stage === 'knockout' && <KnockoutStage teams={winners} />}
		</div>
	);
};

export default App;
