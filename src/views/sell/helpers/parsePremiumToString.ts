export const parsePremiumToString = (premium?: string | number) => {
  if (!premium) return ''

  const number = Number(premium)
  if (isNaN(number)) return String(premium).trim()
  if (number < -21) return '-21'
  if (number > 21) return '21'
  return String(premium).trim()
    .replace(/^0/u, '')
}
