import { priceFormat } from '../../../../src/utils/string'

describe('priceFormat', () => {
  it('formats the amount correctly', () => {
    expect(priceFormat(1234567.89)).toEqual('1 234 567.89')
    expect(priceFormat(123456.789)).toEqual('123 456.79')
    expect(priceFormat(123.456)).toEqual('123.46')
    expect(priceFormat(123)).toEqual('123.00')
  })
})
