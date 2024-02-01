const BASE = 10;
export const floor = (num: number, digits = 0) => {
  const exp = BASE ** digits;
  const result = Math.floor(num * exp) / exp;
  return digits > 0 ? result : Math.round(result);
};
