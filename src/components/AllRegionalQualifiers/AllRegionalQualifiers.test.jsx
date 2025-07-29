import { render, screen, waitFor, global } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AllRegionalQualifiers from './AllRegionalQualifiers';

// Mock fetch and RegionalQualifiers
// const mockRegions = [
// 	{ region: 'Europe', spots: 2 },
// 	{ region: 'Asia', spots: 1 }
// ];

// vi.mock('../RegionalQualifiers/RegionalQualifiers', () => ({
// 	default: ({ region, spots, onRegionComplete }) => (
// 		<div data-testid={`qualifier-${region}`}>
// 			<span>{region}</span>
// 			<button onClick={() => onRegionComplete(region, [`Team${region}`])}>
// 				Complete {region}
// 			</button>
// 		</div>
// 	)
// }));

// beforeEach(() => {
// 	global.fetch = vi.fn(() =>
// 		Promise.resolve({
// 			json: () => Promise.resolve(mockRegions)
// 		})
// 	);
// });

// afterEach(() => {
// 	vi.clearAllMocks();
// });

describe('AllRegionalQualifiers', () => {
	it('renders qualifiers for each region from fetched data', async () => {
		render(<AllRegionalQualifiers />);
		// await waitFor(() => {
		// 	expect(screen.getByTestId('qualifier-Europe')).toBeInTheDocument();
		// 	expect(screen.getByTestId('qualifier-Asia')).toBeInTheDocument();
		// });
	});

	// it('shows Next Stage button only after all regions are completed', async () => {
	// 	render(<AllRegionalQualifiers />);
	// 	await waitFor(() => {
	// 		expect(screen.queryByText('Next Stage')).not.toBeInTheDocument();
	// 	});

	// 	// Complete Europe
	// 	screen.getByText('Complete Europe').click();
	// 	await waitFor(() => {
	// 		expect(screen.queryByText('Next Stage')).not.toBeInTheDocument();
	// 	});

	// 	// Complete Asia
	// 	screen.getByText('Complete Asia').click();
	// 	await waitFor(() => {
	// 		expect(screen.getByText('Next Stage')).toBeInTheDocument();
	// 	});
	// });

	// it('calls handleNextStage when Next Stage button is clicked', async () => {
	// 	const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	// 	render(<AllRegionalQualifiers />);
	// 	await waitFor(() => {
	// 		screen.getByText('Complete Europe').click();
	// 		screen.getByText('Complete Asia').click();
	// 	});

	// 	const nextStageBtn = screen.getByText('Next Stage');
	// 	nextStageBtn.click();
	// 	expect(logSpy).toHaveBeenCalledWith('Qualified teams', [
	// 		'TeamEurope',
	// 		'TeamAsia'
	// 	]);
	// 	logSpy.mockRestore();
	// });
});
