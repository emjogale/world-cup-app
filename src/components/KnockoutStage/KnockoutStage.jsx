import React from 'react';
import Match from '../Match/Match';
import './KnockoutStage.css'; // optional for styling

const KnockoutStage = ({ qualifiedTeams }) => {
	console.log('👥 Qualified for knockout:', qualifiedTeams);
	if (!qualifiedTeams || qualifiedTeams.length === 0) {
		return <p>No knockout teams yet</p>;
	}

	return (
		<div className="knockout-stage">
			<h2>Knockout Stage</h2>
			{qualifiedTeams.map((team, index) => {
				if (index % 2 === 0 && qualifiedTeams[index + 1]) {
					return (
						<Match
							key={index}
							team1={team.name}
							team2={qualifiedTeams[index + 1].name}
							score1=""
							score2=""
							onScoreChange={() => {}}
						/>
					);
				}
				return null;
			})}
		</div>
	);
};

export default KnockoutStage;
