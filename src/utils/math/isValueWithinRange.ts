export const isValueWithinRange = (value: number, [bottom, top]: [number, number]): boolean =>
  bottom <= value && value <= top
