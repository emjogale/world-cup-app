import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import App from '../App';

import { getMinimalMockRegion } from '../test-utils/mockRegions';
import { MockTeamsProvider } from '../test-utils/MockTeamsProvider';

describe('App wiring — regionals → qualifiers → groups', () => {
	it('flows winners from regionals into Qualifiers and then into GroupStage', async () => {
		// Minimal region so the test is fast & deterministic
		const { teams, regions } = getMinimalMockRegion({
			spots: 1
		});

		// Render App with mocked context (teams + regions)
		render(
			<MockTeamsProvider teams={teams} regions={regions}>
				<App />
			</MockTeamsProvider>
		);

		// Find the region section in the Regionals stage
		const regionName = regions[0].region;
		const regionTestId = `regional-qualifiers-${regionName.toLowerCase()}`;
		const regionSection = await screen.findByTestId(regionTestId);

		// Use the dev autofill to complete regional matches quickly
		const autofillBtn = within(regionSection).getByRole('button', {
			name: /dev autofill regional matches/i
		});
		await userEvent.click(autofillBtn);

		// App should now move to the Qualifiers screen (seed + "Start Tournament" present)
		const startBtn = await screen.findByRole('button', {
			name: /start tournament/i
		});
		expect(startBtn).toBeInTheDocument();

		// Start the tournament (this seeds and advances to Group Stage)
		await userEvent.click(startBtn);

		// We should now be on Group Stage
		const groupStage = await screen.findByTestId('group-stage');
		expect(groupStage).toBeInTheDocument();

		// (Optional) sanity check: group tables exist
		expect(within(groupStage).getAllByRole('table').length).toBeGreaterThan(
			0
		);
	});
});
