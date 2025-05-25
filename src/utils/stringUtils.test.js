import { describe, it, expect } from 'vitest';
import { safe } from './stringUtils';

describe('safe()', () => {
	it('converts to all lowercase', () => {
		expect(safe('Japan')).toBe('japan');
	});

	it('replaces spaces with underscores', () => {
		expect(safe('South Korea')).toBe('south_korea');
	});

	it('replaces special characters with underscores', () => {
		expect(safe("Côte d'Ivoire")).toBe('c_te_d_ivoire');
		expect(safe('U.A.E.')).toBe('u_a_e_');
		expect(safe('New-Zealand')).toBe('new_zealand');
	});

	it('handles mixed numeric and alphanumeric and punctuation', () => {
		expect(safe('USA 2026!')).toBe('usa_2026_');
	});

	it('replaces multiple special characters in a row', () => {
		expect(safe('Team@#Name')).toBe('team__name');
	});
});
