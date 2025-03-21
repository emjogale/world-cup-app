import React, { useEffect, useState } from 'react';

const Teams = () => {
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const res = await fetch('/teams.json');
				if (!res.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await res.json();

				setTeams(data);
			} catch (error) {
				console.error('Fetch error:', error);
			}
		};

		fetchTeams();
	}, []);

	return (
		<div className="teams-container">
			<h2>here are the teams</h2>

			{teams.map((team) => (
				<div key={team.name} className="team-card">
					<img
						src={team.flag}
						alt={team.name}
						className="team-flag"
					/>
					<p className="team-name">{team.name}</p>
				</div>
			))}
		</div>
	);
};

export default Teams;
