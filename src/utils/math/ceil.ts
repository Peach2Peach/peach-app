const BASE = 10;
export const ceil = (num: number, digits = 0) => {
  const exp = BASE ** digits;
  const result = Math.ceil(num * exp) / exp;
  return digits > 0 ? result : Math.round(result);
};
