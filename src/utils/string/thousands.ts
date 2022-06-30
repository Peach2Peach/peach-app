
/**
 * @description Method to group number in thousands
 * @param number the number
 * @returns number grouped in thousands
 */
export const thousands = (number: number): string => {
  const string = String(Math.round(number))
    .split('')
    .reverse()


  return string.reduce((str, digit, i) => i % 3 === 0 && i >= 3
    ? `${digit} ${str}`
    : `${digit}${str}`
  , '')
}

export default thousands