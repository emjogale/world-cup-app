import React, { useState, useEffect } from 'react';
import { createGroupMatches } from '../../logic/createMatches';

const RegionalQualifiers = ({ region, teams, spots }) => {
	const [groups, setGroups] = useState([]);
	const [matches, setMatches] = useState([]);
	const [standings, setStandings] = useState([]);
	const [qualifiedTeams, setQualifiedTeams] = useState([]);

	useEffect(() => {
		if (teams && teams.length > 0) {
			// TODO: group the teams into groups of 6
			// TODO: create matches for those groups
			// TODO: initialize standings
		}
	}, [teams]);

	return (
		<div data-testid={`regional-qualifiers-${region.toLowerCase()}`}>
			<h2>{region} Qualifiers</h2>

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
		</div>
	);
};

export default RegionalQualifiers;
