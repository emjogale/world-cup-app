import React, { useEffect, useState } from 'react';
import Match from '../Match/Match';
import './KnockoutStage.css';
import { createFirstKnockoutRound } from '../../tournament/bracket/createFirstKnockoutRound';
import { createNextKnockoutRound } from '../../tournament/bracket/createNextKnockoutRound';
import {
	determineWinner,
	isReadyToSubmitRegular,
	isReadyToSubmitExtraTime,
	isReadyToSubmitPenalties,
	hasFinalWinner,
	getTournamentWinner
} from '../../utils/matchHelpers';
import { devAutofillKnockoutRound } from '../../dev/devTools';
import { getKnockoutRoundLabel } from '../../utils/roundLabels';
import { safe } from '../../utils/stringUtils';

// Helper: visible matches = real fixtures (skip waiting placeholders)
const getVisibleMatches = (round) =>
	(Array.isArray(round) ? round : []).filter(
		(m) => !m?.waiting && m?.team1 && m?.team2
	);

const isFinalMatch = (round, roundIndex, knockoutRounds) => {
	const visible = getVisibleMatches(round);
	return (
		Array.isArray(round) &&
		visible.length === 1 &&
		roundIndex === knockoutRounds.length - 1
	);
};

// Title logic with prelim detection
const getRoundTitle = (round, roundIndex, knockoutRounds, tournamentWinner) => {
	const visible = getVisibleMatches(round);
	const isLastRound = roundIndex === knockoutRounds.length - 1;

	// Final banner (after winner decided)
	if (isLastRound && visible.length === 1 && tournamentWinner) {
		return `🏆 Winner: ${tournamentWinner}`;
	}

	// If this is the very first knockout round and it contains any waiting entries,
	// we label it as a Preliminary Round.
	const hasWaiting = Array.isArray(round) && round.some((m) => m.waiting);
	if (roundIndex === 0 && hasWaiting) {
		return 'Preliminary Round';
	}

	// Otherwise, use normal label based on the number of *visible* teams
	// (e.g., 8 matches -> 16 teams => "Round of 16")
	const teamsInThisVisibleRound = visible.length * 2;
	return getKnockoutRoundLabel(teamsInThisVisibleRound);
};

const KnockoutStage = ({ qualifiedTeams }) => {
	const [knockoutRounds, setKnockoutRounds] = useState([]);

	useEffect(() => {
		if (qualifiedTeams.length > 0) {
			const firstRound = createFirstKnockoutRound(qualifiedTeams);
			setKnockoutRounds([firstRound]);
		}
	}, [qualifiedTeams]);

	// Autofill only *real* matches (skip waiting placeholders)
	const handleDevAutofill = () => {
		setKnockoutRounds((prev) => {
			const updated = [...prev];
			const roundIndex = updated.length - 1;
			const round = updated[roundIndex];

			// Split into visible (real) matches and placeholders
			const visible = getVisibleMatches(round);
			const placeholderIndices = [];
			const visibleIndexMap = []; // map from visible-array index back to round index

			round.forEach((m, idx) => {
				if (!m?.waiting && m?.team1 && m?.team2) {
					visibleIndexMap.push(idx);
				} else {
					placeholderIndices.push(idx);
				}
			});

			// Autofill only the visible matches
			const autofilledVisible = devAutofillKnockoutRound(visible);

			// Merge back into the round
			const mergedRound = [...round];
			autofilledVisible.forEach((m, i) => {
				const originalIdx = visibleIndexMap[i];
				mergedRound[originalIdx] = m;
			});

			updated[roundIndex] = mergedRound;

			// If *all* matches in this round are now played (including any already-played waiting entries),
			// advance to the next round.
			const allPlayed = mergedRound.every((m) => m.played);
			if (allPlayed) {
				const next = createNextKnockoutRound(mergedRound);
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
			const match = { ...round[matchIndex] };

			// Ignore changes to waiting placeholders (shouldn't render anyway)
			if (match.waiting) return prev;

			const parsedValue = parseInt(value, 10);
			const isTeam1 = teamName === match.team1.name;

			if (phase === 'regular') {
				if (isTeam1) match.score1 = parsedValue;
				else match.score2 = parsedValue;
			} else if (phase === 'extra') {
				if (isTeam1) match.extraTimeScore1 = parsedValue;
				else match.extraTimeScore2 = parsedValue;
			} else if (phase === 'penalties') {
				if (isTeam1) match.penaltyScore1 = parsedValue;
				else match.penaltyScore2 = parsedValue;
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

			// Skip submitting "waiting" placeholders
			if (match.waiting) return prev;

			const updatedMatch = {
				...match,
				regularTimePlayed:
					phase === 'regular' ? true : match.regularTimePlayed,
				extraTimePlayed:
					phase === 'extra' ? true : match.extraTimePlayed,
				penaltiesPlayed:
					phase === 'penalties' ? true : match.penaltiesPlayed
			};

			// Recompute winner for the phase we just completed
			if (
				phase === 'regular' ||
				phase === 'extra' ||
				phase === 'penalties'
			) {
				updatedMatch.winner = determineWinner(updatedMatch);
			}

			if (updatedMatch.winner) {
				updatedMatch.played = true;
			}

			round[matchIndex] = updatedMatch;
			updated[roundIndex] = round;

			// Advance once *every* item in this round is played.
			// (waiting placeholders are already played: true)
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

	const tournamentWinner = getTournamentWinner(knockoutRounds);

	if (!qualifiedTeams || qualifiedTeams.length === 0) {
		return <p>No knockout teams yet</p>;
	}

	return (
		<div className="knockout-stage">
			<h2>Knockout Stage</h2>

			{knockoutRounds.map((round, roundIndex) => {
				const visible = getVisibleMatches(round);

				return (
					<div key={roundIndex} className="knockout-round">
						<h3>
							{getRoundTitle(
								round,
								roundIndex,
								knockoutRounds,
								tournamentWinner
							)}
						</h3>

						{visible.map((match, matchIndex) => {
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
										penaltyScore1={
											match.penaltyScore1 ?? ''
										}
										penaltyScore2={
											match.penaltyScore2 ?? ''
										}
										regularTimePlayed={
											match.regularTimePlayed
										}
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
												// map visible index back to the round index
												round.indexOf(match),
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
														round.indexOf(match),
														'regular'
													)
												}
												data-testid={`submit-regular-${safe(
													match.team1.name
												)}`}
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
														round.indexOf(match),
														'extra'
													)
												}
												data-testid={`submit-extra-${safe(
													match.team1.name
												)}`}
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
														round.indexOf(match),
														'penalties'
													)
												}
												data-testid={`submit-penalties-${safe(
													match.team1.name
												)}`}
											>
												Submit Penalties
											</button>
										)}

									{hasFinalWinner(match) && (
										<p className="knockout-result">
											{isFinalMatch(
												round,
												roundIndex,
												knockoutRounds
											)
												? `${match.winner.name} wins the World Cup! 🏆`
												: `${match.winner.name} advances!`}
										</p>
									)}
								</div>
							);
						})}
					</div>
				);
			})}

			{tournamentWinner && (
				<p className="champion-banner">
					🏆 Champion: <strong>{tournamentWinner}</strong>
				</p>
			)}

			<button onClick={handleDevAutofill} className="dev-button">
				Dev Complete Knockout Round
			</button>
		</div>
	);
};

export default KnockoutStage;
