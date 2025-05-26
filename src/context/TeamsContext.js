import { createContext, useContext } from 'react';

export const TeamsContext = createContext();

export const useTeams = () => {
	const context = useContext(TeamsContext);
	if (!context) {
		throw new Error('useTeams must be used within a TeamsProvider');
	}
	return context;
};
