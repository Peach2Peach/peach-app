export const getNormalized = (val: number, max: number): number => {
  const bounded = val < 0 ? 0 : Math.min(val, max);
  return bounded / max;
};
