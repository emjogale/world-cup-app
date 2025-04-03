import React, { useMemo, useState } from 'react';
import Tournament from '../../logic/Tournament';
import './GroupStage.css';
import { groupTeams } from '../../logic/groupTeams';
import {
	createGroupMatches,
	getFirstIndividualMatches
} from '../../logic/createMatches';
import Match from '../Match/Match';

const GroupStage = ({ teams }) => {
	const groupedTeams = useMemo(() => {
		if (teams.length === 0) return {};
		const tournament = new Tournament(teams, 'test-seed');
		return groupTeams(tournament.teams);
	}, [teams]);

	const [progress, setGroupProgress] = useState(() => {
		const initial = {};
		for (const groupName of Object.keys(groupedTeams)) {
			initial[groupName] = 0; //starting at match 0
		}
		return initial;
	});

	const [scores, setScores] = useState({});

	const handleScoreChange = (team, score) => {
		setScores((prev) => ({ ...prev, [team]: score }));
	};

	return (
		<div className="group-stage">
			{Object.entries(groupedTeams).map(([groupName, group]) => {
				const allMatches = createGroupMatches(group); // all 6 matches for 4 teams
				const currentIndex = progress[groupName];
				const matchesToShow = getFirstIndividualMatches(
					allMatches.slice(currentIndex)
				);

				// Dev-only check to ensure no team is scheduled more than once at the same time
				const playingTeams = new Set();
				for (const match of matchesToShow) {
					if (
						playingTeams.has(match.team1.name) ||
						playingTeams.has(match.team2.name)
					) {
						console.warn(
							`⚠️ Duplicate team in simultaneous matches for group ${groupName}:`,
							match
						);
					}
					playingTeams.add(match.team1.name);
					playingTeams.add(match.team2.name);
				}
				// scoped scores for this group
				const teamNamesInMatches = matchesToShow.flatMap(
					({ team1, team2 }) => [team1.name, team2.name]
				);
				const allScored = teamNamesInMatches.every(
					(teamName) =>
						scores[teamName] !== undefined &&
						scores[teamName] !== ''
				);
				const handleGroupSubmit = () => {
					console.log(`submitting results for group ${groupName}:`);
					matchesToShow.forEach(({ team1, team2 }) => {
						const s1 = parseInt(scores[team1.name], 10);
						const s2 = parseInt(scores[team2.name], 10);
						console.log(
							`${team1.name} ${s1} - ${s2} ${team2.name}`
						);
					});
					setGroupProgress((prev) => ({
						...prev,
						[groupName]: prev[groupName] + 2
					}));
				};
				return (
					<div key={groupName} className="group-card">
						<h2>Group {groupName}</h2>
						<div className="group-table-wrapper">
							<table className="group-table">
								<thead>
									<tr>
										<th>Team</th>
										<th>P</th>
										<th>W</th>
										<th>D</th>
										<th>L</th>
										<th>F</th>
										<th>A</th>
										<th>GD</th>
										<th>Pts</th>
									</tr>
								</thead>
								<tbody>
									{group.map((team) => (
										<tr
											key={team.name}
											data-testid={`row-${team.name}`}
										>
											<td className="team-cell">
												<div className="team-info">
													<img
														src={team.flag}
														alt={team.name}
														width="24"
														height="16"
													/>
													<span>{team.name}</span>
												</div>
											</td>
											<td>0</td>
											<td>0</td>
											<td>0</td>
											<td>0</td>
											<td>0</td>
											<td>0</td>
											<td>0</td>
											<td>0</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{matchesToShow.map(({ team1, team2 }) => (
							<Match
								key={`${team1.name}-vs-${team2.name}`}
								team1={team1.name}
								team2={team2.name}
								score1={scores[team1.name] || ''}
								score2={scores[team2.name] || ''}
								onScoreChange={handleScoreChange}
							/>
						))}
						{/* One button for both matches */}
						<button
							onClick={handleGroupSubmit}
							disabled={!allScored}
							data-testid={`submit-group-${groupName}`}
						>
							Submit Results
						</button>
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
