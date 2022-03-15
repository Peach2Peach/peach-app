/**
 * @description Method to spell out number (e.g 1000000 to 1 million)
 * @param number the number to spell out
 * @returns spelled out number
 */
export const nameNumber = (number: number): string => {
  const str = number.toString()
  const million = Math.floor(number / 1000000 * 10) / 10
  const thousand = Math.floor(number / 1000 * 10) / 10

  if (million >= 1) return `${million} million`
  if (thousand >= 1) return `${thousand} thousand`

  return str
}

export default nameNumber