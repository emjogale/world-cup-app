import React, { useState } from 'react';
import { shuffleTeams } from './tournament/shuffleTeams';
import Qualifiers from './components/Qualifiers/Qualifiers';
import GroupStage from './components/GroupStage/GroupStage';
import KnockoutStage from './components/KnockoutStage/KnockoutStage';
import './index.css';

import { useTeams } from './context/TeamsContext';
import AllRegionalQualifiers from './components/AllRegionalQualifiers/AllRegionalQualifiers';

const App = () => {
	const [stage, setStage] = useState('regional');
	const [seed, setSeed] = useState(
		() => localStorage.getItem('tdd-seed') || ''
	);
	const [copied, setCopied] = useState(false);

	// pool of teams to show on the Qualifiers screen (either winners or full list if skipping)
	const [teamsForQualifiers, setTeamsForQualifiers] = useState([]);
	const [shuffledTeams, setShuffledTeams] = useState([]);
	const [winners, setWinners] = useState([]);

	const { teams, loading, error } = useTeams();

	const handleCopy = () => {
		navigator.clipboard.writeText(seed);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="app-container">
			<h1>🌍 World Cup</h1>

			{loading && <p>Loading teams...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}

			{stage === 'regional' && (
				<AllRegionalQualifiers
					onAllQualified={({ flat }) => {
						// show the Qualifiers screen with the actual winners
						setTeamsForQualifiers(flat);
						setStage('qualifiers');
					}}
				/>
			)}

			{/* Seed line is visible on quals/groups/knockout (your previous rule) */}
			{stage !== 'regional' && seed && (
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
			)}

			{/* Keep your dev path to skip regionals entirely */}
			{stage === 'regional' && (
				<button
					onClick={() => {
						// show all teams in the Qualifiers screen if skipping regionals
						setTeamsForQualifiers(teams);
						setStage('qualifiers');
					}}
				>
					Skip Regional Qualifiers
				</button>
			)}

			{stage === 'qualifiers' && (
				<>
					{/* Show flags/list for the pool we’re about to seed */}
					<Qualifiers teams={teamsForQualifiers} />

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
							const seeded = shuffleTeams(
								teamsForQualifiers,
								seed || undefined
							);
							setShuffledTeams(seeded);
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
