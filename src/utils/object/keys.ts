export const keys = <K extends string>(obj: Partial<Record<K, any>>): K[] => Object.keys(obj) as K[]
