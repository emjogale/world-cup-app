import React from 'react';
import './Match.css';
import { safe } from '../../utils/stringUtils';

const Match = ({
	team1,
	team2,
	score1,
	score2,
	extraTimeScore1,
	extraTimeScore2,
	penaltyScore1,
	penaltyScore2,
	regularTimePlayed,
	extraTimePlayed,
	showExtraTime,
	showPenalties,
	onScoreChange
}) => {
	const handleChange = (team, value, phase = 'regular') => {
		onScoreChange(team, value, phase);
	};

	return (
		<div
			className="match-card horizontal"
			data-testid={`match-${safe(team1)}-vs-${safe(team2)}`}
		>
			<div className="team-row regular-time">
				<div className="team-input">
					<label htmlFor={`score-${safe(team1)}-regular`}>
						{team1}
					</label>
					<input
						id={`score-${safe(team1)}-regular`}
						data-testid={`score-${safe(team1)}`}
						type="number"
						min="0"
						value={score1}
						onChange={(e) =>
							handleChange(team1, e.target.value, 'regular')
						}
					/>
				</div>

				<span className="vs">v</span>

				<div className="team-input">
					<input
						id={`score-${safe(team2)}-regular`}
						data-testid={`score-${safe(team2)}`}
						type="number"
						min="0"
						value={score2}
						onChange={(e) =>
							handleChange(team2, e.target.value, 'regular')
						}
					/>
					<label htmlFor={`score-${safe(team2)}-regular`}>
						{team2}
					</label>
				</div>
			</div>

			{regularTimePlayed && showExtraTime && (
				<div className="extra-time">
					<h4>Extra Time</h4>
					<div className="team-row">
						<div className="team-input">
							<label htmlFor={`score-${safe(team1)}-extra`}>
								{team1}
							</label>
							<input
								id={`score-${safe(team1)}-extra`}
								type="number"
								value={extraTimeScore1}
								onChange={(e) =>
									handleChange(team1, e.target.value, 'extra')
								}
								data-testid={`extra-${safe(team1)}`}
							/>
							<span className="vs">v</span>
						</div>
						<div className="team-input">
							<input
								id={`score-${safe(team2)}-extra`}
								type="number"
								value={extraTimeScore2}
								onChange={(e) =>
									handleChange(team2, e.target.value, 'extra')
								}
								data-testid={`extra-${safe(team2)}`}
							/>
							<label htmlFor={`score-${safe(team2)}-extra`}>
								{team2}
							</label>
						</div>
					</div>
				</div>
			)}

			{regularTimePlayed && extraTimePlayed && showPenalties && (
				<div className="penalties">
					<h4>Penalties</h4>
					<div className="team-row">
						<label htmlFor={`score-${safe(team1)}-penalties`}>
							{team1}
						</label>
						<input
							id={`score-${safe(team1)}-penalties`}
							type="number"
							value={penaltyScore1}
							onChange={(e) =>
								handleChange(team1, e.target.value, 'penalties')
							}
							data-testid={`penalty-${safe(team1)}`}
						/>

						<label htmlFor={`score-${safe(team2)}-penalties`}>
							{team2}
						</label>
						<input
							id={`score-${safe(team2)}-penalties`}
							type="number"
							value={penaltyScore2}
							onChange={(e) =>
								handleChange(team2, e.target.value, 'penalties')
							}
							data-testid={`penalty-${safe(team2)}`}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Match;
