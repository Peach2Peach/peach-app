export const enforceNumberFormat = (number: string) =>
  number.replace(/,/gu, ".").replace(/[^0-9-+.]/gu, "");
