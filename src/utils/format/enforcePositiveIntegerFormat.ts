export const enforcePositiveIntegerFormat = (value: string) =>
  value.replace(/[^1-9]/gu, "");
