import React, { useState, useEffect } from 'react';
import RegionalQualifiers from '../RegionalQualifiers/RegionalQualifiers';

const AllRegionalQualifiers = ({ onAllQualified }) => {
	const [regions, setRegions] = useState([]);
	const [qualifiedTeams, setQualifiedTeams] = useState({});

	useEffect(() => {
		fetch('/regions.json')
			.then((res) => res.json())
			.then((data) => setRegions(data))
			.catch((err) => console.error('Failed to load regions:', err));
	}, []);

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
