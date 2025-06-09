import { TeamsContext } from '../context/TeamsContext';

export const MockTeamsProvider = ({ children, teams = [] }) => {
	return (
		<TeamsContext.Provider value={{ teams, loading: false, error: null }}>
			{children}
		</TeamsContext.Provider>
	);
};
