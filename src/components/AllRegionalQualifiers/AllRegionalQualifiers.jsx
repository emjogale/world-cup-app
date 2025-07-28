import React, { useState, useEffect } from 'react';
import RegionalQualifiers from '../RegionalQualifiers/RegionalQualifiers';

const AllRegionalQualifiers = () => {
	const [regions, setRegions] = useState([]);
	const [qualifiedTeams, setQualifiedTeams] = useState({});

	useEffect(() => {
		fetch('/data/regions.json')
			.then((res) => res.json())
			.then((data) => setRegions(data))
			.catch((err) => console.error('Failed to load regions:', err));
	}, []);

	const handleRegionComplete = (regionName, teams) => {
		setQualifiedTeams((prev) => {
			if (prev[regionName]) return prev; // already handled
			return {
				...prev,
				[regionName]: teams
			};
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
