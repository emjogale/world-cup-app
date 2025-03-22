import React, { useEffect, useState } from 'react';
import GroupStage from './components/GroupStage';
import Teams from './components/Teams';

const App = () => {
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		fetch('/teams.json')
			.then((res) => res.json())
			.then((data) => setTeams(data))
			.catch((err) => console.error('Error loading teams', err));
	}, []);

	return (
		<div>
			<h1>🌍 World Cup Group Stage</h1>
			<GroupStage teams={teams} />
		</div>
	);
};

export default App;
