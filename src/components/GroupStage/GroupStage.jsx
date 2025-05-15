import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createGroupMatches } from '../../tournament/matches/createMatches';

import Match from '../Match/Match';
import { buildInitialGroupStats } from '../../tournament/grouping/updateGroupStats';

import { getNextMatches } from '../../tournament/matches/createMatches';
import { autoCompleteGroupStage } from '../../utils/devTools';
import KnockoutStage from '../KnockoutStage/KnockoutStage';
import { selectQualifiedTeams } from '../../tournament/matches/selectQualifiedTeams';
import { shuffleAndGroup } from '../../tournament/grouping/shuffleAndGroup';
import './GroupStage.css';
import {
	handleGroupSubmitHelper,
	sortByGroupRanking
} from '../../utils/groupHelpers';

const GroupStage = ({ teams }) => {
	const groupedTeams = useMemo(() => {
		if (teams.length === 0) return {};

		return shuffleAndGroup(teams, 'test-seed');
	}, [teams]);

	const [scores, setScores] = useState({});
	const [groupStats, setGroupStats] = useState(null);
	const [groupMatches, setGroupMatches] = useState(null);
	const [showKnockoutStage, setShowKnockoutStage] = useState(false);
	const [qualifiedTeams, setQualifiedTeams] = useState([]);

	const knockoutRef = useRef(null);

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

	const allGroupsComplete = Object.values(groupMatches).every((matches) =>
		matches.every((match) => match.played)
	);

	return (
		<div className="group-stage" data-testid="group-stage">
			{Object.entries(groupedTeams).map(([groupName]) => {
				const allMatches = groupMatches[groupName];
				const matchesToDisplay = getNextMatches(
					allMatches,
					groupStats[groupName]
				);

				// Dev-only check to ensure no team is scheduled more than once at the same time
				const playingTeams = new Set();
				for (const match of matchesToDisplay) {
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

				const teamNamesInMatches = matchesToDisplay.flatMap(
					({ team1, team2 }) => [team1.name, team2.name]
				);
				const allScored = teamNamesInMatches.every(
					(teamName) =>
						scores[teamName] !== undefined &&
						scores[teamName] !== ''
				);

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
										.sort(sortByGroupRanking)
										.map((team, index) => {
											const isTopTwo = index < 2;
											const isQualifiedThird =
												index === 2 &&
												qualifiedTeams.some(
													(qt) =>
														qt.name === team.name
												);

											return (
												<tr
													key={team.name}
													className={
														isTopTwo ||
														isQualifiedThird
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
															<span>
																{team.name}
															</span>
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
											);
										})}
								</tbody>
							</table>
						</div>
						{matchesToDisplay.map(({ team1, team2 }) => (
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
							onClick={() => {
								const { newStats, updatedMatches, nextScores } =
									handleGroupSubmitHelper({
										groupName,
										groupMatches,
										scores,
										currentStats: groupStats[groupName]
									});

								setGroupStats((prev) => ({
									...prev,
									[groupName]: newStats
								}));

								setGroupMatches((prev) => ({
									...prev,
									[groupName]: updatedMatches
								}));

								setScores(nextScores);
							}}
							disabled={!allScored}
							data-testid={`submit-group-${groupName}`}
						>
							Submit Results
						</button>
					</div>
				);
			})}

			{allGroupsComplete && !showKnockoutStage && (
				<div className="knockout-button-wrapper">
					<button
						className="proceed-knockout-button"
						onClick={() => {
							const qualified = selectQualifiedTeams(groupStats);

							setQualifiedTeams(qualified);

							setShowKnockoutStage(true);
							// Smooth scroll
							setTimeout(() => {
								knockoutRef.current?.scrollIntoView({
									behavior: 'smooth',
									block: 'start'
								});
							}, 50);
						}}
					>
						<span
							role="img"
							aria-label="Trophy"
							style={{ marginRight: '0.5rem' }}
						>
							🏆
						</span>
						Proceed to Knockout Stage
					</button>
				</div>
			)}

			{!allGroupsComplete && (
				<button
					className="dev-fill-results"
					onClick={() => {
						const { updatedMatches, updatedStats } =
							autoCompleteGroupStage(groupMatches, groupStats);
						setGroupMatches(updatedMatches);
						setGroupStats(updatedStats);
					}}
				>
					🔧 Dev: Auto-complete group stage
				</button>
			)}
			{showKnockoutStage && (
				<div ref={knockoutRef}>
					<KnockoutStage qualifiedTeams={qualifiedTeams} />
				</div>
			)}
		</div>
	);
};

export default GroupStage;
