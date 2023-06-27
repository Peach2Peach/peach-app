import { getPropsWithType } from './getPropsWithType'

describe('getPropsWithType', () => {
  it('should return type "range" if the amount is a range', () => {
    const props = { amount: [1, 2] satisfies [number, number] }
    expect(getPropsWithType(props)).toEqual({ ...props, type: 'range' })
  })
  it('should return type "fiatAmount" if the amount is a fiatAmount', () => {
    const props = { amount: 1, price: 21, currency: 'EUR' } as const
    expect(getPropsWithType(props)).toEqual({ ...props, type: 'fiatAmount' })
  })
  it('should return type "amount" if the amount is an amount', () => {
    const props = { amount: 1 }
    expect(getPropsWithType(props)).toEqual({ ...props, type: 'amount' })
  })
  it('should return type "empty" if the amount is not a range, fiatAmount or amount', () => {
    const props = {}
    expect(getPropsWithType(props)).toEqual({ ...props, type: 'empty' })
  })
})
