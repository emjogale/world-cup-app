import { useEffect, useState } from 'react';
import { TeamsContext } from './TeamsContext';

export const TeamsProvider = ({ children }) => {
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadTeams = async () => {
			try {
				const response = await fetch('/teams.json');
				if (!response.ok) throw new Error('Failed to load teams.json');
				const data = await response.json();
				setTeams(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadTeams();
	}, []);

	return (
		<TeamsContext.Provider value={{ teams, loading, error }}>
			{children}
		</TeamsContext.Provider>
	);
};
