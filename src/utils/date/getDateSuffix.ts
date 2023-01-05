/**
 * @description Get the suffix for a given date (e.g. "st", "nd", "rd", "th")
 */
export const getDateSuffix = (date: number): string => {
  const tens = date % 100
  if (tens >= 11 && tens <= 13) {
    return 'th'
  }
  const suffixes = ['st', 'nd', 'rd', 'th']
  return suffixes[(date % 10) - 1] || 'th'
}
