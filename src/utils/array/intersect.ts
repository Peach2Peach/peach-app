export const intersect = <T>(a: T[], b: T[]): T[] => a.filter((val) => b.includes(val))
