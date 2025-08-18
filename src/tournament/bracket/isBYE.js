export const isBYE = (t) =>
	!!t && (t.isBye === true || t.BYE === true || t.name === 'BYE');
