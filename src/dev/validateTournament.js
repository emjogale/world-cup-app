// src/utils/validateTournament.js
const nextPowerOfTwo = (n) => 2 ** Math.ceil(Math.log2(Math.max(1, n)));

export const validateTournament = ({
	teams = [],
	regions = [],
	groupSize = 6,
	targetKO = 32 // desired knockout bracket size
} = {}) => {
	const byRegionCount = regions.reduce((acc, r) => {
		acc[r.region] = teams.filter((t) => t.region === r.region).length;
		return acc;
	}, {});

	const errors = [];
	const warnings = [];

	// 1) Region sanity
	for (const { region, spots } of regions) {
		const count = byRegionCount[region] ?? 0;
		if (count === 0) {
			warnings.push(`Region "${region}" has 0 teams.`);
		}
		if (spots <= 0) {
			errors.push(
				`Region "${region}" has non-positive spots (${spots}).`
			);
		}
		// optional: warn if spots > teams
		if (count > 0 && spots > count) {
			warnings.push(
				`Region "${region}" has spots (${spots}) > teams (${count}).`
			);
		}
	}

	// 2) Total teams and KO shape
	const totalTeams = teams.length;
	const powerOfTwo = (n) => (n & (n - 1)) === 0;
	const isPower = powerOfTwo(totalTeams);

	const expectedKO = Math.min(totalTeams, targetKO);
	const nextPow = nextPowerOfTwo(totalTeams);
	if (!isPower) {
		warnings.push(
			`Total teams = ${totalTeams} (not a power of two). Next power of two: ${nextPow} (BYEs likely in R1).`
		);
	}

	// 3) Group sizing rough check (optional)
	const remainder = totalTeams % groupSize;
	if (remainder !== 0) {
		warnings.push(
			`Total teams (${totalTeams}) not divisible by group size (${groupSize}). Some groups will be uneven.`
		);
	}

	return {
		errors,
		warnings,
		meta: {
			totalTeams,
			byRegionCount,
			groupSize,
			expectedKO,
			nextPowerOfTwo: nextPow,
			isPowerOfTwo: isPower
		}
	};
};
