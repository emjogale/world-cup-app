import React, { useMemo } from 'react';
import Tournament from '../models/Tournament';
import { groupTeams } from '../utils/groupTeams';

const GroupStage = ({ teams }) => {
	const groupedTeams = useMemo(() => {
		if (teams.length === 0) return {};
		const tournament = new Tournament(teams, 'test-seed');
		return groupTeams(tournament.teams);
	}, [teams]);

	return (
		<div className="group-stage">
			{Object.entries(groupedTeams).map(([groupName, group]) => (
				<div key={groupName} className="group-card">
					<h2>Group {groupName}</h2>
					<ul>
						{group.map((team) => (
							<li key={team.name}>
								<img
									src={team.flag}
									alt={team.name}
									width="24"
								/>
								{team.name}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default GroupStage;
