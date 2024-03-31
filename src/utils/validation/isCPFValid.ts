export const isCPFValid = (cpf: string): boolean => {
  const strippedCPF = cpf.replace(/\D/gu, ""); // Remove non-digit characters
  const MAX = 11;
  const TEN = 10;
  const TOTAL = 12;
  const MIN = 9;

  // Check for invalid lengths or all digits being the same
  if (strippedCPF.length !== MAX || /^(.)\1+$/u.test(strippedCPF)) return false;

  let remainder, sum;
  sum = 0;

  // Calculate first check digit
  for (let i = 1; i <= MIN; i++)
    sum += parseInt(strippedCPF.substring(i - 1, i), TEN) * (MAX - i);
  remainder = (sum * TEN) % MAX;

  if (remainder === TEN || remainder === MAX) remainder = 0;
  if (remainder !== parseInt(strippedCPF.substring(MIN, TEN), TEN))
    return false;

  sum = 0;
  // Calculate second check digit
  for (let i = 1; i <= TEN; i++)
    sum += parseInt(strippedCPF.substring(i - 1, i), TEN) * (TOTAL - i);
  remainder = (sum * TEN) % MAX;

  if (remainder === TEN || remainder === MAX) remainder = 0;
  return remainder === parseInt(strippedCPF.substring(TEN, MAX), TEN);
};
