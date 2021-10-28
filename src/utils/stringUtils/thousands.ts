
/**
 * @description Method to group number in thousands
 * @param props parameters
 * @param props.string the string to pad
 * @returns number grouped in thousands
 */
export const thousands = (number: number): string => {
  const string = String(Math.round(number))
    .split('')
    .reverse()

  return string.reduce((str, digit, i) => i % 3 === 0 && i >= 3
    ? `${digit} ${str}`
    : `${digit}${str}`
  , '')
}

export default thousands