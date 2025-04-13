import React, { useEffect, useState } from 'react';
import Match from '../Match/Match';
import { createRoundMatches } from '../../logic/createMatches';
import './KnockoutStage.css';
import { createNextKnockoutRound } from '../../logic/createNextKnockoutRound';

const KnockoutStage = ({ qualifiedTeams }) => {
	const [knockoutRounds, setKnockoutRounds] = useState([]);

	useEffect(() => {
		if (qualifiedTeams.length > 0) {
			const firstRound = createRoundMatches(qualifiedTeams);
			setKnockoutRounds([firstRound]); // store full first round in an array
		}
	}, [qualifiedTeams]);

	const handleScoreChange = (roundIndex, matchIndex, teamKey, value) => {
		setKnockoutRounds((prev) => {
			const updated = [...prev];
			const round = [...updated[roundIndex]];
			const match = {
				...round[matchIndex],
				[teamKey]: parseInt(value, 10)
			};
			// 🏆 Update winner if both scores present
			if (match.score1 !== null && match.score2 !== null) {
				match.winner =
					match.score1 > match.score2 ? match.team1 : match.team2;
			}
			round[matchIndex] = match;
			updated[roundIndex] = round;
			return updated;
		});
	};

	const handleSubmitMatch = (roundIndex, matchIndex) => {
		setKnockoutRounds((prev) => {
			const updated = [...prev];
			const round = [...updated[roundIndex]];
			const match = round[matchIndex];

			const s1 = parseInt(match.score1, 10);
			const s2 = parseInt(match.score2, 10);
			if (isNaN(s1) || isNaN(s2)) return prev;

			const winner = s1 > s2 ? match.team1 : s2 > s1 ? match.team2 : null;

			const updatedMatch = {
				...match,
				played: true,
				winner
			};

			round[matchIndex] = updatedMatch;
			updated[roundIndex] = round;

			// ⬇️ If all matches in the current round are played, generate the next round
			const allPlayed = round.every((m) => m.played);
			if (allPlayed) {
				const next = createNextKnockoutRound(round);
				if (next.length > 0) {
					updated.push(next);
				}
			}

			return updated;
		});
	};

	if (!qualifiedTeams || qualifiedTeams.length === 0) {
		return <p>No knockout teams yet</p>;
	}

	// const currentRound = knockoutRounds[0] || [];
	console.log('🔢 knockoutRounds.length =', knockoutRounds.length);
	return (
		<div className="knockout-stage">
			<h2>Knockout Stage</h2>

			{knockoutRounds.map((round, roundIndex) => (
				<div key={roundIndex} className="knockout-round">
					<h3>Round {roundIndex + 1}</h3>

					{round.map((match, matchIndex) => {
						if (!match.team1 || !match.team2) return null; // skip incomplete matches
						return (
							<div key={matchIndex}>
								{console.log(
									`Rendering match ${match.team1.name} vs ${match.team2.name} in round ${roundIndex}`
								)}
								{console.log('Match data:', match)}
								<Match
									team1={match.team1.name}
									team2={match.team2.name}
									score1={match.score1 ?? ''}
									score2={match.score2 ?? ''}
									onScoreChange={(team, value) =>
										handleScoreChange(
											roundIndex,
											matchIndex,
											team === match.team1.name
												? 'score1'
												: 'score2',
											value
										)
									}
								/>
								<button
									onClick={() =>
										handleSubmitMatch(
											roundIndex,
											matchIndex
										)
									}
									disabled={
										match.played ||
										match.score1 === undefined ||
										match.score2 === undefined
									}
								>
									Submit
								</button>
								{match.played &&
									match.score1 === match.score2 && (
										<div className="extra-time">
											<h4>Extra Time</h4>
											<Match
												team1={match.team1.name}
												team2={match.team2.name}
												score1={
													match.extraTimeScore1 ?? ''
												}
												score2={
													match.extraTimeScore2 ?? ''
												}
												onScoreChange={(team, value) =>
													handleScoreChange(
														roundIndex,
														matchIndex,
														team ===
															match.team1.name
															? 'extraTimeScore1'
															: 'extraTimeScore2',
														value
													)
												}
											/>
										</div>
									)}
								{match.extraTimeScore1 !== null &&
									match.extraTimeScore2 !== null &&
									match.extraTimeScore1 ===
										match.extraTimeScore2 && (
										<div className="penalties">
											<h4>Penalties</h4>
											<Match
												team1={match.team1.name}
												team2={match.team2.name}
												score1={
													match.penaltyScore1 ?? ''
												}
												score2={
													match.penaltyScore2 ?? ''
												}
												onScoreChange={(team, value) =>
													handleScoreChange(
														roundIndex,
														matchIndex,
														team ===
															match.team1.name
															? 'penaltyScore1'
															: 'penaltyScore2',
														value
													)
												}
											/>
										</div>
									)}

								{match.played &&
									match.winner &&
									match.winner.name !== 'TBD' && (
										<p className="knockout-result">
											{match.winner.name} advances!
										</p>
									)}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default KnockoutStage;

// Reminder - knockoutRounds is an array of arrays. Each round is stored as a separate array inside it
