import React, { useMemo } from 'react';
import Tournament from '../../logic/Tournament';
import './GroupStage.css';
import { groupTeams } from '../../logic/groupTeams';
import { createGroupMatches } from '../../logic/createMatches';

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
					{createGroupMatches(group).map((match, index) => (
						<h3 key={index}>
							{match.team1.name} vs {match.team2.name}
						</h3>
					))}
				</div>
			))}
		</div>
	);
};

export default GroupStage;

// Notes:
// We use useMemo() to group teams once per teams prop change
// We use 'test-seed' for consistent groupings in tests
// In the future, we can update it to receive the seed as a prop or context
