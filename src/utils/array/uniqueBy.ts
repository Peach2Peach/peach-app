export const uniqueBy =
  <T extends Record<string, unknown & { toString: () => string }>>(
    key: string,
  ) =>
  (obj: T, index: number, self: T[]) =>
    self.findIndex((s) => s[key].toString() === obj[key].toString()) === index;
