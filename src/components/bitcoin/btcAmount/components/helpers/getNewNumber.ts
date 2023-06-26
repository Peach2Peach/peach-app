import { SATSINBTC } from '../../../../../constants'

export const getNewNumber = (value: number) => {
  const newNumber = (value / SATSINBTC).toFixed(8).split('')
  for (let i = newNumber.length - 3; i > 0; i -= 3) {
    if (newNumber[i] !== '.') {
      newNumber.splice(i, 0, ' ')
    }
  }
  return newNumber
}
