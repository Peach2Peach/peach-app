export const enforceBICFormat = (bic: string) => {
  const formatted = bic.toUpperCase().replace(/[^A-Z0-9]/gu, '')
  return [formatted.substring(0, 4), formatted.substring(4, 6), formatted.substring(6, 8), , formatted.substring(8, 11)]
    .filter((s) => s)
    .join(' ')
}
