import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GroupStage from '../src/components/GroupStage';
import Tournament from '../src/models/Tournament';
import { groupTeams } from '../src/utils/groupTeams';

// mock teams data
const mockTeams = [
	{
		name: 'Argentina',
		flag: 'https://flagpedia.net/data/flags/w320/ar.png'
	},
	{
		name: 'Australia',
		flag: 'https://flagpedia.net/data/flags/w320/au.png'
	},
	{
		name: 'Belgium',
		flag: 'https://flagpedia.net/data/flags/w320/be.png'
	},
	{
		name: 'Brazil',
		flag: 'https://flagpedia.net/data/flags/w320/br.png'
	},
	{
		name: 'Cameroon',
		flag: 'https://flagpedia.net/data/flags/w320/cm.png'
	},
	{
		name: 'Canada',
		flag: 'https://flagpedia.net/data/flags/w320/ca.png'
	},
	{
		name: 'Chile',
		flag: 'https://flagpedia.net/data/flags/w320/cl.png'
	},
	{
		name: 'China',
		flag: 'https://flagpedia.net/data/flags/w320/cn.png'
	}
];

describe('group stage component', () => {
	it('renders group names', () => {
		const tournament = new Tournament(mockTeams, 'test-seed');
		const grouped = groupTeams(tournament.teams);

		render(<GroupStage teams={mockTeams} />);

		for (const groupName of Object.keys(grouped)) {
			expect(screen.getByText(`Group ${groupName}`)).toBeInTheDocument();
		}
	});

	it('renders teams within groups', () => {
		render(<GroupStage teams={mockTeams} />);
		expect(screen.getByText('Brazil')).toBeInTheDocument();
		expect(screen.getByText('Canada')).toBeInTheDocument();
		expect(screen.getByText('China')).toBeInTheDocument();
	});
});
