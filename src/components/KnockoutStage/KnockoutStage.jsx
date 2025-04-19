import React, { useEffect, useState } from 'react';
import Match from '../Match/Match';
import { createRoundMatches } from '../../logic/createMatches';
import './KnockoutStage.css';
import { createNextKnockoutRound } from '../../logic/createNextKnockoutRound';
import {
	determineWinner,
	matchHasClearWinner,
	isReadyToSubmitRegular,
	isReadyToSubmitExtraTime,
	isReadyToSubmitPenalties,
	hasFinalWinner
} from '../../utils/matchHelpers';
import { devAutofillKnockoutRound } from '../../utils/devTools';

const KnockoutStage = ({ qualifiedTeams }) => {
	const [knockoutRounds, setKnockoutRounds] = useState([]);

	useEffect(() => {
		if (qualifiedTeams.length > 0) {
			const firstRound = createRoundMatches(qualifiedTeams);
			setKnockoutRounds([firstRound]); // store full first round in an array
		}
	}, [qualifiedTeams]);

	const handleDevAutofill = () => {
		setKnockoutRounds((prev) => {
			const updated = [...prev];
			const roundIndex = updated.length - 1;
			const autofilledRound = devAutofillKnockoutRound(
				updated[roundIndex]
			);

			updated[roundIndex] = autofilledRound;

			// Optionally trigger next round if all matches are now played
			const allPlayed = autofilledRound.every((m) => m.played);
			if (allPlayed) {
				const next = createNextKnockoutRound(autofilledRound);
				if (next.length > 0) updated.push(next);
			}

			return updated;
		});
	};

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

			// 🛠️ Construct an updated match immutably
			const updatedMatch = {
				...match,
				regularTimePlayed:
					phase === 'regular' ? true : match.regularTimePlayed,
				extraTimePlayed:
					phase === 'extra' ? true : match.extraTimePlayed,
				penaltiesPlayed:
					phase === 'penalties' ? true : match.penaltiesPlayed
			};

			// Always determine the winner after a phase
			if (
				phase === 'regular' ||
				phase === 'extra' ||
				phase === 'penalties'
			) {
				updatedMatch.winner = determineWinner(updatedMatch);
			}

			// ✅ Mark match as played if we have a winner
			if (updatedMatch.winner) {
				updatedMatch.played = true;
			}

			round[matchIndex] = updatedMatch;
			updated[roundIndex] = round;

			// 💡 Advance to next round only when match.played is true
			if (updatedMatch.played) {
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
											data-testid={`submit-regular-${match.team1.name}`}
										>
											Submit Regular Time
										</button>
									)}
								{match.regularTimePlayed &&
									!match.extraTimePlayed &&
									isReadyToSubmitExtraTime(match) && (
										<button
											onClick={() => {
												console.log(
													'🎯 Submitting extra time'
												);
												handleSubmitMatch(
													roundIndex,
													matchIndex,
													'extra'
												);
											}}
											data-testid={`submit-extra-${match.team1.name}`}
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
											data-testid={`submit-penalties-${match.team1.name}`}
										>
											Submit Penalties
										</button>
									)}
								{console.log('🏁 Winner check:', {
									name: match.winner?.name,
									played: match.played,
									matchHasClearWinner:
										matchHasClearWinner(match)
								})}
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
			<button onClick={handleDevAutofill} className="dev-button">
				Dev Complete Knockout Round
			</button>
		</div>
	);
};

export default KnockoutStage;
