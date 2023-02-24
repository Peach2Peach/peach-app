export const enforceSortCodeFormat = (sortCode: string) => {
  const formatted = sortCode.toUpperCase().replace(/[^A-Z0-9]/gu, '')
  return formatted
}
