import React, { useEffect, useState } from 'react';
import { shuffleTeams } from './logic/shuffleTeams';
import Qualifiers from './components/Qualifiers/Qualifiers';
import GroupStage from './components/GroupStage/GroupStage';
import KnockoutStage from './components/KnockoutStage/KnockoutStage';
import { generateMockTeams } from './utils/teamFactories';
import './index.css';
import RegionalQualifiers from './components/RegionalQualifiers/RegionalQualifiers';

const App = () => {
	const [stage, setStage] = useState('qualifiers');
	const [teams, setTeams] = useState([]);
	const [seed, setSeed] = useState(
		() => localStorage.getItem('tdd-seed') || ''
	);
	const [shuffledTeams, setShuffledTeams] = useState([]);
	const [winners, setWinners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const mockAsiaTeams = generateMockTeams(42, 'Asia');

	useEffect(() => {
		fetch('/teams.json')
			.then((res) => {
				if (!res.ok) throw new Error('Failed to load teams');
				return res.json();
			})
			.then((data) => {
				setTeams(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error loading teams', err);
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return (
		<div className="app-container">
			<h1>🌍 World Cup</h1>

			{loading && <p>Loading teams...</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<RegionalQualifiers region="Asia" teams={mockAsiaTeams} spots={8} />
			{stage !== 'qualifiers' && seed && (
				<>
					{console.log('Seed is:', seed)}
					<p
						style={{
							marginTop: '1rem',
							fontStyle: 'italic',
							color: '#666'
						}}
					>
						Using seed: <strong>{seed}</strong>
						<button
							onClick={() => {
								navigator.clipboard.writeText(seed);
							}}
							className="seed-copy"
						>
							Copy Seed
						</button>
					</p>
				</>
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
