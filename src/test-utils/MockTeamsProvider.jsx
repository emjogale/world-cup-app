import { TeamsContext } from '../context/TeamsContext';

export const MockTeamsProvider = ({
	children,
	teams = [],
	regions = [],
	loading = false,
	error = null
}) => {
	return (
		<TeamsContext.Provider value={{ teams, regions, loading, error }}>
			{children}
		</TeamsContext.Provider>
	);
};
