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
import { handleScoreChangeHelper } from '../../utils/scoreHelpers';
import { getMatchKey } from '../../utils/matchHelpers';
import { safe } from '../../utils/stringUtils';

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

	const matchesToDisplayByGroup = useMemo(() => {
		if (!groupMatches || !groupStats) return {};

		const result = {};
		for (const groupName in groupMatches) {
			const matches = groupMatches[groupName];
			const stats = groupStats[groupName];
			result[groupName] = getNextMatches(matches, stats);
		}
		return result;
	}, [groupMatches, groupStats]);

	const handleScoreChange = (match, teamPosition, value) => {
		handleScoreChangeHelper(match, teamPosition, value, setScores);
	};

	if (!groupStats || !groupMatches) return null;

	const allGroupsComplete = Object.values(groupMatches).every((matches) =>
		matches.every((match) => match.played)
	);

	return (
        <div className="group-stage" data-testid="group-stage">
            {Object.entries(groupedTeams).map(([groupName]) => {
				const matchesToDisplay =
					matchesToDisplayByGroup[groupName] || [];
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

				const allScored = matchesToDisplay.every((match) => {
					const key = getMatchKey(match.team1, match.team2);
					const entry = scores[key];
					return (
						entry &&
						entry.score1 !== undefined &&
						entry.score1 !== '' &&
						entry.score2 !== undefined &&
						entry.score2 !== ''
					);
				});

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
													data-testid={`row-${safe(team.name)}`}
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
								key={`${safe(safe(team1.name))}-vs-${safe(safe(
									team2.name
								))}`}
								team1={team1.name}
								team2={team2.name}
								score1={
									scores[`${team1.name}-vs-${team2.name}`]
										?.score1 || ''
								}
								score2={
									scores[`${team1.name}-vs-${team2.name}`]
										?.score2 || ''
								}
								onScoreChange={(team, value) =>
									handleScoreChange(
										{ team1, team2 },
										team === team1.name
											? 'score1'
											: 'score2',
										value
									)
								}
							/>
						))}
                        <button
							onClick={() => {
								const { newStats, updatedMatches, nextScores } =
									handleGroupSubmitHelper({
										matchesToDisplay,
										scores,
										currentStats: groupStats[groupName]
									});

								setGroupStats((prev) => ({
									...prev,
									[groupName]: newStats
								}));

								setGroupMatches((prev) => {
									const group = prev[groupName]; // get all the matches for this group

									// loop over every match in group to check which one was just played - then mark it as played
									const updatedGroup = group.map((match) => {
										const updated = updatedMatches.find(
											(m) =>
												(m.team1.name ===
													match.team1.name &&
													m.team2.name ===
														match.team2.name) ||
												(m.team1.name ===
													match.team2.name &&
													m.team2.name ===
														match.team1.name)
										);
										return updated
											? { ...match, played: true }
											: match;
									});
									return {
										...prev,
										[groupName]: updatedGroup
									};
								});

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
