import { tradeInformationGetters, isTradeInformationGetter } from './tradeInformationGetters'

describe('tradeInformationGetters', () => {
  it.todo('should return the correct value for the price field')
  it.todo('should return the correct value for the paidToMethod field')
  it.todo('should return the correct value for the paidWithMethod field')
  it.todo('should return the correct value for the paidToWallet field')
  it.todo('should return the correct value for the bitcoinAmount field')
  it.todo('should return the correct value for the bitcoinPrice field')
  it.todo('should return the correct value for the via field')
  it.todo('should return the correct value for the method field')
})

describe('isTradeInformationGetter', () => {
  it('should return true if the field name is a valid trade information getter', () => {
    expect(isTradeInformationGetter('price')).toEqual(true)
  })
  it('should return false if the field name is not a valid trade information getter', () => {
    expect(isTradeInformationGetter('foo')).toEqual(false)
  })
})
