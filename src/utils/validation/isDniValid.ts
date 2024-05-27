export const isDniValid = (dni: string) => {
  const MIN = 7;
  const MAX = 9;

  if (!/^\d+$/u.test(dni)) return false;
  return dni.length >= MIN && dni.length <= MAX;
};
