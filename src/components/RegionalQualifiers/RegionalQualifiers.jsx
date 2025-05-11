import React, { useState, useEffect } from 'react';
import { createGroupMatches } from '../../tournament/matches/createMatches';
import { autoCompleteGroupStage } from '../../utils/devTools';
import { initializeGroupStats } from '../../tournament/grouping/updateGroupStats';
import { selectRegionalQualifiers } from '../../tournament/grouping/selectRegionalQualifiers';
import {
	handleGroupSubmitHelper,
	sortByGroupRanking
} from '../../utils/groupHelpers';
import './RegionalQualifiers.css';

const RegionalQualifiers = ({ region, teams, spots }) => {
	const [matches, setMatches] = useState([]);
	const [qualifiedTeams, setQualifiedTeams] = useState([]);
	const [regionalStats, setRegionalStats] = useState({});
	const [scores, setScores] = useState({});

	useEffect(() => {
		if (teams && teams.length > 0) {
			const groupCount = Math.floor(teams.length / 6);
			const groups = Array.from({ length: groupCount }, (_, i) => ({
				name: `Group ${String.fromCharCode(65 + i)}`,
				teams: teams.slice(i * 6, i * 6 + 6)
			}));

			const newMatches = {};
			const newStats = {};

			// console.log('✅ newMatches:', newMatches);
			console.log('✅ newStats:', newStats);
			groups.forEach((group) => {
				newMatches[group.name] = createGroupMatches(group.teams);
				newStats[group.name] = initializeGroupStats(group.teams);
			});

			setMatches(newMatches);
			setRegionalStats(newStats);
		}
	}, [teams]);

	return (
		<div
			data-testid={`regional-qualifiers-${region.toLowerCase()}`}
			className="regional-stage"
		>
			<h2>{region} Qualifiers</h2>

			{Object.entries(matches).map(([groupName, groupMatches]) => {
				const groupStats = regionalStats[groupName];
				if (!groupStats) return null;

				return (
					<div key={groupName} className="group-card">
						<h3>{groupName}</h3>

						{/* Standings Table */}
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
									{Object.values(regionalStats[groupName])
										.sort(sortByGroupRanking)
										.map((team, index) => (
											<tr key={`${team.name}-${index}`}>
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

						{/* Match Fixtures */}
						<ul className="regional-fixtures">
							{groupMatches.map((match) => (
								<li
									key={`${match.team1.name}-vs-${match.team2.name}`}
								>
									<span className="team-name">
										{match.team1.name}
									</span>
									<input
										type="number"
										min="0"
										value={scores[match.team1.name] ?? ''}
										onChange={(e) =>
											setScores((prev) => ({
												...prev,
												[match.team1.name]:
													e.target.value
											}))
										}
									/>
									<span> : </span>
									<input
										type="number"
										min="0"
										value={scores[match.team2.name] ?? ''}
										onChange={(e) =>
											setScores((prev) => ({
												...prev,
												[match.team2.name]:
													e.target.value
											}))
										}
									/>
									<span className="team-name">
										{match.team2.name}
									</span>
								</li>
							))}
						</ul>
						<button
							onClick={() => {
								const { newStats, updatedMatches, nextScores } =
									handleGroupSubmitHelper({
										groupName,
										groupMatches,
										scores,
										currentStats: regionalStats[groupName]
									});

								setRegionalStats((prev) => ({
									...prev,
									[groupName]: newStats
								}));

								setMatches((prev) => ({
									...prev,
									[groupName]: updatedMatches
								}));

								setScores(nextScores);
							}}
						>
							Submit
						</button>
					</div>
				);
			})}

			{qualifiedTeams.length > 0 && (
				<div>
					<h3>Qualified Teams</h3>
					<div className="qualified-grid">
						{qualifiedTeams.map((team, index) => (
							<div
								key={`${team.name}-${index}`}
								className="qualified-team"
							>
								<img src={team.flag} alt={team.name} />
								<span>{team.name}</span>
							</div>
						))}
					</div>
				</div>
			)}

			<button
				onClick={() => {
					const { updatedMatches, updatedStats } =
						autoCompleteGroupStage(matches, regionalStats);

					setMatches(updatedMatches);
					setRegionalStats(updatedStats);

					const qualifiers = selectRegionalQualifiers(
						updatedStats,
						spots
					);
					setQualifiedTeams(qualifiers);
					console.log(
						'Qualified:',
						qualifiers.map((t) => t?.name)
					);
				}}
				className="dev-button"
			>
				Dev Autofill Regional Matches
			</button>
		</div>
	);
};

export default RegionalQualifiers;
