// sorts teams by points, then goal difference, then goals for
export const sortByGroupRanking = (a, b) =>
	b.points - a.points || b.gd - a.gd || b.for - a.for;
