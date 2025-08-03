import React, { useState } from 'react';
import RegionalQualifiers from '../RegionalQualifiers/RegionalQualifiers';
import { useTeams } from '../../context/TeamsContext';

const AllRegionalQualifiers = ({ onAllQualified }) => {
	const { regions } = useTeams(); // from context
	const [qualifiedTeams, setQualifiedTeams] = useState({});

	const handleRegionComplete = (regionName, teams) => {
		setQualifiedTeams((prev) => {
			if (prev[regionName]) return prev; // already handled
			const updated = {
				...prev,
				[regionName]: teams
			};

			// if all regions are done, notify parent
			if (
				regions.length > 0 &&
				Object.keys(updated).length === regions.length
			) {
				onAllQualified?.(updated);
			}
			return updated;
		});
	};

	const handleNextStage = () => {
		const allQualified = Object.values(qualifiedTeams).flat();
		console.log('Qualified teams', allQualified);
		// eventually you might: pass to KnockoutStage, or navigate to next route
	};

	const allRegionsComplete =
		regions.length > 0 &&
		Object.keys(qualifiedTeams).length === regions.length;

	return (
		<div>
			{regions.map(({ region, spots }) => (
				<RegionalQualifiers
					key={region}
					region={region}
					spots={spots}
					onRegionComplete={handleRegionComplete}
				/>
			))}

			{allRegionsComplete && (
				<button onClick={handleNextStage()}>Next Stage</button>
			)}
		</div>
	);
};

export default AllRegionalQualifiers;
