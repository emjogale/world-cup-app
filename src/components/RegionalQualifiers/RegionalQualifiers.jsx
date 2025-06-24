import React, { useState, useEffect } from 'react';
import { createGroupMatches } from '../../tournament/matches/createMatches';
import { autoCompleteGroupStage } from '../../dev/devTools';
import { initializeGroupStats } from '../../tournament/grouping/updateGroupStats';
import { selectRegionalQualifiers } from '../../tournament/grouping/selectRegionalQualifiers';
import {
	handleGroupSubmitHelper,
	sortByGroupRanking
} from '../../utils/groupHelpers';
import './RegionalQualifiers.css';
import { getMatchKey } from '../../utils/matchHelpers';
import { handleScoreChangeHelper } from '../../utils/scoreHelpers';
import { splitIntoGroups } from '../../utils/groupHelpers';
import { safe } from '../../utils/stringUtils';
import { useTeams } from '../../context/TeamsContext';

const RegionalQualifiers = ({ region, spots, onRegionComplete }) => {
	const { teams, loading, error } = useTeams();
	// use only the teams from the correct region
	const [matches, setMatches] = useState([]);
	const [qualifiedTeams, setQualifiedTeams] = useState([]);
	const [regionalStats, setRegionalStats] = useState({});
	const [scores, setScores] = useState({});

	useEffect(() => {
		if (!teams || teams.length === 0) return;

		const regionTeams = teams.filter((t) => t.region === region);
		if (regionTeams.length === 0) return;

		// use seed for predetermined shuffling
		const seed = `${region}-qualifiers`;
		const groupSize = 6;

		const splitGroups = splitIntoGroups(regionTeams, groupSize, seed);
		const groups = splitGroups.map((groupTeams, i) => ({
			name: `Group ${String.fromCharCode(65 + i)}`,
			teams: groupTeams
		}));

		const newMatches = {};
		const newStats = {};

		groups.forEach((group) => {
			newMatches[group.name] = createGroupMatches(group.teams);
			newStats[group.name] = initializeGroupStats(group.teams);
		});

		setMatches(newMatches);
		setRegionalStats(newStats);
	}, [teams, region]);

	useEffect(() => {
		if (qualifiedTeams.length > 0) {
			onRegionComplete(region, qualifiedTeams);
		}
	}, [qualifiedTeams, onRegionComplete, region]);

	const handleDevAutofill = (seed = null) => {
		const { updatedMatches, updatedStats } = autoCompleteGroupStage(
			matches,
			regionalStats,
			seed
		);

		setMatches(updatedMatches);
		setRegionalStats(updatedStats);

		const qualifiers = selectRegionalQualifiers(updatedStats, spots);
		setQualifiedTeams(qualifiers);

		onRegionComplete(region, qualifiers);
	};

	// while data is loading or errored, give quick feedback
	if (loading) return <p>Loading {region} teams...</p>;
	if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

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
											<tr
												key={`${safe(
													team.name
												)}-${index}`}
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
						{/* Match Fixtures */}
						<ul className="regional-fixtures">
							{groupMatches.map((match) => (
								<li
									key={`${safe(
										safe(safe(match.team1.name))
									)}-vs-${safe(
										safe(safe(match.team2.name))
									)}`}
								>
									<span className="team-name">
										{match.team1.name}
									</span>
									<input
										type="number"
										min="0"
										data-testid={`score-${safe(
											match.team1.name
										)}-vs-${safe(match.team2.name)}-1`}
										value={
											scores[
												getMatchKey(
													match.team1,
													match.team2
												)
											]?.score1 || ''
										}
										onChange={(e) =>
											handleScoreChangeHelper(
												match,
												'score1',
												e.target.value,
												setScores
											)
										}
									/>
									<span> : </span>
									<input
										type="number"
										min="0"
										data-testid={`score-${safe(
											match.team2.name
										)}-vs-${safe(match.team1.name)}-2`}
										value={
											scores[
												getMatchKey(
													match.team1,
													match.team2
												)
											]?.score2 || ''
										}
										onChange={(e) =>
											handleScoreChangeHelper(
												match,
												'score2',
												e.target.value,
												setScores
											)
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
								key={`${safe(team.name)}-${index}`}
								className="qualified-team"
							>
								<img src={team.flag} alt={team.name} />
								<span>{team.name}</span>
							</div>
						))}
					</div>
				</div>
			)}
			<button onClick={handleDevAutofill} className="dev-button">
				Dev Autofill Regional Matches
			</button>
		</div>
	);
};

export default RegionalQualifiers;
