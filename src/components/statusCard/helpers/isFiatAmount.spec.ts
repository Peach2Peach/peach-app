import { isFiatAmount } from './isFiatAmount'

describe('isFiatAmount', () => {
  it('should return true if the props have a single amount number, price and currency', () => {
    const props = {
      amount: 1,
      price: 21,
      currency: 'EUR',
    } as const
    expect(isFiatAmount(props)).toBe(true)
  })
  it('should return false in all other cases', () => {
    const propsWithoutAmount = {
      price: 21,
      currency: 'EUR',
    } as const
    const propsWithoutPrice = {
      amount: 1,
      currency: 'EUR',
    } as const
    const propsWithoutCurrency = {
      amount: 1,
      price: 21,
    } as const
    const propsWithAmountAsArray = {
      amount: [1, 2] satisfies [number, number],
      price: 21,
      currency: 'EUR',
    } as const
    const emptyProps = {}

    expect(isFiatAmount(propsWithoutAmount)).toBe(false)
    expect(isFiatAmount(propsWithoutPrice)).toBe(false)
    expect(isFiatAmount(propsWithoutCurrency)).toBe(false)
    expect(isFiatAmount(propsWithAmountAsArray)).toBe(false)
    expect(isFiatAmount(emptyProps)).toBe(false)
  })
})
