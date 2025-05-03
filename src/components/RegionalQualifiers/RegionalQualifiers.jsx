import React, { useState, useEffect } from 'react';
import { createGroupMatches } from '../../logic/createMatches';
import { autoCompleteGroupStage } from '../../utils/devTools';

const RegionalQualifiers = ({ region, teams, spots }) => {
	const [groups, setGroups] = useState([]);
	const [matches, setMatches] = useState([]);
	const [standings, setStandings] = useState([]);
	const [qualifiedTeams, setQualifiedTeams] = useState([]);

	useEffect(() => {
		if (teams && teams.length > 0) {
			// Step 1: split teams into groups (e.g., Group A–G)
			const groupCount = Math.floor(teams.length / 6);
			const groups = Array.from({ length: groupCount }, (_, i) => ({
				name: `Group ${String.fromCharCode(65 + i)}`,
				teams: teams.slice(i * 6, i * 6 + 6)
			}));

			const newMatches = {};
			const newStats = {};

			groups.forEach((group) => {
				newMatches[group.name] = createGroupMatches(group.teams);

				newStats[group.name] = group.teams.reduce((acc, team) => {
					acc[team.name] = {
						played: 0,
						won: 0,
						lost: 0,
						drawn: 0,
						points: 0,
						for: 0,
						against: 0,
						gd: 0
					};
					return acc;
				}, {});
			});

			setMatches(newMatches);
			setStandings(newStats);
		}
	}, [teams]);

	return (
		<div data-testid={`regional-qualifiers-${region.toLowerCase()}`}>
			<h2>{region} Qualifiers</h2>
			{Object.entries(matches).map(([groupName, groupMatches]) => (
				<div key={groupName} style={{ marginBottom: '2rem' }}>
					<h3>{groupName}</h3>
					<ul>
						{groupMatches.map((match, index) => (
							<li key={index}>
								{match.team1.name} {match.score1 ?? '-'} :{' '}
								{match.score2 ?? '-'} {match.team2.name}
							</li>
						))}
					</ul>
				</div>
			))}

			{Object.entries(standings).map(([groupName, groupTable]) => (
				<div key={groupName}>
					<h4>{groupName} Standings</h4>
					<ul>
						{Object.entries(groupTable).map(([teamName, stats]) => (
							<li key={teamName}>
								{teamName} — Pts: {stats.points}, GD: {stats.gd}
								, W: {stats.won}, L: {stats.lost}
							</li>
						))}
					</ul>
				</div>
			))}

			{/* Render groups, matches, standings */}
			{qualifiedTeams.length > 0 && (
				<div>
					<h3>Qualified Teams</h3>
					<ul>
						{qualifiedTeams.map((team) => (
							<li key={team.name}>{team.name}</li>
						))}
					</ul>
				</div>
			)}

			<button
				onClick={() => {
					const { updatedMatches, updatedStats } =
						autoCompleteGroupStage(matches, standings);

					setMatches(updatedMatches);
					setStandings(updatedStats);

					// Optional: decide qualified teams immediately
					// setQualifiedTeams(...) here later
				}}
				className="dev-button"
			>
				Dev Autofill Regional Matches
			</button>
		</div>
	);
};

export default RegionalQualifiers;
