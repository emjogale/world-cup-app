import React, { useEffect, useState } from 'react';
import Match from '../Match/Match';
import { createRoundMatches } from '../../logic/createMatches';
import './KnockoutStage.css';
import { createNextKnockoutRound } from '../../logic/createNextKnockoutRound';
import {
	determineWinner,
	hasFinalWinner,
	isReadyToSubmitRegular,
	isReadyToSubmitExtraTime,
	isReadyToSubmitPenalties
} from '../../utils/matchHelpers';

const KnockoutStage = ({ qualifiedTeams }) => {
	const [knockoutRounds, setKnockoutRounds] = useState([]);

	useEffect(() => {
		if (qualifiedTeams.length > 0) {
			const firstRound = createRoundMatches(qualifiedTeams);
			setKnockoutRounds([firstRound]); // store full first round in an array
		}
	}, [qualifiedTeams]);

	const handleScoreChange = (
		roundIndex,
		matchIndex,
		teamName,
		value,
		phase = 'regular'
	) => {
		setKnockoutRounds((prev) => {
			const updated = [...prev];
			const round = [...updated[roundIndex]];
			const match = {
				...round[matchIndex]
			};

			const parsedValue = parseInt(value, 10);
			// Determine which score field to update based on the team name
			const isTeam1 = teamName === match.team1.name;

			if (phase === 'regular') {
				if (isTeam1) {
					match.score1 = parsedValue;
				} else {
					match.score2 = parsedValue;
				}
			} else if (phase === 'extra') {
				if (isTeam1) {
					match.extraTimeScore1 = parsedValue;
				} else {
					match.extraTimeScore2 = parsedValue;
				}
			} else if (phase === 'penalties') {
				if (isTeam1) {
					match.penaltyScore1 = parsedValue;
				} else {
					match.penaltyScore2 = parsedValue;
				}
			}

			round[matchIndex] = match;
			updated[roundIndex] = round;
			return updated;
		});
	};

	const handleSubmitMatch = (roundIndex, matchIndex, phase = 'regular') => {
		setKnockoutRounds((prev) => {
			const updated = [...prev];
			const round = [...updated[roundIndex]];
			const match = round[matchIndex];

			if (phase === 'regular') {
				match.regularTimePlayed = true;
			} else if (phase === 'extra') {
				match.extraTimePlayed = true;
			} else if (phase === 'penalties') {
				match.penaltiesPlayed = true;
				match.played = true;
				match.winner = determineWinner(match);
			}
			// Always determine the winner if we’ve finished any phase
			if (phase === 'regular' || phase === 'extra') {
				match.winner = determineWinner(match);
			}
			round[matchIndex] = match;
			updated[roundIndex] = round;

			// If it's the final submission (after penalties), trigger next round
			if (phase === 'penalties' || match.winner) {
				const allPlayed = round.every((m) => m.played);
				if (allPlayed) {
					const next = createNextKnockoutRound(round);
					if (next.length > 0) {
						updated.push(next);
					}
				}
			}

			return updated;
		});
	};

	if (!qualifiedTeams || qualifiedTeams.length === 0) {
		return <p>No knockout teams yet</p>;
	}

	return (
		<div className="knockout-stage">
			<h2>Knockout Stage</h2>

			{knockoutRounds.map((round, roundIndex) => (
				<div key={roundIndex} className="knockout-round">
					<h3>Round {roundIndex + 1}</h3>

					{round.map((match, matchIndex) => {
						if (!match.team1 || !match.team2) return null;

						const showExtraTime =
							match.regularTimePlayed &&
							match.score1 === match.score2;

						const showPenalties =
							match.extraTimePlayed &&
							Number.isInteger(match.extraTimeScore1) &&
							Number.isInteger(match.extraTimeScore2) &&
							match.extraTimeScore1 === match.extraTimeScore2;

						return (
							<div key={matchIndex}>
								<Match
									team1={match.team1.name}
									team2={match.team2.name}
									score1={match.score1 ?? ''}
									score2={match.score2 ?? ''}
									extraTimeScore1={
										match.extraTimeScore1 ?? ''
									}
									extraTimeScore2={
										match.extraTimeScore2 ?? ''
									}
									penaltyScore1={match.penaltyScore1 ?? ''}
									penaltyScore2={match.penaltyScore2 ?? ''}
									regularTimePlayed={match.regularTimePlayed}
									extraTimePlayed={match.extraTimePlayed}
									penaltiesPlayed={match.penaltiesPlayed}
									showExtraTime={showExtraTime}
									showPenalties={showPenalties}
									onScoreChange={(
										team,
										value,
										phase = 'regular'
									) =>
										handleScoreChange(
											roundIndex,
											matchIndex,
											team,
											value,
											phase
										)
									}
								/>
								{!match.regularTimePlayed &&
									isReadyToSubmitRegular(match) && (
										<button
											onClick={() =>
												handleSubmitMatch(
													roundIndex,
													matchIndex,
													'regular'
												)
											}
										>
											Submit Regular Time
										</button>
									)}
								{match.regularTimePlayed &&
									!match.extraTimePlayed &&
									isReadyToSubmitExtraTime(match) && (
										<button
											onClick={() =>
												handleSubmitMatch(
													roundIndex,
													matchIndex,
													'extra'
												)
											}
										>
											Submit Extra Time
										</button>
									)}
								{match.extraTimePlayed &&
									!match.penaltiesPlayed &&
									isReadyToSubmitPenalties(match) && (
										<button
											onClick={() =>
												handleSubmitMatch(
													roundIndex,
													matchIndex,
													'penalties'
												)
											}
										>
											Submit Penalties
										</button>
									)}

								{hasFinalWinner(match) &&
									match.winner?.name && (
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
