import React from 'react';
import './Match.css';

const Match = ({
	team1,
	team2,
	score1,
	score2,
	extraTimeScore1,
	extraTimeScore2,
	penaltyScore1,
	penaltyScore2,
	played,
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
			data-testid={`match-${team1}-vs-${team2}`}
		>
			<div className="regular-time">
				<label>
					{team1}
					<input
						data-testid={`score-${team1}`}
						type="number"
						min="0"
						value={score1}
						onChange={(e) =>
							handleChange(team1, e.target.value, 'regular')
						}
					/>
				</label>
				<span>v</span>
				<label>
					<input
						data-testid={`score-${team2}`}
						type="number"
						min="0"
						value={score2}
						onChange={(e) =>
							handleChange(team2, e.target.value, 'regular')
						}
					/>
					{team2}
				</label>
			</div>

			{played && showExtraTime && (
				<div className="extra-time">
					<h4>Extra Time</h4>
					<label>
						{team1}
						<input
							type="number"
							value={extraTimeScore1}
							onChange={(e) =>
								handleChange(team1, e.target.value, 'extra')
							}
							data-testid={`extra-${team1}`}
						/>
					</label>
					<label>
						{team2}
						<input
							type="number"
							value={extraTimeScore2}
							onChange={(e) =>
								handleChange(team2, e.target.value, 'extra')
							}
							data-testid={`extra-${team2}`}
						/>
					</label>
				</div>
			)}

			{played && showPenalties && (
				<div className="penalties">
					<h4>Penalties</h4>
					<label>
						{team1}
						<input
							type="number"
							value={penaltyScore1}
							onChange={(e) =>
								handleChange(team1, e.target.value, 'penalties')
							}
							data-testid={`penalty-${team1}`}
						/>
					</label>
					<label>
						{team2}
						<input
							type="number"
							value={penaltyScore2}
							onChange={(e) =>
								handleChange(team2, e.target.value, 'penalties')
							}
							data-testid={`penalty-${team2}`}
						/>
					</label>
				</div>
			)}
		</div>
	);
};

export default Match;
