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

	// 1) compute once per render
	const regionTeams = React.useMemo(
		() => (teams || []).filter((t) => t.region === region),
		[teams, region]
	);

	// 2) empty region flag (only after loading finishes)
	const isEmptyRegion = !loading && regionTeams.length === 0;

	// 3) report empty region completion once
	const [emptyReported, setEmptyReported] = useState(false);
	useEffect(() => {
		if (isEmptyRegion && !emptyReported) {
			onRegionComplete?.(region, []); // ✅ mark region complete with 0 qualifiers
			setEmptyReported(true);
		}
	}, [isEmptyRegion, emptyReported, region, onRegionComplete]);

	useEffect(() => {
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
	}, [regionTeams, region]);

	useEffect(() => {
		if (qualifiedTeams.length === spots) {
			onRegionComplete(region, qualifiedTeams);
		}
	}, [qualifiedTeams, onRegionComplete, region, spots]);

	const handleDevAutofill = (seed = null) => {
		if (isEmptyRegion) return; // nothing to do for empty region
		// If groups/stats aren’t ready yet, don’t run
		if (!matches || Object.keys(matches).length === 0) return;
		if (!regionalStats || Object.keys(regionalStats).length === 0) return;

		// Run the dev tool, but guard against undefined results
		const result =
			autoCompleteGroupStage(matches, regionalStats, seed) || {};
		const updatedMatches = result.updatedMatches ?? matches;
		const updatedStatsRaw = result.updatedStats ?? regionalStats;

		// Normalize one group (array -> object keyed by team name)
		const normalizeGroup = (groupStats) =>
			Array.isArray(groupStats)
				? Object.fromEntries(
						groupStats.map((team) => [team.name, team])
				  )
				: groupStats ?? {};

		// Normalize the whole stats object safely
		const updatedStatsObj =
			updatedStatsRaw && typeof updatedStatsRaw === 'object'
				? updatedStatsRaw
				: {};

		const normalisedUpdatedStats = Object.fromEntries(
			Object.entries(updatedStatsObj).map(([groupName, groupStats]) => [
				groupName,
				normalizeGroup(groupStats)
			])
		);

		// Apply state
		setMatches(updatedMatches);
		setRegionalStats(normalisedUpdatedStats);

		// Compute qualifiers from normalized stats
		const qualifiers =
			selectRegionalQualifiers(normalisedUpdatedStats, spots) || [];
		setQualifiedTeams(qualifiers);

		// Notify parent
		onRegionComplete(region, qualifiers);
	};

	// while data is loading or errored, give quick feedback
	if (loading) return <p>Loading {region} teams...</p>;
	if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

	if (isEmptyRegion) {
		return (
			<div
				className="group-card"
				style={{ textAlign: 'center', opacity: 0.85 }}
			>
				<h3>{region} Qualifiers</h3>
				<p>No teams in this region yet.</p>
				<button className="dev-button" disabled>
					Dev Autofill Regional Matches
				</button>
			</div>
		);
	}

	return (
		<div
			data-testid={`regional-qualifiers-${region?.toLowerCase()}`}
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
								const result = handleGroupSubmitHelper({
									matchesToDisplay: groupMatches,
									scores,
									currentStats: regionalStats[groupName]
								});

								// Accept either shape; normalize to name-keyed object in state
								const maybeByName =
									result.newStatsByName ??
									result.newStats ??
									{};
								const byName = Array.isArray(maybeByName)
									? Object.fromEntries(
											maybeByName.map((s) => [s.name, s])
									  )
									: maybeByName;

								const updatedRegionalStats = {
									...regionalStats,
									[groupName]: byName
								};

								setRegionalStats(updatedRegionalStats);
								setMatches((prev) => ({
									...prev,
									[groupName]: result.updatedMatches
								}));
								setScores(result.nextScores);

								// Compute qualifiers for this region NOW (selector expects object-of-objects)
								const qualifiers = selectRegionalQualifiers(
									updatedRegionalStats,
									spots
								);
								setQualifiedTeams(qualifiers);
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
			<button
				onClick={handleDevAutofill}
				className="dev-button"
				disabled={
					isEmptyRegion ||
					!matches ||
					Object.keys(matches).length === 0 ||
					!regionalStats ||
					Object.keys(regionalStats).length === 0
				}
			>
				Dev Autofill Regional Matches
			</button>
		</div>
	);
};

export default RegionalQualifiers;
