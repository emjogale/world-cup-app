import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Teams from './Qualifiers';
import { beforeEach, afterEach } from 'vitest';
import { mockFetchTeams } from '../../test-utils/mockFetchTeams';

beforeEach(() => {
	mockFetchTeams;
});
afterEach(() => {
	vi.restoreAllMocks();
});

describe.skip('Team component', () => {
	it('renders team names from fetch', async () => {
		render(<Teams />);

		expect(await screen.findByText('Brazil')).toBeInTheDocument();
	});
});
