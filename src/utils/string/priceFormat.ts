import { groupChars } from './groupChars'

export const priceFormat = (amount: number, round?: boolean) => {
  if (amount === Infinity) return '∞'
  const [integer, decimal] = amount.toFixed(2).split('.')

  return round ? groupChars(amount.toFixed(), 3) : [groupChars(integer, 3), decimal].join('.')
}
