import { useEffect, useState } from 'react';
import { TeamsContext } from './TeamsContext';

export const TeamsProvider = ({ children }) => {
	const [teams, setTeams] = useState([]);
	const [regions, setRegions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const teamsRes = await fetch('/teams.json');
				if (!teamsRes.ok) throw new Error('Failed to load teams');

				const regionsRes = await fetch('/regions.json');
				if (!regionsRes.ok) throw new Error('Failed to load regions');

				const teamsData = await teamsRes.json();
				const regionsData = await regionsRes.json();

				setTeams(teamsData);
				setRegions(regionsData);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	return (
		<TeamsContext.Provider value={{ teams, regions, loading, error }}>
			{children}
		</TeamsContext.Provider>
	);
};
