export const safe = (name) => {
	if (typeof name !== 'string') {
		if (name == null) return ''; // null or undefined
		name = String(name); // convert numbers or others to string
	}
	return name
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '_')
		.replace(/[^a-z0-9_]/gi, '_');
};
