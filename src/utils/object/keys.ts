export const keys = <K extends string>(obj: Partial<Record<K, unknown>>): K[] => Object.keys(obj) as K[]
