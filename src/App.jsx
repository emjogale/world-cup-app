import React, { useState } from 'react';
import { shuffleTeams } from './tournament/shuffleTeams';
import Qualifiers from './components/Qualifiers/Qualifiers';
import GroupStage from './components/GroupStage/GroupStage';
import KnockoutStage from './components/KnockoutStage/KnockoutStage';
import './index.css';
import RegionalQualifiers from './components/RegionalQualifiers/RegionalQualifiers';
import { useTeams } from './context/TeamsContext';
import AllRegionalQualifiers from './components/AllRegionalQualifiers/AllRegionalQualifiers';

const App = () => {
	const [stage, setStage] = useState('regional');
	const [seed, setSeed] = useState(
		() => localStorage.getItem('tdd-seed') || ''
	);
	const [copied, setCopied] = useState(false);
	const [shuffledTeams, setShuffledTeams] = useState([]);
	const [winners, setWinners] = useState([]);

	const { teams, loading, error } = useTeams();

	// const asiaTeams =
	// 	!loading && !error ? teams.filter((t) => t.region === 'AFC') : [];

	const handleCopy = () => {
		navigator.clipboard.writeText(seed);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000); // hide after 2s
	};
	return (
		<div className="app-container">
			<h1>🌍 World Cup</h1>

			{loading && <p>Loading teams...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}

			{/* {asiaTeams.length > 0 ? (
				<RegionalQualifiers region="AFC" spots={8} />
			) : (
				!loading && error && <p>No teams found for Asia yet</p>
			)} */}

			{stage === 'regional' && (
				<AllRegionalQualifiers
					onComplete={(qualifiedTeamsByRegion) => {
						// flatten and shuffle the qualified teams from all regions
						const allTeams = Object.values(
							qualifiedTeamsByRegion
						).flat();
						const shuffled = shuffleTeams(
							allTeams,
							seed || undefined
						);

						setShuffledTeams(shuffled);
						setStage('qualifiers');
					}}
				/>
			)}
			{stage !== 'qualifiers' && seed && (
				<>
					<p
						style={{
							marginTop: '1rem',
							fontStyle: 'italic',
							color: '#666'
						}}
						data-testid="seed-line"
					>
						Using seed: <strong>{seed}</strong>
						<button onClick={handleCopy} className="seed-copy">
							Copy Seed
						</button>
						{copied && <span role="status">Copied!</span>}
					</p>
				</>
			)}
			{stage === 'regional' && (
				<button onClick={() => setStage('qualifiers')}>
					Skip Regional Qualifiers
				</button>
			)}
			{stage === 'qualifiers' && (
				<>
					<Qualifiers />
					<small style={{ display: 'block', marginBottom: '0.5rem' }}>
						Enter a seed to repeat a specific tournament layout
					</small>
					<label htmlFor="seed" className="sr-only">
						Seed input
					</label>
					<input
						type="text"
						id="seed"
						placeholder="Optional seed"
						value={seed}
						onChange={(e) => setSeed(e.target.value)}
						className="seed-input"
					/>

					<button
						onClick={() => {
							const shuffled = shuffleTeams(
								teams,
								seed || undefined
							);

							setShuffledTeams(shuffled);
							setStage('groups');
						}}
						className="start-button"
					>
						Start Tournament
					</button>
				</>
			)}
			{stage === 'groups' && (
				<GroupStage
					teams={shuffledTeams}
					onComplete={(groupWinners) => {
						setWinners(groupWinners);
						setStage('knockout');
					}}
				/>
			)}
			{stage === 'knockout' && <KnockoutStage teams={winners} />}
		</div>
	);
};

export default App;
