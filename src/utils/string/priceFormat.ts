import { groupChars } from './groupChars'

export const priceFormat = (amount: number) => {
  const [integer, decimal] = amount.toFixed(2).split('.')

  return [groupChars(integer, 3), decimal].join('.')
}
