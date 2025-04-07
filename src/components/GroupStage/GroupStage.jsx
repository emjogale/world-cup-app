import React, { useMemo, useState, useEffect } from 'react';
import Tournament from '../../logic/Tournament';
import './GroupStage.css';
import { groupTeams } from '../../logic/groupTeams';
import { createGroupMatches } from '../../logic/createMatches';
import Match from '../Match/Match';
import {
	upDateGroupStats,
	buildInitialGroupStats
} from '../../logic/updateGroupStats';
import { getNextMatches } from '../../logic/createMatches';

const GroupStage = ({ teams }) => {
	const groupedTeams = useMemo(() => {
		if (teams.length === 0) return {};
		const tournament = new Tournament(teams, 'test-seed');
		return groupTeams(tournament.teams);
	}, [teams]);

	const [scores, setScores] = useState({});
	const [groupStats, setGroupStats] = useState(null);
	const [groupMatches, setGroupMatches] = useState(null);

	useEffect(() => {
		if (!groupedTeams || Object.keys(groupedTeams).length === 0) return;
		setGroupStats(buildInitialGroupStats(groupedTeams));

		const allMatches = {};
		for (const [groupName, group] of Object.entries(groupedTeams)) {
			allMatches[groupName] = createGroupMatches(group).map((match) => ({
				...match,
				played: false
			}));
		}
		setGroupMatches(allMatches);
	}, [groupedTeams]);

	const handleScoreChange = (team, score) => {
		setScores((prev) => ({ ...prev, [team]: score }));
	};

	if (!groupStats || !groupMatches) return null;
	console.log('group stats are:', groupStats);
	return (
		<div className="group-stage">
			{Object.entries(groupedTeams).map(([groupName]) => {
				const allMatches = groupMatches[groupName];
				const matchesToShow = getNextMatches(
					allMatches,
					groupStats[groupName]
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

				const teamNamesInMatches = matchesToShow.flatMap(
					({ team1, team2 }) => [team1.name, team2.name]
				);
				const allScored = teamNamesInMatches.every(
					(teamName) =>
						scores[teamName] !== undefined &&
						scores[teamName] !== ''
				);

				const handleGroupSubmit = () => {
					const results = matchesToShow.map(({ team1, team2 }) => ({
						team1: team1.name,
						score1: parseInt(scores[team1.name], 10),
						team2: team2.name,
						score2: parseInt(scores[team2.name], 10)
					}));

					console.log('➡️ Submitting results:', results);

					const newStats = upDateGroupStats(
						groupStats[groupName],
						results
					);
					console.log(
						'✅ Updated stats for group:',
						groupName,
						newStats
					);
					setGroupStats((prev) => ({
						...prev,
						[groupName]: { ...newStats }
					}));

					setGroupMatches((prev) => {
						const updated = { ...prev };
						updated[groupName] = prev[groupName].map((match) => {
							const matchWasJustPlayed = results.some(
								(r) =>
									(r.team1 === match.team1.name &&
										r.team2 === match.team2.name) ||
									(r.team1 === match.team2.name &&
										r.team2 === match.team1.name)
							);
							return matchWasJustPlayed
								? { ...match, played: true }
								: match;
						});
						return updated;
					});

					const teamsToReset = new Set();
					results.forEach(({ team1, team2 }) => {
						teamsToReset.add(team1);
						teamsToReset.add(team2);
					});

					setScores((prev) => {
						const next = { ...prev };
						teamsToReset.forEach((team) => {
							next[team] = '';
						});
						return next;
					});
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
									{Object.values(groupStats[groupName])
										.sort(
											(a, b) =>
												b.points - a.points ||
												b.gd - a.gd ||
												b.for - a.for
										)
										.map((team, index) => (
											<tr
												key={team.name}
												className={
													index < 2
														? 'group__top-team'
														: ''
												}
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
												<td>{team.played}</td>
												<td>{team.won}</td>
												<td>{team.drawn}</td>
												<td>{team.lost}</td>
												<td>{team.for}</td>
												<td>{team.against}</td>
												<td>{team.gd}</td>
												<td>{team.points}</td>
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
