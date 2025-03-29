import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GroupStage from './GroupStage';
import { groupTeams } from '../../logic/groupTeams';

const mockTeams = [
	{ name: 'Argentina', flag: '🇦🇷' },
	{ name: 'Australia', flag: '🇦🇺' },
	{ name: 'Belgium', flag: '🇧🇪' },
	{ name: 'Brazil', flag: '🇧🇷' },
	{ name: 'Cameroon', flag: '🇨🇲' },
	{ name: 'Canada', flag: '🇨🇦' },
	{ name: 'Chile', flag: '🇨🇱' },
	{ name: 'China', flag: '🇨🇳' }
];

describe('group stage component', () => {
	it('renders group names', () => {
		const grouped = groupTeams(mockTeams);
		render(<GroupStage teams={mockTeams} />);
		for (const groupName of Object.keys(grouped)) {
			expect(screen.getByText(`Group ${groupName}`)).toBeInTheDocument();
		}
	});

	it('renders team names in each group', () => {
		render(<GroupStage teams={mockTeams} />);

		mockTeams.forEach((team) => {
			expect(screen.getByText(team.name)).toBeInTheDocument();
		});
	});
});
