import { SATSINBTC } from '../../../../../constants'

export const getNewNumber = (value: number) => {
  const newNum = (value / SATSINBTC).toFixed(8).split('')
  for (let i = newNum.length - 3; i > 0; i -= 3) {
    if (newNum[i] !== '.') {
      newNum.splice(i, 0, ' ')
    }
  }
  return newNum
}
