import React, { useMemo, useState } from 'react';
import RegionalQualifiers from '../RegionalQualifiers/RegionalQualifiers';
import { useTeams } from '../../context/TeamsContext';

const AllRegionalQualifiers = ({ onAllQualified }) => {
	const { regions = [] } = useTeams();
	const [qualifiedByRegion, setQualifiedByRegion] = useState({});

	const allRegionsComplete =
		regions.length > 0 &&
		Object.keys(qualifiedByRegion).length === regions.length;

	const flatQualified = useMemo(() => {
		return Object.entries(qualifiedByRegion).flatMap(
			([regionName, teams]) =>
				(teams || []).map((t) => ({
					...t,
					region: t.region ?? regionName
				}))
		);
	}, [qualifiedByRegion]);

	const handleRegionComplete = (regionName, teams) => {
		setQualifiedByRegion((prev) => {
			if (prev[regionName]) return prev; // already set
			const next = { ...prev, [regionName]: teams };

			if (
				regions.length > 0 &&
				Object.keys(next).length === regions.length
			) {
				onAllQualified?.({ byRegion: next, flat: flatify(next) });
			}
			return next;
		});
	};

	// helper to produce flat list from a byRegion object
	const flatify = (byRegion) =>
		Object.entries(byRegion).flatMap(([r, ts]) =>
			(ts || []).map((t) => ({ ...t, region: t.region ?? r }))
		);

	const handleContinue = () => {
		// If parent provided a handler, it will navigate. If not, we still emit for dev.
		onAllQualified?.({ byRegion: qualifiedByRegion, flat: flatQualified });
	};

	return (
		<div data-testid="all-regional-qualifiers">
			{regions.map(({ region, spots }) => (
				<RegionalQualifiers
					key={region}
					region={region}
					spots={spots}
					onRegionComplete={handleRegionComplete}
				/>
			))}

			{allRegionsComplete && (
				<div style={{ marginTop: 16 }}>
					<button onClick={handleContinue}>
						Continue to Group Stage
					</button>
				</div>
			)}
		</div>
	);
};

export default AllRegionalQualifiers;
