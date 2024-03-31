export const isDniValid = (dni: string): boolean => {
  const MIN = 7;
  const MAX = 9;

  if (!/^\d+$/u.test(dni)) return false;
  // Proceed with length validation
  return dni.length >= MIN && dni.length <= MAX;
};
