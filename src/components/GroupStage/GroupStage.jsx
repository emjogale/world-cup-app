import React, { useMemo, useState } from 'react';
import Tournament from '../../logic/Tournament';
import './GroupStage.css';
import { groupTeams } from '../../logic/groupTeams';
import { createGroupMatches } from '../../logic/createMatches';
import Match from '../Match/Match';

const GroupStage = ({ teams }) => {
	const [visibleMatches, setVisibleMatches] = useState({});

	const groupedTeams = useMemo(() => {
		if (teams.length === 0) return {};
		const tournament = new Tournament(teams, 'test-seed');
		return groupTeams(tournament.teams);
	}, [teams]);

	return (
		<div className="group-stage">
			{Object.entries(groupedTeams).map(([groupName, group]) => {
				const allMatches = createGroupMatches(group); // all 6 matches for 4 teams
				const matchesToShow = allMatches.slice(0, 2); // just the first 2

				return (
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
						{matchesToShow.map(({ team1, team2 }) => (
							<Match
								key={`${team1.name}-vs-${team2.name}`}
								team1={team1.name}
								team2={team2.name}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
};

export default GroupStage;

// Notes:
// We use useMemo() to group teams once per teams prop change
// We use 'test-seed' for consistent groupings in tests
// In the future, we can update it to receive the seed as a prop or context
