import React from 'react';
import { describe, it, vi, expect } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';

// Delay one tick so tests can assert the regional screen before it advances
vi.mock('./components/AllRegionalQualifiers/AllRegionalQualifiers', () => {
	const StubRegional = ({ onComplete, onAllQualified }) => {
		React.useEffect(() => {
			const id = setTimeout(() => {
				const teams = Array.from({ length: 32 }, (_, i) => ({
					name: `T${i + 1}`,
					region: 'Test'
				}));
				onComplete?.({ Test: teams }); // legacy contract
				onAllQualified?.({ byRegion: { Test: teams }, flat: teams }); // new contract
			}, 10); // small, deterministic delay
			return () => clearTimeout(id);
		}, [onComplete, onAllQualified]);

		return <div data-testid="stub-regional">Regional stub</div>;
	};
	return { default: StubRegional };
});

vi.mock('./components/Qualifiers/Qualifiers', () => ({
	default: () => <div data-testid="stub-qualifiers" />
}));

import { renderApp } from './test-utils/renderApp';

describe('App flow', () => {
	it('moves to qualifiers after regional completes', async () => {
		renderApp();

		// 1) assert the regional screen synchronously (now guaranteed to render for a tick)
		expect(screen.getByTestId('stub-regional')).toBeInTheDocument();

		// 2) wait until it disappears after the stub fires the callback
		await waitForElementToBeRemoved(() =>
			screen.queryByTestId('stub-regional')
		);

		// 3) now the qualifiers stage should be up
		expect(
			await screen.findByRole('button', { name: /start tournament/i })
		).toBeInTheDocument();
		expect(
			await screen.findByTestId('stub-qualifiers')
		).toBeInTheDocument();
		expect(
			await screen.findByPlaceholderText(/optional seed/i)
		).toBeInTheDocument();
	});
});
