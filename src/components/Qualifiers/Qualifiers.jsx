// This view shows all qualified teams before the tournament begins.
// Useful for previewing entries or editing before grouping.

import './Qualifiers.css';
import { useTeams } from '../../context/TeamsContext';

const Qualifiers = () => {
	const { teams, error } = useTeams();

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
