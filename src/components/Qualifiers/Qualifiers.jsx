// This view shows all qualified teams before the tournament begins.

import './Qualifiers.css';
import { useTeams } from '../../context/TeamsContext';

const Qualifiers = ({ teams: override }) => {
	const { teams: contextTeams, error } = useTeams();
	const teams = override?.length ? override : contextTeams;

	return (
		<div className="teams-container">
			{error && (
				<p className="error-message">
					⚠️ Error loading teams. Please try again.
				</p>
			)}
			{teams.map((team) => (
				<div key={team.name} className="team-card">
					<img
						src={team.flag}
						alt={team.name}
						className="team-flag"
					/>
					<p className="team-name">{team.name}</p>
				</div>
			))}
		</div>
	);
};

export default Qualifiers;
