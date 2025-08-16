// src/test-utils/renderApp.js
import { render } from '@testing-library/react';
import { MockTeamsProvider } from './MockTeamsProvider';
import App from '../App';

/**
 * Renders App wrapped in MockTeamsProvider to avoid network.
 * You can override teams/regions per test.
 */
export const renderApp = ({
	teams = [],
	regions = [{ region: 'Test', spots: 32 }]
} = {}) => {
	return render(
		<MockTeamsProvider teams={teams} regions={regions}>
			<App />
		</MockTeamsProvider>
	);
};
