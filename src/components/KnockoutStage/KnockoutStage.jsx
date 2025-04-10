import React, { useEffect, useState } from 'react';
import Match from '../Match/Match';
import { createRoundMatches } from '../../logic/createMatches';
import './KnockoutStage.css';

const KnockoutStage = ({ qualifiedTeams }) => {
	const [matches, setMatches] = useState([]);

	useEffect(() => {
		if (qualifiedTeams.length > 0) {
			const initialMatches = createRoundMatches(qualifiedTeams);
			setMatches(initialMatches);
		}
	}, [qualifiedTeams]);

	const handleScoreChange = (matchIndex, teamKey, value) => {
		setMatches((prev) => {
			const updated = [...prev];
			updated[matchIndex] = {
				...updated[matchIndex],
				[teamKey]: value
			};
			return updated;
		});
	};

	const handleSubmitMatch = (matchIndex) => {
		const match = matches[matchIndex];
		const s1 = parseInt(match.score1, 10);
		const s2 = parseInt(match.score2, 10);

		if (isNaN(s1) || isNaN(s2)) return;

		const winner = s1 > s2 ? match.team1 : s2 > s1 ? match.team2 : null; // No draws in knockout!

		setMatches((prev) => {
			const updated = [...prev];
			updated[matchIndex] = {
				...match,
				played: true,
				winner
			};
			return updated;
		});
	};

	if (!qualifiedTeams || qualifiedTeams.length === 0) {
		return <p>No knockout teams yet</p>;
	}

	return (
		<div className="knockout-stage">
			<h2>Knockout Stage</h2>

			{matches.map((match, index) => (
				<div
					key={index}
					data-testid={`match-${match.team1.name}-vs-${match.team2.name}`}
				>
					<Match
						team1={match.team1.name}
						team2={match.team2.name}
						score1={match.score1 ?? ''}
						score2={match.score2 ?? ''}
						onScoreChange={(team, value) =>
							handleScoreChange(
								index,
								team === match.team1.name ? 'score1' : 'score2',
								value
							)
						}
					/>
					<button
						onClick={() => handleSubmitMatch(index)}
						disabled={
							match.played ||
							match.score1 === undefined ||
							match.score2 === undefined
						}
					>
						Submit
					</button>
					{match.played && match.winner && (
						<p className="knockout-result">
							✅ {match.winner.name} advances!
						</p>
					)}
				</div>
			))}
		</div>
	);
};

export default KnockoutStage;
